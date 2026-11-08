// frontend/src/services/students.service.js
import { queryAll, queryOne } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

/* ---------- Helpers ---------- */
const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms))

function enrichUser(u) {
  if (!u) return null
  return {
    ...u,
    skills: queryAll('SELECT * FROM skills WHERE user_id = ?', [u.id]),
    interests: queryAll('SELECT * FROM interests WHERE user_id = ?', [u.id])
  }
}

/**
 * Pesquisa de estudantes com filtros, ordenação e paginação.
 *
 * @param {object} opts
 * @param {string} opts.q             Texto livre (nome, bio, curso)
 * @param {string} opts.institution   Filtrar por instituição exata
 * @param {string} opts.course        Filtrar por curso
 * @param {string} opts.city          Filtrar por cidade
 * @param {string} opts.skill         Filtrar por nome de habilidade
 * @param {string} opts.skillType     'offer' | 'seek' | 'both' | ''
 * @param {string} opts.availability  Filtrar por disponibilidade
 * @param {boolean} opts.onlyVerified Apenas contas verificadas
 * @param {boolean} opts.onlyOnline   Apenas utilizadores online
 * @param {string} opts.sort          'reputation' | 'recent' | 'name' | 'reviews'
 * @param {number} opts.page          1-based
 * @param {number} opts.limit         Itens por página
 */
export const studentsService = {
  async search({
    q = '',
    institution = '',
    course = '',
    city = '',
    skill = '',
    skillType = '',
    availability = '',
    onlyVerified = false,
    onlyOnline = false,
    sort = 'reputation',
    page = 1,
    limit = 12
  } = {}) {
    if (!USE_FAKE) {
      return api.get('/users/search', {
        params: { q, institution, course, city, skill, skillType, availability, onlyVerified, onlyOnline, sort, page, limit }
      })
    }
    await delay()

    let sql = 'SELECT DISTINCT u.* FROM users u'
    const params = []
    const where = []

    // JOIN só quando necessário
    if (skill) {
      sql += ' JOIN skills s ON s.user_id = u.id'
      where.push('s.name LIKE ?')
      params.push(`%${skill}%`)
      if (skillType) {
        where.push('(s.type = ? OR s.type = "both")')
        params.push(skillType)
      }
    }

    if (q) {
      where.push('(u.name LIKE ? OR u.bio LIKE ? OR u.course LIKE ?)')
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }
    if (institution) { where.push('u.institution = ?'); params.push(institution) }
    if (course)      { where.push('u.course LIKE ?');   params.push(`%${course}%`) }
    if (city)        { where.push('u.city = ?');        params.push(city) }
    if (availability){ where.push('u.availability = ?');params.push(availability) }
    if (onlyVerified){ where.push('u.verified = 1') }
    if (onlyOnline)  { where.push('u.online = 1') }

    if (where.length) sql += ' WHERE ' + where.join(' AND ')

    switch (sort) {
      case 'recent':  sql += ' ORDER BY u.created_at DESC'; break
      case 'name':    sql += ' ORDER BY u.name ASC';        break
      case 'reviews': sql += ' ORDER BY u.reviews_count DESC'; break
      default:        sql += ' ORDER BY u.reputation DESC, u.reviews_count DESC'
    }

    const all = queryAll(sql, params).map(enrichUser)
    const total = all.length
    const start = (page - 1) * limit
    const items = all.slice(start, start + limit)

    return {
      data: {
        items,
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    }
  },

  async getById(id) {
    if (!USE_FAKE) return api.get(`/users/${id}`)
    await delay(80)
    const u = queryOne('SELECT * FROM users WHERE id = ?', [id])
    if (!u) {
      const err = new Error('Estudante não encontrado.')
      err.response = { status: 404, data: { message: 'Estudante não encontrado.' } }
      throw err
    }
    return { data: enrichUser(u) }
  },

  async suggestions(userId, limit = 6) {
    if (!USE_FAKE) return api.get('/users/suggestions', { params: { userId, limit } })
    await delay(80)
    const me = queryOne('SELECT * FROM users WHERE id = ?', [userId])
    if (!me) return { data: [] }

    const users = queryAll('SELECT * FROM users WHERE id != ?', [userId])
    const suggestions = users
      .map((u) => {
        let score = 0
        if (u.institution && u.institution === me.institution) score += 20
        if (u.course === me.course) score += 10
        if (u.city && u.city === me.city) score += 5
        score += (u.reputation || 0) * 2
        return { ...enrichUser(u), score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return { data: suggestions }
  },

  async filterOptions() {
    if (!USE_FAKE) return api.get('/users/filter-options')
    await delay(40)
    const institutions = queryAll(
      'SELECT DISTINCT institution FROM users WHERE institution IS NOT NULL AND institution != "" ORDER BY institution'
    ).map((r) => r.institution)

    const courses = queryAll(
      'SELECT DISTINCT course FROM users WHERE course IS NOT NULL AND course != "" ORDER BY course'
    ).map((r) => r.course)

    const cities = queryAll(
      'SELECT DISTINCT city FROM users WHERE city IS NOT NULL AND city != "" ORDER BY city'
    ).map((r) => r.city)

    const skills = queryAll(
      'SELECT DISTINCT name FROM skills ORDER BY name'
    ).map((r) => r.name)

    return { data: { institutions, courses, cities, skills } }
  }
}
