# my-first-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


### Project Structure

```plaintext
src/
├── assets/
├── components/
│   ├── auth/
│   │   └── LoginForm.vue
│   ├── layout/
│   │   ├── AppLayout.vue
│   │   ├── Sidebar.vue
│   │   └── Navbar.vue
│   └── ui/
├── composables/
├── router/
│   └── index.ts                // Ahora con extensión .ts
├── stores/
│   └── auth.ts                 // Store con tipos
├── types/                      // Nuevo: Tipos globales
│   └── index.ts
├── views/
│   ├── auth/
│   │   └── Login.vue
│   ├── dashboard/
│   │   ├── Home.vue
│   │   ├── Documents.vue
│   │   ├── Users.vue
│   │   ├── Settings.vue
│   │   └── RecycleBin.vue
│   └── NotFound.vue
├── App.vue
└── main.ts                     // Punto de entrada principal
```


### Router Configuration

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/dashboard/Home.vue')
      },
      {
        path: '/documents',
        name: 'documents',
        component: () => import('@/views/dashboard/Documents.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/dashboard/Users.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/dashboard/Settings.vue')
      },
      {
        path: '/recycle-bin',
        name: 'recycle-bin',
        component: () => import('@/views/dashboard/RecycleBin.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
```

### Global Types

```typescript
// Tipos para autenticación
export interface User {
  name: string
  email: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// Tipos para rutas
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
    title?: string
    icon?: string
  }
}
``` 

### Auth Store

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  async function login(credentials: LoginCredentials): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        user.value = {
          name: 'Admin',
          email: credentials.email
        }
        localStorage.setItem('auth', 'true')
        router.push('/')
        resolve()
      }, 500)
    })
  }

  function logout(): void {
    user.value = null
    localStorage.removeItem('auth')
    router.push('/login')
  }

  function initialize(): void {
    if (localStorage.getItem('auth')) {
      user.value = { name: 'Admin', email: 'admin@example.com' }
    }
  }

  return { user, isAuthenticated, login, logout, initialize }
})

```

### Sidebar Component

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface MenuItem {
  path: string
  name: string
  icon: string
}

const menuItems: MenuItem[] = [
  { path: '/', name: 'home', icon: 'icon-home' },
  { path: '/documents', name: 'documents', icon: 'icon-documents' },
  { path: '/users', name: 'users', icon: 'icon-users' },
  { path: '/settings', name: 'settings', icon: 'icon-settings' },
  { path: '/recycle-bin', name: 'recycle-bin', icon: 'icon-recycle' }
]
</script>

<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <RouterLink :to="item.path" :title="item.name">
            <i :class="item.icon"></i>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* Estilos igual que antes */
</style>

```

### Login Form Component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { LoginCredentials } from '@/types'

const emit = defineEmits<{
  (e: 'submit', credentials: LoginCredentials): void
}>()

const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false
})

const submitForm = () => {
  emit('submit', credentials.value)
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <input v-model="credentials.email" type="email" placeholder="Email" required>
    <input v-model="credentials.password" type="password" placeholder="Password" required>
    <label>
      <input v-model="credentials.rememberMe" type="checkbox"> Remember me
    </label>
    <button type="submit">Login</button>
  </form>
</template>

```

### main.ts

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importaciones CSS globales
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Inicializar store de autenticación
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')

```


### App.vue

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Redirigir si no está autenticado al intentar acceder a rutas protegidas
watchEffect(() => {
  if (!authStore.isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="app">
    <!-- Mostrar solo el RouterView para login -->
    <RouterView v-if="!authStore.isAuthenticated" />
    
    <!-- Mostrar layout completo cuando está autenticado -->
    <template v-else>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </template>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* Estilos globales */
body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

```