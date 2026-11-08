<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Definições da Conta ⚙️</div>
        <div class="text-caption text-grey-7">Gere as tuas credenciais de acesso e dados da aplicação</div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Informações Gerais -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Dados de Utilizador</div>
            <div class="q-gutter-md">
              <q-input :model-value="auth.user?.name" label="Nome Completo" outlined dense readonly>
                <template #prepend><q-icon name="person" /></template>
              </q-input>
              <q-input :model-value="auth.user?.email" label="E-mail" outlined dense readonly>
                <template #prepend><q-icon name="email" /></template>
              </q-input>
              <q-input :model-value="auth.user?.institution" label="Instituição de Ensino" outlined dense readonly>
                <template #prepend><q-icon name="school" /></template>
              </q-input>
              <q-input :model-value="auth.user?.course" label="Curso" outlined dense readonly>
                <template #prepend><q-icon name="menu_book" /></template>
              </q-input>
            </div>
            <div class="q-mt-md text-caption text-grey-7">
              Para editar os teus dados públicos ou competências, acede a
              <router-link :to="{ name: 'profile' }" class="text-primary text-weight-bold">Meu Perfil</router-link>.
            </div>
          </q-card-section>
        </q-card>

        <!-- Sessão e Acesso -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Sessão Ativa</div>
            <div class="row items-center justify-between">
              <div>
                <div class="text-body2 text-weight-medium">Conectado como {{ auth.user?.email }}</div>
                <div class="text-caption text-grey-7">ID de Utilizador: #{{ auth.userId }}</div>
              </div>
              <q-btn color="negative" outline icon="logout" label="Terminar Sessão" @click="handleLogout" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Segurança & Base de Dados -->
      <div class="col-12 col-md-6">
        <!-- Alterar Palavra-passe -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Segurança & Palavra-passe</div>
            <div class="text-caption text-grey-7 q-mb-md">Atualiza a tua palavra-passe de acesso à conta</div>

            <q-form @submit.prevent="handleChangePassword" class="q-gutter-sm">
              <q-input
                v-model="pwdForm.current"
                label="Palavra-passe atual"
                type="password"
                outlined dense
                :rules="[v => !!v || 'Obrigatório']"
              />
              <q-input
                v-model="pwdForm.next"
                label="Nova palavra-passe"
                type="password"
                outlined dense
                :rules="[v => (v && v.length >= 6) || 'Mínimo 6 caracteres']"
              />
              <q-input
                v-model="pwdForm.confirm"
                label="Confirmar nova palavra-passe"
                type="password"
                outlined dense
                :rules="[v => v === pwdForm.next || 'As palavras-passe não coincidem']"
              />
              <q-btn
                type="submit"
                color="primary"
                label="Atualizar Palavra-passe"
                unelevated
                class="q-mt-sm"
                :loading="updatingPwd"
              />
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Gestão da Base Local (Demo / Reset) -->
        <q-card flat bordered class="bg-red-1" style="border: 1px solid #e57373;">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-negative">Zona de Dados Demo (SQLite WASM)</div>
            <div class="text-caption text-grey-9 q-mt-xs">
              A aplicação está a correr com um banco de dados SQLite local no teu navegador. Podes restaurar os dados originais de teste a qualquer momento.
            </div>

            <div class="row q-gutter-sm q-mt-md">
              <q-btn
                color="negative"
                icon="restart_alt"
                label="Restaurar Dados Iniciais"
                unelevated
                @click="confirmReset"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { queryOne, run, resetDatabase } from 'src/db'
import { api } from 'src/boot/axios'

const USE_FAKE = (import.meta.env.VITE_USE_FAKE_API || import.meta.env.USE_FAKE_API || 'false') === 'true'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const pwdForm = reactive({ current: '', next: '', confirm: '' })
const updatingPwd = ref(false)

async function handleChangePassword() {
  if (pwdForm.next !== pwdForm.confirm) return
  updatingPwd.value = true
  try {
    if (!USE_FAKE) {
      await api.put('/auth/change-password', { current: pwdForm.current, next: pwdForm.next })
      $q.notify({ type: 'positive', message: 'Palavra-passe alterada com sucesso!' })
      pwdForm.current = ''
      pwdForm.next = ''
      pwdForm.confirm = ''
      return
    }
    const u = queryOne('SELECT password FROM users WHERE id = ?', [auth.userId])
    if (!u || u.password !== pwdForm.current) {
      $q.notify({ type: 'negative', message: 'A palavra-passe atual está incorreta.' })
      return
    }
    run('UPDATE users SET password = ? WHERE id = ?', [pwdForm.next, auth.userId])
    $q.notify({ type: 'positive', message: 'Palavra-passe alterada com sucesso!' })
    pwdForm.current = ''
    pwdForm.next = ''
    pwdForm.confirm = ''
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message || 'Erro ao alterar palavra-passe' })
  } finally {
    updatingPwd.value = false
  }
}

function confirmReset() {
  $q.dialog({
    title: 'Restaurar Base de Dados',
    message: 'Isto irá limpar todas as alterações, criar novos utilizadores e dados fictícios e terminar a sessão atual. Desejas continuar?',
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    resetDatabase()
    auth.logout()
    window.location.href = '/auth/login'
  })
}

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
