// frontend/src/services/exchange.service.js
import { queryAll, queryOne, run } from 'src/db'
import { api } from 'src/boot/axios'
import { notificationsService } from './notifications.service'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'
const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms))

const VALID_STATUS = ['pending', 'accepted', 'rejected', 'cancelled', 'running', 'completed']

/* ---------- Helpers ---------- */
function enrich(row) {
  if (!row) return null
  return {
    ...row,
    requester: queryOne('SELECT id,name,avatar,institution FROM users WHERE id = ?', [row.requester_id]),
    provider:  queryOne('SELECT id,name,avatar,institution FROM users WHERE id = ?', [row.provider_id]),
    review:    queryOne('SELECT * FROM reviews WHERE exchange_id = ? LIMIT 1', [row.id])
  }
}

function fail(msg, status = 400) {
  const err = new Error(msg)
  err.response = { status, data: { message: msg } }
  throw err
}

/* ---------- Service ---------- */
export const exchangeService = {
  /**
   * Lista pedidos de troca do utilizador.
   * @param {number} userId
   * @param {object} opts
   * @param {'all'|'requester'|'provider'} opts.role
   * @param {string} opts.status  'all' | 'pending' | 'accepted' | ...
   * @param {string} opts.q       pesquisa livre por skill
   * @param {number} opts.page
   * @param {number} opts.limit
   */
  async list(userId, { role = 'all', status = 'all', q = '', page = 1, limit = 10 } = {}) {
    if (!USE_FAKE) return api.get('/exchanges', { params: { role, status, q, page, limit } })
    await delay()

    const where = []
    const params = []

    if (role === 'requester') {
      where.push('requester_id = ?')
      params.push(userId)
    } else if (role === 'provider') {
      where.push('provider_id = ?')
      params.push(userId)
    } else {
      where.push('(requester_id = ? OR provider_id = ?)')
      params.push(userId, userId)
    }
    if (status !== 'all') {
      where.push('status = ?')
      params.push(status)
    }
    if (q) {
      where.push('skill LIKE ?')
      params.push(`%${q}%`)
    }

    const sql = `SELECT * FROM exchange_requests
                 WHERE ${where.join(' AND ')}
                 ORDER BY
                   CASE status
                     WHEN 'pending'   THEN 0
                     WHEN 'running'   THEN 1
                     WHEN 'accepted'  THEN 2
                     WHEN 'completed' THEN 3
                     WHEN 'rejected'  THEN 4
                     WHEN 'cancelled' THEN 5
                     ELSE 6
                   END,
                   created_at DESC`

    const all = queryAll(sql, params)
    const total = all.length
    const start = (page - 1) * limit
    const items = all.slice(start, start + limit).map(enrich)

    return { data: { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) } }
  },

  async getById(id) {
    if (!USE_FAKE) return api.get(`/exchanges/${id}`)
    await delay(80)
    const r = queryOne('SELECT * FROM exchange_requests WHERE id = ?', [id])
    if (!r) fail('Pedido não encontrado.', 404)
    return { data: enrich(r) }
  },

  async create({ requesterId, providerId, skill, message, scheduledAt }) {
    if (!USE_FAKE) return api.post('/exchanges', { requesterId, providerId, skill, message, scheduledAt })
    await delay()
    if (!skill) fail('A habilidade é obrigatória.')
    if (requesterId === providerId) fail('Não podes criar um pedido para ti mesmo.')

    // Evitar duplicados pendentes para a mesma skill
    const dup = queryOne(
      `SELECT id FROM exchange_requests
       WHERE requester_id = ? AND provider_id = ? AND skill = ?
         AND status IN ('pending','accepted','running')`,
      [requesterId, providerId, skill]
    )
    if (dup) fail('Já existe um pedido ativo para esta habilidade.')

    const id = run(
      `INSERT INTO exchange_requests
        (requester_id, provider_id, skill, message, scheduled_at, status)
       VALUES (?,?,?,?,?, 'pending')`,
      [requesterId, providerId, skill, message || '', scheduledAt || null]
    )

    // Notificar o provider
    await notificationsService.push(providerId, {
      type: 'exchange',
      title: 'Novo pedido de troca',
      body: `Recebeste um pedido para "${skill}".`,
      link: `/exchanges/${id}`
    })

    return { data: enrich(queryOne('SELECT * FROM exchange_requests WHERE id = ?', [id])) }
  },

  async updateStatus(id, status, actorId) {
    if (!USE_FAKE) return api.put(`/exchanges/${id}/status`, { status, actorId })
    await delay()
    if (!VALID_STATUS.includes(status)) fail('Estado inválido.')

    const current = queryOne('SELECT * FROM exchange_requests WHERE id = ?', [id])
    if (!current) fail('Pedido não encontrado.', 404)

    // Regras de quem pode mudar o quê
    const isRequester = current.requester_id === actorId
    const isProvider = current.provider_id === actorId
    if (!isRequester && !isProvider) fail('Sem permissão.', 403)

    const s = current.status
    const allowed = {
      pending:   ['accepted', 'rejected', 'cancelled'],
      accepted:  ['running', 'cancelled'],
      running:   ['completed', 'cancelled'],
      completed: [],
      rejected:  [],
      cancelled: []
    };
    if (!allowed[s]?.includes(status)) fail(`Não podes passar de "${s}" para "${status}".`)

    // Só o provider aceita/rejeita
    if ((status === 'accepted' || status === 'rejected') && !isProvider) {
      fail('Apenas quem recebe o pedido pode aceitar/rejeitar.')
    }
    // Só o requester cancela enquanto pending
    if (status === 'cancelled' && s === 'pending' && !isRequester) {
      fail('Apenas quem criou o pedido o pode cancelar.')
    }

    run(
      `UPDATE exchange_requests
       SET status = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [status, id]
    )

    // Notificar a outra parte
    const target = isRequester ? current.provider_id : current.requester_id
    await notificationsService.push(target, {
      type: 'exchange',
      title: 'Estado do pedido atualizado',
      body: `O pedido "${current.skill}" está agora "${status}".`,
      link: `/exchanges/${id}`
    })

    return { data: enrich(queryOne('SELECT * FROM exchange_requests WHERE id = ?', [id])) }
  },

  async stats(userId) {
    if (!USE_FAKE) return api.get('/exchanges/stats', { params: { userId } })
    await delay(40)
    const base = queryAll(
      'SELECT status, COUNT(*) as n FROM exchange_requests WHERE requester_id = ? OR provider_id = ? GROUP BY status',
      [userId, userId]
    )
    const out = { pending: 0, accepted: 0, running: 0, completed: 0, rejected: 0, cancelled: 0 }
    base.forEach((r) => { out[r.status] = r.n })
    out.total = Object.values(out).reduce((a, b) => a + b, 0)
    return { data: out }
  }
}
