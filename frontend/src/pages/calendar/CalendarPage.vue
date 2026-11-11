<template>
  <q-page padding class="q-pb-xl">
    <!-- Cabeçalho da Página -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="row items-center q-gutter-sm">
          <div class="text-h5 text-weight-bolder text-dark">Aulas em Directo & Calendário</div>
          <q-badge v-if="liveCount > 0" color="negative" rounded class="q-px-sm q-py-xs text-weight-bold pulse-badge">
            <q-icon name="fiber_manual_record" size="10px" class="q-mr-xs" />
            {{ liveCount }} AO VIVO
          </q-badge>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Assista a transmissões em directo de mentores universitários ou agende as tuas próprias aulas.
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          unelevated
          rounded
          color="primary"
          icon="add_to_queue"
          label="Agendar Nova Aula"
          class="text-weight-bold"
          @click="showCreateSessionDialog = true"
        />
      </div>
    </div>

    <!-- Navegação de Tabs: Aulas em Directo vs Gestão de Disponibilidade -->
    <q-card flat class="q-mb-md" style="border-radius: 14px; border: 1px solid #E2E8F0;">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-7"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        style="background: #F8FAFC;"
      >
        <q-tab name="sessions" icon="live_tv" label="Aulas & Sessões em Directo">
          <q-badge v-if="liveCount > 0" color="negative" floating rounded>{{ liveCount }}</q-badge>
        </q-tab>
        <q-tab name="availability" icon="tune" label="Minha Disponibilidade Semanal" />
      </q-tabs>
    </q-card>

    <!-- ABA 1: AULAS E SESSÕES EM DIRECTO -->
    <div v-if="activeTab === 'sessions'">
      <!-- Barra de Filtros Rápidos -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row q-gutter-xs">
          <q-chip
            clickable
            :selected="selectedFilter === 'all'"
            color="primary"
            :outline="selectedFilter !== 'all'"
            text-color="white"
            @click="selectedFilter = 'all'"
          >
            Todas ({{ store.sessions.length }})
          </q-chip>
          <q-chip
            clickable
            :selected="selectedFilter === 'LIVE'"
            color="negative"
            :outline="selectedFilter !== 'LIVE'"
            text-color="white"
            icon="fiber_manual_record"
            @click="selectedFilter = 'LIVE'"
          >
            Ao Vivo Agora ({{ liveCount }})
          </q-chip>
          <q-chip
            clickable
            :selected="selectedFilter === 'SCHEDULED'"
            color="primary"
            :outline="selectedFilter !== 'SCHEDULED'"
            text-color="white"
            icon="event"
            @click="selectedFilter = 'SCHEDULED'"
          >
            Agendadas ({{ scheduledCount }})
          </q-chip>
          <q-chip
            clickable
            :selected="selectedFilter === 'ENDED'"
            color="grey-7"
            :outline="selectedFilter !== 'ENDED'"
            text-color="white"
            icon="check_circle"
            @click="selectedFilter = 'ENDED'"
          >
            Terminadas ({{ endedCount }})
          </q-chip>
        </div>

        <div class="text-caption text-grey-6 gt-xs">
          <q-icon name="sync" class="rotate-anim q-mr-xs" color="positive" />
          Sincronização em tempo real ativa
        </div>
      </div>

      <!-- Grid de Cartões de Sessão -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-lg-8">
          <div v-if="filteredSessions.length === 0" class="text-center q-pa-xl bg-white rounded-borders">
            <q-icon name="live_tv" size="56px" color="grey-4" />
            <div class="text-subtitle1 text-grey-7 q-mt-sm">Nenhuma aula encontrada nesta categoria.</div>
            <q-btn flat color="primary" label="Ver todas as aulas" class="q-mt-xs" @click="selectedFilter = 'all'" />
          </div>

          <div class="column q-gutter-md">
            <q-card
              v-for="session in filteredSessions"
              :key="session.id || session._id"
              flat
              class="session-card transition-all"
              :class="{
                'session-card-live': session.status === 'LIVE',
                'session-card-scheduled': session.status === 'SCHEDULED' || session.status === 'WAITING',
                'session-card-ended': session.status === 'ENDED'
              }"
            >
              <q-card-section class="q-pa-lg">
                <!-- Cabeçalho do Cartão: Título e Badge de Estado -->
                <div class="row items-center justify-between no-wrap q-mb-sm">
                  <div class="row items-center no-wrap ellipsis">
                    <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm">
                      <q-icon :name="session.status === 'LIVE' ? 'sensors' : (session.status === 'ENDED' ? 'done_all' : 'school')" size="18px" />
                    </q-avatar>
                    <span class="text-h6 text-weight-bolder text-dark ellipsis">
                      Sessão: {{ session.title }}
                    </span>
                  </div>

                  <!-- BADGE DE ESTADO CONFORME REQUERIMENTO -->
                  <div>
                    <!-- ESTADO 1: AO VIVO -->
                    <q-badge
                      v-if="session.status === 'LIVE'"
                      color="negative"
                      class="q-px-sm q-py-xs text-weight-bold live-pill shadow-1"
                    >
                      <span class="blink-dot q-mr-xs">●</span> AO VIVO
                    </q-badge>

                    <!-- ESTADO 2: AGENDADA -->
                    <q-badge
                      v-else-if="session.status === 'SCHEDULED' || session.status === 'WAITING'"
                      color="primary"
                      outline
                      class="q-px-sm q-py-xs text-weight-bold bg-blue-1 text-primary"
                    >
                      <q-icon name="schedule" size="14px" class="q-mr-xs" />
                      AGENDADA
                    </q-badge>

                    <!-- ESTADO 3: TERMINADA -->
                    <q-badge
                      v-else-if="session.status === 'ENDED'"
                      color="grey-6"
                      class="q-px-sm q-py-xs text-weight-bold text-white"
                    >
                      <q-icon name="check" size="14px" class="q-mr-xs" />
                      TERMINADA
                    </q-badge>
                  </div>
                </div>

                <!-- Subtítulo: Mentora, Data e Hora -->
                <div class="row items-center text-caption text-grey-8 q-mb-md">
                  <q-avatar size="24px" class="q-mr-xs shadow-1">
                    <img :src="session.host_avatar || 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&fit=crop'" />
                  </q-avatar>
                  <span class="text-weight-bold text-dark q-mr-xs">Mentora:</span>
                  <span class="text-weight-medium">{{ session.host_name }}</span>
                  <span class="q-mx-xs">•</span>
                  <span>{{ formatSessionDate(session.scheduled_at) }}</span>
                  <span class="q-mx-xs">•</span>
                  <span class="text-weight-bold text-primary">{{ formatSessionTime(session.scheduled_at) }}</span>
                </div>

                <!-- Descrição Breve da Aula -->
                <p v-if="session.description" class="text-body2 text-grey-7 q-mb-md">
                  {{ session.description }}
                </p>

                <!-- CORPO DO CARTÃO DE ACORDO COM O ESTADO (A, B ou C) -->

                <!-- CENÁRIO A: SESSÃO AGENDADA -->
                <div
                  v-if="session.status === 'SCHEDULED' || session.status === 'WAITING'"
                  class="rounded-borders q-pa-md q-mb-md scheduled-banner"
                >
                  <div class="row items-center text-primary text-weight-bold text-subtitle2 q-mb-xs">
                    <q-icon name="hourglass_empty" size="20px" class="q-mr-xs" />
                    A aula ainda não começou
                  </div>
                  <div class="text-caption text-grey-8">
                    Aguarda o início da transmissão pela mentora <b>{{ session.host_name }}</b>. Os participantes serão notificados automaticamente assim que a live for aberta.
                  </div>
                </div>

                <!-- CENÁRIO B: SESSÃO AO VIVO -->
                <div
                  v-else-if="session.status === 'LIVE'"
                  class="rounded-borders q-pa-md q-mb-md live-banner"
                >
                  <div class="row items-center justify-between">
                    <div>
                      <div class="row items-center text-negative text-weight-bold text-subtitle2 q-mb-xs">
                        <q-icon name="sensors" size="20px" class="q-mr-xs" />
                        A aula já começou!
                      </div>
                      <div class="text-caption text-grey-9">
                        A mentora <b>{{ session.host_name }}</b> está a transmitir em directo agora.
                      </div>
                    </div>

                    <!-- NÚMERO DINÂMICO DE PARTICIPANTES -->
                    <div class="column items-end">
                      <div class="row items-center q-gutter-xs">
                        <q-icon name="groups" color="primary" size="20px" />
                        <span class="text-weight-bolder text-primary text-subtitle2">
                          {{ session.participantsCount || (session.participants ? session.participants.length : 0) }} participantes na sala
                        </span>
                      </div>
                      <!-- Mini Avatares dos Participantes Presentes -->
                      <div class="row items-center q-mt-xs">
                        <q-avatar
                          v-for="(p, pIdx) in (session.participants || []).slice(0, 4)"
                          :key="pIdx"
                          size="20px"
                          class="overlapping-avatar shadow-1"
                        >
                          <img :src="p.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user_name || 'U')}&background=059669&color=fff`" />
                        </q-avatar>
                        <span v-if="(session.participantsCount || 0) > 4" class="text-caption text-grey-7 q-ml-xs" style="font-size: 11px;">
                          +{{ (session.participantsCount || session.participants.length) - 4 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- CENÁRIO C: SESSÃO TERMINADA -->
                <div
                  v-else-if="session.status === 'ENDED'"
                  class="rounded-borders q-pa-md q-mb-md ended-banner"
                >
                  <div class="row items-center text-grey-8 text-weight-bold text-subtitle2 q-mb-xs">
                    <q-icon name="flag" size="18px" class="q-mr-xs" />
                    Aula encerrada pela mentora
                  </div>
                  <div class="text-caption text-grey-7">
                    Esta transmissão terminou. O resumo da aula e materiais de apoio ficam disponíveis para consulta no perfil dos participantes.
                  </div>
                </div>

                <!-- BARRA DE AÇÕES INFERIOR DO CARTÃO -->
                <div class="row items-center justify-between q-pt-xs border-top">
                  <!-- Identificação do Papel (Mentor vs Aluno) -->
                  <div class="text-caption text-grey-7">
                    <span v-if="isUserHost(session)" class="text-primary text-weight-bold">
                      <q-icon name="stars" class="q-mr-xs" />Tu és o Mentor desta sessão
                    </span>
                    <span v-else>
                      <q-icon name="person" class="q-mr-xs" />Inscrição confirmada como participante
                    </span>
                  </div>

                  <!-- BOTÕES CONFORME O ESTADO E PAPEL -->
                  <div class="row q-gutter-sm">
                    <!-- SE A AULA ESTIVER AGENDADA -->
                    <template v-if="session.status === 'SCHEDULED' || session.status === 'WAITING'">
                      <!-- Se for o mentor da aula (ou administrador) -->
                      <q-btn
                        v-if="isUserHost(session) || auth.isAdmin"
                        unelevated
                        rounded
                        color="positive"
                        icon="live_tv"
                        label="Iniciar Aula"
                        class="text-weight-bold shadow-1"
                        :loading="loadingActionId === (session.id || session._id)"
                        @click="handleStartLive(session)"
                      >
                        <q-tooltip>Ativar transmissão e abrir a sala em directo para os estudantes</q-tooltip>
                      </q-btn>

                      <!-- Se for estudante: botão de aguardo na Sala de Espera + botão rápido de iniciar como mentor para testes -->
                      <template v-else>
                        <q-btn
                          outline
                          rounded
                          color="primary"
                          icon="hourglass_top"
                          label="Aguardar Início da Aula"
                          class="text-weight-bold"
                          :to="{ name: 'live-room', params: { id: session.id || session._id } }"
                        >
                          <q-tooltip>Entrar na Sala de Espera e testar câmara e áudio antes da aula</q-tooltip>
                        </q-btn>

                        <q-btn
                          unelevated
                          rounded
                          color="positive"
                          icon="sensors"
                          label="Iniciar Aula (Mentor)"
                          class="text-weight-bold shadow-1"
                          :loading="loadingActionId === (session.id || session._id)"
                          @click="handleStartLive(session)"
                        >
                          <q-tooltip>Iniciar transmissão como mentor desta aula para testes</q-tooltip>
                        </q-btn>
                      </template>
                    </template>

                    <!-- SE A AULA ESTIVER AO VIVO -->
                    <template v-else-if="session.status === 'LIVE'">
                      <q-btn
                        unelevated
                        rounded
                        color="negative"
                        icon="videocam"
                        label="Entrar na Aula"
                        class="text-weight-bold pulse-btn shadow-2"
                        :to="{ name: 'live-room', params: { id: session.id || session._id } }"
                      />

                      <!-- Mentor também pode encerrar a partir daqui -->
                      <q-btn
                        v-if="isUserHost(session) || auth.isAdmin"
                        flat
                        rounded
                        color="grey-8"
                        icon="stop_circle"
                        label="Encerrar"
                        @click="handleEndLive(session)"
                      />
                    </template>

                    <!-- SE A AULA ESTIVER TERMINADA -->
                    <template v-else-if="session.status === 'ENDED'">
                      <q-btn
                        flat
                        rounded
                        dense
                        color="grey-7"
                        icon="history_edu"
                        label="Ver Resumo"
                        :to="{ name: 'live-room', params: { id: session.id || session._id } }"
                      />
                    </template>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Coluna Lateral: Resumo das Aulas e Acesso Rápido -->
        <div class="col-12 col-lg-4">
          <!-- Card de Ajuda / Roteiro da Mentoria -->
          <q-card flat class="q-pa-md q-mb-md" style="border-radius: 14px; border: 1px solid #E2E8F0; background: #FFFFFF;">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm row items-center">
              <q-icon name="tips_and_updates" color="amber-8" class="q-mr-xs" />
              Como Funcionam as Lives
            </div>
            <q-list dense separator class="text-caption text-grey-8">
              <q-item class="q-py-sm">
                <q-item-section avatar><q-icon name="schedule" color="primary" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">1. Sessão Agendada</q-item-label>
                  <q-item-label caption>O mentor agenda data/hora. Os estudantes aguardam.</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-py-sm">
                <q-item-section avatar><q-icon name="sensors" color="negative" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">2. Sinal AO VIVO</q-item-label>
                  <q-item-label caption>Quando o mentor inicia, todos recebem o sinal em tempo real sem recarregar a página.</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-py-sm">
                <q-item-section avatar><q-icon name="video_camera_front" color="positive" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">3. Sala Interativa</q-item-label>
                  <q-item-label caption>Vídeo, áudio, chat dinâmico e levantamento de mão.</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <!-- Card de Estatísticas Rápidas -->
          <q-card flat class="q-pa-md" style="border-radius: 14px; border: 1px solid #E2E8F0; background: #FFFFFF;">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Resumo da Tua Agenda</div>
            <div class="column q-gutter-sm">
              <div class="row items-center justify-between q-pa-sm rounded-borders" style="background: #ECFDF5;">
                <span class="text-caption text-weight-bold text-grey-8">Aulas Ao Vivo Agora:</span>
                <span class="text-weight-bolder text-negative">{{ liveCount }}</span>
              </div>
              <div class="row items-center justify-between q-pa-sm rounded-borders" style="background: #EFF6FF;">
                <span class="text-caption text-weight-bold text-grey-8">Aulas Marcadas:</span>
                <span class="text-weight-bolder text-primary">{{ scheduledCount }}</span>
              </div>
              <div class="row items-center justify-between q-pa-sm rounded-borders" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
                <span class="text-caption text-weight-bold text-grey-8">Total de Participações:</span>
                <span class="text-weight-bolder text-dark">{{ totalParticipantsJoined }} estudantes</span>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- ABA 2: MINHA DISPONIBILIDADE SEMANAL -->
    <div v-if="activeTab === 'availability'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-md" style="border-radius: 14px; border: 1px solid #E2E8F0;">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle1 text-weight-bold text-dark">Horários Livres Cadastrados</div>
                <div class="text-caption text-grey-7">Estes períodos são sugeridos automaticamente nos pedidos de troca e mentorias.</div>
              </div>
              <q-btn unelevated rounded size="sm" color="primary" label="+ Novo Horário" @click="showAddSlotDialog = true" />
            </div>

            <q-list separator>
              <q-item
                v-for="slot in meetusStore.availabilitySlots"
                :key="slot.id"
                class="rounded-borders q-my-xs q-pa-sm"
              >
                <q-item-section avatar>
                  <q-icon name="schedule" color="primary" size="28px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-subtitle2">{{ slot.day }}</q-item-label>
                  <q-item-label caption class="text-grey-8">
                    Das {{ slot.start }} às {{ slot.end }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    color="negative"
                    icon="delete"
                    @click="deleteSlot(slot.id)"
                  >
                    <q-tooltip>Remover Horário</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat class="q-pa-md" style="border-radius: 14px; border: 1px solid #E2E8F0;">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Dicas de Disponibilidade</div>
            <p class="text-caption text-grey-7">
              Estudantes com horários definidos recebem 3x mais propostas de trocas compatíveis e facilitam a abertura de salas de mentoria em direto.
            </p>
          </q-card>
        </div>
      </div>
    </div>

    <!-- MODAL AGENDAR NOVA AULA EM DIRECTO -->
    <q-dialog v-model="showCreateSessionDialog">
      <q-card style="width: 520px; max-width: 95vw; border-radius: 20px;">
        <q-card-section class="row items-center justify-between bg-primary text-white q-py-md">
          <div class="row items-center">
            <q-icon name="live_tv" size="24px" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Agendar Nova Aula em Directo</div>
          </div>
          <q-btn flat round dense icon="close" text-color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-input
            v-model="newSession.title"
            label="Tema / Título da Aula *"
            placeholder="Ex: Inglês com Lúcia, Cálculo I, Introdução a Python"
            outlined
            dense
            :rules="[val => !!val || 'O título é obrigatório']"
          />

          <q-input
            v-model="newSession.subject"
            label="Área / Cadeira de Estudo"
            placeholder="Ex: Engenharia Informática, Línguas, Matemática"
            outlined
            dense
          />

          <q-input
            v-model="newSession.description"
            label="Descrição dos tópicos abordados"
            placeholder="Ex: Prática de conversação fluente e vocabulário técnico."
            type="textarea"
            rows="3"
            outlined
            dense
          />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="newSession.date"
                label="Data da Aula"
                type="date"
                outlined
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="newSession.time"
                label="Hora de Início"
                type="time"
                outlined
                dense
              />
            </div>
          </div>

          <div class="text-caption text-grey-7">
            A aula será criada com o estado <b>AGENDADA</b>. Quando chegar a hora, basta clicar em «Iniciar Aula» para ativar a transmissão em direto.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md border-top">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Confirmar e Agendar"
            color="primary"
            class="text-weight-bold"
            :loading="isCreating"
            @click="handleCreateSession"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL ADICIONAR HORÁRIO DISPONÍVEL -->
    <q-dialog v-model="showAddSlotDialog">
      <q-card style="width: 420px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div class="text-subtitle1 text-weight-bold">Adicionar Horário Disponível</div>
          <q-btn flat round dense icon="close" text-color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md q-pt-md">
          <q-select
            v-model="newSlot.day"
            label="Dia da Semana"
            :options="['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']"
            outlined
            dense
          />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="newSlot.start" label="Hora de Início" type="time" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="newSlot.end" label="Hora de Fim" type="time" outlined dense />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated rounded label="Salvar Período" color="primary" @click="saveSlot" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useSessionsStore } from 'src/stores/sessions';
import { useAuthStore } from 'src/stores/auth';
import { useMeetUsStore } from 'src/stores/meetus';

const $q = useQuasar();
const router = useRouter();
const store = useSessionsStore();
const auth = useAuthStore();
const meetusStore = useMeetUsStore();

const activeTab = ref('sessions');
const selectedFilter = ref('all');
const showCreateSessionDialog = ref(false);
const showAddSlotDialog = ref(false);
const isCreating = ref(false);
const loadingActionId = ref(null);

const newSession = ref({
  title: '',
  subject: '',
  description: '',
  date: new Date().toISOString().substring(0, 10),
  time: '10:00'
});

const newSlot = ref({
  day: 'Segunda-feira',
  start: '14:00',
  end: '18:00'
});

onMounted(async () => {
  await store.fetchSessions();
});

// Contadores e Filtros Reativos
const liveCount = computed(() => store.liveSessions.length);
const scheduledCount = computed(() => store.scheduledSessions.length);
const endedCount = computed(() => store.endedSessions.length);

const totalParticipantsJoined = computed(() => {
  return store.sessions.reduce((acc, s) => acc + (s.participantsCount || (s.participants ? s.participants.length : 0)), 0);
});

const filteredSessions = computed(() => {
  if (selectedFilter.value === 'LIVE') return store.liveSessions;
  if (selectedFilter.value === 'SCHEDULED') return store.scheduledSessions;
  if (selectedFilter.value === 'ENDED') return store.endedSessions;
  return store.sessions;
});

function isUserHost(session) {
  const currentUserId = auth.user?.id || auth.user?._id;
  if (!currentUserId || !session) return false;
  // Também permite se o nome coincidir (para testes de demonstração da Lúcia ou Rosa)
  return String(session.host_id) === String(currentUserId) ||
    session.host_name?.toLowerCase().includes(auth.user?.name?.toLowerCase() || '---');
}

function formatSessionDate(isoString) {
  if (!isoString) return '11 de Novembro';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('pt-MZ', { day: 'numeric', month: 'long' });
  } catch {
    return '11 de Novembro';
  }
}

function formatSessionTime(isoString) {
  if (!isoString) return '10:00';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '10:00';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '10:00';
  }
}

