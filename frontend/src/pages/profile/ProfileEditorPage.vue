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
                  :options="['Universidade Eduardo Mondlane', 'Universidade Pedagógica', 'ISCTEM', 'Universidade Save', 'A Politécnica']"
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
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-6">
                <q-input v-model="form.avatar" label="URL da Foto de Perfil" outlined dense />
                <div class="text-caption text-grey-6 q-mt-xs">Insira um link direto de imagem (ex: Unsplash / Pravatar)</div>
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="form.cover" label="URL da Imagem de Capa" outlined dense />
                <div class="text-caption text-grey-6 q-mt-xs">Imagem de cabeçalho do perfil</div>
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
              label="Interesses (separados por vírgula)"
              outlined
              dense
              placeholder="Ex: Tecnologia, Robótica, Xadrez, Fotografia, Literatura"
            />
          </q-card>
        </div>
      </div>

      <!-- Coluna Lateral: Pré-Visualização em Tempo Real -->
      <div class="col-12 col-lg-4">
        <div class="sticky-preview">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Pré-Visualização em Direto</div>
          <q-card flat class="overflow-hidden shadow-2" style="border-radius: 18px;">
            <div style="height: 120px;">
              <img :src="form.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop'" class="full-width full-height object-cover" />
            </div>
            <div class="q-pa-md text-center" style="margin-top: -45px;">
              <q-avatar size="80px" class="border-white shadow-2" style="border: 3px solid #FFF;">
                <img :src="form.avatar || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces'" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const store = useMeetUsStore()
const auth = useAuthStore()

const form = ref({
  name: store.currentUser.name,
  email: store.currentUser.email,
  city: store.currentUser.city || 'Maputo',
  institution: store.currentUser.institution,
  course: store.currentUser.course,
  year: store.currentUser.year || 3,
  avatar: store.currentUser.avatar,
  cover: store.currentUser.cover || '',
  bio: store.currentUser.bio,
  availability: store.currentUser.availability
})

const interestsString = ref((store.currentUser.interests || []).join(', '))

function saveProfile() {
  const interests = interestsString.value
    ? interestsString.value.split(',').map(s => s.trim()).filter(Boolean)
    : store.currentUser.interests

  store.updateCurrentUser({
    ...form.value,
    interests
  })

  $q.notify({
    type: 'positive',
    message: 'Perfil atualizado com sucesso!',
    position: 'top-right'
  })

  router.push({ name: 'profile' })
}

function handleLogout() {
  $q.dialog({
    title: 'Terminar Sessão',
    message: 'Tens a certeza de que desejas sair da tua conta MEET-US?',
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-7'
    },
    ok: {
      unelevated: true,
      label: 'Sim, Terminar Sessão',
      color: 'negative'
    },
    persistent: false
  }).onOk(() => {
    auth.logout()
    $q.notify({
      type: 'info',
      message: 'Sessão terminada com sucesso.',
      icon: 'logout'
    })
    router.push({ name: 'login' })
  })
}
</script>

<style scoped>
.sticky-preview {
  position: sticky;
  top: 90px;
}
</style>
