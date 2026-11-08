// frontend/src/boot/db.js
import { boot } from 'quasar/wrappers'
import { initDatabase } from 'src/db'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

export default boot(async ({ app }) => {
  if (USE_FAKE) {
    const db = await initDatabase()
    app.config.globalProperties.$db = db
    console.log('[DB] SQLite fictício inicializado com sucesso')
  } else {
    console.log('[DB] Conectado ao Backend Node.js & MongoDB (http://localhost:3000)')
  }
})
