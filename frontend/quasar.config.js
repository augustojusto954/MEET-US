// frontend/quasar.config.js
import { fileURLToPath } from 'node:url'
import { defineConfig } from '#q-app'

export default defineConfig(() => {
  return {
    boot: ['pinia', 'db', 'axios', 'socket'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons', 'material-icons-outlined', 'mdi-v7'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      vueRouterMode: 'history',
      env: {
        API_URL: process.env.API_URL || 'http://localhost:3000/api',
        SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:3000',
        USE_FAKE_API: process.env.USE_FAKE_API || 'false'
      },
      extendViteConf(viteConf) {
        const srcDir = fileURLToPath(new URL('./src/', import.meta.url))
        viteConf.resolve.alias.src = srcDir
        viteConf.resolve.alias.pages = `${srcDir}pages/`
        viteConf.resolve.alias.layouts = `${srcDir}layouts/`
      },
    },

    devServer: {
      open: false,
      port: 9000,
      host: '0.0.0.0'
    },

    framework: {
      plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'Meta'],
      config: {
        notify: { position: 'top-right', timeout: 3000 },
        loading: { spinnerColor: 'primary' },
        dark: false
      }
    },

    animations: [],

    ssr: { pwa: false, prodPort: 3000, middlewares: ['render'] },

    pwa: { workboxMode: 'GenerateSW' },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: { appId: 'meet-us-frontend' }
    },

    bex: { extraScripts: [] }
  }
})
