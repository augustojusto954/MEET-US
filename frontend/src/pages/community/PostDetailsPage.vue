<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm" @click="$router.back()" />
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Publicação da Comunidade</div>
        <div class="text-caption text-grey-7">Visualiza e participa na discussão do tópico.</div>
      </div>
    </div>

    <div v-if="post" class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <!-- Post Card -->
        <q-card flat class="q-pa-lg q-mb-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="row items-center">
              <q-avatar size="48px" class="shadow-1">
                <img :src="post.author.avatar" />
              </q-avatar>
              <div class="q-ml-sm">
                <div class="text-subtitle1 text-weight-bold text-dark">{{ post.author.name }}</div>
                <div class="text-caption text-grey-7">{{ post.author.course }} • {{ post.author.institution }}</div>
              </div>
            </div>
            <q-badge color="soft-lavender" text-color="primary" class="q-px-sm q-py-xs text-weight-bold">
              {{ post.category }}
            </q-badge>
          </div>

          <div class="text-h5 text-weight-bolder text-dark q-mb-sm">{{ post.title }}</div>
          <p class="text-body1 text-grey-9 leading-relaxed q-mb-md" style="white-space: pre-line;">
            {{ post.content }}
          </p>

          <div class="row q-gutter-xs q-mb-md">
            <q-badge v-for="tag in post.tags" :key="tag" color="lavender" text-color="secondary" class="q-pa-xs">
              #{{ tag }}
            </q-badge>
          </div>

          <q-separator class="q-my-md" />

          <!-- Ações -->
          <div class="row items-center justify-between">
            <div class="row q-gutter-sm">
              <q-btn
                flat
                rounded
                :color="post.isLiked ? 'negative' : 'grey-7'"
                :icon="post.isLiked ? 'favorite' : 'favorite_border'"
                :label="`${post.likesCount} Curtidas`"
                @click="store.toggleLikePost(post.id)"
              />
              <q-btn
                flat
                rounded
                :color="post.saved ? 'primary' : 'grey-7'"
                :icon="post.saved ? 'bookmark' : 'bookmark_border'"
                :label="post.saved ? 'Guardado' : 'Guardar'"
                @click="store.toggleSavePost(post.id)"
              />
            </div>
            <q-btn
              flat
              rounded
              color="grey-6"
              icon="flag"
              label="Denunciar"
              size="sm"
              @click="reportPost"
            />
          </div>
        </q-card>

        <!-- Secção de Comentários -->
        <q-card flat class="q-pa-lg">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">
            Comentários ({{ post.comments?.length || 0 }})
          </div>

          <!-- Caixa de Adicionar Comentário -->
          <div class="row items-start q-mb-lg">
            <q-avatar size="40px" class="q-mr-sm">
              <img :src="store.currentUser.avatar" />
            </q-avatar>
            <div class="col">
              <q-input
                v-model="commentText"
                placeholder="Escreve uma resposta ou comentário construtivo..."
                outlined
                dense
                type="textarea"
                rows="2"
                bg-color="soft-lavender"
              />
              <div class="row justify-end q-mt-xs">
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  label="Comentar"
                  size="sm"
                  class="text-weight-bold"
                  :disable="!commentText.trim()"
                  @click="sendComment"
                />
              </div>
            </div>
          </div>

          <!-- Lista de Comentários Existentes -->
          <div v-if="post.comments?.length" class="column q-gutter-md">
            <div
              v-for="c in post.comments"
              :key="c.id"
              class="q-pa-sm bg-soft-lavender rounded-borders"
            >
              <div class="row items-center justify-between">
                <div class="row items-center">
                  <q-avatar size="28px" class="q-mr-xs">
                    <img :src="c.authorAvatar" />
                  </q-avatar>
                  <span class="text-weight-bold text-caption text-dark">{{ c.authorName }}</span>
                </div>
                <span class="text-caption text-grey-6">{{ c.createdAt }}</span>
              </div>
              <div class="text-body2 text-grey-9 q-mt-xs q-pl-md">
                {{ c.text }}
              </div>
            </div>
          </div>

          <div v-else class="text-caption text-grey-6 text-center q-pa-md">
            Ainda não há comentários nesta publicação. Sê o primeiro a responder!
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <!-- Sobre o Autor -->
        <q-card flat class="q-pa-md q-mb-md">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-sm">Sobre o Autor</div>
          <div class="row items-center q-mb-sm">
            <q-avatar size="48px">
              <img :src="post.author.avatar" />
            </q-avatar>
            <div class="q-ml-sm">
              <div class="text-subtitle2 text-weight-bold">{{ post.author.name }}</div>
              <div class="text-caption text-grey-7">{{ post.author.institution }}</div>
            </div>
          </div>
          <q-btn
            outline
            rounded
            dense
            color="primary"
            label="Ver Perfil"
            class="full-width"
            :to="{ name: 'profile', query: { id: post.author.id } }"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'

const route = useRoute()
const $q = useQuasar()
const store = useMeetUsStore()

const commentText = ref('')

const post = computed(() => {
  const id = route.params.id
  return store.posts.find(p => p.id === id) || store.posts[0]
})

function sendComment() {
  if (!commentText.value.trim() || !post.value) return
  store.addCommentToPost(post.value.id, commentText.value)
  commentText.value = ''
  $q.notify({ type: 'positive', message: 'Comentário adicionado!' })
}

function reportPost() {
  $q.notify({ type: 'info', message: 'Denúncia registada para análise da moderação.' })
}
</script>
