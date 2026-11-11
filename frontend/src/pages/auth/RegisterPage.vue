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
        <img src="/icons/meet-us-logo.png" style="height: 58px; max-width: 240px; object-fit: contain;" alt="MEET-US" />
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
        <!-- Foto de Perfil Própria / Avatar Personalizado -->
        <div class="avatar-box q-pa-sm rounded-borders">
          <div class="field-label q-mb-xs">Foto de Perfil</div>
          <div class="row items-center q-gutter-md">
            <q-avatar size="64px" class="shadow-2 border-primary bg-white relative-position">
              <img :src="displayAvatar" alt="Avatar" />
            </q-avatar>

            <div class="col">
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onFileChange"
              />
              <div class="row q-gutter-xs">
                <q-btn
                  unelevated
                  dense
                  size="sm"
                  color="primary"
                  icon="photo_camera"
                  label="Carregar Foto"
                  class="q-px-sm text-weight-bold"
                  no-caps
                  @click="fileInputRef?.click()"
                />
                <q-btn
                  v-if="form.avatar"
                  flat
                  dense
                  size="sm"
                  color="grey-8"
                  icon="close"
                  label="Limpar"
                  class="q-px-xs"
                  no-caps
                  @click="form.avatar = ''"
                />
              </div>
              <div class="text-caption text-grey-6 q-mt-xs" style="font-size: 11px; line-height: 1.2;">
                Carrega a tua foto ou usa o avatar gerado com o teu nome.
              </div>
            </div>
          </div>

          <!-- Sugestões de Fotos de Estudantes -->
          <div class="q-mt-sm">
            <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 11px;">Ou seleciona um avatar:</div>
            <div class="row q-gutter-xs items-center">
              <q-avatar
                v-for="(av, idx) in PRESET_AVATARS"
                :key="idx"
                size="32px"
                class="cursor-pointer preset-avatar"
                :class="{ 'preset-selected': form.avatar === av }"
                @click="form.avatar = av"
              >
                <img :src="av" />
              </q-avatar>
            </div>
          </div>
        </div>

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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const isPwd = ref(true)
const fileInputRef = ref(null)

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces', // Amália
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces', // Carlos
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces', // Lúcia
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces', // Hélder
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces', // Quitéria
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces'  // Samira
]

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
  avatar: '',
  institution: 'Universidade Eduardo Mondlane',
  course: '',
  year: 1
})

const displayAvatar = computed(() => {
  if (form.avatar && form.avatar.trim()) {
    return form.avatar
  }
  const cleanName = (form.name || '').trim() || 'Estudante'
  const bgColors = ['059669', '2563EB', '7C3AED', 'D97706', 'DC2626', '0D9488', '4F46E5', '0284C7', 'E11D48']
  const charSum = cleanName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const bg = bgColors[Math.abs(charSum) % bgColors.length]
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=${bg}&color=ffffff&size=256&bold=true`
})

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    $q.notify({ type: 'warning', message: 'A imagem deve ter no máximo 5MB.' })
    return
  }

  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = new Image()
    img.onload = () => {
      // Redimensionar para tamanho otimizado (300x300) para mobile e baixo consumo
      const canvas = document.createElement('canvas')
      const maxDim = 300
      let w = img.width
      let h = img.height
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w)
          w = maxDim
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h)
          h = maxDim
        }
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      form.avatar = canvas.toDataURL('image/jpeg', 0.85)
      $q.notify({ type: 'positive', message: 'Foto carregada com sucesso!', icon: 'check' })
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

async function onSubmit() {
  try {
    const payload = { ...form }
    if (!payload.avatar) {
      payload.avatar = displayAvatar.value
    }
    await auth.register(payload)
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
  margin: 24px auto;
  padding: 16px;
}
.register-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;
}
.avatar-box {
  background: #F8FAFC;
  border: 1px dashed #CBD5E1;
}
.preset-avatar {
  border: 2px solid transparent;
  transition: transform 0.15s, border-color 0.15s;
}
.preset-avatar:hover {
  transform: scale(1.1);
}
.preset-selected {
  border-color: #059669 !important;
  transform: scale(1.08);
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

@media (max-width: 480px) {
  .register-card {
    padding: 16px;
    border-radius: 12px;
  }
  .register-page {
    margin: 12px auto;
    padding: 8px;
  }
}
</style>
