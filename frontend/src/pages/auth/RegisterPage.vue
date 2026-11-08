<template>
  <div class="register-page">
    <!-- Voltar à Página Principal -->
    <div class="q-mb-md">
      <router-link to="/" class="row items-center text-caption text-weight-bold text-grey-7 back-link" style="text-decoration: none;">
        <q-icon name="arrow_back" size="18px" class="q-mr-xs" />
        Voltar à página principal
      </router-link>
    </div>

    <!-- Logo Clicável para Home -->
    <div class="text-center q-mb-lg">
      <router-link to="/" style="text-decoration: none;" class="cursor-pointer">
        <div class="text-h4 text-weight-bolder" style="color: #059669; letter-spacing: -1px;">MEET-US</div>
        <div class="text-caption" style="color: #94A3B8;">Liga-te. Partilha. Aprende.</div>
      </router-link>
    </div>

    <div class="register-card">
      <div class="q-mb-md">
        <div class="row items-center justify-between">
          <div class="text-h5 text-weight-bolder text-dark">Criar Conta</div>
          <q-badge class="q-pa-xs text-weight-bold" style="background: #ECFDF5; color: #059669; border-radius: 6px;">
            🇲🇿 Moçambique
          </q-badge>
        </div>
        <div class="text-body2 q-mt-xs" style="color: #64748B;">
          Junta-te a milhares de estudantes universitários
        </div>
      </div>

      <q-form @submit.prevent="onSubmit" class="column q-gutter-y-md">
        <div>
          <div class="field-label">Nome Completo</div>
          <q-input
            v-model="form.name"
            placeholder="ex: Samira Mucavele"
            outlined
            dense
            :rules="[v => !!v || 'Obrigatório']"
          >
            <template #prepend><q-icon name="person_outline" color="grey-6" /></template>
          </q-input>
        </div>

        <div>
          <div class="field-label">E-mail Académico</div>
          <q-input
            v-model="form.email"
            type="email"
            placeholder="ex: samira@uem.mz"
            outlined
            dense
            :rules="[v => !!v || 'Obrigatório']"
          >
            <template #prepend><q-icon name="mail_outline" color="grey-6" /></template>
          </q-input>
        </div>

        <div>
          <div class="field-label">Palavra-passe</div>
          <q-input
            v-model="form.password"
            :type="isPwd ? 'password' : 'text'"
            placeholder="Mínimo de 6 caracteres"
            outlined
            dense
            :rules="[v => v.length >= 6 || 'Mínimo 6 caracteres']"
          >
            <template #prepend><q-icon name="lock_outline" color="grey-6" /></template>
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-6"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-8">
            <div class="field-label">Universidade</div>
            <q-select
              v-model="form.institution"
              :options="INSTITUTIONS"
              outlined
              dense
            >
              <template #prepend><q-icon name="school" color="grey-6" /></template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <div class="field-label">Ano</div>
            <q-select
              v-model.number="form.year"
              :options="[1, 2, 3, 4, 5]"
              outlined
              dense
            >
              <template #prepend><q-icon name="calendar_today" color="grey-6" /></template>
            </q-select>
          </div>
        </div>

        <div>
          <div class="field-label">Curso</div>
          <q-input
            v-model="form.course"
            placeholder="ex: Engenharia Informática, Economia..."
            outlined
            dense
          >
            <template #prepend><q-icon name="menu_book" color="grey-6" /></template>
          </q-input>
        </div>

        <q-btn
          type="submit"
          label="Criar a Minha Conta"
          class="full-width q-py-sm q-mt-sm"
          unelevated
          no-caps
          color="primary"
          text-color="white"
          :loading="auth.loading"
          style="border-radius: 10px; font-weight: 700; font-size: 0.95rem;"
        />

        <div class="text-center text-body2 q-pt-xs" style="color: #64748B;">
          Já tens uma conta registada?
          <router-link :to="{ name: 'login' }" class="text-weight-bold q-ml-xs" style="color: #059669;">
            Iniciar sessão
          </router-link>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const isPwd = ref(true)

const INSTITUTIONS = [
  'Universidade Eduardo Mondlane',
  'Universidade Pedagógica',
  'ISCTEM',
  'Universidade Save',
  'A Politécnica',
  'Universidade Zambeze',
  'Universidade Lúrio'
]

const form = reactive({
  name: '',
  email: '',
  password: '',
  institution: 'Universidade Eduardo Mondlane',
  course: '',
  year: 1
})

async function onSubmit() {
  try {
    await auth.register(form)
    $q.notify({
      type: 'positive',
      message: `Conta criada com sucesso! Bem-vindo(a), ${form.name}!`,
      icon: 'check_circle'
    })
    router.push({ name: 'dashboard' })
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Erro ao criar conta. Tenta novamente.',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.register-page {
  width: 100%;
  max-width: 480px;
  margin: 32px auto;
  padding: 16px;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 6px;
}
.back-link {
  transition: color 0.15s ease;
}
.back-link:hover {
  color: #059669 !important;
}
</style>
