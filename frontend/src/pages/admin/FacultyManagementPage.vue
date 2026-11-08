<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Gestão de Faculdades</div>
        <div class="text-caption text-grey-7">Faculdades e unidades orgânicas das instituições conveniadas.</div>
      </div>
      <q-btn unelevated rounded color="primary" icon="add" label="Adicionar Faculdade" @click="showModal = true" />
    </div>

    <q-card flat class="overflow-hidden">
      <q-table
        :rows="store.faculties"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      />
    </q-card>

    <q-dialog v-model="showModal">
      <q-card style="width: 450px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="bg-soft-lavender text-weight-bold">Registar Faculdade</q-card-section>
        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="form.name" label="Nome da Faculdade *" outlined dense />
          <q-input v-model="form.dean" label="Diretor / Decano" outlined dense />
          <q-select
            v-model="form.universityId"
            label="Universidade *"
            :options="store.universities.map(u => ({ label: `${u.acronym} - ${u.name}`, value: u.id }))"
            emit-value
            map-options
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated rounded label="Registar" color="primary" @click="saveFaculty" />
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
const showModal = ref(false)

const form = ref({ name: '', dean: '', universityId: '1' })

const columns = [
  { name: 'name', label: 'Nome da Faculdade', field: 'name', align: 'left', sortable: true },
  { name: 'dean', label: 'Decano / Direção', field: 'dean', align: 'left' },
  { name: 'coursesCount', label: 'Cursos Cadastrados', field: 'coursesCount', align: 'center', sortable: true }
]

function saveFaculty() {
  if (!form.value.name) return
  store.faculties.push({ id: `fac-${Date.now()}`, ...form.value, coursesCount: 0 })
  store._persist('faculties')
  showModal.value = false
  form.value = { name: '', dean: '', universityId: '1' }
  $q.notify({ type: 'positive', message: 'Faculdade registada!' })
}
</script>
