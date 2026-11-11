<template>
  <div class="login-wrapper bg-white">
    <!-- Palco Centralizado: Campos de Login e Imagem dos Estudantes Próximos (Fiel a 3paginaLogin.webp) -->
    <div class="login-stage">
      <!-- Coluna Esquerda: Marca e Formulário de Autenticação -->
      <div class="login-form-side">
        <!-- Linha Superior: Voltar à Página Principal e Selo -->
        <div class="nav-row q-mb-sm row items-center justify-between">
          <router-link to="/" class="back-link row items-center text-caption text-weight-bold" style="text-decoration: none;">
            <q-icon name="arrow_back" size="18px" class="q-mr-xs" />
            Voltar à página principal
          </router-link>
          <q-badge class="q-px-sm q-py-xs text-weight-bold" style="background: #ECFDF5; color: #059669; border-radius: 6px;">
            🇲🇿 Moçambique
          </q-badge>
        </div>

        <!-- Marca Oficial MEET-US -->
        <div class="brand-block q-mb-md text-center">
          <router-link to="/" style="text-decoration: none;">
            <img src="/icons/meet-us-logo.png" style="height: 58px; max-width: 240px; object-fit: contain;" alt="MEET-US" />
          </router-link>
        </div>

        <!-- Cartão Oficial: Bem-vindo de volta -->
        <q-card flat class="login-card bg-white">
          <div class="q-mb-md">
            <h1 class="card-title text-dark q-my-none">Bem-vindo de volta</h1>
            <p class="card-subtitle text-grey-7 q-mt-xs q-mb-none">
              Entre na sua conta para continuar a aprender e colaborar.
            </p>
          </div>

          <!-- Formulário Quasar Interativo -->
          <q-form @submit.prevent="onSubmit" class="column q-gutter-y-md">
            <!-- Campo: Email -->
            <div class="field-group">
              <label class="field-label" for="login-email">Email</label>
              <q-input
                id="login-email"
                v-model="email"
                type="email"
                outlined
                dense
                placeholder="Insira o seu email"
                class="login-input"
                :rules="[val => (val && val.length > 0) || 'Insira o seu email']"
                lazy-rules
              >
                <template #prepend>
                  <q-icon name="mail_outline" color="grey-6" size="20px" />
                </template>
              </q-input>
            </div>

            <!-- Campo: Palavra-passe -->
            <div class="field-group">
              <label class="field-label" for="login-password">Palavra-passe</label>
              <q-input
                id="login-password"
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                outlined
                dense
                placeholder="Insira a sua palavra-passe"
                class="login-input"
                :rules="[val => (val && val.length > 0) || 'Insira a sua palavra-passe']"
                lazy-rules
              >
                <template #prepend>
                  <q-icon name="lock_outline" color="grey-6" size="20px" />
                </template>
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

            <!-- Link: Esqueceste a palavra-passe? -->
            <div class="row items-center justify-start q-mt-xs">
              <router-link :to="{ name: 'forgot' }" class="forgot-password-link">
                Esqueceste a palavra-passe?
              </router-link>
            </div>

            <!-- Botão: Entrar -->
            <q-btn
              type="submit"
              label="Entrar"
              class="full-width btn-entrar q-py-sm q-mt-md"
              unelevated
              no-caps
              :loading="auth.loading"
            />

            <!-- Rodapé: Criar conta -->
            <div class="text-center q-mt-md register-footer">
              <span class="text-grey-7">Ainda não tem conta?</span>
              <router-link :to="{ name: 'register' }" class="create-account-link q-ml-xs">
                Criar conta
              </router-link>
            </div>
          </q-form>
        </q-card>
      </div>

      <!-- Coluna Direita: Imagem dos Estudantes Próxima aos Campos -->
      <div class="login-image-side">
        <div class="image-inner">
          <img
            src="/images/login-students.webp"
            alt="Estudantes universitários de Moçambique a colaborar - MEET-US"
            class="students-hero-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const isPwd = ref(true)

