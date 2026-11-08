<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Moderação de Avaliações</div>
        <div class="text-caption text-grey-7">Auditoria das notas e comentários trocados entre estudantes.</div>
      </div>
    </div>

    <q-card flat class="overflow-hidden">
      <q-table
        :rows="store.reviews"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-rating="props">
          <q-td :props="props">
            <q-rating :model-value="props.row.rating" size="16px" color="amber-9" readonly />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round dense size="sm" color="negative" icon="delete" @click="$q.notify({ type: 'info', message: 'Avaliação removida.' })" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

const columns = [
  { name: 'reviewerName', label: 'Avaliador', field: 'reviewerName', align: 'left', sortable: true },
  { name: 'exchangeTopic', label: 'Tópico da Troca', field: 'exchangeTopic', align: 'left' },
  { name: 'rating', label: 'Classificação', field: 'rating', align: 'center', sortable: true },
  { name: 'comment', label: 'Comentário', field: 'comment', align: 'left' },
  { name: 'date', label: 'Data', field: 'date', align: 'center' },
  { name: 'actions', label: 'Moderação', align: 'right' }
]
</script>
