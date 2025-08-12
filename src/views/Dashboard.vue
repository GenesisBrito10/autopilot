<template>
  <AppLayout>
    <!-- Container para notificações de operações em andamento -->
    <div id="trade-notification-container" class="fixed top-0 right-0 z-50"></div>
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
                        :disabled="isGeneratingSignal"
                        class="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i :class="isGeneratingSignal ? 'fas fa-spinner fa-spin' : 'fas fa-wand-magic-sparkles'"></i>
                  {{ isGeneratingSignal ? 'Gerando...' : 'Gerar Sinal' }}
                </button>
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
              <span class="text-2xl font-bold text-green-400">{{ transactionStats.winPercent }}%</span>
            </div>
            <h4 class="text-gray-400 text-sm">Taxa de Acerto</h4>
            <div class="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-500 to-green-400"
                :style="{ width: `${transactionStats.winPercent}%` }"></div>
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
                  :key="idx" class="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
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
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '@/components/AppLayout.vue'
import Apexchart from 'vue3-apexcharts'
import axios from 'axios'
import { io } from 'socket.io-client'
const router = useRouter()

// State variables
const userDisplayName = ref('Usuário(a)')
const balance = ref(5000)
const accountType = ref('demo')
const isGeneratingSignal = ref(false)
const selectedBroker = ref('homebroker')
const history = ref([])
const GALES = ref(2)
const initialBalance = ref(null)

// Trading variables
const selectedAsset = ref('EURUSD')
const selectedTime = ref(1)
const defaultUserSettings = { entryValue: 10, stopWin: 100, stopLoss: 100 }
const userSettings = ref({ ...defaultUserSettings })
const COLLECTION_NAME = 'autopilot'

// --- CHART STATE AND OPTIONS ---
let chartUpdateInterval = null;
const chartSeries = ref([{ data: [] }]);

