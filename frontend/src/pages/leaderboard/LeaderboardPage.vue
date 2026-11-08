<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Ranking de Estudantes</div>
        <div class="text-caption text-grey-7">Os estudantes com melhor reputação e mais partilhas na comunidade universitária.</div>
      </div>
      <q-badge color="primary" class="q-px-md q-py-xs text-weight-bold">Temporada Semestral 2026</q-badge>
    </div>

    <!-- Pódio Top 3 -->
    <div v-if="rankedStudents.length >= 3" class="row justify-center items-end q-col-gutter-lg q-my-lg">
      <!-- 2º Lugar (Prata) -->
      <div class="col-12 col-sm-4 col-md-3 text-center order-sm-1 order-2">
        <q-card flat class="q-pa-md cursor-pointer hover-lift bg-white shadow-2" style="border: 2px solid #E2E8F0; border-radius: 20px;" @click="goToProfile(rankedStudents[1])">
          <div class="text-subtitle2 text-weight-bolder text-grey-7">2º Lugar · Prata</div>
          <q-avatar size="84px" class="q-mt-sm shadow-1 border-white" style="border: 3px solid #E2E8F0;">
            <img :src="rankedStudents[1].avatar" />
          </q-avatar>
          <div class="text-subtitle1 text-weight-bolder text-dark q-mt-sm ellipsis">{{ rankedStudents[1].name }}</div>
          <div class="text-caption text-grey-7 ellipsis">{{ rankedStudents[1].course }}</div>
          <div class="text-caption text-grey-6 ellipsis">{{ rankedStudents[1].institution }}</div>
          <div class="q-mt-sm">
            <q-badge color="amber-9" text-color="white" class="q-pa-xs">
              <q-icon name="star" size="14px" class="q-mr-xs" />
              {{ rankedStudents[1].reputation }}
            </q-badge>
            <div class="text-caption text-grey-7 q-mt-xs">{{ rankedStudents[1].reviews_count }} avaliações</div>
          </div>
        </q-card>
      </div>

      <!-- 1º Lugar (Ouro) -->
      <div class="col-12 col-sm-4 col-md-4 text-center order-sm-2 order-1">
        <q-card flat class="q-pa-lg cursor-pointer hover-lift bg-emerald-50 shadow-4" style="border: 3px solid #059669; border-radius: 24px;" @click="goToProfile(rankedStudents[0])">
          <div class="text-subtitle1 text-weight-bolder text-primary">1º Lugar · Top Mentor</div>
          <q-avatar size="104px" class="q-mt-sm shadow-3 border-white" style="border: 4px solid #059669;">
            <img :src="rankedStudents[0].avatar" />
          </q-avatar>
          <div class="text-h6 text-weight-bolder text-dark q-mt-sm ellipsis">{{ rankedStudents[0].name }}</div>
          <div class="text-caption text-weight-medium text-grey-8 ellipsis">{{ rankedStudents[0].course }}</div>
          <div class="text-caption text-grey-7 ellipsis">{{ rankedStudents[0].institution }}</div>
          <div class="q-mt-sm">
            <q-badge color="primary" text-color="white" class="q-pa-sm text-subtitle2 text-weight-bolder">
              <q-icon name="star" size="16px" class="q-mr-xs" />
              {{ rankedStudents[0].reputation }}
            </q-badge>
            <div class="text-caption text-grey-8 text-weight-medium q-mt-xs">{{ rankedStudents[0].reviews_count }} mentorias concluídas</div>
          </div>
        </q-card>
      </div>

      <!-- 3º Lugar (Bronze) -->
      <div class="col-12 col-sm-4 col-md-3 text-center order-sm-3 order-3">
        <q-card flat class="q-pa-md cursor-pointer hover-lift bg-white shadow-2" style="border: 2px solid #E2E8F0; border-radius: 20px;" @click="goToProfile(rankedStudents[2])">
          <div class="text-subtitle2 text-weight-bolder text-amber-9">3º Lugar · Bronze</div>
          <q-avatar size="84px" class="q-mt-sm shadow-1 border-white" style="border: 3px solid #E2E8F0;">
            <img :src="rankedStudents[2].avatar" />
          </q-avatar>
          <div class="text-subtitle1 text-weight-bolder text-dark q-mt-sm ellipsis">{{ rankedStudents[2].name }}</div>
          <div class="text-caption text-grey-7 ellipsis">{{ rankedStudents[2].course }}</div>
          <div class="text-caption text-grey-6 ellipsis">{{ rankedStudents[2].institution }}</div>
          <div class="q-mt-sm">
            <q-badge color="amber-9" text-color="white" class="q-pa-xs">
              <q-icon name="star" size="14px" class="q-mr-xs" />
              {{ rankedStudents[2].reputation }}
            </q-badge>
            <div class="text-caption text-grey-7 q-mt-xs">{{ rankedStudents[2].reviews_count }} avaliações</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Tabela Completa do Ranking -->
    <q-card flat class="overflow-hidden q-mt-lg">
      <q-table
        :rows="rankedStudents"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-rank="props">
          <q-td :props="props">
            <span class="text-weight-bolder text-subtitle2" :class="props.rowIndex < 3 ? 'text-primary' : 'text-grey-7'">
              #{{ props.rowIndex + 1 }}
            </span>
          </q-td>
        </template>

        <template #body-cell-student="props">
          <q-td :props="props">
            <div class="row items-center cursor-pointer" @click="goToProfile(props.row)">
              <q-avatar size="36px" class="q-mr-sm">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div>
                <div class="text-weight-bold text-dark">{{ props.row.name }}</div>
                <div class="text-caption text-grey-7">{{ props.row.course }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-reputation="props">
          <q-td :props="props">
            <div class="row items-center justify-center">
              <q-icon name="star" color="amber-9" size="16px" class="q-mr-xs" />
              <b class="text-dark">{{ props.row.reputation }}</b>
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn
              unelevated
              rounded
              dense
              size="sm"
              color="primary"
              label="Propor Troca"
              :to="{ name: 'exchange-create', query: { partnerId: props.row.id } }"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetUsStore } from 'src/stores/meetus'

const router = useRouter()
const store = useMeetUsStore()

const columns = [
  { name: 'rank', label: 'Posição', align: 'center', style: 'width: 60px;' },
  { name: 'student', label: 'Estudante', field: 'name', align: 'left', sortable: true },
  { name: 'institution', label: 'Universidade', field: 'institution', align: 'left', sortable: true },
  { name: 'reputation', label: 'Reputação', field: 'reputation', align: 'center', sortable: true },
  { name: 'reviews_count', label: 'Avaliações', field: 'reviews_count', align: 'center', sortable: true },
  { name: 'actions', label: 'Ação', align: 'right' }
]

const rankedStudents = computed(() => {
  return [...store.students].sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
})

function goToProfile(student) {
  router.push({ name: 'profile', query: { id: student.id } })
}
</script>
