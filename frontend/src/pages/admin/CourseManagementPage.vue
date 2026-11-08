<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Gestão de Cursos</div>
        <div class="text-caption text-grey-7">Catálogo oficial de cursos de graduação e pós-graduação.</div>
      </div>
      <q-btn unelevated rounded color="primary" icon="add" label="Adicionar Curso" @click="showModal = true" />
    </div>

    <q-card flat class="overflow-hidden">
      <q-table
        :rows="store.courses"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      />
    </q-card>

    <q-dialog v-model="showModal">
      <q-card style="width: 450px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="bg-soft-lavender text-weight-bold">Registar Novo Curso</q-card-section>
        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="form.name" label="Nome do Curso *" outlined dense />
          <q-select
            v-model="form.degree"
            label="Grau Académico"
            :options="['Licenciatura', 'Mestrado', 'Doutoramento']"
            outlined
            dense
          />
          <q-input v-model.number="form.durationYears" label="Duração (Anos)" type="number" outlined dense />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated rounded label="Registar" color="primary" @click="saveCourse" />
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

const form = ref({ name: '', degree: 'Licenciatura', durationYears: 4, facultyId: '1', universityId: '1' })

const columns = [
  { name: 'name', label: 'Nome do Curso', field: 'name', align: 'left', sortable: true },
  { name: 'degree', label: 'Grau', field: 'degree', align: 'center', sortable: true },
  { name: 'durationYears', label: 'Duração', field: (row) => `${row.durationYears} anos`, align: 'center' }
]

function saveCourse() {
  if (!form.value.name) return
  store.addCourse({ ...form.value })
  showModal.value = false
  form.value = { name: '', degree: 'Licenciatura', durationYears: 4, facultyId: '1', universityId: '1' }
  $q.notify({ type: 'positive', message: 'Curso adicionado!' })
}
</script>
