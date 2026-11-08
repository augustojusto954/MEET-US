<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Definições & Privacidade ⚙️</div>
        <div class="text-caption text-grey-7">Gere as tuas preferências de conta, visibilidade e segurança.</div>
      </div>
    </div>

    <!-- Tabs: Conta vs Privacidade -->
    <q-card flat class="q-mb-lg">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-7 bg-soft-lavender"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="privacy" icon="security" label="Privacidade & Segurança" />
        <q-tab name="account" icon="manage_accounts" label="Definições da Conta" />
        <q-tab name="blocked" icon="block" label="Utilizadores Bloqueados" />
      </q-tabs>
    </q-card>

    <!-- Tab 1: Privacidade & Segurança -->
    <div v-if="activeTab === 'privacy'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Visibilidade do Perfil</div>

            <q-list separator>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Perfil Académico Público</q-item-label>
                  <q-item-label caption>Permite que qualquer estudante encontre o teu perfil na busca</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="privacy.publicProfile" color="primary" />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Mostrar Universidade e Faculdade</q-item-label>
                  <q-item-label caption>Exibe a instituição de ensino no cartão de busca e matching</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="privacy.showUniversity" color="primary" />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Mostrar Disponibilidade Semanal</q-item-label>
                  <q-item-label caption>Permite que outros vejam os teus dias livres para estudo</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="privacy.showAvailability" color="primary" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Quem pode enviar-te mensagens no Chat</q-item-label>
                  <q-item-label caption>Controla o recebimento de mensagens diretas</q-item-label>
                </q-item-section>
                <q-item-section side style="width: 200px;">
                  <q-select
                    v-model="privacy.allowMessagesFrom"
                    dense
                    outlined
                    :options="[
                      { label: 'Todos os Estudantes', value: 'everyone' },
                      { label: 'Apenas Conexões', value: 'connections_only' }
                    ]"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
            </q-list>

            <div class="row justify-end q-mt-lg">
              <q-btn unelevated rounded color="primary" label="Guardar Preferências" @click="savePreferences" />
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat class="q-pa-md bg-soft-lavender">
            <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Segurança dos Teus Dados</div>
            <p class="text-caption text-grey-8 leading-relaxed">
              O MEET-US não partilha o teu contacto telefónico, endereço residencial ou dados privados. Todas as mensagens e chamadas são geridas de forma segura pela aplicação.
            </p>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Tab 2: Definições da Conta -->
    <div v-if="activeTab === 'account'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Alterar Palavra-passe</div>
            <div class="column q-gutter-md">
              <q-input v-model="currentPassword" label="Palavra-passe Atual" type="password" outlined dense />
              <q-input v-model="newPassword" label="Nova Palavra-passe" type="password" outlined dense />
              <q-input v-model="confirmPassword" label="Confirmar Nova Palavra-passe" type="password" outlined dense />
              <div class="row justify-end">
                <q-btn unelevated rounded color="primary" label="Atualizar Palavra-passe" @click="changePassword" />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Tab 3: Utilizadores Bloqueados -->
    <div v-if="activeTab === 'blocked'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Lista de Utilizadores Bloqueados</div>
            <div class="text-caption text-grey-7 q-mb-md">
              Utilizadores bloqueados não podem enviar-te mensagens nem ver a tua disponibilidade.
            </div>

            <q-list separator>
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-avatar size="40px" class="bg-grey-4 text-grey-8">
                    <q-icon name="person_off" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Utilizador Exemplar Bloqueado</q-item-label>
                  <q-item-label caption>Bloqueado a 15 de Outubro de 2026</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn outline rounded dense size="sm" color="negative" label="Desbloquear" @click="$q.notify({ type: 'info', message: 'Utilizador desbloqueado.' })" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()

const activeTab = ref('privacy')

const privacy = ref({
  publicProfile: true,
  showUniversity: true,
  showAvailability: true,
  allowMessagesFrom: 'everyone'
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

function savePreferences() {
  store.updateCurrentUser({ privacy: privacy.value })
  $q.notify({ type: 'positive', message: 'Preferências de privacidade guardadas com sucesso!' })
}

function changePassword() {
  if (!newPassword.value) {
    $q.notify({ type: 'warning', message: 'Indique a nova palavra-passe.' })
    return
  }
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  $q.notify({ type: 'positive', message: 'Palavra-passe alterada com sucesso!' })
}
</script>
