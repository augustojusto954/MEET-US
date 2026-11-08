<template>
  <q-card class="cursor-pointer exchange-card" @click="$emit('open', exchange)">
    <q-card-section>
      <div class="row items-center">
        <q-avatar size="42px">
          <img :src="other?.avatar">
        </q-avatar>
        <div class="q-ml-md col">
          <div class="text-subtitle2 text-weight-medium">{{ other?.name || '—' }}</div>
          <div class="text-caption text-grey-7">
            {{ roleLabel }}
          </div>
        </div>
        <ExchangeStatusChip :status="exchange.status" />
      </div>

      <div class="q-mt-md">
        <q-icon name="swap_horiz" color="primary" />
        <span class="text-weight-medium q-ml-xs">{{ exchange.skill }}</span>
      </div>

      <div v-if="exchange.message" class="text-caption text-grey-7 q-mt-xs" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        {{ exchange.message }}
      </div>

      <div class="row items-center q-mt-sm text-caption text-grey-6">
        <q-icon name="schedule" size="14px" />
        <span class="q-ml-xs">{{ formatDate(exchange.created_at) }}</span>
        <q-space />
        <span v-if="exchange.scheduled_at">
          <q-icon name="event" size="14px" />
          <span class="q-ml-xs">{{ formatDate(exchange.scheduled_at) }}</span>
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import ExchangeStatusChip from './ExchangeStatusChip.vue'
import { formatDate } from 'src/utils/format'
import { useAuthStore } from 'src/stores/auth'

const props = defineProps({
  exchange: { type: Object, required: true }
})
defineEmits(['open'])

const auth = useAuthStore()
const isRequester = computed(() => props.exchange.requester_id === auth.userId)
const other = computed(() => (isRequester.value ? props.exchange.provider : props.exchange.requester))
const roleLabel = computed(() =>
  isRequester.value ? 'Tu pediste • ' + props.exchange.skill : 'Pedido recebido'
)
</script>

<style scoped>
.exchange-card { transition: transform 0.15s, box-shadow 0.15s; border-radius: 12px; }
.exchange-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
</style>