// Iniciar a transmissão AO VIVO
async function handleStartLive(session) {
  const sId = session.id || session._id;
  loadingActionId.value = sId;
  try {
    await store.startLive(sId, auth.user?.id || session.host_id);
    $q.notify({
      type: 'positive',
      icon: 'sensors',
      message: `A aula «${session.title}» está agora AO VIVO! A entrar na sala...`
    });
    router.push({ name: 'live-room', params: { id: sId } });
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Erro ao iniciar live: ' + err.message });
  } finally {
    loadingActionId.value = null;
  }
}

// Encerrar transmissão
async function handleEndLive(session) {
  const sId = session.id || session._id;
  $q.dialog({
    title: 'Terminar Aula em Directo?',
    message: `Tens a certeza de que desejas encerrar a transmissão de «${session.title}»? A sala será fechada para todos os participantes.`,
    cancel: true,
    persistent: true,
    ok: { label: 'Sim, Terminar Aula', color: 'negative', rounded: true, unelevated: true }
  }).onOk(async () => {
    try {
      await store.endLive(sId, auth.user?.id || session.host_id);
      $q.notify({ type: 'info', icon: 'flag', message: 'Aula terminada com sucesso.' });
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Erro ao encerrar: ' + err.message });
    }
  });
}

// Agendar nova aula
async function handleCreateSession() {
  if (!newSession.value.title) {
    $q.notify({ type: 'warning', message: 'Preenche o título da aula.' });
    return;
  }

  isCreating.value = true;
  try {
    const scheduledDateTime = new Date(`${newSession.value.date}T${newSession.value.time}:00`).toISOString();
    const payload = {
      title: newSession.value.title,
      subject: newSession.value.subject,
      description: newSession.value.description,
      scheduled_at: scheduledDateTime
    };

    const created = await sessionsService.createSession(payload);
    store.sessions.unshift(created);

    $q.notify({
      type: 'positive',
      icon: 'event_available',
      message: `Aula «${created.title}» agendada com sucesso!`
    });
    showCreateSessionDialog.value = false;
    newSession.value = {
      title: '',
      subject: '',
      description: '',
      date: new Date().toISOString().substring(0, 10),
      time: '10:00'
    };
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Erro ao agendar aula: ' + err.message });
  } finally {
    isCreating.value = false;
  }
}

