// frontend/src/services/chat.service.js
import { queryAll, queryOne, run } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'
const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms))

export const chatService = {
  async listConversations(userId) {
    if (!USE_FAKE) return api.get('/chat/conversations', { params: { userId } })
    await delay()
    const convs = queryAll(
      `SELECT * FROM conversations WHERE user_a = ? OR user_b = ? ORDER BY last_message_at DESC`,
      [userId, userId]
    )
    return {
      data: convs.map((c) => {
        const otherId = c.user_a === userId ? c.user_b : c.user_a
        const other = queryOne('SELECT * FROM users WHERE id = ?', [otherId])
        const unread = queryOne(
          `SELECT COUNT(*) AS n FROM messages
           WHERE conversation_id = ? AND sender_id != ? AND status != 'read'`,
          [c.id, userId]
        )?.n || 0
        return { ...c, other, unread }
      })
    }
  },

  async getOrCreate(userId, otherId) {
    if (!USE_FAKE) return api.post('/chat/conversations', { userId, otherId })
    await delay()
    const a = Math.min(userId, otherId)
    const b = Math.max(userId, otherId)
    let conv = queryOne('SELECT * FROM conversations WHERE user_a = ? AND user_b = ?', [a, b])
    if (!conv) {
      const id = run('INSERT INTO conversations (user_a,user_b,last_message,last_message_at) VALUES (?,?,?,datetime("now"))', [a, b, ''])
      conv = queryOne('SELECT * FROM conversations WHERE id = ?', [id])
    }
    return { data: conv }
  },

  async listMessages(conversationId, { limit = 50 } = {}) {
    if (!USE_FAKE) return api.get(`/chat/conversations/${conversationId}/messages`, { params: { limit } })
    await delay(80)
    const rows = queryAll(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?',
      [conversationId, limit]
    )
    return { data: rows }
  },

  async sendMessage({ conversationId, senderId, type = 'text', content, fileUrl }) {
    if (!USE_FAKE) return api.post('/chat/messages', { conversationId, senderId, type, content, fileUrl })
    await delay(60)
    const id = run(
      `INSERT INTO messages (conversation_id,sender_id,type,content,file_url,status)
       VALUES (?,?,?,?,?,?)`,
      [conversationId, senderId, type, content || '', fileUrl || '', 'sent']
    )
    run(
      `UPDATE conversations SET last_message = ?, last_message_at = datetime('now') WHERE id = ?`,
      [content || `[${type}]`, conversationId]
    )
    return { data: queryOne('SELECT * FROM messages WHERE id = ?', [id]) }
  },

  async markRead(conversationId, userId) {
    if (!USE_FAKE) return api.put(`/chat/conversations/${conversationId}/read`, { userId })
    run(
      `UPDATE messages SET status = 'read' WHERE conversation_id = ? AND sender_id != ?`,
      [conversationId, userId]
    )
    return { data: { success: true } }
  }
}
