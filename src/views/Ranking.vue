<template>
  <AppLayout>
    <div class="min-h-screen">
      <!-- Floating Orbs -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>

      <!-- Main Container -->
      <div class="p-4 lg:p-6 max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-2 lg:gap-3">
                <i class="fas fa-trophy text-yellow-400 text-xl lg:text-2xl"></i>
                Ranking de Depositantes
              </h1>
              <p class="text-gray-400 text-sm lg:text-base">Maiores depositantes da plataforma por volume investido</p>
            </div>
            
            <!-- Period Filter -->
            <div class="flex gap-1 lg:gap-2 overflow-x-auto">
              <button 
                v-for="period in periods" 
                :key="period.value"
                @click="selectedPeriod = period.value"
                :class="[
                  'px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-medium transition-all text-sm lg:text-base whitespace-nowrap',
                  selectedPeriod === period.value 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-blue-500'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
        </div>



        <!-- Top 3 Podium -->
        <div class="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
          <h2 class="text-lg lg:text-xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
            <i class="fas fa-medal text-yellow-400 text-base lg:text-lg"></i>
            Top 3 Maiores Depositantes
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <!-- 2nd Place -->
            <div class="lg:order-1 order-2">
              <div class="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-700 hover:border-slate-600 transition-all">
                <div class="absolute -top-3 -right-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-lg">2</span>
                  </div>
                </div>
                
                <div class="text-center mb-4">
                  <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <i class="fas fa-user text-white text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-bold text-white">Carlos Silva</h3>
                  <p class="text-sm text-gray-400">@carlos_trader</p>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Depósito</span>
                    <span class="text-white font-medium">R$ 185.000</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Primeiro Depósito</span>
                    <span class="text-blue-400 font-medium">Jan/2023</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Total de Depósitos</span>
                    <span class="text-purple-400 font-medium">47</span>
                  </div>
                </div>
                
                <button class="w-full mt-4 py-2 bg-slate-800/50 text-gray-400 rounded-lg hover:bg-slate-800/70 hover:text-white transition-all">
                  <i class="fas fa-eye mr-2"></i>
                  Ver Perfil
                </button>
              </div>
            </div>

            <!-- 1st Place -->
            <div class="lg:order-2 order-1">
              <div class="relative bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 border-yellow-600/50 hover:border-yellow-500 transition-all transform lg:scale-105">
                <div class="absolute -top-4 -right-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <i class="fas fa-crown text-white text-xl"></i>
                  </div>
                </div>
                
                <div class="text-center mb-4">
                  <div class="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center ring-4 ring-yellow-400/30">
                    <i class="fas fa-user text-white text-3xl"></i>
                  </div>
                  <h3 class="text-xl font-bold text-white">João Pedro</h3>
                  <p class="text-sm text-yellow-400">@jp_gold_trader</p>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Depósito</span>
                    <span class="text-yellow-400 font-bold text-lg">R$ 250.000</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Primeiro Depósito</span>
                    <span class="text-blue-400 font-bold">Nov/2022</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Total de Depósitos</span>
                    <span class="text-purple-400 font-bold">83</span>
                  </div>
                </div>
                
                <button class="w-full mt-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all transform hover:scale-[1.02]">
                  <i class="fas fa-star mr-2"></i>
                  Ver Perfil
                </button>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="lg:order-3 order-3">
              <div class="relative bg-gradient-to-br from-orange-900/20 to-amber-900/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-orange-700/50 hover:border-orange-600 transition-all">
                <div class="absolute -top-3 -right-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-lg">3</span>
                  </div>
                </div>
                
                <div class="text-center mb-4">
                  <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center">
                    <i class="fas fa-user text-white text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-bold text-white">Maria Santos</h3>
                  <p class="text-sm text-gray-400">@maria_fx</p>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Depósito</span>
                    <span class="text-white font-medium">R$ 150.000</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Primeiro Depósito</span>
                    <span class="text-blue-400 font-medium">Mar/2023</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Total de Depósitos</span>
                    <span class="text-purple-400 font-medium">35</span>
                  </div>
                </div>
                
                <button class="w-full mt-4 py-2 bg-orange-800/30 text-orange-400 rounded-lg hover:bg-orange-800/50 transition-all">
                  <i class="fas fa-eye mr-2"></i>
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Ranking Table -->
        <div class="glass-card rounded-xl lg:rounded-2xl p-4 lg:p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
            <h2 class="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
              <i class="fas fa-list-ol text-blue-400 text-base lg:text-lg"></i>
              Ranking Completo
            </h2>
            
            <div class="flex gap-2">
              <button class="px-3 py-1.5 rounded-lg bg-slate-900/50 text-gray-400 text-sm hover:text-white transition-all">
                <i class="fas fa-filter mr-1"></i>
                Filtros
              </button>
              <button class="px-3 py-1.5 rounded-lg bg-slate-900/50 text-gray-400 text-sm hover:text-white transition-all">
                <i class="fas fa-download mr-1"></i>
                Exportar
              </button>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="block lg:hidden">
            <div class="space-y-3">
              <div v-for="(trader, index) in paginatedTraders" :key="trader.id" 
                class="glass-card p-4 rounded-xl">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <span class="text-white font-bold text-lg">#{{ trader.position }}</span>
                      <i v-if="trader.trend === 'up'" class="fas fa-arrow-up text-green-400 text-xs"></i>
                      <i v-else-if="trader.trend === 'down'" class="fas fa-arrow-down text-red-400 text-xs"></i>
                      <i v-else class="fas fa-minus text-gray-400 text-xs"></i>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <i class="fas fa-user text-white text-sm"></i>
                    </div>
                  </div>
                  <span v-if="trader.isOnline" class="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                    <span class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Offline
                  </span>
                </div>
                
                <div class="mb-3">
                  <p class="text-white font-medium">{{ trader.name }}</p>
                  <p class="text-xs text-gray-400">{{ trader.username }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p class="text-gray-400 text-xs mb-1">Depósito Total</p>
                    <p class="text-white font-medium">R$ {{ trader.deposit.toLocaleString('pt-BR') }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400 text-xs mb-1">Nº Depósitos</p>
                    <p class="text-white font-medium">{{ trader.totalDeposits }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400 text-xs mb-1">Último Depósito</p>
                    <p class="text-gray-300">{{ trader.lastDeposit }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400 text-xs mb-1">Média Mensal</p>
                    <p class="text-blue-400 font-medium">R$ {{ trader.monthlyAverage.toLocaleString('pt-BR') }}</p>
                  </div>
                </div>
                
                <button class="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm">
                  <i class="fas fa-eye mr-1"></i>
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop View -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-gray-400 text-sm border-b border-slate-800">
                  <th class="text-left pb-4 pl-4">Posição</th>
                  <th class="text-left pb-4">Depositante</th>
                  <th class="text-left pb-4">Depósito Total</th>
                  <th class="text-left pb-4">Nº Depósitos</th>
                  <th class="text-left pb-4">Último Depósito</th>
                  <th class="text-left pb-4">Média Mensal</th>
                  <th class="text-center pb-4">Status</th>
                  <th class="text-center pb-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(trader, index) in paginatedTraders" :key="trader.id" 
                  class="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                  <td class="py-4 pl-4">
                    <div class="flex items-center gap-2">
                      <span class="text-white font-medium">#{{ trader.position }}</span>
                      <i v-if="trader.trend === 'up'" class="fas fa-arrow-up text-green-400 text-xs"></i>
                      <i v-else-if="trader.trend === 'down'" class="fas fa-arrow-down text-red-400 text-xs"></i>
                      <i v-else class="fas fa-minus text-gray-400 text-xs"></i>
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <i class="fas fa-user text-white text-sm"></i>
                      </div>
                      <div>
                        <p class="text-white font-medium">{{ trader.name }}</p>
                        <p class="text-xs text-gray-400">{{ trader.username }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4">
                    <span class="text-white font-medium">R$ {{ trader.deposit.toLocaleString('pt-BR') }}</span>
                  </td>
                  <td class="py-4">
                    <span class="text-white font-medium">{{ trader.totalDeposits }}</span>
                  </td>
                  <td class="py-4">
                    <span class="text-gray-400">{{ trader.lastDeposit }}</span>
                  </td>
                  <td class="py-4">
                    <span class="text-blue-400 font-medium">
                      R$ {{ trader.monthlyAverage.toLocaleString('pt-BR') }}
                    </span>
                  </td>
                  <td class="py-4 text-center">
                    <span v-if="trader.isOnline" class="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                      <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Online
                    </span>
                    <span v-else class="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      Offline
                    </span>
                  </td>
                  <td class="py-4 text-center">
                    <button class="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm">
                      <i class="fas fa-eye mr-1"></i>
                      Detalhes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 lg:mt-6">
            <p class="text-gray-400 text-xs lg:text-sm text-center sm:text-left">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, topTraders.length) }} de {{ topTraders.length }} depositantes
            </p>
            
            <div class="flex gap-1 lg:gap-2">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg bg-slate-900/50 text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg transition-all text-sm lg:text-base',
                  currentPage === page 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-900/50 text-gray-400 hover:text-white'
                ]"
              >
                {{ page }}
              </button>
              
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg bg-slate-900/50 text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

// Period filter
const periods = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'all', label: 'Todos' }
]
const selectedPeriod = ref('month')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data
const topTraders = ref([
  { id: 1, position: 1, name: 'João Pedro', username: '@jp_gold_trader', deposit: 250000, totalDeposits: 83, lastDeposit: 'Há 2 dias', monthlyAverage: 12500, isOnline: true, trend: 'up' },
  { id: 2, position: 2, name: 'Carlos Silva', username: '@carlos_trader', deposit: 185000, totalDeposits: 47, lastDeposit: 'Há 5 dias', monthlyAverage: 9250, isOnline: true, trend: 'up' },
  { id: 3, position: 3, name: 'Maria Santos', username: '@maria_fx', deposit: 150000, totalDeposits: 35, lastDeposit: 'Há 1 semana', monthlyAverage: 7500, isOnline: false, trend: 'down' },
  { id: 4, position: 4, name: 'Pedro Oliveira', username: '@pedro_pro', deposit: 120000, totalDeposits: 28, lastDeposit: 'Hoje', monthlyAverage: 6000, isOnline: true, trend: 'up' },
  { id: 5, position: 5, name: 'Ana Costa', username: '@ana_trader', deposit: 95000, totalDeposits: 22, lastDeposit: 'Há 3 dias', monthlyAverage: 4750, isOnline: true, trend: 'same' },
  { id: 6, position: 6, name: 'Lucas Ferreira', username: '@lucas_fx', deposit: 87000, totalDeposits: 19, lastDeposit: 'Há 2 semanas', monthlyAverage: 4350, isOnline: false, trend: 'down' },
  { id: 7, position: 7, name: 'Juliana Lima', username: '@ju_profits', deposit: 75000, totalDeposits: 18, lastDeposit: 'Ontem', monthlyAverage: 3750, isOnline: true, trend: 'up' },
  { id: 8, position: 8, name: 'Roberto Alves', username: '@roberto_win', deposit: 68000, totalDeposits: 15, lastDeposit: 'Há 4 dias', monthlyAverage: 3400, isOnline: true, trend: 'same' },
  { id: 9, position: 9, name: 'Fernanda Souza', username: '@fer_trader', deposit: 62000, totalDeposits: 14, lastDeposit: 'Há 1 semana', monthlyAverage: 3100, isOnline: false, trend: 'up' },
  { id: 10, position: 10, name: 'Marcos Paulo', username: '@marcos_fx', deposit: 58000, totalDeposits: 12, lastDeposit: 'Hoje', monthlyAverage: 2900, isOnline: true, trend: 'down' },
  { id: 11, position: 11, name: 'Patricia Dias', username: '@paty_gold', deposit: 52000, totalDeposits: 11, lastDeposit: 'Há 6 dias', monthlyAverage: 2600, isOnline: true, trend: 'up' },
  { id: 12, position: 12, name: 'Gabriel Santos', username: '@gabriel_pro', deposit: 48000, totalDeposits: 10, lastDeposit: 'Há 3 semanas', monthlyAverage: 2400, isOnline: false, trend: 'same' },
  { id: 13, position: 13, name: 'Camila Rocha', username: '@camila_fx', deposit: 45000, totalDeposits: 9, lastDeposit: 'Ontem', monthlyAverage: 2250, isOnline: true, trend: 'up' },
  { id: 14, position: 14, name: 'Bruno Martins', username: '@bruno_trader', deposit: 41000, totalDeposits: 8, lastDeposit: 'Há 10 dias', monthlyAverage: 2050, isOnline: true, trend: 'down' },
  { id: 15, position: 15, name: 'Larissa Mendes', username: '@lari_profits', deposit: 38000, totalDeposits: 7, lastDeposit: 'Há 2 dias', monthlyAverage: 1900, isOnline: false, trend: 'up' }
])

const totalPages = computed(() => Math.ceil(topTraders.value.length / itemsPerPage))
const paginatedTraders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return topTraders.value.slice(start, end)
})

// Visible pages for pagination (show only 3 pages on mobile, 5 on desktop)
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = window.innerWidth < 640 ? 3 : 5
  const halfVisible = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, currentPage.value - halfVisible)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>

<style scoped>
/* Glass Card Effect */
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.3));
  border: 1px solid rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  bottom: 20%;
  left: 10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(40px, -60px) scale(1.1);
  }
  50% {
    transform: translate(-30px, 40px) scale(0.95);
  }
  75% {
    transform: translate(50px, 20px) scale(1.05);
  }
}
</style>