<template>
  <div class="landing-page bg-slate-50 text-slate-800 antialiased">
    <!-- Header -->
    <header class="sticky-header">
      <div class="landing-container header-inner">
        <!-- Logo -->
        <div class="row items-center q-gutter-sm">
          <router-link to="/" class="logo-text">MEET-US</router-link>
          <span class="mz-badge">🇲🇿 Moçambique</span>
        </div>

        <!-- Navigation Links -->
        <nav class="gt-sm nav-links">
          <a href="#como-funciona" class="nav-link">Como funciona</a>
          <a href="#competencias" class="nav-link">Competências</a>
          <a href="#comunidade" class="nav-link">Comunidade</a>
          <a href="#sobre" class="nav-link">Sobre</a>
        </nav>

        <!-- Action Buttons -->
        <div class="row items-center q-gutter-xs q-gutter-sm-sm">
          <template v-if="auth.isAuthenticated">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Ir para o Dashboard"
              icon-right="arrow_forward"
              :to="auth.user?.role === 'admin' ? { name: 'admin-overview' } : { name: 'dashboard' }"
              class="text-weight-bold shadow-1"
              no-caps
            />
          </template>
          <template v-else>
            <q-btn
              flat
              no-caps
              label="Entrar"
              :to="{ name: 'login' }"
              class="text-weight-bold btn-login"
            />
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Cria conta"
              :to="{ name: 'register' }"
              class="text-weight-bold btn-signup shadow-2 gt-xs"
            />
          </template>
          <!-- Mobile Hamburger Toggle -->
          <q-btn
            flat
            round
            dense
            icon="menu"
            color="grey-8"
            class="lt-md q-ml-xs"
            @click="mobileNavOpen = true"
          />
        </div>
      </div>

      <!-- Mobile Navigation Drawer / Dialog -->
      <q-dialog v-model="mobileNavOpen" position="top">
        <q-card class="full-width q-pa-md shadow-5" style="border-radius: 0 0 16px 16px;">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-weight-bolder text-h6" style="color: #059669;">MEET-US</div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
          <q-list separator>
            <q-item clickable v-close-popup href="#como-funciona">
              <q-item-section avatar><q-icon name="help_outline" color="primary" /></q-item-section>
              <q-item-section>Como funciona</q-item-section>
            </q-item>
            <q-item clickable v-close-popup href="#competencias">
              <q-item-section avatar><q-icon name="stars" color="primary" /></q-item-section>
              <q-item-section>Competências</q-item-section>
            </q-item>
            <q-item clickable v-close-popup href="#comunidade">
              <q-item-section avatar><q-icon name="groups" color="primary" /></q-item-section>
              <q-item-section>Comunidade</q-item-section>
            </q-item>
            <q-item clickable v-close-popup href="#sobre">
              <q-item-section avatar><q-icon name="info" color="primary" /></q-item-section>
              <q-item-section>Sobre</q-item-section>
            </q-item>
          </q-list>
          <div class="row q-gutter-sm q-mt-md">
            <template v-if="auth.isAuthenticated">
              <q-btn
                unelevated
                color="primary"
                label="Abrir Meu Painel"
                icon-right="arrow_forward"
                :to="auth.user?.role === 'admin' ? { name: 'admin-overview' } : { name: 'dashboard' }"
                class="full-width text-weight-bold"
                no-caps
                v-close-popup
              />
            </template>
            <template v-else>
              <q-btn
                outline
                color="primary"
                label="Entrar"
                :to="{ name: 'login' }"
                class="col text-weight-bold"
                no-caps
                v-close-popup
              />
              <q-btn
                unelevated
                color="primary"
                label="Cria Conta"
                :to="{ name: 'register' }"
                class="col text-weight-bold"
                no-caps
                v-close-popup
              />
            </template>
          </div>
        </q-card>
      </q-dialog>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="landing-container">
          <div class="row q-col-gutter-xl items-center">
            <!-- Left Text Content -->
            <div class="col-12 col-md-6 text-left">
              <span class="hero-tag">
                Liga-te. Partilha. Aprende.
              </span>
              <h1 class="hero-title q-mt-md">
                Ensina o que dominas. <br class="gt-xs" />
                <span class="text-primary">Aprende o que precisas.</span>
              </h1>
              <p class="hero-subtitle q-mt-md">
                A plataforma onde estudantes universitários de Moçambique partilham conhecimento, encontram parceiros de estudo e crescem juntos.
              </p>
              <div class="row items-center q-gutter-md q-mt-lg">
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  label="Começar agora"
                  size="lg"
                  :to="{ name: 'register' }"
                  class="text-weight-bold shadow-3"
                  style="border-radius: 12px; padding: 12px 28px;"
                />
                <q-btn
                  outline
                  no-caps
                  color="grey-8"
                  label="Ver como funciona"
                  size="lg"
                  href="#como-funciona"
                  class="text-weight-medium bg-white"
                  style="border-radius: 12px; padding: 12px 24px; border: 1px solid #E2E8F0;"
                />
              </div>
            </div>

            <!-- Right Visual: Fotografia Oficial dos Estudantes (Sem bordas, Não flutuante, Grande) -->
            <div class="col-12 col-md-6 flex flex-center">
              <div class="hero-image-container">
                <img
                  src="/images/login-students.webp"
                  alt="Estudantes universitários de Moçambique a colaborar - MEET-US"
                  class="hero-students-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section class="stats-bar">
        <div class="landing-container">
          <div class="row q-col-gutter-lg text-center">
            <div class="col-6 col-md-3">
              <div class="stat-number">+5.000</div>
              <div class="stat-label">estudantes</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-number">12</div>
              <div class="stat-label">universidades</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-number">+300</div>
              <div class="stat-label">competências</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="stat-number">+10.000</div>
              <div class="stat-label">sessões realizadas</div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="como-funciona" class="section-padding bg-white">
        <div class="landing-container">
          <div class="text-center section-header">
            <h2 class="section-title">Como funciona</h2>
            <p class="section-desc">Três passos simples para começares a evoluir academicamente com colegas da tua universidade.</p>
          </div>

          <div class="row q-col-gutter-lg q-mt-md">
            <div class="col-12 col-md-4">
              <div class="step-card">
                <div class="step-badge">01</div>
                <h3 class="step-title">Cria o teu perfil</h3>
                <p class="step-text">Diz-nos quem és, o que sabes ensinar e o que queres aprender. Personaliza o teu perfil académico.</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="step-card">
                <div class="step-badge">02</div>
                <h3 class="step-title">Encontra a tua compatibilidade</h3>
                <p class="step-text">Descobre estudantes com competências e horários compatíveis contigo através do nosso algoritmo inteligente.</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="step-card">
                <div class="step-badge">03</div>
                <h3 class="step-title">Agenda a tua sessão</h3>
                <p class="step-text">Combina o melhor horário e começa a aprender ou a ensinar juntos num ambiente colaborativo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Popular Skills Section -->
      <section id="competencias" class="section-padding bg-slate-50 border-y">
        <div class="landing-container text-center">
          <h2 class="section-title">Competências populares</h2>
          <div class="row justify-center q-gutter-sm q-mt-lg">
            <span
              v-for="skill in popularSkills"
              :key="skill"
              class="skill-pill cursor-pointer"
              @click="$router.push({ name: 'students', query: { q: skill } })"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </section>

      <!-- Featured Students Section -->
      <section id="comunidade" class="section-padding bg-white">
        <div class="landing-container">
          <div class="text-center section-header">
            <h2 class="section-title">Estudantes em destaque</h2>
            <p class="section-desc">Conhece alguns dos mentores mais ativos e bem avaliados da nossa comunidade.</p>
          </div>

          <div class="row q-col-gutter-lg q-mt-md">
            <div v-for="s in featuredStudents" :key="s.name" class="col-12 col-md-4">
              <div class="featured-student-card shadow-1 cursor-pointer" @click="$router.push({ name: 'students' })">
                <div class="row items-center q-gutter-md q-mb-md">
                  <q-avatar size="60px" class="shadow-1">
                    <img :src="s.avatar" :alt="s.name" />
                  </q-avatar>
                  <div>
                    <h3 class="text-subtitle1 text-weight-bolder text-dark">{{ s.name }}</h3>
                    <p class="text-caption text-grey-7" style="margin: 0;">{{ s.course }}</p>
                    <p class="text-caption text-grey-5" style="margin: 0;">{{ s.city }}</p>
                  </div>
                </div>
                <div class="row items-center justify-between q-pt-md" style="border-top: 1px solid #F1F5F9;">
                  <span class="compat-tag">{{ s.compat }} compatível</span>
                  <div class="row items-center text-weight-bold text-dark">
                    <q-icon name="star" color="amber-8" size="16px" class="q-mr-xs" /> {{ s.rating }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="sobre" class="section-padding bg-slate-50 border-t">
        <div class="landing-container">
          <div class="text-center section-header">
            <h2 class="section-title">O que dizem os estudantes</h2>
            <p class="section-desc">Histórias reais de quem transformou a sua jornada académica com o MEET-US.</p>
          </div>

          <div class="row q-col-gutter-lg q-mt-md">
            <div v-for="t in testimonials" :key="t.name" class="col-12 col-md-4">
              <div class="testimonial-card shadow-1">
                <p class="testimonial-quote">"{{ t.quote }}"</p>
                <div class="row items-center q-gutter-sm q-pt-md" style="border-top: 1px solid #F1F5F9;">
                  <q-avatar size="40px">
                    <img :src="t.avatar" :alt="t.name" />
                  </q-avatar>
                  <div>
                    <h4 class="text-caption text-weight-bold text-dark" style="margin: 0;">{{ t.name }}</h4>
                    <p class="text-caption text-grey-6" style="margin: 0; font-size: 11px;">{{ t.role }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="final-cta-section text-center">
        <div class="landing-container">
          <h2 class="text-h4 text-weight-bolder text-white">Pronto para aprender algo novo?</h2>
          <p class="q-mt-sm text-subtitle1" style="color: #D1FAE5; max-width: 560px; margin-left: auto; margin-right: auto;">
            Junta-te a milhares de estudantes universitários em Moçambique hoje mesmo.
          </p>
          <div class="q-mt-lg">
            <q-btn
              unelevated
              no-caps
              label="Criar conta grátis"
              size="lg"
              :to="{ name: 'register' }"
              class="text-weight-bolder shadow-3"
              style="background: #FFFFFF; color: #059669; border-radius: 12px; padding: 14px 36px;"
            />
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="landing-container">
        <div class="row q-col-gutter-xl q-mb-xl">
          <div class="col-12 col-md-4">
            <span class="logo-text">MEET-US</span>
            <p class="q-mt-sm text-caption text-grey-6" style="line-height: 1.6;">
              A plataforma onde estudantes universitários partilham conhecimento, encontram parceiros de estudo e crescem juntos.
            </p>
          </div>
          <div class="col-6 col-md-2">
            <div class="footer-col-title">Plataforma</div>
            <ul class="footer-links">
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#competencias">Competências</a></li>
              <li><a href="#comunidade">Comunidade</a></li>
              <li><a href="#sobre">Sobre nós</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-3">
            <div class="footer-col-title">Universidades parceiras</div>
            <div class="row q-gutter-xs">
              <span v-for="u in ['UEM', 'UP', 'ISCTEM', 'UniLúrio', 'UniSave', 'A Politécnica']" :key="u" class="uni-badge">
                {{ u }}
              </span>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="footer-col-title">Acesso Rápido</div>
            <div class="column q-gutter-xs">
              <router-link :to="{ name: 'login' }" class="text-caption text-weight-bold text-primary">
                ➔ Iniciar Sessão
              </router-link>
              <router-link :to="{ name: 'register' }" class="text-caption text-weight-bold text-primary">
                ➔ Criar Conta de Estudante
              </router-link>
              <router-link :to="{ name: 'dashboard' }" class="text-caption text-weight-bold text-grey-7">
                ➔ Portal do Estudante
              </router-link>
              <router-link :to="{ name: 'students' }" class="text-caption text-weight-bold text-primary">
                ➔ Descobrir Estudantes
              </router-link>
            </div>
          </div>
        </div>

        <div class="footer-bottom text-center text-caption text-grey-5">
          © 2026 MEET-US Moçambique. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const mobileNavOpen = ref(false)

const popularSkills = [
  'Design de Interfaces',
  'Programação',
  'Excel',
  'Inglês',
  'Contabilidade',
  'Fotografia',
  'Matemática',
  'Marketing'
]

const featuredStudents = [
  {
    name: 'Lúcia Nanttumbo',
    course: 'Engenharia Informática',
    city: 'Maputo',
    compat: '92%',
    rating: '4,9',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name: 'Carlos Mangue',
    course: 'Gestão de Empresas',
    city: 'Beira',
    compat: '89%',
    rating: '4,9',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name: 'Fátima Juma',
    course: 'Contabilidade e Auditoria',
    city: 'Nampula',
    compat: '93%',
    rating: '4,9',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces'
  }
]

const testimonials = [
  {
    name: 'Nelson Tivane',
    role: 'Engenharia Civil, Maputo',
    quote: 'Encontrei parcerias incríveis e melhorei muito nas cadeiras difíceis. A plataforma facilitou totalmente a minha rotina universitária.',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name: 'Ângela Sitoe',
    role: 'Medicina, Beira',
    quote: 'Ensinar aqui ajudou-me a ganhar confiança e ainda fiz novas amizades na minha universidade. Recomendo a todos!',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name: 'Rui Zandamela',
    role: 'Informática, Nampula',
    quote: 'A compatibilidade funciona mesmo. Economizo tempo e aprendo com pessoas que realmente entendem do assunto.',
    avatar: 'https://images.unsplash.com/photo-1520451644838-906a72aa7c86?w=400&h=400&fit=crop&crop=faces'
  }
]
</script>

<style scoped>
.landing-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F8FAFC;
}

.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #F1F5F9;
  height: 72px;
  display: flex;
  align-items: center;
}

