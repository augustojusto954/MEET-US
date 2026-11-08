<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Moderação da Comunidade (Community Moderation) ⚖️</div>
        <div class="text-caption text-grey-7">Revisão de publicações, comentários e conformidade de conteúdo.</div>
      </div>
    </div>

    <div class="column q-gutter-md">
      <q-card
        v-for="post in store.posts"
        :key="post.id"
        flat
        class="q-pa-md hover-lift"
      >
        <div class="row items-center justify-between q-mb-xs">
          <div class="row items-center">
            <q-avatar size="36px" class="q-mr-sm">
              <img :src="post.author.avatar" />
            </q-avatar>
            <div>
              <span class="text-weight-bold text-dark">{{ post.author.name }}</span>
              <span class="text-caption text-grey-6 q-ml-sm">{{ post.author.institution }}</span>
            </div>
          </div>
          <q-badge color="soft-lavender" text-color="primary">{{ post.category }}</q-badge>
        </div>

        <div class="text-subtitle1 text-weight-bold text-dark q-mt-xs">{{ post.title }}</div>
        <p class="text-body2 text-grey-8 q-mt-xs ellipsis-2-lines">{{ post.content }}</p>

        <div class="row items-center justify-between q-mt-sm pt-xs border-top">
          <span class="text-caption text-positive">✓ Em conformidade com as diretrizes</span>
          <div class="row q-gutter-xs">
            <q-btn flat rounded dense size="sm" color="negative" icon="delete" label="Remover Post" @click="$q.notify({ type: 'warning', message: 'Publicação ocultada por moderação.' })" />
            <q-btn flat rounded dense size="sm" color="warning" icon="warning" label="Emitir Aviso" @click="$q.notify({ type: 'info', message: 'Aviso pedagógico enviado ao autor.' })" />
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const $q = useQuasar()
const store = useMeetUsStore()
</script>
