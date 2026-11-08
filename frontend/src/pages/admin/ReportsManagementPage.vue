<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Gestão de Denúncias</div>
        <div class="text-caption text-grey-7">Fila de queixas e infrações reportadas pelos estudantes da plataforma.</div>
      </div>
    </div>

    <div class="column q-gutter-md">
      <q-card
        v-for="rep in store.reports"
        :key="rep.id"
        flat
        class="q-pa-lg hover-lift"
        style="border-left: 5px solid #EF4444;"
      >
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center">
            <q-badge color="negative" class="q-px-sm q-py-xs text-weight-bolder q-mr-sm">
              Prioridade {{ rep.priority }}
            </q-badge>
            <span class="text-subtitle1 text-weight-bolder text-dark">{{ rep.reason }}</span>
          </div>
          <span class="text-caption text-grey-6">{{ rep.date }}</span>
        </div>

        <div class="bg-soft-lavender q-pa-sm rounded-borders q-my-sm">
          <div class="text-caption text-grey-8">
            Denunciante: <b>{{ rep.reporterName }}</b> ➔ Denunciado: <b>{{ rep.reportedName }}</b>
          </div>
          <p class="text-body2 text-grey-9 q-mt-xs">{{ rep.details }}</p>
        </div>

        <div class="row items-center justify-between q-mt-md pt-xs border-top">
          <div class="row items-center">
            <span class="text-caption text-weight-bold text-grey-7 q-mr-xs">Estado:</span>
            <q-badge :color="rep.status === 'closed' ? 'positive' : 'warning'">
              {{ rep.status === 'closed' ? 'Resolvido' : 'Pendente de Resolução' }}
            </q-badge>
          </div>

          <div v-if="rep.status !== 'closed'" class="row q-gutter-xs">
            <q-btn
              outline
              rounded
              dense
              size="sm"
              color="negative"
              label="Suspender Infrator"
              @click="resolveReportAction(rep.id, 'Utilizador suspenso temporariamente')"
            />
            <q-btn
              unelevated
              rounded
              dense
              size="sm"
              color="positive"
              label="Marcar como Resolvido"
              @click="resolveReportAction(rep.id, 'Resolvido sem infração grave')"
            />
          </div>
          <div v-else class="text-caption text-positive font-weight-bold">
            ✓ Ação tomada: {{ rep.actionTaken || 'Resolvido' }}
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

function resolveReportAction(reportId, action) {
  store.resolveReport(reportId, action)
  $q.notify({ type: 'positive', message: 'Denúncia processada e arquivada.' })
}
</script>
