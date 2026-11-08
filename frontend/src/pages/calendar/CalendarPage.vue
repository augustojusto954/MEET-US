<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Calendário & Disponibilidade</div>
        <div class="text-caption text-grey-7">
          Organiza as tuas sessões de estudo agendadas e define os teus horários livres para mentoria.
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add_alarm"
        label="Adicionar Período Disponível"
        @click="showAddSlotDialog = true"
      />
    </div>

    <!-- Navegação de Tabs: Calendário vs Gestão de Horários -->
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
        <q-tab name="calendar" icon="event" label="Próximas Sessões Agendadas" />
        <q-tab name="availability" icon="tune" label="Minha Disponibilidade Semanal" />
      </q-tabs>
    </q-card>

    <!-- Tab 1: Calendário de Sessões -->
    <div v-if="activeTab === 'calendar'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1 text-weight-bold text-dark">Novembro de 2026</div>
              <div class="row q-gutter-xs">
                <q-btn flat round dense icon="chevron_left" />
                <q-btn flat round dense icon="chevron_right" />
              </div>
            </div>

            <!-- Lista de Eventos Agendados -->
            <q-list separator>
              <q-item
                v-for="ev in store.calendarEvents"
                :key="ev.id"
                class="rounded-borders q-my-sm q-pa-md"
                style="background: #F8FAFC; border: 1px solid #E2E8F0;"
              >
                <q-item-section avatar>
                  <q-avatar size="44px" :style="{ backgroundColor: ev.color || '#059669', color: 'white' }">
                    <q-icon name="event" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bolder text-subtitle2 text-dark">{{ ev.title }}</q-item-label>
                  <q-item-label caption class="text-grey-8">
                    Com <b>{{ ev.partner }}</b> • {{ ev.mode }}
                  </q-item-label>
                  <q-item-label caption class="text-primary text-weight-bold q-mt-xs">
                    {{ ev.date }} às {{ ev.time }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    unelevated
                    rounded
                    dense
                    color="primary"
                    icon="videocam"
                    label="Entrar na Sala"
                    :to="{ name: 'calls', query: { partner: ev.partner } }"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat class="q-pa-md">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm">Resumo da Semana</div>
            <div class="column q-gutter-sm">
              <div class="row items-center justify-between q-pa-sm rounded-borders" style="background: #ECFDF5;">
                <span class="text-caption text-weight-bold">Sessões Marcadas:</span>
                <span class="text-weight-bolder text-primary">{{ store.calendarEvents.length }}</span>
              </div>
              <div class="row items-center justify-between q-pa-sm rounded-borders" style="background: #ECFDF5;">
                <span class="text-caption text-weight-bold">Horas de Estudo:</span>
                <span class="text-weight-bolder text-secondary">6h 30m</span>
              </div>
              <div class="row items-center justify-between q-pa-sm rounded-borders" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
                <span class="text-caption text-weight-bold">Parceiros Diferentes:</span>
                <span class="text-weight-bolder text-dark">3 colegas</span>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Tab 2: Minha Disponibilidade Semanal -->
    <div v-if="activeTab === 'availability'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-subtitle1 text-weight-bold text-dark">Horários Livres Cadastrados</div>
                <div class="text-caption text-grey-7">Estes períodos são sugeridos automaticamente nos pedidos de troca.</div>
              </div>
              <q-btn unelevated rounded size="sm" color="primary" label="+ Novo Horário" @click="showAddSlotDialog = true" />
            </div>

            <q-list separator>
              <q-item
                v-for="slot in store.availabilitySlots"
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
          <q-card flat class="q-pa-md">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Dicas de Disponibilidade</div>
            <p class="text-caption text-grey-7">
              Estudantes com horários definidos recebem 3x mais propostas de trocas compatíveis e reduzem o tempo de acerto de agenda.
            </p>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Modal Adicionar Slot de Disponibilidade -->
    <q-dialog v-model="showAddSlotDialog">
      <q-card style="width: 420px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="row items-center justify-between bg-soft-lavender">
          <div class="text-subtitle1 text-weight-bold">Adicionar Horário Disponível</div>
          <q-btn flat round dense icon="close" v-close-popup />
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

const activeTab = ref('calendar')
const showAddSlotDialog = ref(false)

const newSlot = ref({
  day: 'Segunda-feira',
  start: '14:00',
  end: '18:00'
})

function saveSlot() {
  store.addAvailabilitySlot({ ...newSlot.value, active: true })
  showAddSlotDialog.value = false
  $q.notify({ type: 'positive', message: 'Horário de disponibilidade adicionado!' })
}

function deleteSlot(id) {
  store.removeAvailabilitySlot(id)
  $q.notify({ type: 'info', message: 'Período removido.' })
}
</script>
