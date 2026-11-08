<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Pedidos de Troca</div>
        <div class="text-caption text-grey-7">
          Acompanha todas as tuas propostas de mentoria mútua e sessões acordadas.
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add"
        label="Criar Nova Troca"
        :to="{ name: 'exchange-create' }"
      />
    </div>

    <!-- Filtros de Estado -->
    <q-card flat class="q-mb-lg">
      <q-tabs
        v-model="statusFilter"
        dense
        class="text-grey-7 bg-soft-lavender"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="all" label="Todas" />
        <q-tab name="pending" label="Pendentes">
          <q-badge v-if="store.pendingExchangesCount" color="negative" class="q-ml-xs">
            {{ store.pendingExchangesCount }}
          </q-badge>
        </q-tab>
        <q-tab name="accepted" label="Aceites" />
        <q-tab name="running" label="Em Andamento" />
        <q-tab name="completed" label="Concluídas" />
      </q-tabs>
    </q-card>

    <!-- Lista de Trocas -->
    <div v-if="filteredExchanges.length" class="row q-col-gutter-md">
      <div
        v-for="exc in filteredExchanges"
        :key="exc.id"
        class="col-12 col-md-6"
      >
        <q-card flat class="q-pa-md hover-lift full-height column justify-between">
          <div>
            <!-- Topo: Participante & Status Badge -->
            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-avatar size="48px" class="shadow-1">
                  <img :src="exc.partnerAvatar" />
                </q-avatar>
                <div class="q-ml-sm">
                  <div class="text-subtitle1 text-weight-bolder text-dark">{{ exc.partnerName }}</div>
                  <div class="text-caption text-grey-7">{{ exc.partnerCourse }} • {{ exc.partnerUniversity }}</div>
                </div>
              </div>

              <q-badge :color="getStatusColor(exc.status)" class="q-px-sm q-py-xs text-weight-bold">
                {{ getStatusLabel(exc.status) }}
              </q-badge>
            </div>

            <q-separator class="q-my-sm" />

            <!-- Competências Trocadas -->
            <div class="bg-soft-lavender q-pa-sm rounded-borders q-my-sm">
              <div class="row items-center justify-between text-body2">
                <div class="col">
                  <div class="text-caption text-weight-bold text-primary">Vais Ensinar:</div>
                  <div class="text-weight-bold text-dark ellipsis">{{ exc.skillGiven }}</div>
                </div>
                <q-icon name="sync_alt" color="primary" size="20px" class="q-mx-xs" />
                <div class="col text-right">
                  <div class="text-caption text-weight-bold text-secondary">Vais Aprender:</div>
                  <div class="text-weight-bold text-dark ellipsis">{{ exc.skillReceived }}</div>
                </div>
              </div>
            </div>

            <!-- Objetivo & Agendamento -->
            <div class="text-caption text-grey-8 ellipsis-2-lines q-mb-xs">
              <b>Objetivo:</b> {{ exc.goal }}
            </div>
            <div class="text-caption text-primary row items-center">
              <q-icon name="event" size="14px" class="q-mr-xs" />
              {{ exc.scheduledDate }} às {{ exc.scheduledTime }} ({{ exc.mode }})
            </div>
          </div>

          <!-- Ações do Cartão -->
          <div class="row q-gutter-xs q-mt-md pt-sm border-top">
            <q-btn
              flat
              rounded
              dense
              color="grey-8"
              label="Ver Detalhes"
              class="col"
              :to="{ name: 'exchange-details', params: { id: exc.id } }"
            />

            <q-btn
              v-if="exc.status === 'running'"
              unelevated
              rounded
              dense
              color="positive"
              icon="videocam"
              label="Entrar na Sala"
              class="col"
              :to="{ name: 'calls', query: { partner: exc.partnerName } }"
            />

            <q-btn
              v-else-if="exc.status === 'pending'"
              unelevated
              rounded
              dense
              color="primary"
              label="Aceitar Pedido"
              class="col"
              @click="handleAcceptExchange(exc.id)"
            />

            <q-btn
              v-else-if="exc.status === 'accepted'"
              unelevated
              rounded
              dense
              color="primary"
              label="Iniciar Sessão"
              class="col"
              @click="handleStartExchange(exc.id)"
            />

            <q-btn
              v-else-if="exc.status === 'completed'"
              outline
              rounded
              dense
              color="primary"
              label="Avaliar Sessão"
              class="col"
              :to="{ name: 'reviews' }"
            />
          </div>
        </q-card>
      </div>
    </div>

    <EmptyState
      v-else
      icon="swap_horiz"
      title="Nenhuma troca encontrada neste filtro"
      description="Cria uma nova proposta de troca para começar a colaborar."
      action-label="Propor Nova Troca"
      action-icon="add"
      @action="$router.push({ name: 'exchange-create' })"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import EmptyState from 'src/components/common/EmptyState.vue'

const $q = useQuasar()
const store = useMeetUsStore()

const statusFilter = ref('all')

const filteredExchanges = computed(() => {
  if (statusFilter.value === 'all') return store.exchanges
  return store.exchanges.filter(e => e.status === statusFilter.value)
})

function getStatusColor(status) {
  const map = {
    pending: 'warning',
    accepted: 'primary',
    running: 'positive',
    completed: 'secondary',
    rejected: 'negative',
    cancelled: 'grey-6'
  }
  return map[status] || 'grey'
}

function getStatusLabel(status) {
  const map = {
    pending: 'Pendente',
    accepted: 'Aceite',
    running: 'Em Andamento',
    completed: 'Concluída',
    rejected: 'Recusada',
    cancelled: 'Cancelada'
  }
  return map[status] || status
}

function handleAcceptExchange(id) {
  store.updateExchangeStatus(id, 'accepted')
  $q.notify({ type: 'positive', message: 'Troca aceite! A sessão está confirmada.' })
}

function handleStartExchange(id) {
  store.updateExchangeStatus(id, 'running')
  $q.notify({ type: 'positive', message: 'Sessão iniciada! Boa troca de conhecimento.' })
}
</script>
