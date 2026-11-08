<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { socket } from 'src/boot/socket'
import { useAuthStore } from 'src/stores/auth'
import { useChatStore } from 'src/stores/chat'
import { useNotificationsStore } from 'src/stores/notifications'
import { useMeetUsStore } from 'src/stores/meetus'

const auth = useAuthStore()
const chat = useChatStore()
const notifs = useNotificationsStore()
const meetusStore = useMeetUsStore()

onMounted(async () => {
  chat.bindSocket?.()
  notifs.bindSocket?.()

  if (socket) {
    if (auth.isAuthenticated && auth.userId) {
      socket.emit('user:join', auth.userId)
    }

    socket.on('connect', () => {
      if (auth.isAuthenticated && auth.userId) {
        socket.emit('user:join', auth.userId)
      }
    })

    socket.on('user:presence', ({ userId, online }) => {
      meetusStore.updateUserPresence?.(userId, online)
      if (chat.conversations && Array.isArray(chat.conversations)) {
        const conv = chat.conversations.find(c => String(c.other?.id || c.partnerId) === String(userId))
        if (conv) conv.online = Boolean(online)
      }
    })

    socket.on('users:online_list', (onlineIds) => {
      meetusStore.setOnlineUsers?.(onlineIds)
    })
  }

  if (auth.isAuthenticated) {
    await auth.fetchMe?.()
    chat.loadConversations?.()
    notifs.load?.()
  }
  await meetusStore.syncWithBackend?.()
})
</script>
