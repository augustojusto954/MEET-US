<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
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
  if (auth.isAuthenticated) {
    await auth.fetchMe?.()
    chat.loadConversations?.()
    notifs.load?.()
  }
  await meetusStore.syncWithBackend?.()
})
</script>
