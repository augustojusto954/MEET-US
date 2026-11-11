<template>
  <q-layout view="lHh Lpr lFf" class="bg-app">
    <!-- Admin Header -->
    <q-header elevated class="bg-white text-dark q-py-xs" style="border-bottom: 1px solid #E2E8F0;">
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="grey-8"
          class="lt-md q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <div class="row items-center q-mr-lg">
          <q-badge style="background: #059669; color: white;" class="q-px-sm q-py-xs text-weight-bolder">
            PORTAL ADMIN
          </q-badge>
        </div>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <!-- Voltar ao Portal do Estudante -->
          <q-btn
            outline
            rounded
            color="primary"
            icon="arrow_back"
            label="Ver como Estudante"
            class="text-weight-bold"
            no-caps
            :to="{ name: 'dashboard' }"
          />

          <!-- Notificação de Alertas / Denúncias -->
          <q-btn flat round dense icon="report_problem" color="warning" :to="{ name: 'admin-reports' }">
            <q-badge color="negative" floating rounded>2</q-badge>
            <q-tooltip>Denúncias Pendentes</q-tooltip>
          </q-btn>

          <!-- Admin Profile -->
          <q-btn-dropdown flat no-caps dense class="q-px-sm" style="background: #ECFDF5; color: #059669; border-radius: 8px;">
            <template #label>
              <div class="row items-center no-wrap">
                <q-avatar size="28px" class="shadow-1 q-mr-xs">
                  <img :src="adminAvatar" />
                </q-avatar>
                <span class="text-weight-bold text-dark ellipsis" style="max-width: 140px;">{{ auth.user?.name || 'Admin Central' }}</span>
                <q-badge color="primary" class="q-ml-xs text-caption">ADMIN</q-badge>
              </div>
            </template>
            <q-list dense style="min-width: 200px;">
              <q-item clickable v-close-popup :to="{ name: 'admin-profile' }">
                <q-item-section avatar><q-icon name="badge" color="primary" /></q-item-section>
                <q-item-section>Perfil do Administrador</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup :to="{ name: 'dashboard' }">
                <q-item-section avatar><q-icon name="school" color="primary" /></q-item-section>
                <q-item-section>Portal do Estudante</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout" class="text-negative">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section class="text-weight-bold">Terminar Sessão</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Admin Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      class="meetus-sidebar column justify-between"
    >
      <div>
        <!-- Brand Header -->
        <!-- Brand Header com Logótipo Oficial -->
        <div class="q-pa-md row items-center justify-between">
          <img src="/icons/meet-us-logo.png" style="height: 42px; max-width: 170px; object-fit: contain;" alt="MEET-US" />
          <q-badge color="primary" class="text-weight-bold" style="font-size: 10px;">Admin</q-badge>
        </div>

        <q-separator style="background: #E2E8F0;" class="q-mx-md q-mb-xs" />

        <!-- Admin Links -->
        <q-scroll-area style="height: calc(100vh - 150px);">
          <div class="sidebar-section-title">PAINEL & ANALYTICS</div>
          <q-item
            v-for="item in navSection1"
            :key="item.to"
            clickable
            v-ripple
            :to="{ name: item.to }"
            class="sidebar-item"
            active-class="active-item"
          >
            <q-item-section avatar><q-icon :name="item.icon" size="20px" /></q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>

          <div class="sidebar-section-title q-mt-sm">ACADÉMICO & UTILIZADORES</div>
          <q-item
            v-for="item in navSection2"
            :key="item.to"
            clickable
            v-ripple
            :to="{ name: item.to }"
            class="sidebar-item"
            active-class="active-item"
          >
            <q-item-section avatar><q-icon :name="item.icon" size="20px" /></q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>

          <div class="sidebar-section-title q-mt-sm">MODERAÇÃO & AUDITORIA</div>
          <q-item
            v-for="item in navSection3"
            :key="item.to"
            clickable
            v-ripple
            :to="{ name: item.to }"
            class="sidebar-item"
            active-class="active-item"
          >
            <q-item-section avatar><q-icon :name="item.icon" size="20px" /></q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
            <q-item-section side v-if="item.badge">
              <q-badge color="negative" text-color="white" rounded>{{ item.badge }}</q-badge>
            </q-item-section>
          </q-item>

          <div class="sidebar-section-title q-mt-sm">SISTEMA</div>
          <q-item
            v-for="item in navSection4"
            :key="item.to"
            clickable
            v-ripple
            :to="{ name: item.to }"
            class="sidebar-item"
            active-class="active-item"
          >
            <q-item-section avatar><q-icon :name="item.icon" size="20px" /></q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>

          <div class="q-py-md"></div>
        </q-scroll-area>
      </div>

      <div class="q-pa-sm" style="border-top: 1px solid rgba(140, 133, 244, 0.15);">
        <q-btn
          flat
          dense
          class="full-width text-light-purple"
          icon="keyboard_return"
          label="Sair para Estudante"
          :to="{ name: 'dashboard' }"
        />
      </div>
    </q-drawer>

    <!-- Admin Page Container -->
    <q-page-container class="bg-app">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const leftDrawerOpen = ref(true)

const adminAvatar = computed(() => {
  if (auth.user?.avatar && auth.user.avatar.trim()) {
    const av = auth.user.avatar.trim()
    if (av.startsWith('/uploads')) {
      if (typeof window !== 'undefined' && window.location.port && window.location.port !== '3000' && window.location.port !== '80' && window.location.port !== '443') {
        return `${window.location.protocol}//${window.location.hostname}:3000${av}`
      }
    }
    return av
  }
  const name = auth.user?.name || 'Administrador Central'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=ffffff&size=256&bold=true`
})

onMounted(() => {
  if (!auth.isAdmin) {
    $q.notify({
      type: 'negative',
      message: 'Acesso restrito. Apenas o administrador oficial do MEET-US tem permissão para aceder a esta área.',
      icon: 'lock'
    })
    router.replace({ name: 'dashboard' })
  }
})

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

const navSection1 = [
  { to: 'admin-overview', label: 'Admin Overview', icon: 'dashboard' },
  { to: 'admin-analytics', label: 'Platform Analytics', icon: 'insights' }
]

const navSection2 = [
  { to: 'admin-students', label: 'Student Management', icon: 'school' },
  { to: 'admin-universities', label: 'University Management', icon: 'account_balance' },
  { to: 'admin-faculties', label: 'Faculty Management', icon: 'domain' },
  { to: 'admin-courses', label: 'Course Management', icon: 'menu_book' },
  { to: 'admin-categories', label: 'Skill Categories', icon: 'category' }
]

const navSection3 = [
  { to: 'admin-moderation', label: 'Community Moderation', icon: 'gavel' },
  { to: 'admin-reports', label: 'Reports Management', icon: 'flag', badge: 2 },
  { to: 'admin-reviews', label: 'Reviews Management', icon: 'rate_review' }
]

const navSection4 = [
  { to: 'admin-profile', label: 'Admin Profile', icon: 'badge' },
  { to: 'admin-settings', label: 'Admin Settings', icon: 'tune' }
]
</script>
