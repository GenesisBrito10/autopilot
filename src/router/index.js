import { createRouter, createWebHistory } from 'vue-router'

// Importação das views
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Tutorials from '../views/Tutorials.vue'
import Settings from '../views/Settings.vue'
import Ranking from '../views/Ranking.vue'
import Links from '../views/Links.vue'

const routes = [
  // Rotas padrão (sem slug)
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: false }
  },
  {
    path: '/tutorials',
    component: Tutorials,
    meta: { requiresAuth: false }
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: false }
  },
  {
    path: '/ranking',
    component: Ranking,
    meta: { requiresAuth: false }
  },
  {
    path: '/links',
    component: Links,
    meta: { requiresAuth: false }
  },

  // Rotas com slug
  { path: '/:slug', redirect: to => `/${to.params.slug}/login` },
  { path: '/:slug/login', component: Login },
  { 
    path: '/:slug/dashboard',
    component: Dashboard,
    meta: { requiresAuth: false }
  },
  {
    path: '/:slug/tutorials',
    component: Tutorials,
    meta: { requiresAuth: false }
  },
  {
    path: '/:slug/settings',
    component: Settings,
    meta: { requiresAuth: false }
  },
  {
    path: '/:slug/ranking',
    component: Ranking,
    meta: { requiresAuth: false }
  },
  {
    path: '/:slug/links',
    component: Links,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userEmail = localStorage.getItem('userEmail')
  const userPassword = localStorage.getItem('userPassword')
  
  if (to.meta.requiresAuth && (!userEmail || !userPassword)) {
    // next('/login')
  } else {
    next()
  }
})

export default router