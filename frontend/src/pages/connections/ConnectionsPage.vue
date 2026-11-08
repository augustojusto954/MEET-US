<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Minhas Conexões</div>
        <div class="text-caption text-grey-7">
          Gere os teus colegas de estudo, pedidos recebidos, enviados e novas sugestões.
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="person_add"
        label="Descobrir Colegas"
        :to="{ name: 'students' }"
      />
    </div>

    <!-- Tabs: All Connections, Received, Sent, Suggested -->
    <q-card flat class="q-mb-lg">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-7 bg-soft-lavender"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="all" label="Todas as Conexões">
          <q-badge color="primary" class="q-ml-xs">{{ store.myConnectionsList.length }}</q-badge>
        </q-tab>
        <q-tab name="received" label="Pedidos Recebidos">
          <q-badge v-if="store.receivedRequestsList.length" color="negative" class="q-ml-xs">
            {{ store.receivedRequestsList.length }}
          </q-badge>
        </q-tab>
        <q-tab name="sent" label="Pedidos Enviados">
          <q-badge color="grey-6" class="q-ml-xs">{{ store.sentRequestsList.length }}</q-badge>
        </q-tab>
        <q-tab name="suggested" label="Sugeridos para Si">
          <q-badge color="secondary" class="q-ml-xs">{{ store.suggestedStudentsList.length }}</q-badge>
        </q-tab>
      </q-tabs>
    </q-card>

    <!-- Tab 1: All Connections -->
    <div v-if="activeTab === 'all'">
      <div v-if="store.myConnectionsList.length" class="row q-col-gutter-md">
        <div
          v-for="student in store.myConnectionsList"
          :key="student.id"
          class="col-12 col-sm-6 col-lg-4"
        >
          <q-card flat class="q-pa-md hover-lift full-height column justify-between">
            <div>
              <div class="row items-center">
                <q-avatar size="54px" class="shadow-1">
                  <img :src="student.avatar" />
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bolder text-dark">{{ student.name }}</div>
                  <div class="text-caption text-grey-7">{{ student.course }}</div>
                  <div class="text-caption text-grey-6">{{ student.institution }}</div>
                </div>
              </div>

              <div class="q-mt-sm">
                <div class="text-caption text-weight-bold text-primary">Competências:</div>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-chip
                    v-for="sk in (student.skillsTeach || []).slice(0, 3)"
                    :key="sk.id"
                    dense
                    size="sm"
                    color="soft-lavender"
                    text-color="primary"
                  >
                    {{ sk.name }}
                  </q-chip>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="row q-gutter-xs q-mt-md pt-sm border-top">
              <q-btn
                unelevated
                rounded
                dense
                color="primary"
                icon="chat"
                label="Mensagem"
                class="col"
                :to="{ name: 'chat-user', params: { userId: student.id } }"
              />
              <q-btn
                flat
                rounded
                dense
                color="grey-8"
                label="Perfil"
                :to="{ name: 'profile', query: { id: student.id } }"
              />
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="person_remove"
                @click="handleRemoveConnection(student.id)"
              >
                <q-tooltip>Remover Conexão</q-tooltip>
              </q-btn>
            </div>
          </q-card>
        </div>
      </div>

      <EmptyState
        v-else
        icon="groups"
        title="Ainda não tens conexões ativas"
        description="Conecta-te com estudantes da tua universidade ou de outras instituições para começarem a trocar competências."
        action-label="Encontrar Colegas"
        action-icon="search"
        @action="$router.push({ name: 'students' })"
      />
    </div>

    <!-- Tab 2: Received Requests -->
    <div v-if="activeTab === 'received'">
      <div v-if="store.receivedRequestsList.length" class="row q-col-gutter-md">
        <div
          v-for="student in store.receivedRequestsList"
          :key="student.id"
          class="col-12 col-sm-6 col-lg-4"
        >
          <q-card flat class="q-pa-md hover-lift full-height column justify-between" style="border: 1px solid #5B55D6;">
            <div>
              <div class="row items-center justify-between">
                <q-badge color="accent" text-color="white" class="q-pa-xs">Pedido Recebido</q-badge>
                <span class="text-caption text-grey-6">Há 2 horas</span>
              </div>

              <div class="row items-center q-mt-sm">
                <q-avatar size="50px">
                  <img :src="student.avatar" />
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bolder text-dark">{{ student.name }}</div>
                  <div class="text-caption text-grey-7">{{ student.course }} • {{ student.institution }}</div>
                </div>
              </div>

              <div class="bg-soft-lavender q-pa-sm rounded-borders q-mt-sm">
                <div class="text-caption text-grey-8 italic">
                  "Olá! Vi que ensinas Vue.js, gostaria muito de trocar com Cálculo!"
                </div>
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-md pt-sm border-top">
              <q-btn
                unelevated
                rounded
                color="primary"
                label="Aceitar"
                class="col text-weight-bold"
                @click="handleAccept(student.id)"
              />
              <q-btn
                flat
                rounded
                color="negative"
                label="Recusar"
                class="col"
                @click="handleDecline(student.id)"
              />
            </div>
          </q-card>
        </div>
      </div>

      <EmptyState
        v-else
        icon="inbox"
        title="Nenhum pedido recebido pendente"
        description="Quando outros estudantes quiserem conectar-se contigo, os pedidos aparecerão aqui."
      />
    </div>

    <!-- Tab 3: Sent Requests -->
    <div v-if="activeTab === 'sent'">
      <div v-if="store.sentRequestsList.length" class="row q-col-gutter-md">
        <div
          v-for="student in store.sentRequestsList"
          :key="student.id"
          class="col-12 col-sm-6 col-lg-4"
        >
          <q-card flat class="q-pa-md hover-lift full-height column justify-between">
            <div>
              <div class="row items-center justify-between">
                <q-badge color="grey-4" text-color="dark" class="q-pa-xs">Aguardando Resposta</q-badge>
              </div>

              <div class="row items-center q-mt-sm">
                <q-avatar size="50px">
                  <img :src="student.avatar" />
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bolder text-dark">{{ student.name }}</div>
                  <div class="text-caption text-grey-7">{{ student.course }} • {{ student.institution }}</div>
                </div>
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-md pt-sm border-top">
              <q-btn
                outline
                rounded
                dense
                color="negative"
                label="Cancelar Pedido"
                class="full-width"
                @click="handleCancelRequest(student.id)"
              />
            </div>
          </q-card>
        </div>
      </div>

      <EmptyState
        v-else
        icon="outgoing_mail"
        title="Nenhum pedido enviado a aguardar"
        description="Explora o directório de estudantes para enviar convites de estudo."
        action-label="Descobrir Estudantes"
        action-icon="search"
        @action="$router.push({ name: 'students' })"
      />
    </div>

    <!-- Tab 4: Suggested -->
    <div v-if="activeTab === 'suggested'">
      <div v-if="store.suggestedStudentsList.length" class="row q-col-gutter-md">
        <div
          v-for="student in store.suggestedStudentsList"
          :key="student.id"
          class="col-12 col-sm-6 col-lg-4"
        >
          <q-card flat class="q-pa-md hover-lift full-height column justify-between">
            <div>
              <div class="row items-center">
                <q-avatar size="50px">
                  <img :src="student.avatar" />
                </q-avatar>
                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bolder text-dark">{{ student.name }}</div>
                  <div class="text-caption text-grey-7">{{ student.course }} • {{ student.institution }}</div>
                </div>
              </div>

              <div class="q-mt-sm">
                <div class="text-caption text-weight-bold text-primary">Ensina:</div>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="sk in (student.skillsTeach || []).slice(0, 2)"
                    :key="sk.id"
                    color="soft-lavender"
                    text-color="primary"
                    class="q-pa-xs"
                  >
                    {{ sk.name }}
                  </q-badge>
                </div>
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-md pt-sm border-top">
              <q-btn
                unelevated
                rounded
                dense
                color="primary"
                icon="person_add"
                label="Conectar"
                class="col text-weight-bold"
                @click="handleConnect(student.id)"
              />
              <q-btn
                flat
                rounded
                dense
                color="grey-8"
                label="Ver Perfil"
                :to="{ name: 'profile', query: { id: student.id } }"
              />
            </div>
          </q-card>
        </div>
      </div>

      <EmptyState
        v-else
        icon="check_circle"
        title="Estás conectado a todos os perfis disponíveis!"
        description="Excelente atividade na rede universitária."
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import EmptyState from 'src/components/common/EmptyState.vue'

const $q = useQuasar()
const store = useMeetUsStore()
const activeTab = ref('all')

function handleAccept(studentId) {
  store.acceptConnection(studentId)
  $q.notify({ type: 'positive', message: 'Conexão aceite! Já podem conversar.' })
}

function handleDecline(studentId) {
  store.declineConnection(studentId)
  $q.notify({ type: 'info', message: 'Pedido recusado.' })
}

function handleCancelRequest(studentId) {
  store.cancelConnectionRequest(studentId)
  $q.notify({ type: 'info', message: 'Pedido cancelado.' })
}

function handleRemoveConnection(studentId) {
  $q.dialog({
    title: 'Remover Conexão',
    message: 'Desejas remover este estudante da tua lista de conexões?',
    cancel: true,
    persistent: true,
    ok: { label: 'Remover', color: 'negative', flat: true }
  }).onOk(() => {
    store.removeConnection(studentId)
    $q.notify({ type: 'info', message: 'Conexão removida.' })
  })
}

function handleConnect(studentId) {
  store.sendConnectionRequest(studentId)
  $q.notify({ type: 'positive', message: 'Pedido de conexão enviado!' })
}
</script>