async function onSubmit() {
  if (!email.value || !password.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, insira o email e a palavra-passe.',
      icon: 'warning'
    })
    return
  }

  try {
    await auth.login({ email: email.value.trim(), password: password.value })
    const roleLabel = auth.user?.role === 'admin' ? 'Administrador' : 'Estudante'
    $q.notify({
      type: 'positive',
      message: `Bem-vindo(a), ${auth.user?.name || roleLabel}!`,
      caption: `Sessão iniciada como ${roleLabel}.`,
      icon: 'check_circle'
    })
    const defaultRoute = auth.user?.role === 'admin' ? { name: 'admin-overview' } : { name: 'dashboard' }
    const redirect = route.query.redirect || defaultRoute
    router.push(redirect)
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Falha na autenticação. Verifique os seus dados.',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Palco Central: Agrupa os Campos e a Imagem Próximos entre Si */
.login-stage {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 24px; /* Proximidade direta entre o formulário e a fotografia */
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
}

/* Lado Esquerdo: Formulário & Marca */
.login-form-side {
  flex: 0 0 460px;
  max-width: 460px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.back-link {
  color: #64748b;
  transition: color 0.15s ease;
}

.back-link:hover {
  color: #059669;
}

.brand-title {
  font-size: 2rem;
  font-weight: 800;
  color: #059669;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.92rem;
  font-weight: 500;
  color: #64748b;
  margin-top: 2px;
}

.login-card {
  border: 1.5px solid #e2e8f0;
  border-radius: 28px;
  padding: 32px 32px;
  box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.08);
  width: 100%;
}

.card-title {
  font-size: 1.95rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.card-subtitle {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.45;
}

.field-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.login-input :deep(.q-field__control) {
  border-radius: 12px;
  border-color: #cbd5e1;
  height: 48px;
}

.login-input :deep(.q-field__control:hover) {
  border-color: #059669;
}

.login-input :deep(.q-field__control.q-field__control--focused) {
  border-color: #059669;
}

.forgot-password-link {
  color: #059669;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: color 0.15s ease;
}

.forgot-password-link:hover {
  color: #047857;
  text-decoration: underline;
}

.btn-entrar {
  background: #10b981 !important;
  color: #ffffff !important;
  border-radius: 12px;
  height: 48px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  transition: all 0.15s ease;
}

.btn-entrar:hover {
  background: #059669 !important;
  box-shadow: 0 6px 18px rgba(5, 150, 105, 0.4);
  transform: translateY(-1px);
}

.register-footer {
  font-size: 0.9rem;
}

.create-account-link {
  color: #059669;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.15s ease;
}

.create-account-link:hover {
  color: #047857;
  text-decoration: underline;
}

/* Lado Direito: A Imagem dos Estudantes Adjacente ao Formulário */
.login-image-side {
  flex: 1 1 580px;
  max-width: 680px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Encostada perto dos campos */
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.image-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.students-hero-img {
  width: 100%;
  max-width: 660px;
  height: auto;
  max-height: 85vh;
  object-fit: contain;
  object-position: left center;
  display: block;
  user-select: none;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* Responsividade para Ecrãs Médios */
@media (max-width: 1050px) {
  .login-stage {
    gap: 16px;
    max-width: 960px;
  }
  .login-form-side {
    flex: 0 0 420px;
    max-width: 420px;
  }
  .login-card {
    padding: 24px 24px;
    border-radius: 24px;
  }
  .students-hero-img {
    max-height: 72vh;
  }
}

/* Responsividade para Ecrãs Móveis */
@media (max-width: 768px) {
  .login-wrapper {
    padding: 16px 12px;
  }
  .login-stage {
    flex-direction: column-reverse;
    gap: 16px;
  }
  .login-image-side {
    max-width: 100%;
    justify-content: center;
  }
  .image-inner {
    justify-content: center;
  }
  .students-hero-img {
    max-height: 320px;
    object-position: center bottom;
  }
  .login-form-side {
    flex: 1 1 auto;
    max-width: 100%;
  }
  .login-card {
    padding: 24px 18px;
    border-radius: 20px;
  }
}
</style>
