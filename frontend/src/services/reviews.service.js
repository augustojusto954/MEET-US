// frontend/src/services/reviews.service.js
import { queryAll, queryOne, run } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'
const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms))

export const reviewsService = {
  async listByUser(userId) {
    if (!USE_FAKE) return api.get(`/reviews/user/${userId}`)
    await delay()
    const rows = queryAll('SELECT * FROM reviews WHERE reviewed_id = ? ORDER BY created_at DESC', [userId])
    return {
      data: rows.map((r) => ({
        ...r,
        reviewer: queryOne('SELECT id,name,avatar FROM users WHERE id = ?', [r.reviewer_id]),
        exchange: queryOne('SELECT id,skill FROM exchange_requests WHERE id = ?', [r.exchange_id])
      }))
    }
  },

  async listGiven(userId) {
    if (!USE_FAKE) return api.get(`/reviews/given/${userId}`)
    await delay()
    const rows = queryAll('SELECT * FROM reviews WHERE reviewer_id = ? ORDER BY created_at DESC', [userId])
    return {
      data: rows.map((r) => ({
        ...r,
        reviewed: queryOne('SELECT id,name,avatar FROM users WHERE id = ?', [r.reviewed_id]),
        exchange: queryOne('SELECT id,skill FROM exchange_requests WHERE id = ?', [r.exchange_id])
      }))
    }
  },

  async create({ exchangeId, reviewerId, reviewedId, rating, comment }) {
    if (!USE_FAKE) return api.post('/reviews', { exchangeId, reviewerId, reviewedId, rating, comment })
    await delay()
    if (!rating || rating < 1 || rating > 5) throw new Error('Classificação inválida.')
    const existing = queryOne(
      'SELECT id FROM reviews WHERE exchange_id = ? AND reviewer_id = ?',
      [exchangeId, reviewerId]
    )
    if (existing) throw new Error('Já avaliaste esta troca.')
    run(
      `INSERT INTO reviews (exchange_id,reviewer_id,reviewed_id,rating,comment) VALUES (?,?,?,?,?)`,
      [exchangeId, reviewerId, reviewedId, rating, comment || '']
    )
    // recalcular reputação
    const agg = queryOne(
      'SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE reviewed_id = ?',
      [reviewedId]
    )
    run('UPDATE users SET reputation = ?, reviews_count = ? WHERE id = ?', [
      +(+agg.avg).toFixed(2), agg.n, reviewedId
    ])
    return { data: { success: true } }
  }
}
