<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Categorias de Competências</div>
        <div class="text-caption text-grey-7">Taxonomia oficial de competências partilhadas na plataforma.</div>
      </div>
      <q-btn unelevated rounded color="primary" icon="add" label="Nova Categoria" @click="showAddDialog = true" />
    </div>

    <div class="row q-col-gutter-md">
      <div
        v-for="cat in store.skillCategories"
        :key="cat.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat class="q-pa-md hover-lift full-height column justify-between">
          <div>
            <div class="row items-center justify-between">
              <q-avatar size="48px" class="bg-soft-lavender text-primary">
                <q-icon :name="cat.icon" size="26px" />
              </q-avatar>
              <q-badge color="primary" class="q-px-sm q-py-xs">{{ cat.count }} competências</q-badge>
            </div>
            <div class="text-subtitle1 text-weight-bolder text-dark q-mt-sm">{{ cat.name }}</div>
            <p class="text-caption text-grey-7 q-mt-xs">{{ cat.description }}</p>
          </div>

          <div class="row justify-end q-mt-md pt-xs border-top">
            <q-btn flat rounded dense size="sm" color="primary" label="Editar" />
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showAddDialog">
      <q-card style="width: 450px; max-width: 90vw; border-radius: 18px;">
        <q-card-section class="bg-soft-lavender text-weight-bold">Nova Categoria de Competência</q-card-section>
        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="newCat.name" label="Nome da Categoria *" outlined dense />
          <q-input v-model="newCat.icon" label="Ícone (Material Symbols)" outlined dense />
          <q-input v-model="newCat.description" label="Descrição" type="textarea" rows="2" outlined dense />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated rounded label="Criar" color="primary" @click="saveCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()
const showAddDialog = ref(false)

const newCat = ref({ name: '', icon: 'category', description: '' })

function saveCategory() {
  if (!newCat.value.name) return
  store.skillCategories.push({
    id: `cat-${Date.now()}`,
    name: newCat.value.name,
    icon: newCat.value.icon || 'category',
    count: 0,
    description: newCat.value.description
  })
  store._persist('skillCategories')
  showAddDialog.value = false
  newCat.value = { name: '', icon: 'category', description: '' }
  $q.notify({ type: 'positive', message: 'Categoria criada com sucesso!' })
}
</script>
