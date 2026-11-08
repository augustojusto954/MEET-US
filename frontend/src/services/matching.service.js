// frontend/src/services/matching.service.js
import { queryAll, queryOne, run } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

function delay(ms = 120) { return new Promise((r) => setTimeout(r, ms)) }

function computeScore(a, b) {
  const aSkills = queryAll('SELECT * FROM skills WHERE user_id = ?', [a.id])
  const bSkills = queryAll('SELECT * FROM skills WHERE user_id = ?', [b.id])
  const aInt = queryAll('SELECT * FROM interests WHERE user_id = ?', [a.id]).map((x) => x.name)
  const bInt = queryAll('SELECT * FROM interests WHERE user_id = ?', [b.id]).map((x) => x.name)

  let score = 0
  const aOffers = aSkills.filter((s) => s.type !== 'seek').map((s) => s.name)
  const aSeeks = aSkills.filter((s) => s.type !== 'offer').map((s) => s.name)
  const bOffers = bSkills.filter((s) => s.type !== 'seek').map((s) => s.name)
  const bSeeks = bSkills.filter((s) => s.type !== 'offer').map((s) => s.name)

  // Skills que A procura e B oferece
  score += bOffers.filter((s) => aSeeks.includes(s)).length * 25
  // Skills que B procura e A oferece
  score += aOffers.filter((s) => bSeeks.includes(s)).length * 25
  // Interesses comuns
  score += aInt.filter((i) => bInt.includes(i)).length * 10
  // Mesma instituição
  if (a.institution && a.institution === b.institution) score += 10
  // Reputação de B
  score += (b.reputation || 0) * 2

  return Math.min(100, Math.round(score))
}

export const matchingService = {
  async getCandidates(userId, { limit = 20 } = {}) {
    if (!USE_FAKE) return api.get('/matching/candidates', { params: { userId, limit } })
    await delay()
    const me = queryOne('SELECT * FROM users WHERE id = ?', [userId])
    if (!me) return { data: [] }
    const swiped = queryAll('SELECT target_id FROM swipes WHERE swiper_id = ?', [userId]).map((r) => r.target_id)
    const blocked = queryAll('SELECT blocked_id FROM blocks WHERE blocker_id = ?', [userId]).map((r) => r.blocked_id)
    const exclude = new Set([userId, ...swiped, ...blocked])

    const users = queryAll('SELECT * FROM users WHERE id != ?', [userId])
    const candidates = users
      .filter((u) => !exclude.has(u.id))
      .map((u) => {
        const skills = queryAll('SELECT * FROM skills WHERE user_id = ?', [u.id])
        const interests = queryAll('SELECT * FROM interests WHERE user_id = ?', [u.id])
        return { ...u, skills, interests, score: computeScore(me, u) }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return { data: candidates }
  },

  async swipe(swiperId, targetId, action) {
    if (!USE_FAKE) return api.post('/matching/swipe', { swiperId, targetId, action })
    await delay(80)
    run('INSERT OR REPLACE INTO swipes (swiper_id,target_id,action) VALUES (?,?,?)', [swiperId, targetId, action])

    if (action === 'like') {
      const reciprocal = queryOne(
        `SELECT * FROM swipes WHERE swiper_id = ? AND target_id = ? AND action = 'like'`,
        [targetId, swiperId]
      )
      if (reciprocal) {
        const a = Math.min(swiperId, targetId)
        const b = Math.max(swiperId, targetId)
        const existing = queryOne('SELECT * FROM matches WHERE user_a = ? AND user_b = ?', [a, b])
        if (!existing) {
          run('INSERT INTO matches (user_a,user_b,score,status) VALUES (?,?,?,?)', [a, b, 100, 'matched'])
        }
        return { data: { matched: true } }
      }
    }
    return { data: { matched: false } }
  },

  async listMatches(userId) {
    if (!USE_FAKE) return api.get('/matching/matches', { params: { userId } })
    await delay()
    const matches = queryAll(
      'SELECT * FROM matches WHERE user_a = ? OR user_b = ? ORDER BY created_at DESC',
      [userId, userId]
    )
    return {
      data: matches.map((m) => {
        const otherId = m.user_a === userId ? m.user_b : m.user_a
        const other = queryOne('SELECT * FROM users WHERE id = ?', [otherId])
        return { ...m, other }
      })
    }
  }
}
