<template>
  <q-page padding class="q-pb-xl bg-app">
    <!-- Header com Título e Seletor de Telas -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="row items-center q-gutter-sm">
          <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" />
          <div>
            <div class="text-h5 text-weight-bolder text-dark">
              Telas de Referência do Sistema
            </div>
            <div class="text-caption text-grey-7">
              Utiliza as imagens oficiais do MEET-US como páginas clicáveis e navega diretamente para os fluxos reais do sistema.
            </div>
          </div>
        </div>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn
          outline
          rounded
          color="primary"
          icon="home"
          label="Ir para Home"
          :to="{ name: 'home' }"
        />
        <q-btn
          unelevated
          rounded
          color="primary"
          text-color="white"
          class="shadow-2"
          icon="launch"
          :label="currentScreen.actionLabel"
          :to="currentScreen.route"
        />
      </div>
    </div>

    <!-- Navegação de Abas entre as Telas de Design -->
    <q-card flat class="q-pa-xs q-mb-lg bg-white shadow-1" style="border-radius: 16px;">
      <q-tabs
        v-model="activeTab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        class="text-grey-7"
      >
        <q-tab name="principal" icon="web" label="1. Imagem Principal (Home)" />
        <q-tab name="login" icon="login" label="2. Tela de Login (3paginaLogin.webp)" />
        <q-tab name="dashboard" icon="dashboard" label="3. Tela Dashboard (2.webp)" />
        <q-tab name="descobrir" icon="explore" label="4. Descobrir Estudantes (3.webp)" />
      </q-tabs>
    </q-card>

    <!-- Visualizador Interativo da Tela Selecionada -->
    <div class="row q-col-gutter-lg">
      <!-- Coluna Principal: Imagem com Hotspots Clicáveis -->
      <div class="col-12 col-lg-9">
        <q-card flat class="bg-white q-pa-md shadow-2" style="border-radius: 20px;">
          <div class="row items-center justify-between q-mb-md">
            <div class="row items-center">
              <q-badge style="background: #ECFDF5; color: #059669;" class="q-px-sm q-py-xs text-weight-bold q-mr-sm">
                {{ currentScreen.badge }}
              </q-badge>
              <span class="text-subtitle1 text-weight-bold text-dark">{{ currentScreen.title }}</span>
            </div>

            <div class="row items-center q-gutter-xs">
              <q-toggle
                v-model="showHotspots"
                label="Mostrar Áreas Clicáveis"
                color="primary"
                dense
              />
              <q-btn
                flat
                round
                dense
                icon="fullscreen"
                color="grey-7"
                @click="openFullscreen"
              >
                <q-tooltip>Ver em Ecrã Inteiro</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Container da Imagem com Hotspots Sobrepostos -->
          <div class="image-hotspot-container relative-position overflow-hidden rounded-borders border-subtle">
            <img
              :src="currentScreen.image"
              :alt="currentScreen.title"
              class="full-width display-block design-image"
            />

            <!-- Áreas Clicáveis Dinâmicas sobre a Imagem -->
            <template v-if="showHotspots">
              <div
                v-for="(spot, idx) in currentScreen.hotspots"
                :key="idx"
                class="clickable-hotspot cursor-pointer"
                :style="spot.style"
                @click="handleHotspotClick(spot)"
              >
                <div class="hotspot-pulse"></div>
                <div class="hotspot-badge shadow-2">
                  <q-icon :name="spot.icon || 'touch_app'" size="14px" class="q-mr-xs" />
                  {{ spot.label }}
                </div>
              </div>
            </template>
          </div>
        </q-card>
      </div>

      <!-- Coluna Lateral: Guia de Ações e Navegação Direta -->
      <div class="col-12 col-lg-3">
        <!-- Cartão de Ação Rápida -->
        <q-card flat class="q-pa-md q-mb-md gradient-emerald text-white shadow-2" style="border-radius: 18px;">
          <div class="text-subtitle1 text-weight-bolder">{{ currentScreen.title }}</div>
          <p class="text-caption text-lavender q-mt-xs">
            {{ currentScreen.description }}
          </p>
          <q-btn
            unelevated
            color="white"
            text-color="primary"
            class="full-width text-weight-bold q-mt-sm"
            icon="open_in_browser"
            :label="currentScreen.actionLabel"
            :to="currentScreen.route"
          />
        </q-card>

        <!-- Lista de Atalhos Clicáveis da Tela -->
        <q-card flat class="bg-white q-pa-md shadow-1" style="border-radius: 18px;">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm row items-center">
            <q-icon name="ads_click" color="primary" size="20px" class="q-mr-xs" />
            Interações Clicáveis nesta Tela
          </div>

          <q-list separator dense>
            <q-item
              v-for="(spot, idx) in currentScreen.hotspots"
              :key="idx"
              clickable
              v-ripple
              class="rounded-borders q-my-xs q-py-sm"
              @click="handleHotspotClick(spot)"
            >
              <q-item-section avatar>
                <q-avatar size="32px" color="soft-lavender" text-color="primary" :icon="spot.icon || 'arrow_forward'" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-caption">{{ spot.label }}</q-item-label>
                <q-item-label caption class="text-grey-6">{{ spot.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey-5" size="18px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Informações do Design System -->
        <q-card flat class="bg-white q-pa-md q-mt-md shadow-1" style="border-radius: 18px;">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">
            Especificações de Design
          </div>
          <div class="text-caption text-grey-7 q-mb-sm">
            Fidelidade 100% aos arquivos e pastas fornecidas do MEET-US:
          </div>
          <div class="column q-gutter-xs text-caption">
            <div class="row justify-between">
              <span class="text-grey-7">Ficheiro de Origem:</span>
              <span class="text-weight-bold text-primary">{{ currentScreen.fileOrigin }}</span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Cores Principais:</span>
              <span class="text-weight-bold text-dark">Roxo #211B50 & Índigo #5B55D6</span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Tipografia:</span>
              <span class="text-weight-bold text-dark">Poppins & Inter</span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Público-Alvo:</span>
              <span class="text-weight-bold text-emerald-700">🇲🇿 Moçambique</span>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const activeTab = ref('principal')
const showHotspots = ref(false)

const screensData = {
  principal: {
    title: 'Imagem Principal — Vitrine Universitária',
    badge: 'Home & Apresentação',
    fileOrigin: 'stitch/screen.png & code.html',
    image: '/designs/principal.png',
    route: { name: 'home' },
    actionLabel: 'Abrir Página Home Interativa',
    description: 'A página de entrada da plataforma MEET-US com o lema "Ensina o que dominas. Aprende o que precisas", estatísticas de Moçambique e compatibilidade.',
    hotspots: [
      {
        label: 'Botão Entrar',
        description: 'Leva ao formulário de autenticação académica',
        icon: 'login',
        route: { name: 'login' },
        style: { top: '2.5%', right: '9%', width: '70px', height: '32px' }
      },
      {
        label: 'Cria Conta',
        description: 'Leva ao registo universitário moçambicano',
        icon: 'person_add',
        route: { name: 'register' },
        style: { top: '2.5%', right: '2%', width: '90px', height: '32px' }
      },
      {
        label: 'Começar Agora',
        description: 'Iniciar jornada de aprendizagem colaborativa',
        icon: 'rocket_launch',
        route: { name: 'register' },
        style: { top: '15%', left: '8%', width: '130px', height: '42px' }
      },
      {
        label: 'Cartão Amália 94%',
        description: 'Ver detalhes de compatibilidade e mentoria',
        icon: 'favorite',
        route: { name: 'matching-details', params: { id: '2' } },
        style: { top: '13%', right: '7%', width: '280px', height: '80px' }
      },
      {
        label: 'Competências Populares',
        description: 'Explorar competências e matérias populares',
        icon: 'category',
        route: { name: 'skills' },
        style: { top: '48%', left: '10%', width: '80%', height: '70px' }
      },
      {
        label: 'Estudantes em Destaque',
        description: 'Descobrir estudantes de Maputo, Beira e Nampula',
        icon: 'groups',
        route: { name: 'students' },
        style: { top: '65%', left: '10%', width: '80%', height: '120px' }
      }
    ]
  },
  login: {
    title: 'Tela de Login Oficial — MEET-US (3paginaLogin.webp)',
    badge: 'Referência 3paginaLogin.webp',
    fileOrigin: '3paginaLogin.webp',
    image: '/designs/3paginaLogin.webp',
    route: { name: 'login' },
    actionLabel: 'Abrir Tela de Login Funcional',
    description: 'Design oficial da tela de login com cartão flutuante "Bem-vindo de volta", credenciais académicas e fotografia de estudantes universitários em colaboração.',
    hotspots: [
      {
        label: 'MEET-US (Home)',
        description: 'Voltar à página inicial do sistema',
        icon: 'home',
        route: { name: 'home' },
        style: { top: '3.5%', left: '2.5%', width: '16%', height: '9%' }
      },
      {
        label: 'Bem-vindo de volta',
        description: 'Entrar na conta para continuar a aprender e colaborar',
        icon: 'badge',
        route: { name: 'login' },
        style: { top: '20%', left: '8%', width: '38%', height: '14%' }
      },
      {
        label: 'Campo Email',
        description: 'Inserir o seu email',
        icon: 'mail',
        route: { name: 'login' },
        style: { top: '38.5%', left: '10%', width: '34%', height: '7%' }
      },
      {
        label: 'Campo Palavra-passe',
        description: 'Inserir a sua palavra-passe',
        icon: 'lock',
        route: { name: 'login' },
        style: { top: '51.5%', left: '10%', width: '34%', height: '7%' }
      },
      {
        label: 'Esqueceste a palavra-passe?',
        description: 'Recuperar o acesso à tua conta',
        icon: 'help',
        route: { name: 'forgot' },
        style: { top: '60.5%', left: '10%', width: '22%', height: '4%' }
      },
      {
        label: 'Botão Entrar',
        description: 'Submeter credenciais e aceder ao Dashboard',
        icon: 'login',
        route: { name: 'login' },
        style: { top: '66.5%', left: '10%', width: '34%', height: '7%' }
      },
      {
        label: 'Criar Conta',
        description: 'Ainda não tem conta? Criar nova conta universitária',
        icon: 'person_add',
        route: { name: 'register' },
        style: { top: '76.5%', left: '17%', width: '22%', height: '4%' }
      },
      {
        label: 'Estudantes Universitários',
        description: 'Rede colaborativa de estudantes de Moçambique',
        icon: 'groups',
        route: { name: 'students' },
        style: { top: '24%', left: '48%', width: '50%', height: '68%' }
      }
    ]
  },
  dashboard: {
    title: 'Tela 2 — Dashboard do Estudante',
    badge: 'Referência 2.webp',
    fileOrigin: '2.webp',
    image: '/designs/2.webp',
    route: { name: 'dashboard' },
    actionLabel: 'Abrir Dashboard Funcional',
    description: 'Painel central do estudante com métricas, sessões agendadas, pedidos de troca e sugestões de matching.',
    hotspots: [
      {
        label: 'Menu Lateral (Sidebar)',
        description: 'Navegar entre módulos do MEET-US',
        icon: 'menu',
        route: { name: 'dashboard' },
        style: { top: '0%', left: '0%', width: '18%', height: '100%' }
      },
      {
        label: 'Botão Descobrir',
        description: 'Buscar estudantes e parceiros de estudo',
        icon: 'explore',
        route: { name: 'students' },
        style: { top: '8%', left: '60%', width: '12%', height: '38px' }
      },
      {
        label: 'Botão Matching',
        description: 'Ver afinidade e compatibilidade inteligente',
        icon: 'favorite',
        route: { name: 'matching' },
        style: { top: '8%', left: '73%', width: '12%', height: '38px' }
      },
      {
        label: 'Próximas Sessões',
        description: 'Consultar sessões agendadas e salas virtuais',
        icon: 'event',
        route: { name: 'calendar' },
        style: { top: '38%', left: '21%', width: '45%', height: '140px' }
      },
      {
        label: 'Compatibilidade em Destaque',
        description: 'Ver estudantes recomendados com alto match',
        icon: 'bolt',
        route: { name: 'matching' },
        style: { top: '62%', left: '21%', width: '45%', height: '140px' }
      },
      {
        label: 'Mensagens Recentes',
        description: 'Abrir conversas e chat em tempo real',
        icon: 'chat',
        route: { name: 'chat' },
        style: { top: '38%', right: '3%', width: '28%', height: '140px' }
      }
    ]
  },
  descobrir: {
    title: 'Tela 3 — Descobrir Estudantes',
    badge: 'Referência 3.webp',
    fileOrigin: '3.webp',
    image: '/designs/3.webp',
    route: { name: 'students' },
    actionLabel: 'Abrir Pesquisa de Estudantes Real',
    description: 'Diretório completo de estudantes universitários de Moçambique com filtros por universidade, curso, nível e compatibilidade.',
    hotspots: [
      {
        label: 'Barra de Pesquisa',
        description: 'Filtrar por nome, universidade ou competência',
        icon: 'search',
        route: { name: 'students' },
        style: { top: '7%', left: '21%', width: '40%', height: '40px' }
      },
      {
        label: 'Filtros Avançados',
        description: 'Selecionar UEM, UP, ISCTEM, UniSave...',
        icon: 'tune',
        route: { name: 'students' },
        style: { top: '13%', left: '21%', width: '75%', height: '45px' }
      },
      {
        label: 'Cartão de Estudante (Propor Troca)',
        description: 'Abrir fluxo de criação de troca em 6 etapas',
        icon: 'swap_horiz',
        route: { name: 'exchange-create' },
        style: { top: '25%', left: '21%', width: '24%', height: '220px' }
      },
      {
        label: 'Perfil do Estudante',
        description: 'Ver competências que ensina e quer aprender',
        icon: 'person',
        route: { name: 'students' },
        style: { top: '25%', left: '46%', width: '24%', height: '220px' }
      }
    ]
  }
}

const currentScreen = computed(() => {
  return screensData[activeTab.value] || screensData.principal
})

function handleHotspotClick(spot) {
  if (spot.route) {
    $q.notify({
      type: 'info',
      message: `A navegar para: ${spot.label}`,
      caption: spot.description,
      icon: spot.icon || 'launch',
      timeout: 1000
    })
    router.push(spot.route)
  }
}

function openFullscreen() {
  const elem = document.querySelector('.image-hotspot-container')
  if (elem) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      elem.requestFullscreen().catch(err => {
        console.warn('Erro ao abrir tela cheia:', err)
      })
    }
  }
}
</script>

<style scoped>
.image-hotspot-container {
  background-color: #F8FAFC;
  min-height: 500px;
  position: relative;
}

.design-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.border-subtle {
  border: 1px solid #E2E8F0;
}

.clickable-hotspot {
  position: absolute;
  border: 2px dashed rgba(91, 85, 214, 0.85);
  background-color: rgba(91, 85, 214, 0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  z-index: 10;
}

.clickable-hotspot:hover {
  background-color: rgba(91, 85, 214, 0.28);
  border-color: #5B55D6;
  border-style: solid;
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(91, 85, 214, 0.4);
}

.hotspot-badge {
  background: #5B55D6;
  color: #FFFFFF;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
  white-space: nowrap;
}

.clickable-hotspot:hover .hotspot-badge {
  background: #211B50;
  transform: scale(1.05);
}

.hotspot-pulse {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #EC4899;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
  70% { transform: scale(1.2); box-shadow: 0 0 0 8px rgba(236, 72, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
}
</style>
