<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm" @click="$router.back()" />
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Detalhes do Pedido de Troca</div>
        <div class="text-caption text-grey-7">
          Acompanhamento completo, histórico da sessão e progresso da mentoria.
        </div>
      </div>
    </div>

    <div v-if="exchange" class="row q-col-gutter-lg">
      <!-- Coluna Esquerda: Informações Principais & Ações -->
      <div class="col-12 col-md-7">
        <q-card flat class="q-pa-lg q-mb-lg">
          <!-- Cabeçalho com Status -->
          <div class="row items-center justify-between q-mb-md">
            <span class="text-caption text-grey-6 text-weight-bold">ID: {{ exchange.id }}</span>
            <q-badge :color="getStatusColor(exchange.status)" class="q-px-md q-py-xs text-subtitle2 text-weight-bolder">
              {{ getStatusLabel(exchange.status) }}
            </q-badge>
          </div>

          <!-- Participantes em Confronto Amigável -->
          <div class="row items-center justify-between bg-soft-lavender q-pa-md rounded-borders q-mb-lg">
            <div class="row items-center">
              <q-avatar size="52px" class="shadow-1">
                <img :src="store.currentUser.avatar" />
              </q-avatar>
              <div class="q-ml-sm">
                <div class="text-subtitle1 text-weight-bold text-dark">{{ store.currentUser.name }}</div>
                <div class="text-caption text-grey-7">{{ store.currentUser.course }}</div>
              </div>
            </div>

            <q-avatar size="36px" class="bg-primary text-white text-weight-bold">⇄</q-avatar>

            <div class="row items-center text-right">
              <div class="q-mr-sm">
                <div class="text-subtitle1 text-weight-bold text-dark">{{ exchange.partnerName }}</div>
                <div class="text-caption text-grey-7">{{ exchange.partnerCourse }}</div>
              </div>
              <q-avatar size="52px" class="shadow-1">
                <img :src="exchange.partnerAvatar" />
              </q-avatar>
            </div>
          </div>

          <!-- Dados da Troca -->
          <div class="column q-gutter-md">
            <div>
              <div class="text-caption text-weight-bold text-grey-7">COMPETÊNCIAS ACORDADAS</div>
              <div class="row items-center q-mt-xs">
                <q-chip color="soft-lavender" text-color="primary" icon="school">
                  Vais Ensinar: <b>{{ exchange.skillGiven }}</b>
                </q-chip>
                <q-icon name="sync_alt" color="grey-6" class="q-mx-xs" />
                <q-chip color="lavender" text-color="secondary" icon="menu_book">
                  Vais Aprender: <b>{{ exchange.skillReceived }}</b>
                </q-chip>
              </div>
            </div>

            <div>
              <div class="text-caption text-weight-bold text-grey-7">OBJETIVO DA SESSÃO</div>
              <div class="text-body2 text-grey-9 q-mt-xs bg-grey-1 q-pa-sm rounded-borders">
                {{ exchange.goal }}
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-bold text-grey-7">DATA & HORÁRIO</div>
                <div class="text-body2 text-dark text-weight-medium q-mt-xs row items-center">
                  <q-icon name="event" color="primary" class="q-mr-xs" />
                  {{ exchange.scheduledDate }} às {{ exchange.scheduledTime }}
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-bold text-grey-7">MODALIDADE</div>
                <div class="text-body2 text-dark text-weight-medium q-mt-xs row items-center">
                  <q-icon name="videocam" color="secondary" class="q-mr-xs" />
                  {{ exchange.mode }}
                </div>
              </div>
            </div>

            <div v-if="exchange.notes">
              <div class="text-caption text-weight-bold text-grey-7">NOTAS ADICIONAIS</div>
              <div class="text-caption text-grey-8 q-mt-xs">{{ exchange.notes }}</div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Barra de Ações Dinâmicas -->
          <div class="row q-gutter-sm justify-end">
            <!-- Se Pendente -->
            <template v-if="exchange.status === 'pending'">
              <q-btn
                outline
                rounded
                color="negative"
                label="Recusar Troca"
                @click="updateStatus('rejected')"
              />
              <q-btn
                outline
                rounded
                color="warning"
                label="Reagendar Horário"
                icon="schedule"
                @click="showRescheduleDialog = true"
              />
              <q-btn
                unelevated
                rounded
                color="primary"
                label="Aceitar Pedido"
                class="text-weight-bold"
                @click="updateStatus('accepted')"
              />
            </template>

            <!-- Se Aceite -->
            <template v-else-if="exchange.status === 'accepted'">
              <q-btn
                outline
                rounded
                color="negative"
                label="Cancelar Troca"
                @click="updateStatus('cancelled')"
              />
              <q-btn
                outline
                rounded
                color="warning"
                label="Alterar Horário"
                @click="showRescheduleDialog = true"
              />
              <q-btn
                unelevated
                rounded
                color="positive"
                icon="videocam"
                label="Iniciar Sessão de Estudo"
                class="text-weight-bold"
                @click="startSession"
              />
            </template>

            <!-- Se Em Andamento -->
            <template v-else-if="exchange.status === 'running'">
              <q-btn
                unelevated
                rounded
                color="positive"
                icon="videocam"
                label="Entrar na Chamada Ao Vivo"
                :to="{ name: 'calls', query: { partner: exchange.partnerName } }"
              />
              <q-btn
                unelevated
                rounded
                color="secondary"
                icon="check_circle"
                label="Concluir Sessão"
                class="text-weight-bold"
                @click="updateStatus('completed')"
              />
            </template>

            <!-- Se Concluída -->
            <template v-else-if="exchange.status === 'completed'">
              <q-btn
                unelevated
                rounded
                color="primary"
                icon="star"
                label="Avaliar Experiência"
                :to="{ name: 'reviews' }"
              />
            </template>
          </div>
        </q-card>
      </div>

      <!-- Coluna Direita: Timeline do Progresso da Troca -->
      <div class="col-12 col-md-5">
        <q-card flat class="q-pa-lg">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">
            Progresso & Histórico da Troca
          </div>

          <q-timeline color="primary">
            <q-timeline-entry
              v-for="(step, idx) in exchange.timeline"
              :key="idx"
              :title="step.title"
              :subtitle="step.date"
              :icon="step.done ? 'check' : 'hourglass_top'"
              :color="step.done ? 'positive' : 'grey-5'"
            />
          </q-timeline>

          <q-separator class="q-my-md" />

          <!-- Chat Rápido com o Parceiro -->
          <div class="text-caption text-grey-7 q-mb-sm">Precisas de alinhar algum detalhe antes da sessão?</div>
          <q-btn
            outline
            rounded
            dense
            color="primary"
            icon="chat"
            label="Conversar com o Parceiro"
            class="full-width"
            :to="{ name: 'chat-user', params: { userId: exchange.partnerId } }"
          />
        </q-card>
      </div>
    </div>

    <!-- Modal Reagendar Horário -->
    <q-dialog v-model="showRescheduleDialog">
      <q-card style="width: 450px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="row items-center justify-between bg-soft-lavender">
          <div class="text-subtitle1 text-weight-bold">Reagendar Sessão</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="newDate" label="Nova Data" type="date" outlined dense />
          <q-select
            v-model="newTime"
            label="Novo Horário"
            :options="['09:00 - 10:30', '10:30 - 12:00', '14:00 - 15:30', '16:00 - 17:30', '18:00 - 19:30']"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated rounded label="Guardar Reagendamento" color="primary" @click="handleReschedule" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <EmptyState
      v-if="!exchange"
      icon="search_off"
      title="Troca não encontrada"
      description="Este pedido não existe ou foi cancelado."
      action-label="Ver Todas as Trocas"
      action-icon="arrow_back"
      @action="$router.push({ name: 'exchanges' })"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import EmptyState from 'src/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()

const showRescheduleDialog = ref(false)
const newDate = ref('2026-11-15')
const newTime = ref('16:00 - 17:30')

const exchange = computed(() => {
  const id = route.params.id
  return store.exchanges.find(e => e.id === id) || store.exchanges[0]
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
    accepted: 'Confirmada / Aceite',
    running: 'Sessão em Andamento',
    completed: 'Concluída com Sucesso',
    rejected: 'Recusada',
    cancelled: 'Cancelada'
  }
  return map[status] || status
}

function updateStatus(newStatus) {
  if (!exchange.value) return
  store.updateExchangeStatus(exchange.value.id, newStatus)
  $q.notify({ type: 'positive', message: `Estado atualizado para: ${getStatusLabel(newStatus)}` })
}

function startSession() {
  updateStatus('running')
  router.push({ name: 'calls', query: { partner: exchange.value.partnerName } })
}

function handleReschedule() {
  if (!exchange.value) return
  store.rescheduleExchange(exchange.value.id, newDate.value, newTime.value)
  showRescheduleDialog.value = false
  $q.notify({ type: 'positive', message: 'Horário reagendado com sucesso!' })
}
</script>
