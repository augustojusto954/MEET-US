<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Métricas & Analytics da Plataforma</div>
        <div class="text-caption text-grey-7">Análise de crescimento, procura de competências e engajamento estudantil.</div>
      </div>
      <q-badge color="positive" class="q-px-sm q-py-xs text-weight-bold">● Métricas em Tempo Real</q-badge>
    </div>

    <!-- Indicadores Chave -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="metric in metrics" :key="metric.label">
        <q-card flat class="q-pa-md hover-lift">
          <div class="text-caption text-grey-7 text-weight-bold">{{ metric.label }}</div>
          <div class="text-h4 text-weight-bolder text-dark q-mt-xs">{{ metric.value }}</div>
          <div class="text-caption text-positive q-mt-xs">{{ metric.change }}</div>
        </q-card>
      </div>
    </div>

    <!-- Gráficos de Procura vs Oferta de Competências -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <q-card flat class="q-pa-md q-mb-lg">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">
            Competências com Maior Procura vs Maior Oferta
          </div>

          <div class="column q-gutter-md">
            <div v-for="sk in skillDemand" :key="sk.name">
              <div class="row items-center justify-between text-caption text-weight-bold q-mb-xs">
                <span>{{ sk.name }}</span>
                <span class="text-primary">{{ sk.demand }}% Procura / {{ sk.supply }}% Oferta</span>
              </div>
              <div class="row items-center q-gutter-xs">
                <q-linear-progress :value="sk.demand / 100" color="primary" rounded size="8px" class="col" />
                <q-linear-progress :value="sk.supply / 100" color="secondary" rounded size="8px" class="col" />
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card flat class="q-pa-md">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Distribuição por Grau Académico</div>
          <div class="column q-gutter-sm">
            <div class="row items-center justify-between bg-soft-lavender q-pa-sm rounded-borders">
              <span>Licenciatura (1º ao 5º Ano):</span>
              <b class="text-primary">88%</b>
            </div>
            <div class="row items-center justify-between bg-soft-lavender q-pa-sm rounded-borders">
              <span>Mestrado / Pós-Graduação:</span>
              <b class="text-secondary">9%</b>
            </div>
            <div class="row items-center justify-between bg-soft-lavender q-pa-sm rounded-borders">
              <span>Recém-Graduados & Mentores:</span>
              <b class="text-positive">3%</b>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const metrics = [
  { label: 'SESSÕES CONCLUÍDAS', value: '1.240', change: '↑ +18% este mês' },
  { label: 'TEMPO MÉDIO DE SESSÃO', value: '78 min', change: '✓ Ótima retenção' },
  { label: 'TAXA DE RETENÇÃO (30D)', value: '74.2%', change: '↑ +4.5% vs anterior' },
  { label: 'ÍNDICE DE SATISFAÇÃO', value: '98.4%', change: '★ Avaliações 4.8+' }
]

const skillDemand = [
  { name: 'UI/UX & Figma', demand: 90, supply: 65 },
  { name: 'Programação (Python & JS)', demand: 95, supply: 70 },
  { name: 'Inglês para Conversação', demand: 85, supply: 60 },
  { name: 'Cálculo I, II & Álgebra', demand: 80, supply: 50 },
  { name: 'Excel & Dashboards', demand: 70, supply: 75 }
]
</script>
