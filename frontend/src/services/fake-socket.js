// frontend/src/services/fake-socket.js
// Simula Socket.IO localmente com EventEmitter simples
export class FakeSocket {
  constructor() {
    this.handlers = new Map()
    this.connected = false
    this.id = `fake-${Math.random().toString(36).slice(2, 9)}`
    setTimeout(() => {
      this.connected = true
      this.emit('connect')
    }, 200)
  }

  on(event, cb) {
    if (!this.handlers.has(event)) this.handlers.set(event, [])
    this.handlers.get(event).push(cb)
    return this
  }

  off(event, cb) {
    const list = this.handlers.get(event) || []
    this.handlers.set(event, list.filter((f) => f !== cb))
    return this
  }

  emit(event, payload) {
    // Echo local (simula servidor a reenviar)
    const list = this.handlers.get(event) || []
    list.forEach((cb) => cb(payload))
    // Simula eventos do servidor
    if (event === 'chat:send') {
      setTimeout(() => {
        const listeners = this.handlers.get('chat:new') || []
        listeners.forEach((cb) => cb(payload))
      }, 300)
    }
    if (event === 'call:start') {
      setTimeout(() => {
        const listeners = this.handlers.get('call:incoming') || []
        listeners.forEach((cb) => cb(payload))
      }, 800)
    }
    return this
  }

  connect() { this.connected = true; this.emit('connect'); return this }
  disconnect() { this.connected = false; this.emit('disconnect'); return this }
}
