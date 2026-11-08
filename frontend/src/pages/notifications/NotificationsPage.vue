<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Centro de Notificações</div>
        <div class="text-caption text-grey-7">Fica a par de pedidos de troca, conexões e conquistas na rede.</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          rounded
          color="primary"
          icon="done_all"
          label="Marcar Todas como Lidas"
          @click="store.markAllNotificationsAsRead"
        />
      </div>
    </div>

    <!-- Filtros de Categorias -->
    <q-card flat class="q-mb-lg">
      <q-tabs
        v-model="activeCategory"
        dense
        class="text-grey-7 bg-soft-lavender"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="All" label="Todas">
          <q-badge color="primary" class="q-ml-xs">{{ store.notifications.length }}</q-badge>
        </q-tab>
        <q-tab name="Connections" label="Conexões" />
        <q-tab name="Exchanges" label="Trocas" />
        <q-tab name="Messages" label="Mensagens" />
        <q-tab name="Community" label="Comunidade" />
        <q-tab name="Achievements" label="Conquistas" />
      </q-tabs>
    </q-card>

    <!-- Lista de Notificações -->
    <div v-if="filteredNotifications.length" class="column q-gutter-sm">
      <q-card
        v-for="notif in filteredNotifications"
        :key="notif.id"
        flat
        class="q-pa-md hover-lift transition-all"
        :class="{ 'bg-soft-lavender': !notif.read, 'bg-white': notif.read }"
        style="border-left: 4px solid;"
        :style="{ borderLeftColor: notif.read ? '#EAE8FF' : '#5B55D6' }"
      >
        <div class="row items-center justify-between">
          <div class="row items-center col">
            <q-avatar size="44px" :color="getCategoryColor(notif.category)" text-color="white" class="q-mr-md shadow-1">
              <q-icon :name="getCategoryIcon(notif.category)" size="22px" />
            </q-avatar>

            <div class="col">
              <div class="row items-center">
                <span class="text-subtitle2 text-weight-bolder text-dark">{{ notif.title }}</span>
                <q-badge v-if="!notif.read" color="negative" class="q-ml-sm" rounded style="font-size: 9px;">Nova</q-badge>
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">{{ notif.body }}</div>
              <div class="text-caption text-grey-6 q-mt-xs">{{ notif.date }}</div>
            </div>
          </div>

          <div class="row items-center q-gutter-xs">
            <q-btn
              v-if="notif.link"
              unelevated
              rounded
              dense
              size="sm"
              color="primary"
              label="Ver"
              class="q-px-sm"
              :to="notif.link"
              @click="store.markNotificationAsRead(notif.id)"
            />
            <q-btn
              v-if="!notif.read"
              flat
              round
              dense
              color="grey-7"
              icon="mark_email_read"
              @click="store.markNotificationAsRead(notif.id)"
            >
              <q-tooltip>Marcar como lida</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="grey-5"
              icon="close"
              @click="store.removeNotification(notif.id)"
            >
              <q-tooltip>Remover</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card>
    </div>

    <EmptyState
      v-else
      icon="notifications_off"
      title="Nenhuma notificação encontrada"
      description="Estás a par de todas as novidades e pedidos na plataforma!"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMeetUsStore } from 'src/stores/meetus'
import EmptyState from 'src/components/common/EmptyState.vue'

const store = useMeetUsStore()
const activeCategory = ref('All')

const filteredNotifications = computed(() => {
  if (activeCategory.value === 'All') return store.notifications
  return store.notifications.filter(n => n.category === activeCategory.value)
})

function getCategoryIcon(cat) {
  const map = {
    Connections: 'group_add',
    Exchanges: 'swap_horiz',
    Messages: 'chat',
    Community: 'forum',
    Achievements: 'emoji_events'
  }
  return map[cat] || 'notifications'
}

function getCategoryColor(cat) {
  const map = {
    Connections: 'secondary',
    Exchanges: 'primary',
    Messages: 'info',
    Community: 'accent',
    Achievements: 'warning'
  }
  return map[cat] || 'primary'
}
</script>
