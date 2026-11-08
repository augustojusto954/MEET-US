<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Gestão de Universidades</div>
        <div class="text-caption text-grey-7">Instituições de ensino superior parceiras integradas no MEET-US.</div>
      </div>
      <q-btn unelevated rounded color="primary" icon="add" label="Adicionar Universidade" @click="showAddDialog = true" />
    </div>

    <q-card flat class="overflow-hidden">
      <q-table
        :rows="store.universities"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-acronym="props">
          <q-td :props="props">
            <q-badge color="primary" class="q-px-sm q-py-xs text-weight-bolder">{{ props.row.acronym }}</q-badge>
          </q-td>
        </template>
        <template #body-cell-verified="props">
          <q-td :props="props">
            <q-badge color="positive">Parceiro Oficial ✓</q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showAddDialog">
      <q-card style="width: 450px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="bg-soft-lavender text-weight-bold">Adicionar Universidade</q-card-section>
        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="newUni.name" label="Nome da Instituição *" outlined dense />
          <q-input v-model="newUni.acronym" label="Sigla *" outlined dense />
          <q-input v-model="newUni.city" label="Cidade Sede *" outlined dense />
          <q-input v-model="newUni.campus" label="Campus Principal" outlined dense />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated rounded label="Registar" color="primary" @click="saveUni" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()
const showAddDialog = ref(false)

const newUni = ref({ name: '', acronym: '', city: 'Maputo', campus: 'Campus Principal' })

const columns = [
  { name: 'acronym', label: 'Sigla', field: 'acronym', align: 'left', sortable: true },
  { name: 'name', label: 'Nome da Universidade', field: 'name', align: 'left', sortable: true },
  { name: 'city', label: 'Cidade', field: 'city', align: 'left' },
  { name: 'campus', label: 'Campus', field: 'campus', align: 'left' },
  { name: 'studentsCount', label: 'Estudantes Registados', field: 'studentsCount', align: 'center', sortable: true },
  { name: 'verified', label: 'Estado', align: 'center' }
]

function saveUni() {
  if (!newUni.value.name || !newUni.value.acronym) {
    $q.notify({ type: 'warning', message: 'Preencha os campos obrigatórios.' })
    return
  }
  store.addUniversity({ ...newUni.value, studentsCount: 0 })
  showAddDialog.value = false
  newUni.value = { name: '', acronym: '', city: 'Maputo', campus: 'Campus Principal' }
  $q.notify({ type: 'positive', message: 'Universidade adicionada com sucesso!' })
}
</script>
