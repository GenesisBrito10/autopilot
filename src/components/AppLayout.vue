<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
    <!-- Floating Orbs Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>

    <!-- Notificação fixa de operação em andamento -->
    <transition name="fade">
      <div v-if="showTradeNotification" class="fixed top-6 right-6 z-[100] min-w-[320px] max-w-xs glass-notification rounded-xl px-5 py-3 flex items-center gap-3 animate-fade-in-up pointer-events-auto">
        <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <i class="fas fa-chart-line text-blue-400"></i>
        </div>
        <div class="flex-1">
          <div class="font-semibold text-base text-white">Trade em andamento</div>
          <div v-if="tradeInfo" class="text-xs text-gray-400 mt-1">
            <span v-if="tradeInfo.pair">{{ tradeInfo.pair }}</span>
            <span v-if="tradeInfo.direction" class="ml-2">{{ tradeInfo.direction }}</span>
            <span v-if="tradeInfo.value" class="ml-2">R$ {{ tradeInfo.value }}</span>
          </div>
        </div>
        <i class="fas fa-spinner fa-spin text-blue-400 text-lg" v-if="tradeInfo && tradeInfo.status === 'executando'"></i>
        <i v-else-if="tradeInfo && tradeInfo.status === 'win'" class="fas fa-check-circle text-green-400 text-lg"></i>
        <i v-else-if="tradeInfo && tradeInfo.status === 'loss'" class="fas fa-times-circle text-red-400 text-lg"></i>
      </div>
    </transition>

    <div class="relative z-10">
      <!-- Mobile Menu Button -->
      <button @click="toggleSidebar"
        class="fixed top-4 right-4 z-[60] p-3 glass-button rounded-lg md:hidden text-white transition-all hover:scale-105">
        <i :class="['fas', isSidebarOpen ? 'fa-times' : 'fa-bars', 'text-xl']"></i>
      </button>

      <!-- Mobile Overlay -->
      <transition name="fade">
        <div v-if="isSidebarOpen" @click="toggleSidebar"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] md:hidden"></div>
      </transition>

      <div class="flex min-h-screen">
        <!-- Modern Sidebar -->
        <transition name="slide">
          <aside :class="[
            'fixed md:fixed sidebar-modern z-[55]',
            { 'sidebar-open': isSidebarOpen },
            { 'sidebar-closed': !isSidebarOpen }
          ]">
            <!-- Logo Section -->
            <div class="sidebar-header">
              <div class="logo-container">
                <div class="logo-glow"></div>
                <img :src="logoUrl" alt="Polarium" class="logo-img">
              </div>
              <div class="brand-text">
                <span class="brand-name">POLARIUM</span>
                <span class="brand-subtitle">Copy Trader</span>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="sidebar-nav">
              <!-- Main Navigation -->
              <div class="nav-section">
                <span class="nav-label">MENU PRINCIPAL</span>
                
              <a href="#" @click="e => handleMenuNav(e, '/dashboard')"
                  class="nav-item"
                  :class="{ 'nav-active': $route.path === '/dashboard' }">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-home nav-icon"></i>
                  <span class="nav-text">{{ t.dashboard }}</span>
                  <div class="nav-badge" v-if="$route.path === '/dashboard'">
                    <span class="pulse-dot"></span>
                </div>
              </a>

                              <a href="#" @click="e => handleMenuNav(e, '/settings')"
                  class="nav-item"
                  :class="{ 'nav-active': $route.path === '/settings' }">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-cog nav-icon"></i>
                  <span class="nav-text">Configurações</span>
                </a>

                <a href="#" @click="e => handleMenuNav(e, '/ranking')"
                  class="nav-item"
                  :class="{ 'nav-active': $route.path === '/ranking' }">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-trophy nav-icon text-yellow-400"></i>
                  <span class="nav-text">Ranking</span>
                </a>
              </div>
             
              <!-- Trading Section -->
              <div class="nav-section">
                <span class="nav-label">TRADING</span>

              <a href="https://trade.polariumbroker.com/traderoom" target="_blank"
                  class="nav-item nav-external">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-chart-line nav-icon text-blue-400"></i>
                  <span class="nav-text">{{ t.tradeStation }}</span>
                  <i class="fas fa-arrow-up-right-from-square nav-external-icon"></i>
              </a>

              <a href="https://trade.polariumbroker.com/traderoom" target="_blank"
                  class="nav-item nav-external">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-wallet nav-icon text-emerald-400"></i>
                  <span class="nav-text">{{ t.deposit }}</span>
                  <i class="fas fa-arrow-up-right-from-square nav-external-icon"></i>
              </a>

              <a href="https://trade.polariumbroker.com/traderoom" target="_blank"
                  class="nav-item nav-external">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-money-bill-transfer nav-icon text-rose-400"></i>
                  <span class="nav-text">{{ t.withdraw }}</span>
                  <i class="fas fa-arrow-up-right-from-square nav-external-icon"></i>
                </a>
                </div>

              <!-- Support Section -->
              <div class="nav-section">
                <span class="nav-label">AJUDA</span>
                
                 <a href="#" @click="e => handleMenuNav(e, '/tutorials')"
                  class="nav-item"
                  :class="{ 'nav-active': $route.path === '/tutorials' }">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-graduation-cap nav-icon text-violet-400"></i>
                  <span class="nav-text">{{ t.tutorials }}</span>
              </a>

                <a href="https://t.me/TRADERBRAVUSOFICIAL" target="_blank"
                  class="nav-item nav-external">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-headset nav-icon text-cyan-400"></i>
                  <span class="nav-text">{{ t.support }}</span>
                  <i class="fas fa-arrow-up-right-from-square nav-external-icon"></i>
                </a>

                <a href="#" @click="e => handleMenuNav(e, '/links')"
                  class="nav-item"
                  :class="{ 'nav-active': $route.path === '/links' }">
                  <div class="nav-indicator"></div>
                  <i class="fas fa-link nav-icon text-purple-400"></i>
                  <span class="nav-text">Links</span>
                </a>
              </div>
            </nav>

            <!-- Bottom Section -->
            <div class="sidebar-footer">
              <div class="user-section">
                <div class="user-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                  <span class="user-name">{{ userDisplayName }}</span>
                  <span class="user-status">
                    <span class="status-dot"></span>
                    Online
                  </span>
                </div>
              </div>
              
              <button @click="logout" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>{{ t.logout }}</span>
              </button>
            </div>
          </aside>
        </transition>

        <!-- Main Content -->
        <main class="flex-1 p-4 md:p-8 md:ml-[280px]">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '../assets/polarium.png'
