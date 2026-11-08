<template>
  <q-page padding class="q-pb-xl">
    <!-- Header Banner -->
    <q-card flat class="gradient-purple text-white q-pa-xl text-center q-mb-lg shadow-2" style="border-radius: 20px;">
      <div class="text-h4 text-weight-bolder" style="letter-spacing: -0.5px;">Centro de Ajuda & Suporte</div>
      <div class="text-subtitle1 text-lavender q-mt-xs q-mb-lg">
        Como podemos ajudar-te na tua jornada colaborativa no MEET-US?
      </div>
      <div class="row justify-center">
        <q-input
          v-model="faqSearch"
          placeholder="Pesquisar por dúvidas, regras ou tutoriais..."
          dense
          outlined
          bg-color="white"
          style="width: 500px; max-width: 90vw; border-radius: 25px;"
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </q-card>

    <!-- Secções de Tópicos Principais -->
    <div class="text-h6 text-weight-bolder text-dark q-mb-md">Explorar por Tópico</div>
    <div class="row q-col-gutter-md q-mb-xl">
      <div
        v-for="topic in topicCategories"
        :key="topic.title"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat class="q-pa-md hover-lift full-height cursor-pointer" @click="selectedTopic = topic.id">
          <div class="row items-center q-mb-sm">
            <q-avatar size="44px" :color="topic.bg" :text-color="topic.color" class="q-mr-sm">
              <q-icon :name="topic.icon" />
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold text-dark">{{ topic.title }}</div>
          </div>
          <div class="text-caption text-grey-7">{{ topic.desc }}</div>
        </q-card>
      </div>
    </div>

    <!-- Perguntas Frequentes (FAQs) com Accordion -->
    <div class="text-h6 text-weight-bolder text-dark q-mb-md">Perguntas Frequentes (FAQs)</div>
    <q-card flat class="q-pa-md">
      <q-list separator>
        <q-expansion-item
          v-for="(faq, idx) in filteredFaqs"
          :key="idx"
          group="faqs"
          :icon="faq.icon || 'help'"
          :label="faq.question"
          header-class="text-weight-bold text-dark"
        >
          <q-card class="bg-soft-lavender q-pa-md">
            <div class="text-body2 text-grey-9 leading-relaxed">
              {{ faq.answer }}
            </div>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card>

    <!-- Caixa de Contacto com Suporte -->
    <q-card flat class="q-pa-lg q-mt-lg text-center bg-soft-lavender" style="border-radius: 18px;">
      <div class="text-subtitle1 text-weight-bold text-dark">Ainda precisas de assistência?</div>
      <div class="text-caption text-grey-7 q-mb-md">
        A equipa de suporte do MEET-US está disponível para resolver questões de contas e segurança.
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="mail"
        label="Contactar Suporte Académico"
        @click="$q.notify({ type: 'info', message: 'Mensagem de contacto enviada ao suporte: suporte@meetus.mz' })"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const faqSearch = ref('')
const selectedTopic = ref('all')

const topicCategories = [
  { id: 'start', title: 'Getting Started', desc: 'Primeiros passos, criação de conta e personalização do perfil', icon: 'rocket_launch', bg: 'soft-lavender', color: 'primary' },
  { id: 'partners', title: 'Finding Study Partners', desc: 'Como funciona o algoritmo de matching e pesquisa por curso', icon: 'person_search', bg: 'lavender', color: 'secondary' },
  { id: 'skills', title: 'Managing Skills', desc: 'Cadastrar competências que ensina e que quer aprender', icon: 'auto_stories', bg: 'amber-1', color: 'amber-9' },
  { id: 'exchanges', title: 'Creating Exchanges', desc: 'Como criar propostas, agendar datas e negociar horários', icon: 'swap_horiz', bg: 'green-1', color: 'positive' },
  { id: 'sessions', title: 'Managing Sessions', desc: 'Uso da sala de vídeo, gravação de notas e avaliação mútua', icon: 'video_camera_front', bg: 'blue-1', color: 'info' },
  { id: 'privacy', title: 'Account & Privacy', desc: 'Segurança dos teus dados e visibilidade académica', icon: 'lock', bg: 'purple-1', color: 'deep-purple' }
]

const faqs = [
  {
    question: 'A utilização do MEET-US tem algum custo financeiro?',
    answer: 'Não. O MEET-US é 100% gratuito e baseado no modelo peer-to-peer de partilha de conhecimento universitário. É estritamente proibido cobrar dinheiro pelas mentorias ou trocas na plataforma.',
    icon: 'money_off'
  },
  {
    question: 'Como funciona o cálculo de compatibilidade (Score)?',
    answer: 'O algoritmo cruza as competências que tu procuras com as que o outro estudante ensina (e vice-versa), adicionando pontos para mesma universidade, interesses em comum e reputação positiva na comunidade.',
    icon: 'calculate'
  },
  {
    question: 'Posso realizar trocas presenciais na minha faculdade?',
    answer: 'Sim! Ao criar o pedido de troca podes selecionar a modalidade "Presencial no Campus" e combinar um ponto de encontro seguro, como a biblioteca ou centro de estudo da tua universidade.',
    icon: 'location_on'
  },
  {
    question: 'Como posso obter o selo de Estudante Verificado?',
    answer: 'Para ser verificado, deves ter o teu e-mail institucional confirmado e realizar pelo menos 3 sessões de troca bem avaliadas.',
    icon: 'verified'
  },
  {
    question: 'O que acontece se o meu parceiro faltar à sessão agendada?',
    answer: 'Podes reagendar a sessão nos detalhes do pedido de troca ou cancelá-la. Em caso de reincidência, podes reportar o utilizador para que a moderação analise a conta.',
    icon: 'event_busy'
  }
]

const filteredFaqs = computed(() => {
  if (!faqSearch.value.trim()) return faqs
  const q = faqSearch.value.toLowerCase()
  return faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
})
</script>