const chartOptions = computed(() => ({
  chart: {
    type: 'candlestick',
    height: 400,
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  title: {
    text: `Gráfico de ${selectedAsset.value}`,
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#E2E8F0',
    }
  },
  xaxis: {
    type: 'datetime',
    labels: { style: { colors: '#94A3B8' } },
    axisBorder: { show: false },
    axisTicks: { color: '#334155' }
  },
  yaxis: {
    tooltip: { enabled: true },
    labels: {
      style: { colors: '#94A3B8' },
      formatter: function (val) {
        if (typeof val === 'number') {
          return val.toFixed(5);
        }
        return '';
      }
    },
    opposite: true
  },
  grid: {
    borderColor: 'rgba(59, 130, 246, 0.1)',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px', fontFamily: 'monospace' }
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#22c55e',
        downward: '#ef4444'
      },
      wick: { useFillColor: true }
    }
  },
  series: [{
    data: chartSeries.value[0].data,
  }]
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
// --- END OF CHART LOGIC ---

// Função padrão para mostrar notificações (toasts)
function showToast(title, icon = 'info', timer = 4000) {
  // Se houver uma operação em andamento, não mostra toasts temporários
  // para evitar que a notificação de operação em andamento seja substituída
  if (isTradeInProgress.value && timer !== undefined) {
    console.log(title); // Apenas loga a mensagem em vez de mostrar o toast
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

// Função para mostrar ou atualizar a notificação de operação em andamento
function showTradeNotification(message, pair) {
  if (!isTradeInProgress.value) return;
  
  // Verifica se já existe uma notificação aberta
  const currentPopup = Swal.getPopup();
  
  if (currentPopup && document.body.contains(currentPopup)) {
    // Atualiza a notificação existente
    const statusEl = document.getElementById('swal-trade-status');
    if (statusEl) statusEl.innerHTML = message;
  } else {
    // Cria uma nova notificação
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
  isGeneratingSignal.value = true;
  showToast('Buscando sinal...', 'info');

  try {
    const pair = selectedAsset.value;
    const period = selectedTime.value;

    const candlesResponse = await getCandles(pair, period);
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
    // Adicionado para responsividade
    width: '90%',
    customClass: {
      popup: 'max-w-md' // Limita a largura máxima em telas grandes
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      /* const entryDate = new Date(entry_time);
      entryDate.setHours(entryDate.getHours() - 3);
      entryDate.setSeconds(0, 0); // ignora os segundos

      const now = new Date();
      const msToWait = entryDate.getTime() - now.getTime();

      if (msToWait > 0) {
        // Notificação tipo toast fixa no canto superior direito até o horário de entrada, sem piscar
        let interval;
        let toastInstance = null;
        await new Promise(resolve => {
          function updateToast(diff) {
            const sec = Math.floor((diff / 1000) % 60);
            const min = Math.floor((diff / 1000 / 60) % 60);
            const hour = Math.floor((diff / 1000 / 60 / 60));
            const countdown = `Restante: ${hour > 0 ? hour + 'h ' : ''}${min > 0 ? min + 'm ' : ''}${sec}s`;
            if (!toastInstance) {
              toastInstance = Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: undefined,
                timerProgressBar: false,
                background: 'rgba(26, 31, 53, 0.95)',
                color: '#fff',
                icon: 'info',
                title: 'Aguardando horário de entrada',
                html: `<div style="color:#cbd5e1;">${formatDateTime(entryDate)}<br><span id="countdown-wait">${countdown}</span></div>`,
                didOpen: () => {
                  // nada
                }
              });
            } else {
              const el = Swal.getHtmlContainer()?.querySelector('#countdown-wait');
              if (el) el.innerHTML = countdown;
            }
          }

          updateToast(msToWait);

          interval = setInterval(() => {
            const now = new Date();
            let diff = entryDate.getTime() - now.getTime();
            if (diff < 0) diff = 0;
            updateToast(diff);
            if (diff <= 0) {
              clearInterval(interval);
              Swal.close();
              resolve();
            }
          }, 1000);
        });
      } */
      const tradeData = {
        pair: pair,
        direction: trade_action === 'BUY' ? 'CALL' : 'PUT',
        period: timeframe ,
      };
      await executeTradeFromSignal(tradeData);
    }
  });
};

// Variável para controlar se há uma operação em andamento
const isTradeInProgress = ref(false);
const currentTradeInfo = ref(null);

const executeTradeFromSignal = async (signalData) => {
  const { pair, direction, period } = signalData;
  
  // Atualiza o estado de operação em andamento
  isTradeInProgress.value = true;
  currentTradeInfo.value = { pair, direction, period };
  
  // Log para confirmar que a operação está em andamento
  console.log('Operação em andamento:', isTradeInProgress.value);

  // Mostra a notificação de operação em andamento usando a função auxiliar
  showTradeNotification(`Iniciando para ${pair}...`, pair);

  const updateToastStatus = (text) => {
    // Usa a função auxiliar para atualizar a notificação
    showTradeNotification(text, pair);
  };

  await updateBalance();
  initialBalance.value = balance.value;

  const maxAttempts = GALES.value + 1;
  let operationValue = userSettings.value.entryValue;
  let finalResult = { status: 'error', message: 'Operação não finalizada.' };

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
      updateToastStatus(attempt === 1 ? `Entrando em ordem: ${formatCurrency(operationValue)}` : `Entrando em Gale #${attempt - 1}: ${formatCurrency(operationValue)}`);
      
      const orderResult = await buyDigital({
        assetName: pair, operationValue, direction,
        account_type: accountType.value, period,
      });

      if (!orderResult || !orderResult.order || !orderResult.order.id) {
        throw new Error(orderResult.message || 'Erro ao executar ordem.');
      }

      updateToastStatus('Aguardando resultado da ordem...');
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const orderStatus = await checkOrderStatus(orderResult.order.id, uniqueId);

      if (!orderStatus || !orderStatus.status) {
        throw new Error('Erro ao verificar status da ordem.');
      }

      if (orderStatus.pnl >= 0) {
        finalResult = { status: 'success', message: 'Resultado: WIN!' };
        // Limpa o flag de operação em andamento no localStorage
        localStorage.removeItem('tradeInProgress');
        localStorage.removeItem('tradeInfo');
        break; 
      } else {
        if (attempt < maxAttempts) {
          operationValue *= 2;
        } else {
          finalResult = { status: 'error', message: 'Resultado: LOSS.' };
          // Limpa o flag de operação em andamento no localStorage
          localStorage.removeItem('tradeInProgress');
          localStorage.removeItem('tradeInfo');
        }
      }
    } catch (err) {
      // Limpa o flag de operação em andamento no localStorage em caso de erro
      localStorage.removeItem('tradeInProgress');
      localStorage.removeItem('tradeInfo');
      finalResult = { status: 'error', message: err.message };
      break;
    }
  }

  // Em vez de Swal.update, feche o toast de loading e abra um novo toast temporário
  Swal.close();
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    background: 'rgba(26, 31, 53, 0.95)',
    color: '#fff',
    icon: finalResult.status,
    title: 'Operação Finalizada!',
    html: `<div id="swal-trade-status">${finalResult.message}</div>`,
  });

  // Atualiza o estado de operação em andamento
  isTradeInProgress.value = false;
  currentTradeInfo.value = null;
  
  // Limpa o flag de operação em andamento no localStorage
  localStorage.removeItem('tradeInProgress');
  localStorage.removeItem('tradeInfo');

  await updateBalance();
  await updateAccountGrowthData();
  initialBalance.value = null;
};

