// frontend/src/router/index.js
import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

export default route(function (/* { store, ssrContext } */) {
  const routerBase = import.meta.env.VITE_ROUTER_BASE || import.meta.env.VUE_ROUTER_BASE || '/'

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(routerBase)
  })

  Router.beforeEach((to) => {
    const auth = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // Reconhece a sessão ativa por token: se o utilizador já está logado, entra direto no sistema
    if (auth.isAuthenticated && (to.path === '/' || to.path.startsWith('/auth'))) {
      if (!to.query.landing) {
        return auth.user?.role === 'admin' ? { name: 'admin-overview' } : { name: 'dashboard' }
      }
    }

    // Se a rota requer autenticação e não há sessão válida
    if (requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    return true
  })

  return Router
})
