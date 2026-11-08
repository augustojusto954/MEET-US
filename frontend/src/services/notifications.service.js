// frontend/src/services/notifications.service.js
import { queryAll, queryOne, run } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'
const delay = (ms = 60) => new Promise((r) => setTimeout(r, ms))

const VALID_TYPES = ['match', 'exchange', 'message', 'review', 'system', 'call']

export const notificationsService = {
  /**
   * Lista notificações do utilizador.
   * @param {number} userId
   * @param {object} opts
   * @param {boolean} opts.onlyUnread
   * @param {string}  opts.type   'all' | 'match' | 'exchange' | ...
   * @param {number}  opts.page
   * @param {number}  opts.limit
   */
  async list(userId, { onlyUnread = false, type = 'all', page = 1, limit = 20 } = {}) {
    if (!USE_FAKE) return api.get('/notifications', { params: { onlyUnread, type, page, limit } })
    await delay()
    const where = ['user_id = ?']
    const params = [userId]

    if (onlyUnread) where.push('read = 0')
    if (type !== 'all') { where.push('type = ?'); params.push(type) }

    const sql = `SELECT * FROM notifications
                 WHERE ${where.join(' AND ')}
                 ORDER BY read ASC, created_at DESC`

    const all = queryAll(sql, params)
    const total = all.length
    const start = (page - 1) * limit
    const items = all.slice(start, start + limit)

    const unreadCount = queryOne(
      'SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read = 0',
      [userId]
    )?.n || 0

    return {
      data: {
        items,
        total,
        unreadCount,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    }
  },

  async getById(id) {
    if (!USE_FAKE) return api.get(`/notifications/${id}`)
    await delay(40)
    return { data: queryOne('SELECT * FROM notifications WHERE id = ?', [id]) }
  },

  async unreadCount(userId) {
    if (!USE_FAKE) return api.get('/notifications/unread-count')
    await delay(30)
    const n = queryOne(
      'SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read = 0',
      [userId]
    )?.n || 0
    return { data: { count: n } }
  },

  async markRead(id) {
    if (!USE_FAKE) return api.put(`/notifications/${id}/read`)
    await delay(30)
    run('UPDATE notifications SET read = 1 WHERE id = ?', [id])
    return { data: { success: true } }
  },

  async markAllRead(userId) {
    if (!USE_FAKE) return api.put('/notifications/read-all', { userId })
    await delay(40)
    run('UPDATE notifications SET read = 1 WHERE user_id = ?', [userId])
    return { data: { success: true } }
  },

  async remove(id) {
    if (!USE_FAKE) return api.delete(`/notifications/${id}`)
    await delay(30)
    run('DELETE FROM notifications WHERE id = ?', [id])
    return { data: { success: true } }
  },

  async clearAll(userId) {
    if (!USE_FAKE) return api.delete('/notifications/clear-all', { data: { userId } })
    await delay(50)
    run('DELETE FROM notifications WHERE user_id = ?', [userId])
    return { data: { success: true } }
  },

  /**
   * Cria uma notificação (usado por outros serviços).
   */
  async push(userId, { type = 'system', title, body = '', link = '' } = {}) {
    if (!VALID_TYPES.includes(type)) type = 'system'
    const id = run(
      `INSERT INTO notifications (user_id, type, title, body, link)
       VALUES (?,?,?,?,?)`,
      [userId, type, title, body, link]
    )
    return { data: queryOne('SELECT * FROM notifications WHERE id = ?', [id]) }
  }
}
