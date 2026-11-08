<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm" @click="$router.back()" />
        <div>
          <div class="text-h5 text-weight-bolder text-dark">Editar Perfil Académico</div>
          <div class="text-caption text-grey-7">Personaliza as tuas informações, fotografia, bio e disponibilidade.</div>
        </div>
      </div>
      <div class="row q-gutter-sm items-center">
        <q-btn
          outline
          rounded
          color="negative"
          icon="logout"
          label="Terminar Sessão"
          class="text-weight-bold"
          @click="handleLogout"
        />
        <q-btn
          unelevated
          rounded
          color="primary"
          icon="save"
          label="Guardar Alterações"
          class="text-weight-bold shadow-1"
          :loading="saving"
          @click="saveProfile"
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Coluna Formulário de Edição -->
      <div class="col-12 col-lg-8">
        <div class="column q-gutter-lg">
          <!-- 1. Informações Pessoais -->
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">1. Informações Pessoais</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input v-model="form.name" label="Nome Completo *" outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="form.email" label="E-mail Universitário *" outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="form.city" label="Cidade *" outlined dense />
              </div>
            </div>
          </q-card>

          <!-- 2. Informações Académicas -->
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">2. Informações Académicas</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="form.institution"
                  label="Universidade / Instituição *"
                  :options="['Universidade Eduardo Mondlane', 'Universidade Pedagógica', 'ISCTEM', 'Universidade Save', 'A Politécnica', 'Universidade Zambeze', 'Universidade Lúrio']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.course" label="Curso / Licenciatura *" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model.number="form.year" label="Ano" type="number" outlined dense min="1" max="6" />
              </div>
            </div>
          </q-card>

          <!-- 3. Fotografias (Avatar e Capa) -->
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">3. Fotografias do Perfil</div>

            <div class="row q-col-gutter-md items-center q-mb-md">
              <!-- Pré-visualização e Carregamento do Avatar -->
              <div class="col-12 col-sm-auto flex flex-center">
                <q-avatar size="84px" class="shadow-2 border-primary bg-white">
                  <img :src="effectiveAvatar" alt="Avatar Atual" />
                </q-avatar>
              </div>

              <div class="col">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />
                <div class="row q-gutter-xs items-center">
                  <q-btn
                    unelevated
                    color="primary"
                    icon="photo_camera"
                    label="Carregar Foto Própria"
                    no-caps
                    class="text-weight-bold"
                    @click="fileInputRef?.click()"
                  />
                  <q-btn
                    flat
                    color="grey-8"
                    icon="refresh"
                    label="Gerar com Iniciais"
                    no-caps
                    @click="resetToInitials"
                  />
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Carrega uma foto tua do telemóvel ou computador (PNG/JPG).
                </div>
              </div>
            </div>

            <!-- Avatares Pré-definidos Alternativos -->
            <div class="q-mb-md">
              <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">Ou escolhe um avatar da comunidade:</div>
              <div class="row q-gutter-xs items-center">
                <q-avatar
                  v-for="(av, idx) in PRESET_AVATARS"
                  :key="idx"
                  size="36px"
                  class="cursor-pointer"
                  :style="form.avatar === av ? 'border: 2px solid #059669; transform: scale(1.08);' : 'border: 2px solid transparent;'"
                  @click="form.avatar = av"
                >
                  <img :src="av" />
                </q-avatar>
              </div>
            </div>

            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-6">
                <q-input v-model="form.avatar" label="URL Direto da Foto (Opcional)" outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="form.cover" label="URL da Imagem de Capa (Opcional)" outlined dense />
              </div>
            </div>
          </q-card>

          <!-- 4. Biografia & Disponibilidade -->
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">4. Biografia & Disponibilidade</div>
            <q-input
              v-model="form.bio"
              label="Biografia Académica"
              type="textarea"
              rows="3"
              outlined
              dense
              class="q-mb-md"
              placeholder="Conta um pouco sobre a tua trajetória e o que gostas de estudar..."
            />
            <q-input
              v-model="form.availability"
              label="Disponibilidade Semanal de Estudo"
              outlined
              dense
              placeholder="Ex: Terças e Quintas (15h - 19h), Sábados de manhã"
            />
          </q-card>

          <!-- 5. Interesses -->
          <q-card flat class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">5. Interesses & Tópicos</div>
            <q-input
              v-model="interestsString"
              label="Tópicos de Interesse (separados por vírgula)"
              outlined
              dense
              placeholder="ex: Inteligência Artificial, Finanças, Empreendedorismo, Música"
            />
          </q-card>
        </div>
      </div>

      <!-- Coluna Pré-visualização do Cartão -->
      <div class="col-12 col-lg-4">
        <div class="sticky-top">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Pré-visualização do Teu Perfil</div>
          <q-card flat class="overflow-hidden shadow-2" style="border-radius: 18px;">
            <div style="height: 120px;">
              <img :src="form.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop'" class="full-width full-height object-cover" />
            </div>
            <div class="q-pa-md text-center" style="margin-top: -45px;">
              <q-avatar size="80px" class="border-white shadow-2 bg-white" style="border: 3px solid #FFF;">
                <img :src="effectiveAvatar" />
              </q-avatar>
              <div class="text-subtitle1 text-weight-bolder text-dark q-mt-xs">{{ form.name || 'Seu Nome' }}</div>
              <div class="text-caption text-grey-7">{{ form.course }} • {{ form.institution }}</div>
              <div class="text-caption text-grey-6">{{ form.city }}</div>

              <q-separator class="q-my-sm" />

              <p class="text-caption text-grey-8 ellipsis-3-lines">
                {{ form.bio || 'Sem biografia definida.' }}
              </p>

              <div class="text-caption text-primary text-weight-bold q-mt-xs">
                {{ form.availability || 'Disponibilidade flexível' }}
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import { useAuthStore } from 'src/stores/auth'
import { api } from 'src/boot/axios'

