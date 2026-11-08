// frontend/src/db/index.js
import initSqlJs from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import schemaSql from './schema.sql?raw'
import { buildSeed } from './seed'

let dbInstance = null

export async function initDatabase() {
  if (dbInstance) return dbInstance

  const SQL = await initSqlJs({
    locateFile: (file) => (file.endsWith('.wasm') ? sqlWasmUrl : file)
  })

  // Persistência simples em localStorage
  const saved = localStorage.getItem('meetus_db')
  if (saved) {
    const bytes = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0))
    dbInstance = new SQL.Database(bytes)
    console.log('[DB] Base carregada do localStorage')
  } else {
    dbInstance = new SQL.Database()
    dbInstance.run(schemaSql)
    buildSeed(dbInstance)
    saveDatabase()
    console.log('[DB] Base criada com seeds fictícios')
  }

  return dbInstance
}

export function saveDatabase() {
  if (!dbInstance) return
  const data = dbInstance.export()
  let binary = ''
  for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i])
  localStorage.setItem('meetus_db', btoa(binary))
}

export function resetDatabase() {
  localStorage.removeItem('meetus_db')
  dbInstance = null
}

/* ---------- Helpers ---------- */

export function queryAll(sql, params = []) {
  if (!dbInstance) throw new Error('DB não inicializada')
  const stmt = dbInstance.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

export function queryOne(sql, params = []) {
  return queryAll(sql, params)[0] || null
}

export function run(sql, params = []) {
  if (!dbInstance) throw new Error('DB não inicializada')
  dbInstance.run(sql, params)
  const id = dbInstance.exec('SELECT last_insert_rowid() AS id')[0].values[0][0]
  saveDatabase()
  return id
}

export function getDb() {
  return dbInstance
}
