// frontend/src/services/fake-api.js
import { queryAll, queryOne, run } from 'src/db'

/* ---------- Helpers ---------- */
function ok(data) { return { data } }
function fail(msg, status = 400) {
  const err = new Error(msg)
  err.response = { status, data: { message: msg } }
  throw err
}
function delay(ms = 150) { return new Promise((r) => setTimeout(r, ms)) }

function enrichUser(u) {
  if (!u) return null
  const skills = queryAll('SELECT * FROM skills WHERE user_id = ?', [u.id])
  const interests = queryAll('SELECT * FROM interests WHERE user_id = ?', [u.id])
  return { ...u, skills, interests }
}

/* ---------- AUTH ---------- */
export const fakeAuth = {
  async register({ name, email, password, institution, course, year }) {
    await delay()
    if (!email || !password || !name) fail('Preenche todos os campos obrigatórios.')
    if (queryOne('SELECT id FROM users WHERE email = ?', [email])) {
      fail('Este e-mail já está registado.')
    }
    const id = run(
      `INSERT INTO users (name,email,password,institution,course,year,avatar)
       VALUES (?,?,?,?,?,?,?)`,
      [name, email, password, institution || '', course || '', year || 1,
       'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces']
    )
    const user = enrichUser(queryOne('SELECT * FROM users WHERE id = ?', [id]))
    return ok({ token: `fake-jwt-${id}`, user })
  },

  async login({ email, password }) {
    await delay()
    const u = queryOne('SELECT * FROM users WHERE email = ?', [email])
    if (!u || u.password !== password) fail('Credenciais inválidas.', 401)
    const user = enrichUser(u)
    return ok({ token: `fake-jwt-${u.id}`, user })
  },

  async me(userId) {
    await delay(50)
    const u = queryOne('SELECT * FROM users WHERE id = ?', [userId])
    if (!u) fail('Utilizador não encontrado.', 404)
    return ok(enrichUser(u))
  },

  async forgotPassword(email) {
    await delay()
    if (!email) fail('Informe o e-mail.')
    return ok({ message: 'Se o e-mail existir, enviámos instruções.' })
  }
}

/* ---------- USERS / PROFILE ---------- */
export const fakeUsers = {
  async getById(id) {
    await delay(80)
    const u = queryOne('SELECT * FROM users WHERE id = ?', [id])
    if (!u) fail('Utilizador não encontrado.', 404)
    return ok(enrichUser(u))
  },

  async update(id, patch) {
    await delay()
    const allowed = ['name','bio','institution','course','year','city','availability','avatar']
    const fields = Object.keys(patch).filter((k) => allowed.includes(k))
    if (!fields.length) return ok(enrichUser(queryOne('SELECT * FROM users WHERE id = ?', [id])))
    const sql = `UPDATE users SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`
    run(sql, [...fields.map((f) => patch[f]), id])
    return ok(enrichUser(queryOne('SELECT * FROM users WHERE id = ?', [id])))
  },

  async search({ q = '', institution = '', skill = '', page = 1, limit = 12 } = {}) {
    await delay()
    let sql = 'SELECT DISTINCT u.* FROM users u'
    const params = []
    const where = []
    if (skill) {
      sql += ' JOIN skills s ON s.user_id = u.id'
      where.push('s.name LIKE ?')
      params.push(`%${skill}%`)
    }
    if (q) { where.push('(u.name LIKE ? OR u.bio LIKE ? OR u.course LIKE ?)'); params.push(`%${q}%`, `%${q}%`, `%${q}%`) }
    if (institution) { where.push('u.institution = ?'); params.push(institution) }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY u.reputation DESC'

    const all = queryAll(sql, params).map(enrichUser)
    const total = all.length
    const start = (page - 1) * limit
    return ok({ items: all.slice(start, start + limit), total, page, limit })
  },

  async leaderboard(limit = 20) {
    await delay()
    const items = queryAll('SELECT * FROM users ORDER BY reputation DESC, reviews_count DESC LIMIT ?', [limit])
    return ok(items.map(enrichUser))
  }
}

/* ---------- SKILLS / INTERESTS ---------- */
export const fakeSkills = {
  async listByUser(userId) {
    return ok(queryAll('SELECT * FROM skills WHERE user_id = ?', [userId]))
  },
  async add(userId, { name, type, level }) {
    if (!name || !type) fail('Nome e tipo são obrigatórios.')
    const id = run('INSERT INTO skills (user_id,name,type,level) VALUES (?,?,?,?)', [userId, name, type, level || ''])
    return ok(queryOne('SELECT * FROM skills WHERE id = ?', [id]))
  },
  async remove(id) {
    run('DELETE FROM skills WHERE id = ?', [id])
    return ok({ success: true })
  }
}

export const fakeInterests = {
  async listByUser(userId) {
    return ok(queryAll('SELECT * FROM interests WHERE user_id = ?', [userId]))
  },
  async add(userId, name) {
    if (!name) fail('Nome do interesse é obrigatório.')
    const id = run('INSERT INTO interests (user_id,name) VALUES (?,?)', [userId, name])
    return ok(queryOne('SELECT * FROM interests WHERE id = ?', [id]))
  },
  async remove(id) {
    run('DELETE FROM interests WHERE id = ?', [id])
    return ok({ success: true })
  }
}
