<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Perfil do Administrador</div>
        <div class="text-caption text-grey-7">Gestão de credenciais, fotografia e dados do administrador oficial do MEET-US.</div>
      </div>
      <div>
        <q-btn
          outline
          rounded
          color="primary"
          icon="arrow_back"
          label="Voltar ao Portal do Estudante"
          class="text-weight-bold"
          no-caps
          :to="{ name: 'dashboard' }"
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Coluna Principal do Formulário -->
      <div class="col-12 col-md-8">
        <q-card flat class="q-pa-lg shadow-1" style="border-radius: 16px;">
          <!-- Cabeçalho com Avatar Interativo -->
          <div class="row items-center q-mb-lg">
            <div class="relative-position q-mr-md">
              <q-avatar size="96px" class="shadow-3 border-primary bg-white">
                <img :src="effectiveAvatar" alt="Avatar do Administrador" />
              </q-avatar>
              <!-- Botão Flutuante de Upload de Foto -->
              <q-btn
                round
                dense
                color="primary"
                icon="photo_camera"
                size="sm"
                class="absolute-bottom-right shadow-2"
                @click="triggerFileInput"
              >
                <q-tooltip>Alterar Fotografia de Perfil</q-tooltip>
              </q-btn>
            </div>

            <div class="col">
              <div class="text-h6 text-weight-bolder text-dark">{{ form.name || 'Administrador Central' }}</div>
              <div class="text-caption text-grey-7">{{ form.email || 'admin@meetus.mz' }}</div>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-badge color="deep-purple" class="q-px-sm q-py-xs text-weight-bold">
                  Super Administrador (Acesso Total)
                </q-badge>
                <q-badge color="positive" class="q-px-sm q-py-xs">Conta Verificada</q-badge>
              </div>

              <!-- Ações Rápidas de Foto -->
              <div class="row items-center q-gutter-xs q-mt-sm">
                <q-btn
                  outline
                  dense
                  rounded
                  color="primary"
                  icon="upload"
                  label="Carregar Foto"
                  size="sm"
                  class="q-px-sm"
                  no-caps
                  @click="triggerFileInput"
                />
                <q-btn
                  flat
                  dense
                  rounded
                  color="grey-7"
                  icon="refresh"
                  label="Gerar com Iniciais"
                  size="sm"
                  class="q-px-sm"
                  no-caps
                  @click="resetToInitials"
                />
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Galeria de Avatares Recomendados para o Admin -->
          <div class="q-mb-lg">
            <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">
              Ou escolhe um avatar oficial predefinido:
            </div>
            <div class="row q-gutter-sm items-center">
              <q-avatar
                v-for="(av, idx) in PRESET_AVATARS"
                :key="idx"
                size="44px"
                class="cursor-pointer shadow-1 transition-transform"
                :style="form.avatar === av ? 'border: 3px solid #059669; transform: scale(1.1);' : 'border: 2px solid transparent;'"
                @click="form.avatar = av"
              >
                <img :src="av" />
                <q-tooltip>Selecionar este avatar</q-tooltip>
              </q-avatar>
            </div>
          </div>

          <!-- Campos do Formulário -->
          <div class="column q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.name"
                  label="Nome do Responsável *"
                  outlined
                  dense
                  hint="Nome exibido na plataforma e relatórios"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.email"
                  label="E-mail de Notificações Técnicas *"
                  outlined
                  dense
                  readonly
                  hint="E-mail oficial do Super Admin"
                >
                  <template #append>
                    <q-icon name="lock" color="grey-6" size="18px" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.institution"
                  label="Instituição / Direção"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.course"
                  label="Departamento / Área de Gestão"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-input
              v-model="form.bio"
              label="Biografia e Atribuições Institucionais"
              type="textarea"
              rows="3"
              outlined
              dense
              hint="Descrição pública do perfil do administrador"
            />

            <q-input
              v-model="form.avatar"
              label="URL Direto da Foto (Opcional)"
              outlined
              dense
              placeholder="https://exemplo.com/minha-foto.jpg"
              hint="Podes colar um link web ou usar o botão 'Carregar Foto' acima"
            />

            <q-separator class="q-my-sm" />

            <!-- Secção de Alteração de Senha -->
            <div>
              <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">
                Segurança da Conta & Palavra-passe
              </div>
              <div class="text-caption text-grey-6 q-mb-sm">
                Deixa estes campos em branco se não pretenderes alterar a palavra-passe atual.
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="newPassword"
                    label="Nova Palavra-passe (Opcional)"
                    type="password"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="confirmPassword"
                    label="Confirmar Nova Palavra-passe"
                    type="password"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn
                unelevated
                rounded
                color="primary"
                icon="save"
                label="Guardar Alterações"
                class="q-px-lg text-weight-bold"
                no-caps
                :loading="saving"
                @click="saveAdminProfile"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Coluna Lateral de Informações de Privilégio -->
      <div class="col-12 col-md-4">
        <q-card flat class="q-pa-lg shadow-1" style="border-radius: 16px;">
          <div class="row items-center q-mb-md">
            <q-icon name="security" color="deep-purple" size="28px" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bolder text-dark">Nível de Privilégio</div>
          </div>

          <div class="text-caption text-grey-7 q-mb-md">
            Esta conta possui acesso de <strong>Super Administrador</strong> com poderes de supervisão e auditoria global:
          </div>

          <q-list dense separator class="text-caption text-grey-8">
            <q-item class="q-px-none">
              <q-item-section avatar><q-icon name="check_circle" color="positive" size="18px" /></q-item-section>
              <q-item-section>Gestão de Estudantes e Mentores</q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section avatar><q-icon name="check_circle" color="positive" size="18px" /></q-item-section>
              <q-item-section>Moderação de Feed e Publicações</q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section avatar><q-icon name="check_circle" color="positive" size="18px" /></q-item-section>
              <q-item-section>Gestão de Universidades e Cursos</q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section avatar><q-icon name="check_circle" color="positive" size="18px" /></q-item-section>
              <q-item-section>Auditoria e Métricas de Plataforma</q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-md" />

          <div class="bg-emerald-50 q-pa-sm rounded-borders text-caption text-positive">
            <q-icon name="info" class="q-mr-xs" />
            As alterações feitas na foto e dados do perfil são refletidas instantaneamente em todo o sistema.
          </div>
        </q-card>
      </div>
    </div>

    <!-- Input Oculto para Selecionar Ficheiro do Computador ou Telemóvel -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const auth = useAuthStore()
