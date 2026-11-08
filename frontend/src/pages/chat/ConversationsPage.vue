<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Mensagens & Conversas</div>
        <div class="text-caption text-grey-7">Conversas em direto com os teus parceiros de mentoria.</div>
      </div>
    </div>

    <q-card flat style="height: calc(100vh - 190px); min-height: 520px; border-radius: 20px; overflow: hidden;" class="row no-wrap">
      <!-- Coluna da Esquerda: Lista de Conversas -->
      <div class="col-12 col-md-4 border-right column bg-white" style="border-right: 1px solid #E2E8F0;">
        <div class="q-pa-md border-bottom" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <q-input
            v-model="searchConv"
            placeholder="Pesquisar conversas..."
            dense
            outlined
            clearable
            bg-color="white"
          >
            <template #prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <q-scroll-area class="col">
          <q-list separator>
            <q-item
              v-for="c in filteredConversations"
              :key="c.id"
              clickable
              v-ripple
              :active="selectedConversation?.id === c.id"
              active-class="bg-emerald-50"
              class="q-py-md"
              @click="selectedConversation = c"
            >
              <q-item-section avatar>
                <q-avatar size="48px" class="relative-position">
                  <img :src="c.avatar" />
                  <q-badge
                    v-if="c.online"
                    color="positive"
                    floating
                    rounded
                    style="top: 2px; right: 2px;"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <div class="row items-center justify-between">
                  <span class="text-subtitle2 text-weight-bold text-dark">{{ c.name }}</span>
                  <span class="text-caption text-grey-6">{{ c.lastMessageAt }}</span>
                </div>
                <div class="text-caption text-grey-7 ellipsis q-mt-xs">
                  {{ c.lastMessage }}
                </div>
              </q-item-section>

              <q-item-section side v-if="c.unreadCount">
                <q-badge color="primary" rounded>{{ c.unreadCount }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Coluna Central: Janela da Conversa Ativa -->
      <div v-if="selectedConversation" class="col column bg-app">
        <!-- Topo da Conversa com Controles -->
        <div class="row items-center justify-between q-pa-md bg-white border-bottom" style="border-bottom: 1px solid #E2E8F0;">
          <div class="row items-center">
            <q-avatar size="40px" class="q-mr-sm">
              <img :src="selectedConversation.avatar" />
            </q-avatar>
            <div>
              <div class="text-subtitle2 text-weight-bold text-dark">{{ selectedConversation.name }}</div>
              <div class="text-caption text-positive row items-center">
                <q-badge color="positive" rounded class="q-mr-xs" />
                {{ selectedConversation.online ? 'Online' : 'Offline' }}
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-xs">
            <!-- Botão Iniciar Chamada -->
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="videocam"
              :to="{ name: 'calls', query: { partner: selectedConversation.name } }"
            >
              <q-tooltip>Chamada de Estudo MEET-US</q-tooltip>
            </q-btn>

            <!-- Toggle Painel Lateral de Informações -->
            <q-btn
              flat
              round
              dense
              color="grey-7"
              icon="info"
              @click="showInfoDrawer = !showInfoDrawer"
            >
              <q-tooltip>Detalhes do Contacto & Troca</q-tooltip>
            </q-btn>

            <!-- Menu Opções (Silenciar, Bloquear, Denunciar) -->
            <q-btn flat round dense icon="more_vert" color="grey-7">
              <q-menu>
                <q-list dense style="min-width: 160px">
                  <q-item clickable v-close-popup @click="notify('Notificações da conversa silenciadas.')">
                    <q-item-section avatar><q-icon name="notifications_off" color="grey-7" /></q-item-section>
                    <q-item-section>Silenciar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="notify('Utilizador bloqueado.')" class="text-negative">
                    <q-item-section avatar><q-icon name="block" color="negative" /></q-item-section>
                    <q-item-section>Bloquear</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="notify('Denúncia enviada.')" class="text-negative">
                    <q-item-section avatar><q-icon name="flag" color="negative" /></q-item-section>
                    <q-item-section>Denunciar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <!-- Banner de Troca Relacionada (se houver) -->
        <div v-if="selectedConversation.exchangeRelated" class="bg-emerald-50 q-px-md q-py-xs row items-center justify-between border-bottom" style="border-bottom: 1px solid #E2E8F0;">
          <div class="row items-center text-caption text-dark">
            <q-icon name="swap_horiz" color="primary" class="q-mr-xs" />
            <span>Troca Ativa: <b>{{ selectedConversation.exchangeRelated.title }}</b> ({{ selectedConversation.exchangeRelated.date }})</span>
          </div>
          <q-btn flat dense rounded size="sm" color="primary" label="Ver Troca" :to="{ name: 'exchanges' }" />
        </div>

        <!-- Mensagens em Scroll -->
        <q-scroll-area class="col q-pa-md">
          <div class="column q-gutter-sm">
            <div
              v-for="msg in selectedConversation.messages"
              :key="msg.id"
              class="row"
              :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="q-pa-md shadow-1"
                :class="msg.sender === 'me' ? 'bg-primary text-white' : 'bg-white text-dark'"
                style="max-width: 65%; border-radius: 12px; border: 1px solid #E2E8F0;"
              >
                <div class="text-body2">{{ msg.text }}</div>
                <div
                  class="text-caption text-right q-mt-xs"
                  :class="msg.sender === 'me' ? 'text-emerald-100' : 'text-grey-6'"
                  style="font-size: 10px;"
                >
                  {{ msg.time }}
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>

        <!-- Input de Envio de Mensagem -->
        <div class="q-pa-md bg-white" style="border-top: 1px solid #E2E8F0;">
          <div class="row items-center q-gutter-sm">
            <q-btn flat round dense icon="attach_file" color="grey-7" @click="notify('Anexo adicionado.')" />
            <q-input
              v-model="inputMessage"
              placeholder="Escreve a tua mensagem..."
              dense
              outlined
              class="col"
              @keyup.enter="handleSend"
            />
            <q-btn
              round
              unelevated
              color="primary"
              icon="send"
              :disable="!inputMessage.trim()"
              @click="handleSend"
            />
          </div>
        </div>
      </div>

      <!-- Coluna da Direita: Drawer de Informações do Contacto -->
      <div
        v-if="showInfoDrawer && selectedConversation"
        class="col-12 col-md-3 border-left bg-white q-pa-md"
        style="border-left: 1px solid #E2E8F0;"
      >
        <div class="text-center q-mb-md">
          <q-avatar size="72px" class="shadow-2 q-mb-sm">
            <img :src="selectedConversation.avatar" />
          </q-avatar>
          <div class="text-h6 text-weight-bolder text-dark">{{ selectedConversation.name }}</div>
          <div class="text-caption text-grey-7">{{ selectedConversation.course }}</div>
          <div class="text-caption text-grey-6">{{ selectedConversation.institution }}</div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-caption text-weight-bold text-primary q-mb-xs">ANEXOS & FICHEIROS</div>
        <div class="column q-gutter-xs">
          <div class="row items-center text-caption text-grey-8 bg-soft-lavender q-pa-xs rounded-borders">
            <q-icon name="picture_as_pdf" color="negative" class="q-mr-xs" />
            <span class="ellipsis">resumo-design-systems.pdf</span>
          </div>
          <div class="row items-center text-caption text-grey-8 bg-soft-lavender q-pa-xs rounded-borders">
            <q-icon name="link" color="primary" class="q-mr-xs" />
            <span class="ellipsis">figma.com/file/meetus-project</span>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <q-btn
          outline
          rounded
          dense
          color="primary"
          label="Ver Perfil Completo"
          class="full-width"
          :to="{ name: 'profile', query: { id: selectedConversation.participantId } }"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const route = useRoute()
const $q = useQuasar()
const store = useMeetUsStore()

const searchConv = ref('')
const inputMessage = ref('')
const showInfoDrawer = ref(false)

const selectedConversation = ref(store.conversations[0])

const filteredConversations = computed(() => {
  if (!searchConv.value.trim()) return store.conversations
  const q = searchConv.value.toLowerCase()
  return store.conversations.filter(c => c.name.toLowerCase().includes(q))
})

function handleSend() {
  if (!inputMessage.value.trim() || !selectedConversation.value) return
  store.sendMessage(selectedConversation.value.id, inputMessage.value)
  inputMessage.value = ''
}

function notify(msg) {
  $q.notify({ type: 'info', message: msg })
}
</script>

<style scoped>
.border-right {
  border-right: 1px solid #EAE8FF;
}
.border-bottom {
  border-bottom: 1px solid #EAE8FF;
}
.border-top {
  border-top: 1px solid #EAE8FF;
}
.border-left {
  border-left: 1px solid #EAE8FF;
}
</style>
