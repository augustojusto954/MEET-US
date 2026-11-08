<template>
  <div class="column items-center justify-center text-center q-pa-xl empty-state-container">
    <div class="empty-state-icon-wrapper q-mb-md">
      <q-avatar size="80px" class="bg-soft-lavender text-primary-purple shadow-sm">
        <q-icon :name="icon || 'inbox'" size="42px" />
      </q-avatar>
    </div>
    <div class="text-h6 text-weight-bold text-dark q-mb-xs">{{ title }}</div>
    <div class="text-body2 text-grey-7 q-mb-lg max-w-sm" style="max-width: 380px;">
      {{ description }}
    </div>
    <q-btn
      v-if="actionLabel"
      :label="actionLabel"
      :icon="actionIcon"
      color="primary"
      unelevated
      rounded
      padding="8px 24px"
      @click="$emit('action')"
    />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'inbox' },
  title: { type: String, default: 'Sem registos para mostrar' },
  description: { type: String, default: 'Não foram encontrados dados para esta secção no momento.' },
  actionLabel: { type: String, default: '' },
  actionIcon: { type: String, default: '' }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state-container {
  min-height: 280px;
}
.empty-state-icon-wrapper {
  animation: floatSlow 4s ease-in-out infinite;
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