const store = useMeetUsStore()

const fileInputRef = ref(null)
const saving = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces'
]

const form = ref({
  name: auth.user?.name || 'Administrador Central MEET-US',
  email: auth.user?.email || 'admin@meetus.mz',
  avatar: auth.user?.avatar || '',
  bio: auth.user?.bio || 'Administrador Geral da Plataforma MEET-US.',
  institution: auth.user?.institution || 'Administração Geral MEET-US',
  course: auth.user?.course || 'Gestão de Sistemas de Informação'
})

const effectiveAvatar = computed(() => {
  if (form.value.avatar && form.value.avatar.trim()) {
    const av = form.value.avatar.trim()
    if (av.startsWith('/uploads')) {
      if (typeof window !== 'undefined' && window.location.port && window.location.port !== '3000' && window.location.port !== '80' && window.location.port !== '443') {
        return `${window.location.protocol}//${window.location.hostname}:3000${av}`
      }
    }
    return av
  }
  const cleanName = (form.value.name || '').trim() || 'Admin Central'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=059669&color=ffffff&size=256&bold=true`
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

function resetToInitials() {
  const cleanName = (form.value.name || '').trim() || 'Admin Central'
  form.value.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=059669&color=ffffff&size=256&bold=true`
  $q.notify({ type: 'info', message: 'Avatar restaurado para as iniciais.' })
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''

  if (file.size > 10 * 1024 * 1024) {
    $q.notify({ type: 'warning', message: 'A imagem deve ter no máximo 10MB.' })
    return
  }

  // Upload direto ao backend uploads
  const formData = new FormData()
  formData.append('file', file)
  api.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => {
    form.value.avatar = res.data.url
    $q.notify({ type: 'positive', message: 'Nova foto carregada! Clica em "Guardar Alterações" para aplicar.', icon: 'check' })
  }).catch(() => {
    // Fallback com FileReader e Canvas
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 400
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
        form.value.avatar = canvas.toDataURL('image/jpeg', 0.88)
        $q.notify({ type: 'positive', message: 'Foto processada! Clica em "Guardar Alterações".', icon: 'check' })
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

async function saveAdminProfile() {
  if (newPassword.value) {
    if (newPassword.value.length < 6) {
      $q.notify({ type: 'warning', message: 'A palavra-passe deve ter pelo menos 6 caracteres.' })
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      $q.notify({ type: 'negative', message: 'A confirmação da palavra-passe não coincide.' })
      return
    }
  }

  saving.value = true
  try {
    const finalAvatar = form.value.avatar || effectiveAvatar.value
    const payload = {
      name: form.value.name,
      bio: form.value.bio,
      institution: form.value.institution,
      course: form.value.course,
      avatar: finalAvatar
    }

    if (newPassword.value) {
      payload.password = newPassword.value.trim()
    }

    const userId = auth.userId || 'admin-001'
    const res = await api.put(`/users/${userId}`, payload)

    const updatedUser = res.data
    if (auth.user) {
      auth.user = { ...auth.user, ...updatedUser }
      auth._persist()
    }
    if (store.currentUser && String(store.currentUser.id || store.currentUser._id) === String(userId)) {
      store.updateCurrentUser(updatedUser)
    }

    newPassword.value = ''
    confirmPassword.value = ''

    $q.notify({
      type: 'positive',
      message: 'Perfil e fotografia do administrador atualizados com sucesso!',
      icon: 'check_circle'
    })
  } catch (err) {
    console.error('Erro ao guardar perfil do admin:', err)
    $q.notify({ type: 'negative', message: 'Falha ao guardar perfil do administrador.' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const userId = auth.userId || 'admin-001'
  try {
    const res = await api.get(`/users/${userId}`)
    if (res.data) {
      form.value.name = res.data.name || form.value.name
      form.value.email = res.data.email || form.value.email
      form.value.avatar = res.data.avatar || form.value.avatar
      form.value.bio = res.data.bio || form.value.bio
      form.value.institution = res.data.institution || form.value.institution
      form.value.course = res.data.course || form.value.course

      if (auth.user) {
        auth.user = { ...auth.user, ...res.data }
        auth._persist()
      }
    }
  } catch (e) {
    console.warn('Não foi possível carregar dados recentes do admin:', e)
  }
})
</script>

<style scoped>
.transition-transform {
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.transition-transform:hover {
  transform: scale(1.08);
}
.hidden {
  display: none !important;
}
</style>
