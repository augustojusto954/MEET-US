<template>
  <q-btn flat round dense icon="notifications">
    <q-badge
      v-if="store.unreadCount"
      color="red"
      floating
      rounded
      :label="store.unreadCount > 99 ? '99+' : store.unreadCount"
    />

    <q-menu
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      style="width: 360px; max-width: 92vw;"
      @before-show="onOpen"
    >
      <div class="column">
        <!-- Header -->
        <div class="row items-center q-pa-md">
          <div class="text-subtitle1 text-weight-medium">
            Notificações
            <q-badge v-if="store.unreadCount" color="primary" class="q-ml-xs">
              {{ store.unreadCount }}
            </q-badge>
          </div>
          <q-space />
          <q-btn
            v-if="store.unreadCount"
            flat dense size="sm"
            color="primary"
            label="Marcar todas"
            @click="store.markAllRead()"
          />
        </div>

        <q-separator />

        <!-- Lista -->
        <q-list
          v-if="store.items.length"
          separator
          style="max-height: 380px; overflow-y: auto;"
        >
          <NotificationItem
            v-for="n in store.items.slice(0, 6)"
            :key="n.id"
            :notification="n"
            @click="onClick(n)"
            @remove="store.remove(n.id)"
          />
        </q-list>

        <div v-else class="text-center text-grey-7 q-pa-lg">
          <q-icon name="notifications_off" size="2.4rem" />
          <div class="text-caption q-mt-sm">Sem notificações</div>
        </div>

        <q-separator />

        <!-- Footer -->
        <div class="row justify-center q-pa-sm">
          <q-btn
            flat
            color="primary"
            label="Ver todas"
            icon-right="arrow_forward"
            :to="{ name: 'notifications' }"
            @click="$refs.menu?.hide?.()"
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from 'src/stores/notifications'
import NotificationItem from './NotificationItem.vue'

const store = useNotificationsStore()
const router = useRouter()

function onOpen() {
  store.load()
}

onMounted(() => {
  store.load()
})

async function onClick(n) {
  if (!n.read) await store.markRead(n.id)
  if (n.link) {
    // Se link for uma rota conhecida, navega
    router.push(n.link).catch(() => {})
  }
}
</script>
