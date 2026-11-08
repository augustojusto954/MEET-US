<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm" @click="$router.back()" />
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Propor Nova Troca de Conhecimento</div>
        <div class="text-caption text-grey-7">
          Processo orientado em 6 etapas para combinar a melhor sessão de estudo.
        </div>
      </div>
    </div>

    <q-card flat class="q-pa-md shadow-2" style="max-width: 800px; margin: 0 auto; border-radius: 20px;">
      <!-- Q-Stepper de 6 Etapas -->
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        header-nav
        class="bg-transparent"
      >
        <!-- ETAPA 1: Seleccionar Estudante -->
        <q-step
          :name="1"
          title="Estudante"
          icon="person"
          :done="step > 1"
        >
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Etapa 1: Seleciona o Parceiro de Estudo</div>
          <div class="text-caption text-grey-7 q-mb-md">Escolhe com quem queres realizar a sessão de aprendizagem mútua:</div>

          <div class="row q-col-gutter-sm">
            <div
              v-for="s in availablePartners"
              :key="s.id"
              class="col-12 col-sm-6"
            >
              <q-card
                flat
                bordered
                class="q-pa-sm cursor-pointer hover-lift"
                :class="{ 'bg-soft-lavender border-primary': selectedPartner?.id === s.id }"
                @click="selectedPartner = s"
              >
                <div class="row items-center">
                  <q-avatar size="44px">
                    <img :src="s.avatar" />
                  </q-avatar>
                  <div class="q-ml-sm col">
                    <div class="text-weight-bold text-dark ellipsis">{{ s.name }}</div>
                    <div class="text-caption text-grey-7 ellipsis">{{ s.course }} • {{ s.institution }}</div>
                  </div>
                  <q-icon
                    :name="selectedPartner?.id === s.id ? 'check_circle' : 'radio_button_unchecked'"
                    :color="selectedPartner?.id === s.id ? 'primary' : 'grey-5'"
                    size="22px"
                  />
                </div>
              </q-card>
            </div>
          </div>

          <q-stepper-navigation class="q-mt-lg row justify-end">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Continuar: Escolher Competência"
              :disable="!selectedPartner"
              @click="step = 2"
            />
          </q-stepper-navigation>
        </q-step>

        <!-- ETAPA 2: Escolher Competência -->
        <q-step
          :name="2"
          title="Competências"
          icon="auto_stories"
          :done="step > 2"
        >
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Etapa 2: Escolher as Competências Trocadas</div>
          <div class="text-caption text-grey-7 q-mb-md">
            O que queres aprender com {{ selectedPartner?.name }} e o que vais ensinar em troca:
          </div>

          <!-- O que queres aprender -->
          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-primary block q-mb-xs">
              O QUE QUERES APRENDER (Ensinado por {{ selectedPartner?.name }}):
            </label>
            <q-select
              v-model="skillToLearn"
              dense
              outlined
              :options="partnerTeachSkillOptions"
              label="Seleciona a competência que procuras"
              bg-color="white"
            />
          </div>

          <!-- O que vais ensinar -->
          <div>
            <label class="text-caption text-weight-bold text-secondary block q-mb-xs">
              O QUE VAIS ENSINAR EM RETRIBUIÇÃO (Das tuas competências):
            </label>
            <q-select
              v-model="skillToTeach"
              dense
              outlined
              :options="myTeachSkillOptions"
              label="Seleciona o que dominas para ensinar"
              bg-color="white"
            />
          </div>

          <q-stepper-navigation class="q-mt-lg row justify-between">
            <q-btn flat rounded color="grey-7" label="Voltar" @click="step = 1" />
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Continuar: Definir Objetivo"
              :disable="!skillToLearn || !skillToTeach"
              @click="step = 3"
            />
          </q-stepper-navigation>
        </q-step>

        <!-- ETAPA 3: Definir Objetivo da Troca -->
        <q-step
          :name="3"
          title="Objetivo"
          icon="flag"
          :done="step > 3"
        >
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Etapa 3: Objetivo da Sessão</div>
          <div class="text-caption text-grey-7 q-mb-md">
            Explica brevemente o que pretendem alcançar juntos (ex: preparar para exame, rever um trabalho, criar um protótipo):
          </div>

          <q-input
            v-model="exchangeGoal"
            label="Objetivo / Meta de Aprendizagem *"
            type="textarea"
            rows="3"
            outlined
            dense
            placeholder="Ex: Praticar conceitos de componentes reativos e rever boas práticas de prototipagem no Figma para o projeto da faculdade."
          />

          <q-stepper-navigation class="q-mt-lg row justify-between">
            <q-btn flat rounded color="grey-7" label="Voltar" @click="step = 2" />
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Continuar: Modalidade"
              :disable="!exchangeGoal.trim()"
              @click="step = 4"
            />
          </q-stepper-navigation>
        </q-step>

        <!-- ETAPA 4: Seleccionar Modalidade -->
        <q-step
          :name="4"
          title="Modalidade"
          icon="videocam"
          :done="step > 4"
        >
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Etapa 4: Como será realizada a sessão?</div>
          <div class="text-caption text-grey-7 q-mb-md">Escolhe o formato de encontro mais conveniente:</div>

          <div class="column q-gutter-sm">
            <q-card
              v-for="mod in modalities"
              :key="mod.value"
              flat
              bordered
              class="q-pa-md cursor-pointer hover-lift"
              :class="{ 'bg-soft-lavender border-primary': selectedModality === mod.value }"
              @click="selectedModality = mod.value"
            >
              <div class="row items-center">
                <q-avatar size="40px" class="bg-primary text-white q-mr-md">
                  <q-icon :name="mod.icon" />
                </q-avatar>
                <div class="col">
                  <div class="text-subtitle2 text-weight-bold">{{ mod.title }}</div>
                  <div class="text-caption text-grey-7">{{ mod.desc }}</div>
                </div>
                <q-icon
                  :name="selectedModality === mod.value ? 'check_circle' : 'radio_button_unchecked'"
                  :color="selectedModality === mod.value ? 'primary' : 'grey-5'"
                  size="24px"
                />
              </div>
            </q-card>
          </div>

          <q-stepper-navigation class="q-mt-lg row justify-between">
            <q-btn flat rounded color="grey-7" label="Voltar" @click="step = 3" />
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Continuar: Data & Horário"
              @click="step = 5"
            />
          </q-stepper-navigation>
        </q-step>

        <!-- ETAPA 5: Escolher Data e Horário -->
        <q-step
          :name="5"
          title="Horário"
          icon="event"
          :done="step > 5"
        >
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Etapa 5: Data e Horário Propostos</div>
          <div class="text-caption text-grey-7 q-mb-md">Sugere quando gostarias de realizar a sessão:</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="scheduledDate"
                label="Data da Sessão *"
                type="date"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="scheduledTime"
                label="Horário Proposto *"
                :options="timeOptions"
                outlined
                dense
              />
            </div>
          </div>

          <div class="q-mt-md">
            <label class="text-caption text-weight-bold text-grey-7 block q-mb-xs">
              Duração Estimada:
            </label>
            <q-btn-toggle
              v-model="duration"
              spread
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="soft-lavender"
              text-color="dark"
              :options="[
                { label: '45 minutos', value: '45 minutos' },
                { label: '60 minutos', value: '60 minutos' },
                { label: '90 minutos', value: '90 minutos' },
                { label: '2 horas', value: '2 horas' }
              ]"
            />
          </div>

          <q-stepper-navigation class="q-mt-lg row justify-between">
            <q-btn flat rounded color="grey-7" label="Voltar" @click="step = 4" />
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Continuar: Revisão Final"
              :disable="!scheduledDate || !scheduledTime"
              @click="step = 6"
            />
          </q-stepper-navigation>
        </q-step>

        <!-- ETAPA 6: Rever e Confirmar -->
        <q-step
          :name="6"
          title="Confirmar"
          icon="check_circle"
        >
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Etapa 6: Rever Resumo e Enviar Proposta</div>
          <div class="text-caption text-grey-7 q-mb-md">
            Verifica todos os detalhes antes de notificar o teu parceiro de estudo:
          </div>

          <q-card flat bordered class="q-pa-md bg-soft-lavender rounded-borders q-mb-md">
            <!-- Participantes -->
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center">
                <q-avatar size="44px">
                  <img :src="store.currentUser.avatar" />
                </q-avatar>
                <div class="q-ml-sm">
                  <div class="text-weight-bold">{{ store.currentUser.name }}</div>
                  <div class="text-caption text-grey-7">Proponente</div>
                </div>
              </div>

              <q-icon name="sync_alt" color="primary" size="28px" />

              <div class="row items-center text-right">
                <div class="q-mr-sm">
                  <div class="text-weight-bold">{{ selectedPartner?.name }}</div>
                  <div class="text-caption text-grey-7">{{ selectedPartner?.institution }}</div>
                </div>
                <q-avatar size="44px">
                  <img :src="selectedPartner?.avatar" />
                </q-avatar>
              </div>
            </div>

            <q-separator class="q-my-sm" />

            <!-- Dados da Troca -->
            <div class="q-gutter-xs text-body2">
              <div><b>Competência que vais aprender:</b> <q-badge color="primary">{{ skillToLearn }}</q-badge></div>
              <div><b>Competência que vais ensinar:</b> <q-badge color="secondary">{{ skillToTeach }}</q-badge></div>
              <div><b>Objetivo:</b> {{ exchangeGoal }}</div>
              <div><b>Modalidade:</b> {{ selectedModality }}</div>
              <div><b>Data e Hora:</b> {{ scheduledDate }} às {{ scheduledTime }} ({{ duration }})</div>
            </div>
          </q-card>

          <q-stepper-navigation class="q-mt-lg row justify-between">
            <q-btn flat rounded color="grey-7" label="Voltar" @click="step = 5" />
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Confirmar e Enviar Pedido"
              icon-right="send"
              class="text-weight-bold"
              @click="submitExchange"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()