.header-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 900;
  color: #059669;
  letter-spacing: -0.5px;
  text-decoration: none;
}

.mz-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #047857;
  background: #ECFDF5;
  border: 1px solid #D1FAE5;
  padding: 2px 8px;
  border-radius: 20px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: #475569;
  font-weight: 500;
  font-size: 0.92rem;
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link:hover {
  color: #059669;
}

.nav-link-highlight {
  color: #059669 !important;
  font-weight: 700 !important;
}

.btn-login {
  color: #334155;
  border-radius: 10px;
}

.btn-signup {
  border-radius: 10px;
  padding: 8px 18px;
}

/* Hero */
.hero-section {
  padding: 60px 0 80px;
}

.hero-tag {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #059669;
  background: #ECFDF5;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-title {
  font-size: 3rem;
  line-height: 1.15;
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.12rem;
  color: #475569;
  line-height: 1.6;
  max-width: 520px;
}

.hero-image-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none !important;
  box-shadow: none !important;
}

.hero-students-img {
  width: 100%;
  max-width: 640px;
  height: auto;
  max-height: 520px;
  object-fit: contain;
  display: block;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  user-select: none;
}

/* Stats */
.stats-bar {
  background: #ECFDF5;
  border-top: 1px solid #D1FAE5;
  border-bottom: 1px solid #D1FAE5;
  padding: 32px 0;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 900;
  color: #059669;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
  margin-top: 4px;
}

