<template>
  <q-page padding class="q-pb-xl">
    <!-- Header Admin -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Visão Geral da Plataforma</div>
        <div class="text-caption text-grey-7">
          Painel central de controlo, indicadores de adesão e integridade do sistema MEET-US.
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn outline rounded color="primary" icon="refresh" label="Atualizar Dados" @click="$q.notify({ type: 'info', message: 'Métricas atualizadas em tempo real.' })" />
        <q-btn unelevated rounded color="primary" icon="download" label="Exportar Relatório" @click="$q.notify({ type: 'positive', message: 'Relatório gerado com sucesso.' })" />
      </div>
    </div>

    <!-- 4 Cartões KPI Principais -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="q-pa-md hover-lift">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">ESTUDANTES TOTAIS</div>
              <div class="text-h4 text-weight-bolder text-dark q-mt-xs">{{ store.students.length + 1420 }}</div>
              <div class="text-caption text-positive q-mt-xs">↑ +14% este mês</div>
            </div>
            <q-avatar size="48px" class="bg-soft-lavender text-primary">
              <q-icon name="school" />
            </q-avatar>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="q-pa-md hover-lift">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">TROCAS ATIVAS</div>
              <div class="text-h4 text-weight-bolder text-dark q-mt-xs">{{ store.exchanges.length + 84 }}</div>
              <div class="text-caption text-positive q-mt-xs">↑ 92% taxa de conclusão</div>
            </div>
            <q-avatar size="48px" class="bg-lavender text-secondary">
              <q-icon name="swap_horiz" />
            </q-avatar>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="q-pa-md hover-lift">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">UNIVERSIDADES CONECTADAS</div>
              <div class="text-h4 text-weight-bolder text-dark q-mt-xs">{{ store.universities.length }}</div>
              <div class="text-caption text-grey-6 q-mt-xs">7 instituições verificadas</div>
            </div>
            <q-avatar size="48px" class="bg-amber-1 text-amber-9">
              <q-icon name="account_balance" />
            </q-avatar>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="q-pa-md hover-lift">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">DENÚNCIAS PENDENTES</div>
              <div class="text-h4 text-weight-bolder text-negative q-mt-xs">{{ store.reports.filter(r => r.status === 'open').length }}</div>
              <div class="text-caption text-grey-6 q-mt-xs">Ação necessária</div>
            </div>
            <q-avatar size="48px" class="bg-red-1 text-negative">
              <q-icon name="flag" />
            </q-avatar>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Grelha de Atividade Recente e Ações Rápidas -->
    <div class="row q-col-gutter-lg">
      <!-- Coluna Esquerda: Denúncias & Moderação Rápida -->
      <div class="col-12 col-lg-7">
        <q-card flat class="q-pa-md q-mb-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-dark">
              <q-icon name="report_problem" color="negative" class="q-mr-xs" />
              Fila de Denúncias Recentes
            </div>
            <q-btn flat dense color="primary" label="Ver Todas" :to="{ name: 'admin-reports' }" />
          </div>

          <q-list separator>
            <q-item
              v-for="rep in store.reports"
              :key="rep.id"
              class="rounded-borders q-my-xs q-pa-sm"
            >
              <q-item-section avatar>
                <q-avatar size="40px" class="bg-red-1 text-negative">
                  <q-icon name="warning" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="row items-center justify-between">
                  <span class="text-subtitle2 text-weight-bold text-dark">{{ rep.reason }}</span>
                  <q-badge color="negative">{{ rep.priority }}</q-badge>
                </div>
                <div class="text-caption text-grey-8">
                  Denunciante: <b>{{ rep.reporterName }}</b> ➔ Denunciado: <b>{{ rep.reportedName }}</b>
                </div>
                <div class="text-caption text-grey-6 ellipsis">{{ rep.details }}</div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  unelevated
                  rounded
                  dense
                  size="sm"
                  color="primary"
                  label="Analisar"
                  :to="{ name: 'admin-reports' }"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Gráfico / Indicador de Volume Semanal -->
        <q-card flat class="q-pa-md">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm">Volume Semanal de Trocas de Competências</div>
          <div class="row items-end justify-between q-py-lg text-center" style="height: 180px;">
            <div v-for="(day, idx) in ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']" :key="day" class="col column items-center">
              <div
                class="rounded-borders gradient-purple"
                :style="{ height: `${[45, 75, 90, 80, 110, 130, 60][idx]}px`, width: '28px' }"
              />
              <span class="text-caption text-grey-7 q-mt-xs">{{ day }}</span>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Coluna Direita: Atalhos Administrativos & Universidades Ativas -->
      <div class="col-12 col-lg-5">
        <!-- Universidades Parceiras -->
        <q-card flat class="q-pa-md q-mb-lg">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle1 text-weight-bold text-dark">Universidades Ativas</div>
            <q-btn flat dense color="primary" label="Gerir" :to="{ name: 'admin-universities' }" />
          </div>

          <q-list separator>
            <q-item
              v-for="u in store.universities.slice(0, 4)"
              :key="u.id"
              class="q-py-sm"
            >
              <q-item-section avatar>
                <q-avatar size="36px" class="bg-soft-lavender text-primary text-weight-bold">
                  {{ u.acronym }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ u.name }}</q-item-label>
                <q-item-label caption>{{ u.city }} • {{ u.studentsCount }} alunos inscritos</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Acesso Rápido a Módulos Administrativos -->
        <q-card flat class="q-pa-md">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm">Ações Administrativas</div>
          <div class="column q-gutter-sm">
            <q-btn
              outline
              rounded
              color="primary"
              icon="school"
              label="Gestão de Estudantes & Verificações"
              class="text-left"
              :to="{ name: 'admin-students' }"
            />
            <q-btn
              outline
              rounded
              color="secondary"
              icon="gavel"
              label="Fila de Moderação da Comunidade"
              class="text-left"
              :to="{ name: 'admin-moderation' }"
            />
            <q-btn
              outline
              rounded
              color="deep-purple"
              icon="category"
              label="Gerir Categorias de Competências"
              class="text-left"
              :to="{ name: 'admin-categories' }"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useMeetUsStore } from 'src/stores/meetus'

const store = useMeetUsStore()
</script>