const step = ref(1)

const selectedPartner = ref(null)
const skillToLearn = ref('')
const skillToTeach = ref('')
const exchangeGoal = ref('')
const selectedModality = ref('Online (Sala de Estudo MEET-US)')
const scheduledDate = ref('2026-11-10')
const scheduledTime = ref('16:00 - 17:30')
const duration = ref('90 minutos')

const modalities = [
  { value: 'Online (Sala de Estudo MEET-US)', title: 'Online na Plataforma', desc: 'Sessão com áudio, vídeo e quadro interativo MEET-US', icon: 'videocam' },
  { value: 'Presencial no Campus', title: 'Presencial no Campus Universitário', desc: 'Encontro na biblioteca ou salas de estudo da universidade', icon: 'location_on' },
  { value: 'Híbrido', title: 'Formato Híbrido', desc: 'Início online com acompanhamento prático presencial', icon: 'devices' }
]

const timeOptions = [
  '09:00 - 10:30',
  '10:30 - 12:00',
  '14:00 - 15:30',
  '16:00 - 17:30',
  '18:00 - 19:30'
]

const availablePartners = computed(() => {
  return store.students.filter(s => s.id !== store.currentUser.id)
})

const partnerTeachSkillOptions = computed(() => {
  if (!selectedPartner.value?.skillsTeach) return ['Conhecimentos Gerais']
  return selectedPartner.value.skillsTeach.map(s => `${s.name} (${s.level})`)
})