/* Common Section */
.section-padding {
  padding: 80px 0;
}

.section-header {
  max-width: 600px;
  margin: 0 auto 48px;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.5px;
}

.section-desc {
  font-size: 1rem;
  color: #64748B;
  margin-top: 10px;
}

/* Steps */
.step-card {
  background: #F8FAFC;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid #F1F5F9;
  height: 100%;
}

.step-badge {
  width: 50px;
  height: 50px;
  background: #D1FAE5;
  color: #059669;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 8px;
}

.step-text {
  font-size: 0.92rem;
  color: #64748B;
  line-height: 1.6;
}

/* Skills */
.skill-pill {
  background: #FFFFFF;
  color: #334155;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 12px 24px;
  border-radius: 30px;
  border: 1px solid #E2E8F0;
  transition: all 0.2s;
}

.skill-pill:hover {
  background: #ECFDF5;
  color: #059669;
  border-color: #A7F3D0;
}

/* Featured Students */
.featured-student-card {
  background: #F8FAFC;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #F1F5F9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.featured-student-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.08);
}

.compat-tag {
  font-size: 0.78rem;
  font-weight: 700;
  color: #059669;
  background: #D1FAE5;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Testimonials */
.testimonial-card {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #F1F5F9;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.testimonial-quote {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Final CTA */
.final-cta-section {
  background: #059669;
  padding: 70px 0;
}

/* Footer */
.landing-footer {
  background: #FFFFFF;
  border-top: 1px solid #E2E8F0;
  padding: 60px 0 30px;
}

.footer-col-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 16px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #64748B;
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: #059669;
}

.uni-badge {
  background: #F1F5F9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.footer-bottom {
  border-top: 1px solid #F1F5F9;
  padding-top: 24px;
}

.border-y {
  border-top: 1px solid #E2E8F0;
  border-bottom: 1px solid #E2E8F0;
}

.border-t {
  border-top: 1px solid #E2E8F0;
}
</style>