import { translations } from '@/locales'
import axios from 'axios'
import Swal from 'sweetalert2'
const router = useRouter()
const isSidebarOpen = ref(false)
const userDisplayName = ref('Usuário')

// Tentar obter o nome do usuário do objeto 'user' no localStorage
const userStr = localStorage.getItem('user')
if (userStr) {
  try {
    const user = JSON.parse(userStr)
    if (user && user.firstName) {
      userDisplayName.value = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    }
  } catch (error) {
    console.error('Erro ao analisar objeto de usuário:', error)
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const logout = async () => {
  const email = localStorage.getItem('userEmail')
  if (email) {
    try {
      await axios.delete('/api/sdk/stop', {
        data: { email:email },
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('SDK stopped successfully.')
    } catch (error) {
      console.error('Failed to stop SDK:', error)
    }
  }
  localStorage.clear()
  router.push('/login')
}

// Sistema de tradução
const currentLanguage = ref(localStorage.getItem('language') || 'pt')

// Escuta mudanças de idioma vindas de outros componentes
const updateLanguageFromEvent = (event) => {
  if (event.detail && event.detail.language) {
    currentLanguage.value = event.detail.language
  }
}

// Computed property para traduções
const t = computed(() => {
  return translations[currentLanguage.value]
})

// --- Controle de operação ativa global ---
const isBotActive = ref(false)
const tradeInfo = ref(null)
const showTradeNotification = ref(false)
let removeRouterGuard = null

function updateOperationStatus(event) {
  // Atualiza notificação fixa de operação em andamento
  if (event.detail && event.detail.info && event.detail.info.type === 'trade') {
    tradeInfo.value = event.detail.info
    showTradeNotification.value = !!(tradeInfo.value && tradeInfo.value.status === 'executando')
    // Se win/loss/erro, some a notificação após 2.5s
    if (['win', 'loss', 'erro'].includes(tradeInfo.value.status)) {
      setTimeout(() => {
        showTradeNotification.value = false
        tradeInfo.value = null
      }, 2500)
    }
  } else {
    showTradeNotification.value = false
    tradeInfo.value = null
  }
}

function updateBotStatus(event) {
  if (event.detail && typeof event.detail.isActive === 'boolean') {
    isBotActive.value = event.detail.isActive
  } else {
    isBotActive.value = false
  }
}

function handleMenuNav(e, to) {
  if (isBotActive.value) {
    e.preventDefault()
    Swal.fire({
      text: 'Desligue o bot para navegar.',
      icon: 'warning',
      toast: false,
      position: 'top',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      background: 'rgba(26, 31, 53, 0.98)',
      color: '#fff',
      customClass: { popup: 'custom-toast error' }
    })
    return false
  }
  if (router.currentRoute.value.path !== to) {
    router.push(to)
  }
}

onMounted(() => {
  window.addEventListener('bravus:operation-status', updateOperationStatus)
  window.addEventListener('bravus:operation-status', updateBotStatus)
  window.dispatchEvent(new CustomEvent('bravus:request-operation-status'))
  window.addEventListener('app:language-changed', updateLanguageFromEvent)
  
  // Ouvir atualizações de nome de usuário
  window.addEventListener('app:user-name-updated', (event) => {
    if (event.detail && event.detail.name) {
      userDisplayName.value = event.detail.name;
    }
  });

  // Tentar obter o nome do usuário novamente, caso tenha sido atualizado em outro componente
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.firstName) {
        userDisplayName.value = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
      }
    } catch (error) {
      console.error('Erro ao analisar objeto de usuário:', error);
    }
  }

  // Bloqueio global de navegação se o bot estiver ativo
  removeRouterGuard = router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/register') return next()
    if (isBotActive.value) {
      Swal.fire({
        text: 'Desligue o bot para navegar.',
        icon: 'warning',
        toast: false,
        position: 'top',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        background: 'rgba(26, 31, 53, 0.98)',
        color: '#fff',
        customClass: { popup: 'custom-toast error' }
      })
      next(false)
    } else {
      next()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('bravus:operation-status', updateOperationStatus)
  window.removeEventListener('bravus:operation-status', updateBotStatus)
  window.removeEventListener('app:language-changed', updateLanguageFromEvent)
  window.removeEventListener('app:user-name-updated', (event) => {
    if (event.detail && event.detail.name) {
      userDisplayName.value = event.detail.name;
    }
  })
  if (removeRouterGuard) removeRouterGuard()
})
</script>

<style scoped>
/* Modern Sidebar Design */
.sidebar-modern {
  width: 280px;
  height: 100vh;
  background: #0f172a;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
}

.sidebar-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

/* Logo Section */
.sidebar-header {
  padding: 2rem 1.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.logo-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  filter: blur(20px);
  animation: pulse-glow 3s ease-in-out infinite;
}

.logo-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3));
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 0.75rem;
  padding-left: 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 0.75rem;
  margin-bottom: 0.25rem;
  border-radius: 0.75rem;
  color: #94a3b8;
  text-decoration: none;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.nav-item:hover::before {
  transform: translateX(100%);
}