const transactionStats = computed(() => {
  if (!Array.isArray(history.value)) return { wins: 0, losses: 0, total: 0, winPercent: 0, totalProfit: 0 };
  const wins = history.value.filter(tx => tx.payload.pnl > 0).length
  const losses = history.value.filter(tx => tx.payload.pnl <= 0).length
  const total = wins + losses
  const winPercent = total ? Math.round((wins / total) * 100) : 0
  const totalProfit = history.value.reduce((sum, tx) => sum + (tx.payload.pnl || 0), 0)
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

const availableAssets = ref([]);

function formatDateTime(dateStr, lang = 'pt-BR') {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' - ' + date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
}

const showTransactionHistory = () => {
  // Salva a referência da notificação atual se houver uma operação em andamento
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
                  <tr style='background:${idx % 2 === 0 ? "rgba(59,130,246,0.08)" : "rgba(99,102,241,0.10)"};color:${isWin ? '#60a5fa' : '#f87171'};'>
                    
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
      // Alterado para ser responsivo
      width: '90vw',
      customClass: {
        popup: 'max-w-2xl' // Limita a largura máxima em telas maiores
      },
      showCloseButton: true,
      didClose: () => {
        // Se havia uma operação em andamento, restaura a notificação
        if (isTradeInProgress.value && currentTradeInfo.value) {
          // Pequeno atraso para garantir que o modal anterior seja completamente fechado
          setTimeout(() => {
            showTradeNotification(`Operação em andamento para ${currentTradeInfo.value.pair}...`, currentTradeInfo.value.pair);
          }, 100);
        }
      }
  });
}
const startSdk = async () => {
    const email = localStorage.getItem('userEmail')
    const password = localStorage.getItem('userPassword')
    if (email && password) {
        try {
            await axios.post('/api/sdk/start', { email, password });
        } catch (error) {
            console.error("Erro ao iniciar SDK:", error);
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

// Função para obter o access_token via login na API
const getAccessToken = async () => {
  const url = 'https://api-signals.tradeautopilot.ai/auth/login';
  const payload = {
    email: 'windson3433@gmail.com',
    password: 'Dnscotty@123'
  };
  const { data } = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
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
  return data;
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
  } catch (e) { balance.value = 0; }
};

const updateAccountGrowthData = async () => {
  try {
    const data = await getHistory();
    history.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    history.value = [];
  }
};

function loadUserSettings() {
  const saved = localStorage.getItem('botSettings');
  if (saved) userSettings.value = JSON.parse(saved);
}

// A função confirmBeforeUnload foi substituída por uma implementação direta em window.onbeforeunload

// Handler para o evento popstate (botão voltar do navegador)
const popstateHandler = function(e) {
  if (isTradeInProgress.value) {
    // Previne a navegação de volta
    e.preventDefault();
    // Adiciona um estado na história para evitar que o usuário saia
    window.history.pushState(null, document.title, window.location.href);
    // Mostra o modal de confirmação
    showExitConfirmationModal().then((result) => {
      if (result.isConfirmed) {
        // Se o usuário confirmar, permite a navegação de volta
        localStorage.removeItem('tradeInProgress');
        localStorage.removeItem('tradeInfo');
        window.history.back();
      }
    });
  }
};

// Variáveis para detectar gestos de deslize em dispositivos móveis
let touchStartX = 0;
let touchEndX = 0;

// Handler para o início do toque (para detectar gestos de deslize)
const touchStartHandler = function(e) {
  touchStartX = e.changedTouches[0].screenX;
};

// Handler para o fim do toque (para detectar gestos de deslize)
const touchEndHandler = function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
};

// Função para lidar com gestos de deslize
const handleSwipeGesture = () => {
  // Detecta deslize da esquerda para a direita (gesto comum para voltar)
  if (touchEndX - touchStartX > 100 && isTradeInProgress.value) {
    // Mostra o modal de confirmação
    showExitConfirmationModal().then((result) => {
      if (!result.isConfirmed) {
        // Se o usuário cancelar, adiciona um estado na história para evitar que o usuário saia
        window.history.pushState(null, document.title, window.location.href);
      } else {
        // Se o usuário confirmar, permite a navegação de volta
        localStorage.removeItem('tradeInProgress');
        localStorage.removeItem('tradeInfo');
      }
    });
  }
};

// Handler para o evento visibilitychange (quando o app é minimizado ou a aba é trocada)
const visibilityChangeHandler = function() {
  if (document.visibilityState === 'hidden' && isTradeInProgress.value) {
    // Salva o estado no localStorage quando o app é minimizado durante uma operação
    localStorage.setItem('tradeInProgress', 'true');
    localStorage.setItem('tradeInfo', JSON.stringify(currentTradeInfo.value));
  }
};

// Função para adicionar um estado na história para capturar o botão voltar
const addHistoryState = () => {
  // Adiciona um estado na história para poder capturar o evento popstate
  window.history.pushState({page: 'dashboard'}, document.title, window.location.href);
};

onMounted(async () => {
  const storedName = localStorage.getItem('userName')
  if (storedName) userDisplayName.value = storedName
  
  loadUserSettings()
  await startSdk()
  await updateBalance()
  await updateAccountGrowthData()

  // Verifica se a página foi recarregada durante uma operação
  const checkReload = () => {
    const wasTradeInProgress = localStorage.getItem('tradeInProgress') === 'true';
    if (wasTradeInProgress) {
      // Limpa o flag
      localStorage.removeItem('tradeInProgress');
      const tradeInfo = JSON.parse(localStorage.getItem('tradeInfo') || '{}');
      localStorage.removeItem('tradeInfo');
      
      // Mostra o modal informando que a operação foi interrompida
      Swal.fire({
        title: 'Operação Interrompida',
        text: `A operação anterior (${tradeInfo.pair || 'desconhecida'}) foi interrompida devido à recarga da página e não será contabilizada.`,
        icon: 'warning',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  
  // Executa a verificação após o carregamento da página
  checkReload();
  
  // Adiciona os event listeners adequados com base no tipo de dispositivo
  if (isMobile) {
    // Em dispositivos móveis, usamos principalmente modais e capturamos o botão voltar
    addHistoryState(); // Adiciona um estado na história para poder capturar o botão voltar
    window.addEventListener('popstate', popstateHandler);
    document.addEventListener('click', clickHandler);
    
    // Adiciona event listeners para detectar gestos de deslize em dispositivos móveis
    document.addEventListener('touchstart', touchStartHandler, { passive: true });
    document.addEventListener('touchend', touchEndHandler, { passive: true });
    
    // Adiciona um listener para o evento visibilitychange para detectar quando o app é minimizado
    document.addEventListener('visibilitychange', visibilityChangeHandler);
    
    console.log('Modo móvel: eventos de proteção de navegação registrados');
  } else {
    // Em desktop, usamos o beforeunload e outros eventos
    window.addEventListener('beforeunload', beforeUnloadHandler);
    document.addEventListener('click', clickHandler);
    window.addEventListener('keydown', keydownHandler);
    
    console.log('Modo desktop: eventos de proteção de navegação registrados');
  }
  
  // Função global para mostrar o modal de confirmação antes de sair
  window.showExitConfirmation = function() {
    if (isTradeInProgress.value) {
      return showExitConfirmationModal();
    }
    return Promise.resolve({isConfirmed: true});
  };

  try {
    const assets = await getAvailableAssets();
    if(Array.isArray(assets) && assets.length > 0) {
        availableAssets.value = assets;
        selectedAsset.value = assets[0].name;
    }
  } catch (e) { console.error("Não foi possível carregar os ativos", e) }

  await updateChart()
  chartUpdateInterval = setInterval(updateChart, 15000)
});

watch([selectedAsset, selectedTime], async () => {
  if (chartUpdateInterval) clearInterval(chartUpdateInterval)
  chartSeries.value = [{ data: [] }] 
  await updateChart()
  chartUpdateInterval = setInterval(updateChart, 15000)
});

// Armazena referências às funções de event listeners para poder removê-las corretamente
// Detecta se é um dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Função para mostrar o modal de confirmação de saída
const showExitConfirmationModal = () => {
  return Swal.fire({
    title: 'Operação em Andamento',
    text: 'Você tem uma operação em andamento. Se sair agora, ela não será contabilizada. Deseja realmente sair?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });
};

// Handler para o evento beforeunload (usado principalmente em desktop)
const beforeUnloadHandler = function(e) {
  if (isTradeInProgress.value) {
    // Armazena o estado no localStorage para detectar recargas
    localStorage.setItem('tradeInProgress', 'true');
    localStorage.setItem('tradeInfo', JSON.stringify(currentTradeInfo.value));
    
    // Isso ainda é necessário para alguns navegadores desktop
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
};

const clickHandler = function(e) {
  if (isTradeInProgress.value) {
    const target = e.target.closest('a, button');
    if (target && (target.tagName === 'A' || (target.tagName === 'BUTTON' && target.type === 'submit'))) {
      e.preventDefault();
      showExitConfirmationModal().then((result) => {
        if (result.isConfirmed) {
          if (target.tagName === 'A') {
            window.location.href = target.href;
          } else if (target.type === 'submit') {
            target.form.submit();
          }
        }
      });
    }
  }
};

const keydownHandler = function(e) {
  if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && isTradeInProgress.value) {
    e.preventDefault();
    // Usar o modal de confirmação para recarregamento
    Swal.fire({
      title: 'Operação em Andamento',
      text: 'Você tem uma operação em andamento. Se recarregar agora, ela não será contabilizada. Deseja realmente recarregar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, recarregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('tradeInProgress');
        window.location.reload();
      }
    });
  }
};

onUnmounted(() => {
  if (chartUpdateInterval) {
    clearInterval(chartUpdateInterval)
  }
  
  // Remove os eventos de confirmação ao desmontar o componente usando as referências corretas
  if (isMobile) {
    window.removeEventListener('popstate', popstateHandler);
    document.removeEventListener('touchstart', touchStartHandler);
    document.removeEventListener('touchend', touchEndHandler);
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
  } else {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    window.removeEventListener('keydown', keydownHandler);
  }
  
  // Eventos comuns a ambos os modos
  document.removeEventListener('click', clickHandler);
  delete window.showExitConfirmation;
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
.text-blue-400,
.text-blue-500,
.text-blue-600,
.text-blue-700,
.text-blue-800,
.text-blue-900 {
  background: none !important;
}

/* Remover fundo azul dos botões e textos verdes customizados */
.btn-green,
.text-green-500,
.text-green-400,
.bg-green-500,
.bg-green-400,
.border-green-500,
.border-green-400,
.from-green-500,
.to-green-500 {
  color: #3B82F6 !important;
  background: none !important;
  border-color: #3B82F6 !important;
}
.btn-green:hover,
.bg-green-500:hover {
  background-color: #6366F1 !important;
  color: #fff !important;
}
.text-success,
.badge-success {
  color: #3B82F6 !important;
  background: none !important;
  border-color: #3B82F6 !important;
}
.badge-active,
.status-active {
  background: #3B82F6 !important;
  color: #fff !important;
}
.badge-inactive,
.status-inactive {
  background: #6366F1 !important;
  color: #fff !important;
}
</style>