<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Gestão de Competências</div>
        <div class="text-caption text-grey-7">
          Define o que dominas para ensinar e o que desejas aprender com a comunidade.
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add"
        label="Adicionar Competência"
        @click="openAddDialog"
      />
    </div>

    <!-- Tabs: Skills I Teach vs Skills I Want to Learn -->
    <q-card flat class="q-mb-lg">
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
        <q-tab name="teach" icon="school" label="Competências que Ensino">
          <q-badge color="primary" class="q-ml-xs">{{ store.currentUser.skillsTeach?.length || 0 }}</q-badge>
        </q-tab>
        <q-tab name="learn" icon="menu_book" label="O que Quero Aprender">
          <q-badge style="background: #047857; color: white;" class="q-ml-xs">{{ store.currentUser.skillsLearn?.length || 0 }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />

      <!-- Barra de Pesquisa dentro das Skills -->
      <div class="q-pa-md">
        <q-input
          v-model="skillFilter"
          dense
          outlined
          placeholder="Filtrar competências cadastradas..."
          clearable
          bg-color="white"
          style="max-width: 380px;"
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </q-card>

    <!-- Conteúdo da Tab: Ensino -->
    <div v-if="activeTab === 'teach'">
      <div v-if="filteredTeachSkills.length" class="row q-col-gutter-md">
        <div
          v-for="s in filteredTeachSkills"
          :key="s.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <q-card flat class="q-pa-md hover-lift full-height column justify-between">
            <div>
              <div class="row items-center justify-between">
                <q-badge style="background: #ECFDF5; color: #059669;" class="q-pa-xs text-weight-bold">
                  {{ s.category }}
                </q-badge>
                <q-badge color="primary" text-color="white" class="q-pa-xs">
                  {{ s.level }}
                </q-badge>
              </div>

              <div class="text-h6 text-weight-bolder text-dark q-mt-sm">{{ s.name }}</div>
              <div class="text-caption text-grey-7 q-mb-xs">Experiência: <b>{{ s.experience || '2 anos' }}</b></div>
              <p class="text-caption text-grey-8 q-mt-xs">{{ s.description }}</p>
            </div>

            <div class="row justify-end q-gutter-xs q-mt-md pt-sm border-top">
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="confirmDeleteSkill('teach', s.id)"
              >
                <q-tooltip>Remover Competência</q-tooltip>
              </q-btn>
            </div>
          </q-card>
        </div>
      </div>

      <EmptyState
        v-else
        icon="school"
        title="Nenhuma competência cadastrada para ensinar"
        description="Adiciona as tuas habilidades, linguagens ou matérias favoritas para que outros estudantes possam aprender contigo."
        action-label="Adicionar Primeira Competência"
        action-icon="add"
        @action="openAddDialog"
      />
    </div>

    <!-- Conteúdo da Tab: Quero Aprender -->
    <div v-if="activeTab === 'learn'">
      <div v-if="filteredLearnSkills.length" class="row q-col-gutter-md">
        <div
          v-for="s in filteredLearnSkills"
          :key="s.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <q-card flat class="q-pa-md hover-lift full-height column justify-between">
            <div>
              <div class="row items-center justify-between">
                <q-badge style="background: #ECFDF5; color: #059669;" class="q-pa-xs text-weight-bold">
                  {{ s.category }}
                </q-badge>
                <q-badge color="amber-2" text-color="amber-10" class="q-pa-xs text-weight-bold">
                  Prioridade: {{ s.priority || 'Alta' }}
                </q-badge>
              </div>

              <div class="text-h6 text-weight-bolder text-dark q-mt-sm">{{ s.name }}</div>
              <div class="text-caption text-grey-7 q-mb-xs">Nível Desejado: <b>{{ s.level || 'Intermédio' }}</b></div>
              <p class="text-caption text-grey-8 q-mt-xs"><b>Objetivo:</b> {{ s.goal || 'Praticar com colegas universitários' }}</p>
            </div>

            <div class="row justify-end q-gutter-xs q-mt-md pt-sm border-top">
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="confirmDeleteSkill('learn', s.id)"
              >
                <q-tooltip>Remover</q-tooltip>
              </q-btn>
            </div>
          </q-card>
        </div>
      </div>

      <EmptyState
        v-else
        icon="menu_book"
        title="Nenhuma competência na lista de aprendizagem"
        description="Diz-nos o que queres aprender para o nosso algoritmo encontrar os melhores mentores compatíveis."
        action-label="Adicionar Interesse de Aprendizagem"
        action-icon="add"
        @action="openAddDialog"
      />
    </div>

    <!-- Modal Adicionar / Editar Competência -->
    <q-dialog v-model="showAddDialog">
      <q-card style="width: 500px; max-width: 95vw; border-radius: 18px;">
        <q-card-section class="row items-center justify-between" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <div class="text-h6 text-weight-bold text-dark">
            {{ formType === 'teach' ? 'Nova Competência para Ensinar' : 'Nova Competência para Aprender' }}
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-btn-toggle
            v-model="formType"
            spread
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="grey-2"
            text-color="dark"
            :options="[
              { label: 'Eu Domino (Vou Ensinar)', value: 'teach' },
              { label: 'Quero Aprender', value: 'learn' }
            ]"
          />

          <q-input
            v-model="form.name"
            label="Nome da Competência *"
            placeholder="Ex: UI/UX no Figma, Python, Cálculo I, Violão..."
            outlined
            dense
            :rules="[v => !!v || 'Campo obrigatório']"
          />

          <q-select
            v-model="form.category"
            label="Categoria *"
            :options="categoryOptions"
            outlined
            dense
            :rules="[v => !!v || 'Selecione uma categoria']"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select
                v-model="form.level"
                label="Nível *"
                :options="['Iniciante', 'Intermédio', 'Avançado', 'Especialista']"
                outlined
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                v-if="formType === 'teach'"
                v-model="form.experience"
                label="Tempo de Experiência"
                placeholder="Ex: 2 anos"
                outlined
                dense
              />
              <q-select
                v-else
                v-model="form.priority"
                label="Prioridade"
                :options="['Alta', 'Média', 'Baixa']"
                outlined
                dense
              />
            </div>
          </div>

          <q-input
            v-if="formType === 'teach'"
            v-model="form.description"
            label="Descrição / O que abordas nas sessões"
            type="textarea"
            rows="3"
            outlined
            dense
            placeholder="Ex: Ensino desde a criação de variáveis até a estrutura de componentes..."
          />
          <q-input
            v-else
            v-model="form.goal"
            label="Objetivo de Aprendizagem"
            type="textarea"
            rows="3"
            outlined
            dense
            placeholder="Ex: Pretendo preparar-me para o exame e criar projetos práticos..."
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Salvar Competência"
            color="primary"
            class="text-weight-bold"
            @click="saveSkill"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import EmptyState from 'src/components/common/EmptyState.vue'

