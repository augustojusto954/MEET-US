<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Gestão de Estudantes</div>
        <div class="text-caption text-grey-7">Controlo de contas, verificação de identidade e moderação de perfis.</div>
      </div>
    </div>

    <q-card flat class="q-pa-md q-mb-md">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-input
            v-model="search"
            placeholder="Pesquisar por nome ou e-mail..."
            dense
            outlined
            clearable
            bg-color="soft-lavender"
          >
            <template #prepend><q-icon name="search" color="primary" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-select
            v-model="institutionFilter"
            label="Filtrar por Universidade"
            :options="['Todas', 'Universidade Eduardo Mondlane', 'Universidade Pedagógica', 'ISCTEM', 'Universidade Save']"
            dense
            outlined
            bg-color="soft-lavender"
          />
        </div>
      </div>
    </q-card>

    <q-card flat class="overflow-hidden">
      <q-table
        :rows="filteredStudents"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-student="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar size="36px" class="q-mr-sm shadow-1">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div>
                <div class="text-weight-bold text-dark">{{ props.row.name }}</div>
                <div class="text-caption text-grey-7">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-academic="props">
          <q-td :props="props">
            <div class="text-weight-medium text-dark">{{ props.row.course }}</div>
            <div class="text-caption text-grey-6">{{ props.row.institution }}</div>
          </q-td>
        </template>

        <template #body-cell-verified="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.verified ? 'positive' : 'grey-5'"
              class="cursor-pointer q-pa-xs"
              @click="toggleVerify(props.row.id)"
            >
              {{ props.row.verified ? 'Verificado ✓' : 'Não Verificado' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.suspended ? 'negative' : 'positive'">
              {{ props.row.suspended ? 'Suspenso' : 'Ativo' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <div class="row q-gutter-xs justify-end">
              <q-btn
                flat
                round
                dense
                size="sm"
                :color="props.row.verified ? 'grey-7' : 'primary'"
                :icon="props.row.verified ? 'verified' : 'check_circle'"
                @click="toggleVerify(props.row.id)"
              >
                <q-tooltip>{{ props.row.verified ? 'Remover Verificação' : 'Conceder Selo de Verificado' }}</q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="sm"
                :color="props.row.suspended ? 'positive' : 'negative'"
                :icon="props.row.suspended ? 'lock_open' : 'block'"
                @click="toggleSuspend(props.row.id)"
              >
                <q-tooltip>{{ props.row.suspended ? 'Reativar Estudante' : 'Suspender Conta' }}</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

const search = ref('')
const institutionFilter = ref('Todas')

const columns = [
  { name: 'student', label: 'Estudante', field: 'name', align: 'left', sortable: true },
  { name: 'academic', label: 'Curso & Instituição', field: 'course', align: 'left' },
  { name: 'reputation', label: 'Reputação', field: 'reputation', align: 'center', sortable: true },
  { name: 'verified', label: 'Selo Oficial', field: 'verified', align: 'center' },
  { name: 'status', label: 'Estado', field: 'suspended', align: 'center' },
  { name: 'actions', label: 'Ações de Moderação', align: 'right' }
]

const filteredStudents = computed(() => {
  let list = store.students
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q))
  }
  if (institutionFilter.value !== 'Todas') {
    list = list.filter(s => s.institution === institutionFilter.value)
  }
  return list
})

function toggleVerify(id) {
  store.verifyStudent(id)
  $q.notify({ type: 'positive', message: 'Estado de verificação atualizado com sucesso!' })
}

function toggleSuspend(id) {
  store.toggleSuspendStudent(id)
  $q.notify({ type: 'warning', message: 'Estado de suspensão de conta atualizado!' })
}
</script>
