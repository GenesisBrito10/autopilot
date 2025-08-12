import { createRouter, createWebHistory } from 'vue-router'

// Importação das views
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Tutorials from '../views/Tutorials.vue'
import Settings from '../views/Settings.vue'
import Ranking from '../views/Ranking.vue'
import Links from '../views/Links.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
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