function saveSlot() {
  meetusStore.addAvailabilitySlot({ ...newSlot.value, active: true });
  showAddSlotDialog.value = false;
  $q.notify({ type: 'positive', message: 'Horário de disponibilidade adicionado!' });
}

function deleteSlot(id) {
  meetusStore.removeAvailabilitySlot(id);
  $q.notify({ type: 'info', message: 'Período removido.' });
}
</script>

<style scoped>
.session-card {
  border-radius: 18px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  transition: all 0.25s ease;
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

.session-card-live {
  border: 2px solid #EF4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
}

.session-card-scheduled {
  border-left: 4px solid #0B825B;
}

.session-card-ended {
  opacity: 0.85;
  background: #F8FAFC;
}

.live-banner {
  background: #FEF2F2;
  border: 1px solid #FEE2E2;
}

.scheduled-banner {
  background: #F0FDF4;
  border: 1px solid #DCFCE7;
}

.ended-banner {
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
}

.border-top {
  border-top: 1px solid #F1F5F9;
}

.live-pill {
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.blink-dot {
  animation: blinkAnim 1s infinite alternate;
}

@keyframes blinkAnim {
  0% { opacity: 1; }
  100% { opacity: 0.2; }
}

.pulse-badge {
  animation: pulseGlow 1.5s infinite;
}

.pulse-btn {
  animation: pulseBtnAnim 2s infinite;
}

@keyframes pulseGlow {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

@keyframes pulseBtnAnim {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50% { transform: scale(1.02); box-shadow: 0 0 14px rgba(239, 68, 68, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.overlapping-avatar {
  margin-left: -6px;
  border: 2px solid #FFFFFF;
}

.rotate-anim {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