.nav-item:hover {
  color: #fff;
  background: rgba(59, 130, 246, 0.05);
  transform: translateX(4px);
}

.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, #3b82f6, #06b6d4);
  border-radius: 0 2px 2px 0;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-active {
  color: #3b82f6;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.nav-active .nav-indicator {
  height: 70%;
}

.nav-active .nav-icon {
  color: #3b82f6;
  animation: icon-bounce 0.5s;
}

.nav-icon {
  font-size: 1.125rem;
  width: 1.5rem;
  transition: transform 0.3s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-external-icon {
  font-size: 0.625rem;
  opacity: 0;
  transform: translate(-4px, -4px);
  transition: all 0.3s;
}

.nav-item:hover .nav-external-icon {
  opacity: 0.5;
  transform: translate(0, -4px);
}

.nav-badge {
  position: relative;
}

.pulse-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

/* Footer Section */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  background: rgba(15, 23, 42, 0.5);
  margin-top: auto;
  flex-shrink: 0;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

/* Animations */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 currentColor; }
  70% { box-shadow: 0 0 0 6px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Glass Effects for other elements */
.glass-notification {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-button {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.4));
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Floating Orbs */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float-orb 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  bottom: -150px;
  right: -100px;
  animation-delay: 5s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(40px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-30px, 40px) scale(0.95);
  }
  75% {
    transform: translate(20px, 20px) scale(1.05);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar-modern {
    position: fixed !important;
    left: 0;
    top: 0;
    height: 100vh;
    min-height: 100vh;
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 55;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }
}

@media (min-width: 768px) {
  .sidebar-modern {
    position: fixed;
    transform: translateX(0);
    height: 100vh;
    left: 0;
    top: 0;
  }
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s cubic-bezier(.4,0,.2,1);
}
</style>