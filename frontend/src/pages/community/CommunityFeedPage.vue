<template>
  <q-page padding class="q-pb-xl">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bolder text-dark">Feed da Comunidade</div>
        <div class="text-caption text-grey-7">
          Dúvidas académicas, dicas de estudo, partilha de materiais e colaboração.
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="edit_note"
        label="Criar Publicação"
        @click="showCreateModal = true"
      />
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Coluna Central: Feed -->
      <div class="col-12 col-md-8">
        <!-- Caixa Rápida para Publicar -->
        <q-card flat class="q-pa-md q-mb-lg hover-lift">
          <div class="row items-center">
            <q-avatar size="44px">
              <img :src="store.currentUser.avatar" />
            </q-avatar>
            <div
              class="col q-ml-md bg-soft-lavender q-pa-sm rounded-borders text-grey-7 cursor-pointer"
              @click="showCreateModal = true"
            >
              No que estás a estudar hoje, {{ store.currentUser.name.split(' ')[0] }}? Partilha uma dúvida ou dica...
            </div>
          </div>
          <div class="row justify-between items-center q-mt-sm pt-xs border-top">
            <div class="row q-gutter-xs">
              <q-btn flat dense rounded size="sm" icon="image" label="Foto" color="grey-7" @click="showCreateModal = true" />
              <q-btn flat dense rounded size="sm" icon="tag" label="Categoria" color="grey-7" @click="showCreateModal = true" />
            </div>
            <q-btn unelevated rounded size="sm" color="primary" label="Publicar" @click="showCreateModal = true" />
          </div>
        </q-card>

        <!-- Filtros de Categorias -->
        <div class="row q-gutter-xs q-mb-md">
          <q-chip
            v-for="cat in ['Todas', 'Programação & Tech', 'Design & Multimédia', 'Negócios & Gestão', 'Línguas & Comunicação', 'Ciências & Matemática']"
            :key="cat"
            clickable
            :color="selectedCategory === cat ? 'primary' : 'lavender'"
            :text-color="selectedCategory === cat ? 'white' : 'primary'"
            size="sm"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </q-chip>
        </div>

        <!-- Lista de Publicações -->
        <div v-if="filteredPosts.length" class="column q-gutter-md">
          <q-card
            v-for="post in filteredPosts"
            :key="post.id"
            flat
            class="q-pa-lg hover-lift"
          >
            <!-- Topo do Post -->
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center">
                <q-avatar size="46px" class="shadow-1">
                  <img :src="post.author.avatar" />
                </q-avatar>
                <div class="q-ml-sm">
                  <div class="text-subtitle1 text-weight-bolder text-dark">{{ post.author.name }}</div>
                  <div class="text-caption text-grey-7">{{ post.author.course }} • {{ post.author.institution }}</div>
                </div>
              </div>
              <div class="row items-center">
                <span class="text-caption text-grey-6 q-mr-sm">{{ post.createdAt }}</span>
                <q-badge color="soft-lavender" text-color="primary" class="q-px-sm q-py-xs text-weight-bold">
                  {{ post.category }}
                </q-badge>
              </div>
            </div>

            <!-- Título & Conteúdo -->
            <div
              class="text-h6 text-weight-bolder text-dark q-mt-sm cursor-pointer hover-text-primary"
              @click="$router.push({ name: 'post-details', params: { id: post.id } })"
            >
              {{ post.title }}
            </div>
            <p class="text-body2 text-grey-9 q-mt-xs leading-relaxed" style="white-space: pre-line;">
              {{ post.content }}
            </p>

            <!-- Tags -->
            <div class="row q-gutter-xs q-mb-md">
              <q-badge
                v-for="tag in post.tags"
                :key="tag"
                color="lavender"
                text-color="secondary"
                class="q-pa-xs"
              >
                #{{ tag }}
              </q-badge>
            </div>

            <q-separator class="q-my-sm" />

            <!-- Ações: Curtir, Comentar, Guardar, Detalhes -->
            <div class="row items-center justify-between">
              <div class="row items-center q-gutter-sm">
                <q-btn
                  flat
                  rounded
                  dense
                  :color="post.isLiked ? 'negative' : 'grey-7'"
                  :icon="post.isLiked ? 'favorite' : 'favorite_border'"
                  :label="String(post.likesCount)"
                  @click="store.toggleLikePost(post.id)"
                />
                <q-btn
                  flat
                  rounded
                  dense
                  color="grey-7"
                  icon="chat_bubble_outline"
                  :label="String(post.comments?.length || 0)"
                  :to="{ name: 'post-details', params: { id: post.id } }"
                />
              </div>

              <div class="row items-center q-gutter-xs">
                <q-btn
                  flat
                  round
                  dense
                  :color="post.saved ? 'primary' : 'grey-7'"
                  :icon="post.saved ? 'bookmark' : 'bookmark_border'"
                  @click="store.toggleSavePost(post.id)"
                >
                  <q-tooltip>{{ post.saved ? 'Guardado' : 'Guardar publicação' }}</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  rounded
                  dense
                  color="primary"
                  label="Ver Discussão ➔"
                  :to="{ name: 'post-details', params: { id: post.id } }"
                />
              </div>
            </div>
          </q-card>
        </div>

        <EmptyState
          v-else
          icon="forum"
          title="Nenhuma publicação encontrada"
          description="Sê o primeiro a partilhar uma dica ou dúvida nesta categoria!"
          action-label="Criar Publicação"
          action-icon="edit"
          @action="showCreateModal = true"
        />
      </div>

      <!-- Coluna Direita: Tópicos e Regras -->
      <div class="col-12 col-md-4">
        <!-- Tópicos em Alta -->
        <q-card flat class="q-pa-md q-mb-md">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm row items-center">
            <q-icon name="trending_up" color="primary" class="q-mr-xs" size="20px" />
            Tópicos em Tendência
          </div>
          <div class="column q-gutter-xs">
            <div class="row items-center justify-between text-body2 q-py-xs">
              <span class="text-weight-bold text-primary">#FigmaTokens</span>
              <span class="text-caption text-grey-6">14 trocas</span>
            </div>
            <div class="row items-center justify-between text-body2 q-py-xs">
              <span class="text-weight-bold text-primary">#CalculoUEM</span>
              <span class="text-caption text-grey-6">28 posts</span>
            </div>
            <div class="row items-center justify-between text-body2 q-py-xs">
              <span class="text-weight-bold text-primary">#EnglishSpeaking</span>
              <span class="text-caption text-grey-6">19 mentorias</span>
            </div>
            <div class="row items-center justify-between text-body2 q-py-xs">
              <span class="text-weight-bold text-primary">#VueJS</span>
              <span class="text-caption text-grey-6">32 projetos</span>
            </div>
          </div>
        </q-card>

        <!-- Diretrizes da Comunidade -->
        <q-card flat class="q-pa-md bg-soft-lavender">
          <div class="text-subtitle2 text-weight-bold text-dark q-mb-xs">Princípios MEET-US</div>
          <div class="text-caption text-grey-8">
            • Aprendizagem colaborativa e gratuita entre universitários.<br/>
            • Respeito mútuo e incentivo construtivo.<br/>
            • Não é permitida cobrança financeira ou publicidade spam.
          </div>
        </q-card>
      </div>
    </div>

    <!-- Modal Criar Publicação -->
    <q-dialog v-model="showCreateModal">
      <q-card style="width: 550px; max-width: 95vw; border-radius: 20px;">
        <q-card-section class="row items-center justify-between bg-soft-lavender">
          <div class="text-subtitle1 text-weight-bold">Criar Nova Publicação</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-input
            v-model="newPost.title"
            label="Título da Publicação *"
            placeholder="Ex: Dica de Figma / Dúvida sobre limites em Cálculo"
            outlined
            dense
          />

          <q-select
            v-model="newPost.category"
            label="Categoria *"
            :options="['Programação & Tech', 'Design & Multimédia', 'Negócios & Gestão', 'Línguas & Comunicação', 'Ciências & Matemática']"
            outlined
            dense
          />

          <q-input
            v-model="newPost.content"
            label="Conteúdo da Mensagem *"
            placeholder="Descreve o teu raciocínio, contexto ou convite de mentoria..."
            type="textarea"
            rows="4"
            outlined
            dense
          />

          <q-input
            v-model="tagsInput"
            label="Tags (separadas por vírgula)"
            placeholder="Ex: Figma, UIUX, UEM"
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Publicar na Comunidade"
            color="primary"
            class="text-weight-bold"
            @click="publishPost"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMeetUsStore } from 'src/stores/meetus'
import EmptyState from 'src/components/common/EmptyState.vue'

const $q = useQuasar()
const store = useMeetUsStore()

const selectedCategory = ref('Todas')
const showCreateModal = ref(false)
const tagsInput = ref('')

const newPost = ref({
  title: '',
  category: 'Programação & Tech',
  content: ''
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'Todas') return store.posts
  return store.posts.filter(p => p.category === selectedCategory.value)
})

function publishPost() {
  if (!newPost.value.title || !newPost.value.content) {
    $q.notify({ type: 'warning', message: 'Preenche o título e o conteúdo da publicação.' })
    return
  }

  const tags = tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : ['MEETUS']
  store.createPost({
    ...newPost.value,
    tags
  })

  showCreateModal.value = false
  newPost.value = { title: '', category: 'Programação & Tech', content: '' }
  tagsInput.value = ''
  $q.notify({ type: 'positive', message: 'Publicação partilhada com a comunidade!' })
}
</script>
