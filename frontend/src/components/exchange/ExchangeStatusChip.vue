<template>
  <q-chip
    dense
    size="sm"
    :color="meta.color"
    text-color="white"
    :icon="meta.icon"
    class="text-weight-medium"
  >
    {{ meta.label }}
  </q-chip>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const MAP = {
  pending:   { label: 'Pendente',   color: 'orange',    icon: 'hourglass_empty' },
  accepted:  { label: 'Aceite',     color: 'teal',      icon: 'check_circle' },
  rejected:  { label: 'Rejeitado',  color: 'negative',  icon: 'cancel' },
  cancelled: { label: 'Cancelado',  color: 'grey-7',    icon: 'block' },
  running:   { label: 'Em execução',color: 'blue',      icon: 'autorenew' },
  completed: { label: 'Concluído',  color: 'positive',  icon: 'task_alt' }
}

const meta = computed(() => MAP[props.status] || { label: props.status, color: 'grey', icon: 'help' })
</script>
