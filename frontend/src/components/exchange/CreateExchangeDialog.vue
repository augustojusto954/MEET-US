<template>
  <q-dialog v-model="open" persistent>
    <q-card style="width: 100%; max-width: 520px;">
      <q-card-section class="row items-center">
        <q-icon name="swap_horiz" color="primary" size="24px" />
        <div class="text-h6 q-ml-sm">Novo pedido de troca</div>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="form.skill"
          label="Habilidade pretendida *"
          outlined dense
          :rules="[v => !!v || 'Obrigatório']"
          hint="Ex: JavaScript, Design Gráfico, Inglês..."
        />

        <q-input
          v-model="form.message"
          label="Mensagem (opcional)"
          type="textarea"
          outlined autogrow
          maxlength="500"
          counter
        />

        <q-input
          v-model="form.scheduledAt"
          label="Data sugerida (opcional)"
          outlined dense
          mask="####-##-## ##:##"
          hint="Formato: YYYY-MM-DD HH:mm"
        >
          <template #prepend><q-icon name="event" /></template>
        </q-input>

        <q-banner rounded class="bg-blue-1 text-blue-9">
          <template #avatar><q-icon name="info" /></template>
          <div class="text-caption">
            Ao enviar, <b>{{ provider?.name }}</b> receberá uma notificação e poderá aceitar ou rejeitar.
          </div>
        </q-banner>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn
          color="primary"
          label="Enviar pedido"
          :loading="saving"
          :disable="!form.skill"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useExchangeStore } from 'src/stores/exchange'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  provider:   { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'created'])

const $q = useQuasar()
const store = useExchangeStore()

const open = ref(props.modelValue)
const saving = ref(false)

const form = reactive({ skill: '', message: '', scheduledAt: '' })

watch(() => props.modelValue, (v) => (open.value = v))
watch(open, (v) => emit('update:modelValue', v))

function reset() {
  form.skill = ''
  form.message = ''
  form.scheduledAt = ''
}

async function onSubmit() {
  if (!form.skill) return
  saving.value = true
  try {
    const created = await store.create({
      providerId: props.provider.id,
      skill: form.skill,
      message: form.message,
      scheduledAt: form.scheduledAt || null
    })
    $q.notify({ type: 'positive', message: 'Pedido enviado!' })
    emit('created', created)
    open.value = false
    reset()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Erro ao criar pedido' })
  } finally {
    saving.value = false
  }
}
</script>