const myTeachSkillOptions = computed(() => {
  if (!store.currentUser?.skillsTeach) return ['Conhecimentos Gerais']
  return store.currentUser.skillsTeach.map(s => `${s.name} (${s.level})`)
})

onMounted(() => {
  if (route.query.partnerId) {
    const p = store.students.find(s => s.id === route.query.partnerId)
    if (p) {
      selectedPartner.value = p
      step.value = 2
    }
  }
})

function submitExchange() {
  const newExchange = store.createExchangeRequest({
    partnerId: selectedPartner.value.id,
    partnerName: selectedPartner.value.name,
    partnerAvatar: selectedPartner.value.avatar,
    partnerUniversity: selectedPartner.value.institution,
    partnerCourse: selectedPartner.value.course,
    skillGiven: skillToTeach.value,
    skillReceived: skillToLearn.value,
    goal: exchangeGoal.value,
    mode: selectedModality.value,
    scheduledDate: scheduledDate.value,
    scheduledTime: scheduledTime.value,
    duration: duration.value
  })

  $q.notify({
    type: 'positive',
    message: 'Proposta de troca enviada com sucesso! O teu parceiro foi notificado.',
    position: 'top-right'
  })

  router.push({ name: 'exchange-details', params: { id: newExchange.id } })
}
</script>
