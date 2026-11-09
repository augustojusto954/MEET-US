<template>
  <div class="forgot-page-content">
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
        <div class="text-caption" style="color: #94A3B8;">Aprender. Partilhar. Crescer.</div>
      </router-link>
    </div>

    <div class="q-mb-md">
      <div class="row items-center justify-between q-mb-xs">
        <h1 class="text-h5 text-weight-bolder text-dark q-my-none">Recuperar Palavra-passe</h1>
        <q-badge class="q-px-sm q-py-xs text-weight-bold" style="background: #ECFDF5; color: #059669; border-radius: 8px;">
          Suporte
        </q-badge>
      </div>
      <div class="text-caption text-grey-7">
        Introduz o teu e-mail universitário e a nova palavra-passe que desejas utilizar.
      </div>
    </div>

    <q-form @submit.prevent="onSubmit" class="column q-gutter-y-md">
      <div>
        <div class="text-caption text-weight-bold text-dark q-mb-xs">E-mail Académico</div>
        <q-input
          v-model="email"
          type="email"
          outlined
          dense
          placeholder="ex: rosa@gmail.com"
          :rules="[v => !!v || 'Por favor indica o teu e-mail']"
        >
          <template #prepend><q-icon name="mail_outline" color="primary" /></template>
        </q-input>
      </div>

      <div>
        <div class="text-caption text-weight-bold text-dark q-mb-xs">Nova Palavra-passe</div>
        <q-input
          v-model="newPassword"
          :type="isPwd ? 'password' : 'text'"
          outlined
          dense
          placeholder="Mínimo de 6 caracteres"
          :rules="[v => (v && v.length >= 6) || 'Mínimo de 6 caracteres']"
        >
          <template #prepend><q-icon name="lock_outline" color="primary" /></template>
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              color="grey-6"
              size="20px"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>

      <q-btn
        type="submit"
        label="Atualizar Palavra-passe"
        class="full-width text-white shadow-1 q-py-sm text-weight-bold"
        color="primary"
        no-caps
        size="md"
        :loading="loading"
        style="border-radius: 12px; height: 44px; background: #059669 !important;"
      />

      <div class="text-center text-caption text-grey-7 q-pt-sm">
        Lembraste-te da palavra-passe?
        <router-link :to="{ name: 'login' }" class="text-primary text-weight-bolder q-ml-xs">
          Voltar ao login
        </router-link>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const newPassword = ref('')
const isPwd = ref(true)
const loading = ref(false)

async function onSubmit() {
  if (!email.value || !newPassword.value) {
    $q.notify({ type: 'warning', message: 'Preenche o e-mail e a nova palavra-passe.' })
    return
  }
  loading.value = true
  try {
    const res = await api.post('/auth/forgot-password', {
      email: email.value.trim(),
      newPassword: newPassword.value.trim()
    })
    $q.notify({
      type: 'positive',
      message: res.data.message || 'Palavra-passe alterada com sucesso!',
      icon: 'check_circle'
    })
    router.push({ name: 'login' })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Falha ao redefinir a palavra-passe.',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-page-content {
  width: 100%;
  max-width: 440px;
  margin: 48px auto;
  padding: 24px;
}
.back-link {
  transition: color 0.15s ease;
}
.back-link:hover {
  color: #059669 !important;
}
</style>