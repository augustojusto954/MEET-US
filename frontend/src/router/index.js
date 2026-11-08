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

    if (requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (auth.isAuthenticated && to.path.startsWith('/auth')) {
      return { name: 'dashboard' }
    }
    return true
  })

  return Router
})