const $q = useQuasar()
const store = useMeetUsStore()

const activeTab = ref('teach')
const skillFilter = ref('')
const showAddDialog = ref(false)

const formType = ref('teach')
const form = ref({
  name: '',
  category: 'Programação & Tech',
  level: 'Intermédio',
  experience: '1 ano',
  priority: 'Alta',
  description: '',
  goal: ''
})

const categoryOptions = [
  'Programação & Tech',
  'Design & Multimédia',
  'Negócios & Gestão',
  'Línguas & Comunicação',
  'Ciências & Matemática',
  'Música & Artes'
]

function openAddDialog() {
  formType.value = activeTab.value
  form.value = {
    name: '',
    category: 'Programação & Tech',
    level: 'Intermédio',
    experience: '1 ano',
    priority: 'Alta',
    description: '',
    goal: ''
  }
  showAddDialog.value = true
}

function saveSkill() {
  if (!form.value.name) {
    $q.notify({ type: 'warning', message: 'Indique o nome da competência.' })
    return
  }

  if (formType.value === 'teach') {
    store.addSkillTeach({
      name: form.value.name,
      category: form.value.category,
      level: form.value.level,
      experience: form.value.experience,
      description: form.value.description
    })
  } else {
    store.addSkillLearn({
      name: form.value.name,
      category: form.value.category,
      level: form.value.level,
      priority: form.value.priority,
      goal: form.value.goal
    })
  }

  showAddDialog.value = false
  $q.notify({ type: 'positive', message: 'Competência adicionada com sucesso!' })
}

function confirmDeleteSkill(type, id) {
  $q.dialog({
    title: 'Remover Competência',
    message: 'Tens a certeza de que desejas remover esta competência do teu perfil?',
    cancel: true,
    persistent: true,
    ok: { label: 'Remover', color: 'negative', flat: true }
  }).onOk(() => {
    if (type === 'teach') {
      store.removeSkillTeach(id)
    } else {
      store.removeSkillLearn(id)
    }
    $q.notify({ type: 'info', message: 'Competência removida.' })
  })
}

const filteredTeachSkills = computed(() => {
  const list = store.currentUser.skillsTeach || []
  if (!skillFilter.value.trim()) return list
  const q = skillFilter.value.toLowerCase()
  return list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
})

const filteredLearnSkills = computed(() => {
  const list = store.currentUser.skillsLearn || []
  if (!skillFilter.value.trim()) return list
  const q = skillFilter.value.toLowerCase()
  return list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
})
</script>
