<template>
  <AppLayout>
    <div id="trade-notification-container" class="fixed top-0 right-0 z-50"></div>
    
    <div id="profit-notifications-container" class="fixed bottom-4 left-4 z-50 space-y-2 max-w-md"></div>
    
    <!-- Modal de acesso bloqueado (sem saldo) - aparece após clicar em depositar no modal de primeiro acesso -->
    <div v-if="accessBlocked && (!isFirstAccess || (isFirstAccess && balance <= 0 && !showFirstAccessModal))" class="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fas fa-lock text-red-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Acesso Bloqueado</h3>
          
          <div class="mb-4">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-300 mb-2">Aguardando depósito inicial...</p>
            <p class="text-red-400 font-semibold mb-4">Acesso a IA desativado por falta de saldo.</p>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
            <i class="fas fa-wallet"></i>
            DEPOSITAR AGORA E ATIVAR MINHA CONTA
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de primeiro acesso com saldo zero (bloqueia o acesso) -->
    <div v-if="isFirstAccess && balance <= 0 && showFirstAccessModal" class="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fas fa-gift text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Ative sua conta</h3>
          
          <div>
            <p class="text-blue-300 text-lg font-semibold mb-4">Você foi um dos escolhidos para ganhar o primeiro depósito em DOBRO!</p>
            <p class="text-white mb-6">Use o CUPOM: <span class="text-yellow-400 font-bold">SUPER100</span> para dobrar o valor depositado e liberar a IA.</p>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
            <i class="fas fa-wallet"></i>
            DEPOSITAR AGORA
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de primeiro acesso com saldo positivo (pode ser fechado) -->
    <div v-if="showBonusModal && balance > 0" class="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4 relative">
        <button @click="showBonusModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-center">
          <i class="fas fa-gift text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Oferta Especial!</h3>
          
          <div>
            <p class="text-blue-300 text-lg font-semibold mb-4">Você foi um dos escolhidos para ganhar o primeiro depósito em DOBRO!</p>
            <p class="text-white mb-6">Use o CUPOM: <span class="text-yellow-400 font-bold">SUPER100</span> para dobrar o valor depositado.</p>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
            <i class="fas fa-wallet"></i>
            APROVEITAR OFERTA
          </button>
        </div>
      </div>
    </div>
    
    <div class="min-h-screen">
      <div class="p-4 lg:p-6 max-w-7xl mx-auto">
        <div class="mb-8">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">Copy Trader IA</h1>
              <p class="text-gray-400">Bem-vindo(a), {{ userDisplayName }}</p>
            </div>

            <div class="flex items-center gap-4">
              <div class="glass-card px-6 py-3 rounded-xl">
                <div class="flex items-center gap-3">
                  <div>
                    <p class="text-xs text-gray-400">Saldo</p>
                    <p class="text-xl font-bold text-blue-400">{{ formatCurrency(balance) }}</p>
                  </div>
                  <div class="w-px h-10 bg-gray-700"></div>
                  <button @click="switchAccount"
                    class="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all text-sm">
                    {{ accountType === 'demo' ? 'DEMO' : 'REAL' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-1 space-y-6">
            <div class="glass-card p-6 rounded-2xl">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-coins text-blue-400"></i>
                Selecionar Ativo
              </h3>

              <div class="space-y-3">
                <div class="relative">
                  <select v-model="selectedAsset"
                    class="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                  
                    <option v-for="asset in availableAssets" :key="asset.name" :value="asset.name">
                      {{ asset.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="text-sm text-gray-400 mb-2 block">Tempo de Expiração</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button v-for="time in [1, 5]" :key="time" @click="selectedTime = time"
                      :class="['py-2 rounded-lg font-medium transition-all', selectedTime === time ? 'bg-blue-500 text-white' : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-blue-500']">
                      {{ time }}M
                    </button>
                  </div>
                </div>

                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-robot text-blue-400"></i>
                Gerador de Sinais IA
              </h3>
              <div class="space-y-4">
                <button @click="handleGenerateSignal"
                        :disabled="isGeneratingSignal || isTradeInProgress || isWaitingForEntryTime"
                        class="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i :class="isGeneratingSignal ? 'fas fa-spinner fa-spin' : 'fas fa-wand-magic-sparkles'"></i>
                  <span v-if="isGeneratingSignal">Gerando...</span>
                  <span v-else-if="isWaitingForEntryTime">Aguardando Horário de Entrada</span>
                  <span v-else-if="isTradeInProgress">Operação em Andamento</span>
                  <span v-else>Gerar Sinal</span>
                </button>
                <p v-if="isTradeInProgress" class="text-xs text-amber-400 mt-2 text-center">
                  <i class="fas fa-info-circle mr-1"></i> Conclua a operação atual antes de gerar um novo sinal
                </p>
                <p v-if="isWaitingForEntryTime" class="text-xs text-amber-400 mt-2 text-center">
                  <i class="fas fa-clock mr-1"></i> Aguardando o horário de entrada para iniciar a operação
                </p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <div class="glass-card p-6 rounded-2xl h-full min-h-[500px]">
              <div class="flex justify-between items-center mb-4">
                 <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-chart-line text-blue-400"></i>
                  Gráfico de Atividade
                </h3>
              </div>

              <div class="bg-slate-900/50 rounded-xl">
                 <apexchart
                   v-if="chartSeries[0].data.length > 0"
                   type="candlestick"
                   height="400"
                   :options="chartOptions"
                   :series="chartSeries"
                 ></apexchart>
                 <div v-else class="h-[400px] flex flex-col items-center justify-center text-gray-500">
                    <i class="fas fa-spinner fa-spin text-4xl text-blue-400/50"></i>
                    <p class="mt-4">Carregando dados do gráfico...</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-trophy text-green-400"></i>
              </div>
              <span class="text-2xl font-bold text-green-400">{{ transactionStats.total > 0 ? transactionStats.winPercent : 0 }}%</span>
            </div>
            <h4 class="text-gray-400 text-sm">Taxa de Acerto</h4>
            <div class="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-500 to-green-400"
                :style="{ width: transactionStats.winPercent > 0 ? `${transactionStats.winPercent}%` : '0%' }"></div>
            </div>
          </div>

          <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-exchange-alt text-blue-400"></i>
              </div>
              <span class="text-2xl font-bold text-white">{{ transactionStats.total }}</span>
            </div>
            <h4 class="text-gray-400 text-sm">Total de Operações</h4>
            <div class="mt-3 flex gap-4 text-xs">
              <span class="text-green-400">{{ transactionStats.wins }} wins</span>
              <span class="text-red-400">{{ transactionStats.losses }} losses</span>
            </div>
          </div>

          <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-line text-purple-400"></i>
              </div>
              <span class="text-2xl font-bold text-purple-400">{{ formatCurrency(transactionStats.totalProfit) }}</span>
            </div>
            <h4 class="text-gray-400 text-sm">Lucro Total</h4>
            <div class="mt-3">
              <span class="text-xs text-gray-500">ROI: {{ roiStats.totalROI }}%</span>
            </div>
          </div>

          <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-users text-cyan-400"></i>
              </div>
              <span class="text-2xl font-bold text-white">1,234</span>
            </div>
            <h4 class="text-gray-400 text-sm">Traders Ativos</h4>
            <div class="mt-3">
              <span class="text-xs text-green-400">+12% hoje</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fas fa-history text-blue-400"></i>
              Operações Recentes
            </h3>
            <button @click="showTransactionHistory" class="text-blue-400 hover:text-blue-300 transition-all text-sm">
              Ver todas <i class="fas fa-arrow-right ml-1"></i>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-gray-400 text-sm">
                  <th class="text-left pb-4 px-2 md:px-3">Ativo</th>
                  <th class="text-left pb-4 px-2 md:px-3">Direção</th>
                  <th class="text-left pb-4 px-2 md:px-3 hidden sm:table-cell">Tempo</th>
                  <th class="text-right pb-4 px-2 md:px-3">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in [...history].sort((a, b) => new Date(b.payload?.closeTime || b.createdAt) - new Date(a.payload?.closeTime || a.createdAt)).slice(0, 5)"
                  :key="idx" 
                  class="border-t border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  @click="showTradeDetailModal(item.uniqueId)">
                  <td class="py-3 px-2 md:px-3">
                    <div class="flex items-center gap-1 md:gap-2">
                      <div class="flex -space-x-2 mr-1">
                        <img :src="getCurrencyFlag(item.payload?.active?.name || 'EURUSD', 0)"
                          class="w-5 h-5 rounded-full">
                        <img :src="getCurrencyFlag(item.payload?.active?.name || 'EURUSD', 1)"
                          class="w-5 h-5 rounded-full">
                      </div>
                      <span class="text-white text-sm md:text-base">{{ item.payload?.active?.name || 'N/A' }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-2 md:px-3">
                    <span :class="item.payload?.pnl >= 0 ? 'text-green-400' : 'text-red-400'"
                      class="flex items-center gap-1 text-sm md:text-base">
                      <i :class="item.payload?.pnl >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ item.payload?.pnl >= 0 ? 'CALL' : 'PUT' }}
                    </span>
                  </td>
                  <td class="py-3 px-2 md:px-3 text-gray-400 hidden sm:table-cell text-sm md:text-base">
                    {{ formatDateTime(item.payload?.closeTime || item.createdAt) }}
                  </td>
                  <td class="py-3 px-2 md:px-3 text-right">
                    <span :class="item.payload?.pnl >= 0 ? 'text-green-400' : 'text-red-400'" class="font-medium text-sm md:text-base">
                      {{ item.payload?.pnl >= 0 ? '+' : '' }}{{ formatCurrency(item.payload?.pnl || 0) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '@/components/AppLayout.vue'
import Apexchart from 'vue3-apexcharts'
import axios from 'axios'
const router = useRouter()

// State variables
const userDisplayName = ref('Usuário(a)')
const balance = ref(0)
const accountType = ref('real')
const isGeneratingSignal = ref(false)
const history = ref([])
const GALES = ref(2)
const initialBalance = ref(null)

// --- Variáveis para verificação de acesso e saldo ---
const isFirstAccess = ref(false)
const accessBlocked = ref(false)
const showBonusModal = ref(false)
const showFirstAccessModal = ref(true) // Controla a exibição do modal de primeiro acesso
const checkingBalanceInterval = ref(null)
const userEmail = ref(localStorage.getItem('userEmail') || '')
let fakeNotificationInterval = null;

// --- Arrays de notificações ---
const profitNotifications = [
  { name: "Carlos S.", pair: "USD/BRL", amount: 37.50 },
  { name: "Marcela R.", pair: "BTC/USD", amount: 178.34 },
  { name: "João P.", pair: "EUR/USD", amount: 92.15 },
  { name: "Ana B.", pair: "ETH/USD", amount: 243.60 },
  { name: "Rafael M.", pair: "GBP/USD", amount: 115.25 },
]
const activationNotifications = [
  "Fernanda S. ativou sua conta e começou a operar",
  "Lucas M. ativou sua conta e começou a operar",
  "Beatriz P. ativou sua conta e começou a operar",
]

// Trading variables
const selectedAsset = ref('EURUSD')
const selectedTime = ref(1)
const defaultUserSettings = { entryValue: 10, stopWin: 100, stopLoss: 100 }
const userSettings = ref({ ...defaultUserSettings })
const COLLECTION_NAME = 'autopilot'
const availableAssets = ref([]);

// Variáveis para controlar o estado da operação
const isTradeInProgress = ref(false);
const isWaitingForEntryTime = ref(false);
const currentTradeInfo = ref(null);

// --- LÓGICA DO GRÁFICO ---
let chartUpdateInterval = null;
const chartSeries = ref([{ data: [] }]);
const chartOptions = computed(() => ({
  chart: { type: 'candlestick', height: 400, background: 'transparent', toolbar: { show: false }, zoom: { enabled: false } },
  title: { text: `Gráfico de ${selectedAsset.value}`, align: 'left', style: { fontSize: '16px', color: '#E2E8F0', } },
  xaxis: { type: 'datetime', labels: { style: { colors: '#94A3B8' } }, axisBorder: { show: false }, axisTicks: { color: '#334155' } },
  yaxis: { tooltip: { enabled: true }, labels: { style: { colors: '#94A3B8' }, formatter: function (val) { if (typeof val === 'number') { return val.toFixed(5); } return ''; } }, opposite: true },
  grid: { borderColor: 'rgba(59, 130, 246, 0.1)', xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
  tooltip: { theme: 'dark', style: { fontSize: '12px', fontFamily: 'monospace' } },
  plotOptions: { candlestick: { colors: { upward: '#22c55e', downward: '#ef4444' }, wick: { useFillColor: true } } },
  series: [{ data: chartSeries.value[0].data, }]
}));

const updateChart = async () => {
  try {
    const candleData = await getCandles(selectedAsset.value, selectedTime.value * 60);
    const candles = candleData.results;

    if (Array.isArray(candles) && candles.length > 0) {
      const seriesData = candles.map(candle => ({
        x: new Date(candle.time).getTime(), 
        y: [candle.open, candle.high, candle.low, candle.close]
      }));
      chartSeries.value = [{ data: seriesData }];
    } else {
       chartSeries.value = [{ data: [] }];
    }
  } catch (error) {
    console.error("Erro ao atualizar os candles do gráfico:", error);
  }
};

// --- Funções de verificação de acesso e saldo (LÓGICA CORRIGIDA) ---
// --- Verificação de acesso ao usuário ---
const verifyUserAccess = async () => {
  if (!userEmail.value) {
    console.error('Email do usuário não encontrado para verificação.');
    return;
  }
  try {
    const { data } = await axios.post('http://localhost:2006/api/verify-user', { email: userEmail.value });
    if (data.success) {
      console.log('Verificação do usuário:', data.user);
      isFirstAccess.value = data.user.isFirstAccess;

      // Implmentação das três condições:
      // 1. Primeiro acesso + saldo 0: Mostrar modal e bloquear acesso
      // 2. Primeiro acesso + saldo > 0: Mostrar modal promocional que pode ser fechado
      // 3. Não é primeiro acesso + saldo 0: Bloquear acesso
      
      if (isFirstAccess.value && balance.value <= 0) {
        // Condição 1: Primeiro acesso + saldo 0 (bloqueia acesso)
        console.log('Primeiro acesso com saldo zero: bloqueando acesso e mostrando modal promocional');
        accessBlocked.value = true; // Bloqueia o acesso
        showBonusModal.value = false; // Não mostra o modal que pode ser fechado
        showFirstAccessModal.value = true; // Mostra o modal de primeiro acesso
        
        // Registramos o primeiro acesso na API, mas não atualizamos o estado local para manter o modal visível
        try {
          await axios.post('http://localhost:2006/api/register-first-access', { email: userEmail.value });
          console.log('Usuário registrado na API como não sendo mais primeiro acesso, mas mantendo estado local para exibir o modal');
          // Não definimos isFirstAccess.value = false aqui para manter o modal visível
        } catch (error) {
          console.error('Erro ao registrar automaticamente o primeiro acesso:', error);
        }
        
        startCheckingBalance();
        startFakeNotifications();
      } else if (isFirstAccess.value && balance.value > 0) {
        // Condição 2: Primeiro acesso + saldo positivo (mostra modal que pode ser fechado)
        console.log('Primeiro acesso com saldo positivo: permitindo acesso e mostrando modal promocional');
        accessBlocked.value = false; // Não bloqueia o acesso
        showBonusModal.value = true; // Mostra o modal que pode ser fechado
        showFirstAccessModal.value = false; // Não mostra o modal de primeiro acesso
        
        // Registra automaticamente que o usuário já não é mais primeiro acesso
        try {
          await axios.post('http://localhost:2006/api/register-first-access', { email: userEmail.value });
          console.log('Usuário registrado automaticamente como não sendo mais primeiro acesso');
          // Não atualizamos isFirstAccess.value aqui para evitar que o modal desapareça
        } catch (error) {
          console.error('Erro ao registrar automaticamente o primeiro acesso:', error);
        }
      } else if (!isFirstAccess.value && balance.value <= 0) {
        // Condição 3: Não é primeiro acesso + saldo 0 (bloqueia acesso)
        console.log('Acesso bloqueado: saldo zerado e não é primeiro acesso');
        accessBlocked.value = true; // Bloqueia o acesso
        showBonusModal.value = false; // Não mostra nenhum modal promocional
        showFirstAccessModal.value = false; // Não mostra o modal de primeiro acesso
        startCheckingBalance();
        startFakeNotifications();
      } else {
        // Caso padrão: Não é primeiro acesso + saldo positivo
        console.log('Acesso liberado: não é primeiro acesso e tem saldo positivo');
        accessBlocked.value = false;
        showBonusModal.value = false;
        showFirstAccessModal.value = false;
      }
    } else {
      showToast('Erro ao verificar suas informações de acesso.', 'error');
    }
  } catch (error) {
    console.error('Falha na API de verificação de usuário:', error);
    showToast('Não foi possível conectar para verificar seu acesso.', 'error');
  }
};

const redirectToDeposit = async () => {
  // Fechar o modal de bônus se estiver aberto
  if (showBonusModal.value) {
    showBonusModal.value = false;
    
    // Se for um modal de bônus (não o primeiro acesso com saldo zero), 
    // podemos atualizar o estado de primeiro acesso
    isFirstAccess.value = false;
  } else if (isFirstAccess.value && balance.value <= 0) {
    // Quando for o modal de primeiro acesso com saldo zero,
    // ocultamos o modal de primeiro acesso e mostramos a animação de verificação
    showFirstAccessModal.value = false;
    accessBlocked.value = true;
    startCheckingBalance();
    startFakeNotifications();
  }
  
  // Exibe uma mensagem de sucesso
  showToast('Conta pré-ativada! Complete o depósito para começar.', 'success');
  
  // Redireciona para a página de depósito em uma nova aba
  window.open('https://trade.polariumbroker.com/traderoom/', '_blank');
};

const startCheckingBalance = () => {
  if (checkingBalanceInterval.value) clearInterval(checkingBalanceInterval.value);
  console.log('Iniciando verificação de saldo a cada 5 segundos...');
  
  checkingBalanceInterval.value = setInterval(async () => {
    await updateBalance();
    console.log('Verificação periódica de saldo:', balance.value);
    
    if (balance.value > 0) {
      console.log('Saldo positivo detectado, liberando acesso');
      accessBlocked.value = false;
      showFirstAccessModal.value = false; // Garantir que o modal de primeiro acesso não apareça
      stopCheckingBalance();
      stopFakeNotifications();
      
      Swal.fire({
        icon: 'success',
        title: 'Conta Ativada!',
        text: 'Seu depósito foi recebido. Acesso à IA liberado!',
        background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
        color: '#fff',
        confirmButtonColor: '#3B82F6',
      });
    }
  }, 5000);
};

const stopCheckingBalance = () => {
  if (checkingBalanceInterval.value) {
    console.log('Parando verificação de saldo.');
    clearInterval(checkingBalanceInterval.value);
    checkingBalanceInterval.value = null;
  }
};

const startFakeNotifications = () => {
  if (fakeNotificationInterval) clearInterval(fakeNotificationInterval);
  
  const showRandomNotification = () => {
      const isProfit = Math.random() > 0.4;
      const container = document.getElementById('profit-notifications-container');
      if (!container) return;

      let message = '';
      if (isProfit) {
          const notification = profitNotifications[Math.floor(Math.random() * profitNotifications.length)];
          message = `<i class="fas fa-chart-line text-green-400 mr-2"></i> <strong>${notification.name}</strong> lucrou <strong>${formatCurrency(notification.amount)}</strong> no par ${notification.pair}`;
      } else {
          message = `<i class="fas fa-user-check text-blue-400 mr-2"></i> ${activationNotifications[Math.floor(Math.random() * activationNotifications.length)]}`;
      }
      
      const notificationElement = document.createElement('div');
      notificationElement.className = 'glass-card text-white p-3 rounded-lg shadow-lg animate-fade-in-up text-sm';
      notificationElement.innerHTML = message;
      container.appendChild(notificationElement);

      setTimeout(() => {
          notificationElement.classList.add('animate-fade-out');
          setTimeout(() => notificationElement.remove(), 500);
      }, 4500);
  };

  fakeNotificationInterval = setInterval(showRandomNotification, 6000 + Math.random() * 4000);
}

const stopFakeNotifications = () => {
  if (fakeNotificationInterval) {
    clearInterval(fakeNotificationInterval);
    fakeNotificationInterval = null;
  }
}


// --- Funções Utilitárias e de Lógica de Negociação (COMPLETAS) ---

function showToast(title, icon = 'info', timer = 4000) {
  if (isTradeInProgress.value && timer !== undefined) {
    console.log(title);
    return;
  }
  Swal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    background: 'rgba(26, 31, 53, 0.95)',
    color: '#fff',
    customClass: { popup: `custom-toast` }
  })
}

function showTradeNotification(message, pair) {
  if (!isTradeInProgress.value) return;
  const currentPopup = Swal.getPopup();
  if (currentPopup && document.body.contains(currentPopup)) {
    const statusEl = document.getElementById('swal-trade-status');
    if (statusEl) statusEl.innerHTML = message;
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: undefined,
      background: 'rgba(26, 31, 53, 0.95)',
      color: '#fff',
      icon: 'info',
      title: 'Operação em Andamento',
      html: `<div id="swal-trade-status">${message}</div>`,
      didOpen: () => Swal.showLoading(),
      target: document.getElementById('trade-notification-container') || document.body,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
}

const handleGenerateSignal = async () => {
  if (isTradeInProgress.value) {
    showToast('Não é possível gerar um novo sinal enquanto uma operação está em andamento.', 'warning', 6000);
    return;
  }
  if (isWaitingForEntryTime.value) {
    showToast('Não é possível gerar um novo sinal enquanto aguarda o horário de entrada.', 'warning', 6000);
    return;
  }

  isGeneratingSignal.value = true;
  showToast('Buscando sinal...', 'info');

  try {
    const pair = selectedAsset.value;
    const period = selectedTime.value;

    const candlesResponse = await getCandles(pair, period * 60);
    if (!candlesResponse || !candlesResponse.results || !Array.isArray(candlesResponse.results) || candlesResponse.results.length === 0) {
      throw new Error('Não foram retornados candles para gerar o sinal.');
    }

    const signalResponse = await generateSignal(pair, period, candlesResponse.results);
    if (!signalResponse || !signalResponse.data || !signalResponse.data.trade_action || !signalResponse.data.entry_time) {
      throw new Error('Sinal não encontrado, tente novamente.');
    }
    
    Swal.close();
    
    const data = {
      pair,
      timeframe: period * 60,
      ...signalResponse.data
    };
    showSignalConfirmationPopup(data);

  } catch (error) {
    console.error("Erro ao gerar sinal:", error);
    showToast(error.message, 'error', 6000);
  } finally {
    isGeneratingSignal.value = false;
  }
};

const showSignalConfirmationPopup = (signal) => {
  const { pair, timeframe, entry_time, trade_action } = signal;

  const directionText = trade_action === 'BUY'
    ? `<span style="color: #4ade80; font-weight: bold;">COMPRA</span>`
    : `<span style="color: #f87171; font-weight: bold;">VENDA</span>`;

  Swal.fire({
    title: `<span style='color:#fff;font-weight:bold;'>Sinal Encontrado!</span>`,
    html: `
      <div style="color: #cbd5e1; text-align: left; font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
          <strong style="color: #94a3b8;">Ativo:</strong>
          <span>${pair}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
          <strong style="color: #94a3b8;">Expiração:</strong>
          <span>${timeframe / 60} Minuto(s)</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
          <strong style="color: #94a3b8;">Entrada:</strong>
          <span>${formatDateTime(entry_time)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 4px;">
          <strong style="color: #94a3b8;">Ação:</strong>
          <span>${directionText}</span>
        </div>
      </div>
    `,
    icon: 'info',
    background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
    showCancelButton: true,
    confirmButtonText: 'Confirmar Operação',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#be123c',
    width: '90%',
    customClass: {
      popup: 'max-w-md'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      let entryDate = new Date(entry_time);
      entryDate.setHours(entryDate.getHours() - 3); 
      entryDate.setSeconds(0, 0); 
      const serverTimeNow = await getServerTime();
      const initialMsToWait = entryDate.getTime() - serverTimeNow.getTime();

      if (initialMsToWait > 0) {
        isWaitingForEntryTime.value = true;
        const countdownStartTime = Date.now();
        let interval;
        await new Promise(resolve => {
          function updateToast(diff) {
            const sec = Math.floor((diff / 1000) % 60);
            const min = Math.floor((diff / 1000 / 60) % 60);
            const countdown = `Restante: ${min > 0 ? min + 'm ' : ''}${sec}s`;
            if (!Swal.isVisible()) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: undefined,
                background: 'rgba(26, 31, 53, 0.95)',
                color: '#fff',
                icon: 'info',
                title: 'Aguardando horário de entrada',
                html: `<div style="color:#cbd5e1;">${formatDateTime(entryDate)}<br><span id="countdown-wait">${countdown}</span></div>`,
              });
            } else {
              const el = Swal.getHtmlContainer()?.querySelector('#countdown-wait');
              if (el) el.innerHTML = countdown;
            }
          }
          updateToast(initialMsToWait);
          interval = setInterval(() => {
            const elapsedTime = Date.now() - countdownStartTime;
            let diff = initialMsToWait - elapsedTime;
            if (diff < 0) diff = 0;
            updateToast(diff);
            if (diff <= 0) {
              clearInterval(interval);
              Swal.close();
              isWaitingForEntryTime.value = false;
              resolve();
            }
          }, 1000);
        });
      }
      const tradeData = {
        pair: pair,
        direction: trade_action === 'BUY' ? 'CALL' : 'PUT',
        period: timeframe ,
      };
      await executeTradeFromSignal(tradeData);
    }
  });
};

const executeTradeFromSignal = async (signalData) => {
  const { pair, direction, period } = signalData;
  isTradeInProgress.value = true;
  currentTradeInfo.value = { pair, direction, period };
  showTradeNotification(`Iniciando para ${pair}...`, pair);

  await updateBalance();
  initialBalance.value = balance.value;

  const maxAttempts = GALES.value + 1;
  let operationValue = userSettings.value.entryValue;
  let finalResult = { status: 'error', message: 'Operação não finalizada.' };
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (initialBalance.value !== null) {
      const stopLoss = initialBalance.value - userSettings.value.stopLoss;
      const stopWin = initialBalance.value + userSettings.value.stopWin;
      if (balance.value <= stopLoss) {
        finalResult = { status: 'error', message: 'Stop Loss atingido!' }; break;
      }
      if (balance.value >= stopWin) {
        finalResult = { status: 'success', message: 'Stop Win atingido!' }; break;
      }
    }
    if (balance.value <= 0 || balance.value < operationValue) {
      finalResult = { status: 'error', message: 'Saldo insuficiente.' }; break;
    }

    try {
      showTradeNotification(attempt === 1 ? `Entrando em ordem: ${formatCurrency(operationValue)}` : `Entrando em Gale #${attempt - 1}: ${formatCurrency(operationValue)}`, pair);
      const orderResult = await buyDigital({
        assetName: pair, operationValue, direction,
        account_type: accountType.value, period,
      });

      if (!orderResult || !orderResult.order || !orderResult.order.id) {
        throw new Error(orderResult.message || 'Erro ao executar ordem.');
      }

      showTradeNotification('Aguardando resultado da ordem...', pair);
      const orderStatus = await checkOrderStatus(orderResult.order.id, uniqueId);

      if (!orderStatus || !orderStatus.status) {
        throw new Error('Erro ao verificar status da ordem.');
      }

      if (orderStatus.pnl >= 0) {
        finalResult = { status: 'success', message: 'Resultado: WIN!' };
        break; 
      } else {
        if (attempt < maxAttempts) {
          operationValue *= 2;
        } else {
          finalResult = { status: 'error', message: 'Resultado: LOSS.' };
        }
      }
    } catch (err) {
      finalResult = { status: 'error', message: err.message };
      break;
    }
  }

  Swal.close();
  showToast('Operação Finalizada!', finalResult.status, 5000);

  isTradeInProgress.value = false;
  currentTradeInfo.value = null;
  localStorage.removeItem('tradeInProgress');
  localStorage.removeItem('tradeInfo');

  await updateBalance();
  await updateAccountGrowthData();
  initialBalance.value = null;
};

const transactionStats = computed(() => {
  if (!Array.isArray(history.value)) return { wins: 0, losses: 0, total: 0, winPercent: 0, totalProfit: 0 };
  const validTransactions = history.value.filter(tx => tx.payload && typeof tx.payload.pnl === 'number');
  const wins = validTransactions.filter(tx => tx.payload.pnl > 0).length;
  const losses = validTransactions.filter(tx => tx.payload.pnl <= 0).length;
  const total = wins + losses;
  const winPercent = total > 0 ? Math.round((wins / total) * 100) : 0;
  const totalProfit = validTransactions.reduce((sum, tx) => sum + (tx.payload.pnl || 0), 0);
  return { wins, losses, total, winPercent, totalProfit }
});

const roiStats = computed(() => {
  if (!Array.isArray(history.value)) return { totalROI: 0 };
  const totalProfit = transactionStats.value.totalProfit
  const totalInvest = history.value.reduce((sum, tx) => sum + (tx.payload.invest || 0), 0)
  const totalROI = totalInvest ? Math.round((totalProfit / totalInvest) * 100) : 0
  return { totalROI: totalInvest > 0 ? totalROI : 0 }
});

const formatCurrency = (value) => {
  if (typeof value !== 'number') value = 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
};

const switchAccount = async () => {
  accountType.value = accountType.value === 'demo' ? 'real' : 'demo'
  await updateBalance()
  await updateAccountGrowthData()
};

function formatDateTime(dateStr, lang = 'pt-BR', timeOnly = false) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setHours(date.getHours() - 3); 
  
  if (timeOnly) {
    return date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' - ' + date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
}

const showTransactionHistory = () => {
  let currentNotification = null;
  if (isTradeInProgress.value) {
    currentNotification = Swal.getPopup();
  }
  
  const historyArray = Array.isArray(history.value) ? history.value : [];
  const sortedHistory = [...historyArray].sort((a, b) => new Date(b.payload?.closeTime || b.createdAt) - new Date(a.payload?.closeTime || a.createdAt));
  Swal.fire({
      title: `<span style='color:#fff;font-weight:bold;font-size:1.25rem;'>Histórico de Transações</span>`,
      html: `
        <div style="max-height: 400px; overflow-y: auto; overflow-x: auto; border-radius: 12px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead style='position:sticky;top:0;z-index:2;background:rgba(30, 41, 59, 0.95);'>
              <tr style='color:#7dd3fc;font-size:0.875rem;'>
                <th style='padding:12px 16px;text-align:left;font-weight:600;white-space:nowrap;'>PAR</th>
                <th style='padding:12px 16px;text-align:left;font-weight:600;white-space:nowrap;'>DATA</th>
                <th style='padding:12px 16px;text-align:right;font-weight:600;white-space:nowrap;'>VALOR</th>
              </tr>
            </thead>
            <tbody>
              ${sortedHistory.map((item, idx) => {
                const pnl = item.payload?.pnl || 0;
                const isWin = pnl >= 0;
                return `
                  <tr style='background:${idx % 2 === 0 ? "rgba(59,130,246,0.08)" : "rgba(99,102,241,0.10)"};color:${isWin ? '#60a5fa' : '#f87171'};cursor:pointer;' 
                      onclick="showTradeDetails('${item.uniqueId}')">
                    <td style='padding:10px 16px;white-space:nowrap;display:flex;align-items:center;gap:8px;font-weight:500;'>
                      <i class="fas ${isWin ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                      <span>${item.payload?.active?.name || 'N/A'}</span>
                    </td>
                    <td style='padding:10px 16px;white-space:nowrap;'>${formatDateTime(item.payload?.closeTime || item.createdAt)}</td>
                    <td style='padding:10px 16px;text-align:right;white-space:nowrap;font-weight:600;'>${isWin ? '+' : ''}${formatCurrency(pnl)}</td>
                  </tr>`
              }).join('') || `<tr><td colspan="3" style="text-align:center;padding:24px;color:#94a3b8;">Nenhuma operação encontrada.</td></tr>`}
            </tbody>
          </table>
        </div>`,
      background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
      confirmButtonColor: '#6366F1',
      confirmButtonText: `<span style='font-weight:600;'>OK</span>`,
      width: '90vw',
      customClass: {
        popup: 'max-w-2xl'
      },
      showCloseButton: true,
      didOpen: () => {
        window.showTradeDetails = (uniqueId) => {
          showTradeDetailModal(uniqueId);
        };
      },
      didClose: () => {
        delete window.showTradeDetails;
        if (isTradeInProgress.value && currentTradeInfo.value) {
          setTimeout(() => {
            showTradeNotification(`Operação em andamento para ${currentTradeInfo.value.pair}...`, currentTradeInfo.value.pair);
          }, 100);
        }
      }
  });
}
const showTradeDetailModal = (uniqueId) => {
  const historyArray = Array.isArray(history.value) ? history.value : [];
  const trade = historyArray.find(item => item.uniqueId === uniqueId);
  if (!trade) { Swal.fire({ title: 'Erro', text: 'Detalhes da operação não encontrados.', icon: 'error', confirmButtonColor: '#3085d6' }); return; }
  const galeInfos = trade.galeInfos || [];
  const sortedTrades = galeInfos.length > 0 ? [...galeInfos].sort((a, b) => (a.gale || 0) - (b.gale || 0)) : [trade];
  const totalPnl = sortedTrades.reduce((sum, trade) => sum + (trade.payload?.pnl || 0), 0);
  const isOverallWin = totalPnl >= 0;
  const firstTrade = sortedTrades[0];
  const pair = firstTrade.payload?.active?.name || 'N/A';
  const direction = firstTrade.payload?.direction?.toUpperCase() || 'N/A';
  const directionText = direction === 'CALL' ? 'COMPRA' : 'VENDA';
  const directionColor = direction === 'CALL' ? '#4ade80' : '#f87171';
  Swal.fire({
    title: `<span style='color:#fff;font-weight:bold;font-size:1.25rem;'>Detalhes da Operação</span>`,
    html: `
      <div style="color: #cbd5e1; text-align: left; max-height: 500px; overflow-y: auto;">
        <div style="background: rgba(30, 41, 59, 0.6); padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="display: flex; margin-right: 8px;">
                <img src="${getCurrencyFlag(pair, 0)}" style="width: 24px; height: 24px; border-radius: 50%;">
                <img src="${getCurrencyFlag(pair, 1)}" style="width: 24px; height: 24px; border-radius: 50%; margin-left: -8px;">
              </div>
              <span style="font-size: 1.1rem; font-weight: bold; color: #fff;">${pair}</span>
            </div>
            <span style="font-size: 0.9rem; padding: 4px 10px; border-radius: 8px; background: rgba(${isOverallWin ? '74, 222, 128, 0.2' : '248, 113, 113, 0.2'}); color: ${isOverallWin ? '#4ade80' : '#f87171'};">
              ${isOverallWin ? 'WIN' : 'LOSS'}
            </span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.85rem;">
            <div><span style="color: #94a3b8;">Direção:</span><span style="color: ${directionColor}; font-weight: bold;"> ${directionText}</span></div>
            <div><span style="color: #94a3b8;">Data:</span><span> ${formatDateTime(firstTrade.payload?.openTime || firstTrade.createdAt)}</span></div>
            <div><span style="color: #94a3b8;">Resultado Final:</span><span style="color: ${isOverallWin ? '#4ade80' : '#f87171'}; font-weight: bold;"> ${isOverallWin ? '+' : ''}${formatCurrency(totalPnl)}</span></div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${sortedTrades.map((trade, index) => {
            const galeNumber = trade.gale || 0;
            const pnl = trade.payload?.pnl || 0;
            const isWin = pnl >= 0;
            const invest = trade.payload?.invest || 0;
            const openQuote = trade.payload?.openQuote || 'N/A';
            const closeQuote = trade.payload?.closeQuote || 'N/A';
            return `
              <div style="background: rgba(30, 41, 59, 0.4); padding: 12px; border-radius: 10px; border-left: 3px solid ${isWin ? '#4ade80' : '#f87171'};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: bold; color: #fff;">${galeNumber === 0 ? 'Entrada Principal' : `Gale #${galeNumber}`}</span>
                  <span style="color: ${isWin ? '#4ade80' : '#f87171'}; font-weight: bold;">${isWin ? '+' : ''}${formatCurrency(pnl)}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-size: 0.85rem;">
                  <div><div style="color: #94a3b8;">Valor</div><div>${formatCurrency(invest)}</div></div>
                  <div><div style="color: #94a3b8;">Abertura</div><div>${openQuote}</div></div>
                  <div><div style="color: #94a3b8;">Fechamento</div><div>${closeQuote}</div></div>
                  <div><div style="color: #94a3b8;">Horário</div><div>${formatDateTime(trade.payload?.openTime || trade.createdAt, 'pt-BR', true)}</div></div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`,
    background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
    confirmButtonColor: '#6366F1', confirmButtonText: `<span style='font-weight:600;'>Fechar</span>`,
    width: '90vw', customClass: { popup: 'max-w-2xl' }, showCloseButton: true,
  });
};

const startSdk = async () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);        if (user && user.firstName) {
          userDisplayName.value = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
          console.log('Nome de usuário carregado do localStorage:', userDisplayName.value);
          
          // Notificar outros componentes sobre a atualização do nome de usuário
          window.dispatchEvent(new CustomEvent('app:user-name-updated', {
            detail: { name: userDisplayName.value }
          }));
        } else {
        console.warn('Objeto de usuário encontrado, mas firstName está ausente:', user);
      }
    } catch (error) {
      console.error('Erro ao analisar objeto de usuário do localStorage:', error);
    }
  } else {
    console.log('Objeto de usuário não encontrado no localStorage, tentando obter via API...');
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
    if (email && password) {
      try {
        const response = await axios.post('/api/sdk/start', { email, password });
        if (response.data && response.data.data) {
          // Salvar objeto de usuário completo
          localStorage.setItem("user", JSON.stringify({
            firstName: response.data.data.firstName || 'Usuário(a)',
            email: email
          }));
          userDisplayName.value = response.data.data.firstName.charAt(0).toUpperCase() + response.data.data.firstName.slice(1) || 'Usuário(a)';
          console.log('Nome de usuário obtido via API:', userDisplayName.value);
          
          // Notificar outros componentes sobre a atualização do nome de usuário
          window.dispatchEvent(new CustomEvent('app:user-name-updated', {
            detail: { name: userDisplayName.value }
          }));
        } else {
          console.warn('Resposta da API não contém dados de usuário:', response.data);
        }
      } catch (error) {
        console.error("Erro ao iniciar SDK:", error);
      }
    } else {
      console.error('Credenciais não encontradas no localStorage');
    }
  }
};

const buyDigital = async (payload) => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.post('/api/trade/digital/buy', { ...payload, email, password });
  return data;
}

const checkOrderStatus = async (orderId, uniqueId) => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.get('/api/order', { params: { email, password, orderId: Number(orderId), uniqueId, collection: COLLECTION_NAME } });
  return data;
}

const getAccountBalance = async () => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.post('/api/account/balance', { email, password });
  return data;
}

const getHistory = async () => {
  const email = localStorage.getItem('userEmail');
  if (!email) throw new Error('Email não encontrado.');
  const { data } = await axios.get('/api/order/history', { params: { email, collection: COLLECTION_NAME } });
  return data;
}

const getCandles = async (pair, period) => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.get('/api/candles', { params: { pair, period, email, password } });
  return data;
}

const getAvailableAssets = async () => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.get('/api/candles/digital', { params: { email, password } });
  return data;
}

const getServerTime = async () => {
  try {
    const response = await axios.get('/server-time', { baseURL:'/' });
    return new Date(response.data.time);
  } catch (error) {
    console.error("Erro ao buscar a hora do servidor, usando hora local como fallback:", error);
    return new Date();
  }
};

const getAccessToken = async () => {
  const url = 'https://api-signals.tradeautopilot.ai/auth/login';
  const payload = { email: 'windson3433@gmail.com', password: 'Dnscotty@123' };
  const { data } = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
  return data.access_token;
};

const generateSignal = async (pair, timeframe, candles) => {
  const token = await getAccessToken();
  const url = 'https://api-signals.tradeautopilot.ai/signals';
  const { data } = await axios.post(
    url,
    { pair, timeframe: `M${timeframe}`, candles },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return { data }; // Corrigido para retornar o objeto esperado
};

const getCurrencyFlag = (currencyPair, index) => {
    if (!currencyPair) return 'https://flagcdn.com/w20/un.png';
    const cleanPair = currencyPair.split('-')[0];
    const firstCurrency = cleanPair.substring(0, 3).toLowerCase();
    const secondCurrency = cleanPair.substring(3, 6).toLowerCase();
    const currencyToCountry = { 'eur': 'eu', 'usd': 'us', 'gbp': 'gb', 'jpy': 'jp', 'aud': 'au', 'cad': 'ca', 'chf': 'ch', 'nzd': 'nz', 'brl': 'br' };
    const currency = index === 0 ? firstCurrency : secondCurrency;
    const countryCode = currencyToCountry[currency] || currency;
    return `https://flagcdn.com/w20/${countryCode}.png`;
}

const updateBalance = async () => {
  try {
    const data = await getAccountBalance();
    const account = data.balances.find(b => b.type === accountType.value);
    balance.value = account ? account.amount : 0;
  } catch (e) { 
    balance.value = 0; 
  }
};

const updateAccountGrowthData = async () => {
  try {
    const data = await getHistory();
    if (data && Array.isArray(data)) {
      history.value = data.filter(item => item && item.payload);
    } else {
      history.value = [];
    }
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    history.value = [];
  }
};

function loadUserSettings() {
  const saved = localStorage.getItem('botSettings');
  if (saved) userSettings.value = JSON.parse(saved);
}


// --- Lifecycle Hooks ---
onMounted(async () => {
  loadUserSettings();
  await startSdk();
  
  // Atualiza o saldo primeiro
  await updateBalance();
  console.log('Saldo inicial:', balance.value);
  
  // Depois verifica o acesso do usuário, que usa o saldo para determinar o estado
  await verifyUserAccess();
  
  await updateAccountGrowthData();

  try {
    const assets = await getAvailableAssets();
    if(Array.isArray(assets) && assets.length > 0) {
        availableAssets.value = assets;
        selectedAsset.value = assets[0].name;
    }
  } catch (e) { console.error("Não foi possível carregar os ativos", e) }

  await updateChart();
  chartUpdateInterval = setInterval(updateChart, 15000);
});

onUnmounted(() => {
  if (chartUpdateInterval) clearInterval(chartUpdateInterval);
  stopCheckingBalance();
  stopFakeNotifications();
});

watch(balance, (newBalance) => {
  // Se tiver saldo positivo e o acesso estiver bloqueado, libera
  if (newBalance > 0 && accessBlocked.value) {
    console.log('Saldo positivo detectado, liberando acesso bloqueado');
    accessBlocked.value = false;
    showFirstAccessModal.value = false;
    stopCheckingBalance();
    stopFakeNotifications();
    
    Swal.fire({
      icon: 'success',
      title: 'Conta Ativada!',
      text: 'Seu depósito foi recebido. Acesso à IA liberado!',
      background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
      color: '#fff',
      confirmButtonColor: '#3B82F6',
    });
  }
});

watch([selectedAsset, selectedTime], async () => {
  if (chartUpdateInterval) clearInterval(chartUpdateInterval);
  chartSeries.value = [{ data: [] }];
  await updateChart();
  chartUpdateInterval = setInterval(updateChart, 15000);
});

</script>

<style scoped>
/* Glass Card Effect */
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.4));
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.tab-button {
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}
.tab-button:hover {
  background-color: rgba(55, 65, 81, 0.5);
}
.tab-button.active {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

/* Remover fundo azul dos textos azuis */
.text-blue-400 { background: none !important; }

/* Remover fundo azul dos botões e textos verdes customizados */
.text-green-400, .bg-gradient-to-r.from-green-500 {
  color: #3B82F6 !important;
  background: none !important;
  border-color: #3B82F6 !important;
}

/* Animações para as notificações falsas */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-fade-out {
  animation: fade-out 0.5s ease-in forwards;
}
</style>