const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()
const auth = useAuthStore()

const fileInputRef = ref(null)
const saving = ref(false)

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces', // Amália
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces', // Carlos
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces', // Lúcia
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces', // Hélder
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces', // Quitéria
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces'  // Samira
]

const form = ref({
  name: store.currentUser?.name || auth.user?.name || '',
  email: store.currentUser?.email || auth.user?.email || '',
  city: store.currentUser?.city || auth.user?.city || 'Maputo',
  institution: store.currentUser?.institution || auth.user?.institution || 'Universidade Eduardo Mondlane',
  course: store.currentUser?.course || auth.user?.course || '',
  year: store.currentUser?.year || auth.user?.year || 3,
  avatar: store.currentUser?.avatar || auth.user?.avatar || '',
  cover: store.currentUser?.cover || auth.user?.cover || '',
  bio: store.currentUser?.bio || auth.user?.bio || '',
  availability: store.currentUser?.availability || auth.user?.availability || 'Flexível'
})

const effectiveAvatar = computed(() => {
  if (form.value.avatar && form.value.avatar.trim()) {
    return form.value.avatar
  }
  const cleanName = (form.value.name || '').trim() || 'Estudante'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=059669&color=ffffff&size=256&bold=true`
})

function resetToInitials() {
  const cleanName = (form.value.name || '').trim() || 'Estudante'
  form.value.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=059669&color=ffffff&size=256&bold=true`
}

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
      form.value.avatar = canvas.toDataURL('image/jpeg', 0.85)
      $q.notify({ type: 'positive', message: 'Nova foto carregada com sucesso!', icon: 'check' })
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

const interestsString = ref((store.currentUser?.interests || []).join(', '))

async function saveProfile() {
  saving.value = true
  try {
    const interests = interestsString.value
      ? interestsString.value.split(',').map(s => s.trim()).filter(Boolean)
      : store.currentUser?.interests || []

    const profileData = {
      ...form.value,
      avatar: form.value.avatar || effectiveAvatar.value,
      interests
    }

    store.updateCurrentUser(profileData)

    // Sincroniza diretamente com o backend MongoDB se autenticado
    const userId = auth.userId || store.currentUser?.id
    if (userId) {
      await api.put(`/users/${userId}`, {
        name: profileData.name,
        bio: profileData.bio,
        institution: profileData.institution,
        course: profileData.course,
        year: profileData.year,
        city: profileData.city,
        availability: profileData.availability,
        avatar: profileData.avatar
      })
      if (auth.user) {
        auth.user = { ...auth.user, ...profileData }
        auth._persist()
      }
    }

    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso no sistema!',
      icon: 'check_circle'
    })
    router.push({ name: 'profile' })
  } catch (err) {
    console.error('Erro ao guardar perfil:', err)
    $q.notify({
      type: 'negative',
      message: 'Erro ao guardar no servidor. Alterações salvas localmente.',
      icon: 'warning'
    })
  } finally {
    saving.value = false
  }
}

function handleLogout() {
  auth.logout()
  $q.notify({ type: 'info', message: 'Sessão terminada.' })
  router.push({ name: 'login' })
}
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 84px;
}
.object-cover {
  object-fit: cover;
}
</style>
