import { register } from 'register-service-worker'
import { Notify } from 'quasar'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (registration) {
    console.log('[MEET-US PWA] Service worker está ativo.')
    window.__MEETUS_SW_REGISTRATION__ = registration
  },

  registered (registration) {
    console.log('[MEET-US PWA] Service worker registado com sucesso.')
    window.__MEETUS_SW_REGISTRATION__ = registration
  },

  cached (/* registration */) {
    console.log('[MEET-US PWA] Conteúdo armazenado em cache para utilização offline.')
  },

  updatefound (/* registration */) {
    console.log('[MEET-US PWA] Nova atualização encontrada. A transferir em segundo plano...')
  },

  updated (registration) {
    console.log('[MEET-US PWA] Nova versão do MEET-US descarregada!')
    window.__MEETUS_SW_REGISTRATION__ = registration
    window.dispatchEvent(new CustomEvent('meetus:sw-updated', { detail: { registration } }))

    Notify.create({
      message: 'Nova versão do MEET-US disponível!',
      caption: 'A nova versão foi transferida com sucesso. Clica para atualizar.',
      icon: 'system_update',
      color: 'positive',
      position: 'top',
      timeout: 0,
      actions: [
        {
          label: 'Atualizar Agora',
          color: 'white',
          class: 'text-weight-bold bg-white text-positive q-px-md',
          handler: () => {
            if (registration && registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' })
            }
            window.location.reload()
          }
        },
        {
          label: 'Mais tarde',
          color: 'white'
        }
      ]
    })
  },

  offline () {
    console.log('[MEET-US PWA] Sem ligação à internet. Modo offline ativado.')
  },

  error (err) {
    console.error('[MEET-US PWA] Erro ao registar Service Worker:', err)
  }
})
