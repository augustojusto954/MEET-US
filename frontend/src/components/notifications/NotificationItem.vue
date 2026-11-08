<template>
  <q-item
    clickable
    :class="['notification-item', { 'bg-blue-1': !notification.read }]"
    @click="onClick"
  >
    <q-item-section avatar top>
      <q-avatar :color="meta.color" text-color="white" :icon="meta.icon" size="36px" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium">
        {{ notification.title }}
      </q-item-label>
      <q-item-label v-if="notification.body" caption lines="2">
        {{ notification.body }}
      </q-item-label>
      <q-item-label caption class="text-grey-6 q-mt-xs">
        <q-icon name="schedule" size="12px" />
        {{ relativeTime }}
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <div class="column items-end q-gutter-xs">
        <q-badge v-if="!notification.read" color="primary" rounded>nova</q-badge>
        <q-btn
          flat round dense size="sm"
          icon="close"
          @click.stop="$emit('remove', notification)"
        >
          <q-tooltip>Remover</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  notification: { type: Object, required: true }
})
const emit = defineEmits(['click', 'remove'])

const MAP = {
  match:    { color: 'pink',     icon: 'favorite' },
  exchange: { color: 'primary',  icon: 'swap_horiz' },
  message:  { color: 'teal',     icon: 'chat' },
  review:   { color: 'amber',    icon: 'star' },
  call:     { color: 'purple',   icon: 'call' },
  system:   { color: 'grey-7',   icon: 'info' }
}

const meta = computed(() => MAP[props.notification.type] || MAP.system)

const relativeTime = computed(() => {
  const d = new Date(props.notification.created_at)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} d`
  return d.toLocaleDateString('pt-PT')
})

function onClick() {
  emit('click', props.notification)
}
</script>

<style scoped>
.notification-item {
  transition: background 0.15s;
}
</style>
