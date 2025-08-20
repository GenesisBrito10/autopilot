<template>
  <AppLayout>
    <div id="trade-notification-container" class="fixed top-0 right-0 z-[250]"></div>
    
    <div id="profit-notifications-container" class="fixed bottom-4 left-4 z-50 space-y-2 max-w-md"></div>
    
    <div v-if="showTutorial" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200]">
      <div ref="tooltip" class="absolute glass-card p-4 rounded-lg text-white max-w-sm z-[220]" :style="tooltipStyle">
        <h3 class="font-bold text-lg mb-2">{{ tutorialSteps[tutorialStep].title }}</h3>
        <p class="text-sm text-gray-300">{{ tutorialSteps[tutorialStep].text }}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-xs text-gray-400">{{ tutorialStep + 1 }} / {{ tutorialSteps.length }}</span>
          <button v-if="tutorialStep < tutorialSteps.length - 1" @click="nextTutorialStep" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
            Próximo
          </button>
        </div>
      </div>
    </div>

    <div v-if="showFakeAnalysis" class="fixed inset-0 z-[230] flex items-center justify-center pointer-events-none">
        <div class="absolute w-full h-full bg-slate-900/50"></div>
        <div class="glass-card p-8 rounded-2xl text-center">
            <div class="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" :style="`border-color: ${primaryColor}; border-top-color: transparent`"></div>
            <p class="text-white font-semibold text-lg">Analisando Padrões...</p>
            <p class="text-gray-400">Aguarde, nossa IA está buscando a melhor entrada.</p>
        </div>
    </div>

    <div v-if="showProfitAnimation" class="fixed z-[240] pointer-events-none" :style="profitAnimationPosition">
        <div id="profit-animation-card" class="flex flex-col items-center gap-2 glass-card p-4 rounded-2xl shadow-2xl animate-fade-in-pop">
            <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                    <img :src="getCurrencyFlag(selectedAsset, 0)" class="w-6 h-6 rounded-full border-2 border-slate-700">
                    <img :src="getCurrencyFlag(selectedAsset, 1)" class="w-6 h-6 rounded-full border-2 border-slate-700">
                </div>
                <span class="text-white text-md font-bold">{{ selectedAsset }} (OTC)</span>
            </div>
            <p class="text-green-400 text-xl font-bold">+{{ formatCurrency(tutorialProfit) }}</p>
        </div>
    </div>
    
    <div v-if="!showTutorial && accessBlocked && !showFirstAccessModal" class="fixed inset-0 bg-slate-900/95 z-[101] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fas fa-lock text-red-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Acesso Bloqueado</h3>
          
          <div class="mb-4">
            <div class="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" :style="`border-color: ${primaryColor}; border-top-color: transparent`"></div>
            <p class="text-gray-300 mb-2">Aguardando depósito inicial...</p>
            <p class="text-red-400 font-semibold mb-4">Acesso a IA desativado por falta de saldo.</p>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-wallet"></i>
            DEPOSITAR AGORA E ATIVAR MINHA CONTA
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showTutorial && showFirstAccessModal && balance <= 0" class="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fas fa-gift text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Ative sua conta</h3>
          
          <div>
            <p class="text-lg font-semibold mb-4" :style="`color: ${primaryColor}`">Você foi um dos escolhidos para ganhar o primeiro depósito em DOBRO!</p>
            <p class="text-white mb-6">Use o CUPOM: <span class="text-yellow-400 font-bold">SUPER100</span> para dobrar o valor depositado e liberar a IA.</p>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-wallet"></i>
            DEPOSITAR AGORA
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showTutorial && showBonusModal && balance > 0" class="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4 relative">
        <button @click="showBonusModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-center">
          <i class="fas fa-gift text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Oferta Especial!</h3>
          
          <div>
            <p class="text-lg font-semibold mb-4" :style="`color: ${primaryColor}`">Você foi um dos escolhidos para ganhar o primeiro depósito em DOBRO!</p>
            <p class="text-white mb-6">Use o CUPOM: <span class="text-yellow-400 font-bold">SUPER100</span> para dobrar o valor depositado.</p>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-wallet"></i>
            APROVEITAR OFERTA
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showTutorial && showBonusTripleModal && !showBonusRedemptionTripleModal && !isFirstAccess && !isTradeInProgress && !isWaitingForEntryTime && balance > 0 && balance < LOW_BALANCE_THRESHOLD" class="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4 relative">
        <button @click="showBonusTripleModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-center">
          <i class="fas fa-gift text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Oferta Especial!</h3>
          
          <div>
            <p class="text-lg font-semibold mb-4" :style="`color: ${primaryColor}`">Ei, sua banca está quase acabando, que tal um bônus para TRIPLICAR seu depósito?!</p>
          </div>
          
          <button @click="showBonusTripleRedemption" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-gift"></i>
            RESGATAR BÔNUS
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showTutorial && showBonusRedemptionTripleModal && !isFirstAccess && !isTradeInProgress && !isWaitingForEntryTime && balance > 0 && balance < LOW_BALANCE_THRESHOLD" class="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4 relative">
        <div class="text-center">
          <i class="fas fa-check-circle text-green-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Bônus 3X liberado!</h3>
          
          <div>
            <p class="text-white mb-4">Use o cupom: <span class="text-yellow-400 font-bold">SUPER200</span></p>
            
            <div class="mb-4 p-3 bg-slate-800/50 rounded-xl">
              <p class="text-gray-300 text-sm mb-1">Oferta expira em:</p>
              <p class="text-xl font-bold text-white">{{ countdownTime }}</p>
            </div>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-wallet"></i>
            DEPOSITAR AGORA
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showTutorial && showBonusDoubleModal && !showBonusRedemptionDoubleModal && !isFirstAccess && !isTradeInProgress && !isWaitingForEntryTime && balance === 0" class="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4 relative">
        <button @click="showBonusDoubleModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-center">
          <i class="fas fa-gift text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Oferta Exclusiva!</h3>
          
          <div>
            <p class="text-blue-300 text-lg font-semibold mb-4">Você foi um dos escolhidos para ganhar depósito em DOBRO!</p>
          </div>
          
          <button @click="showBonusDoubleRedemption" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-gift"></i>
            RESGATAR BÔNUS
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showTutorial && showBonusRedemptionDoubleModal && !isFirstAccess && !isTradeInProgress && !isWaitingForEntryTime && balance === 0" class="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center">
      <div class="glass-card p-8 rounded-2xl max-w-md w-full mx-4 relative">
        <div class="text-center">
          <i class="fas fa-check-circle text-green-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">Bônus 2X liberado!</h3>
          
          <div>
            <p class="text-white mb-4">Use o CUPOM: <span class="text-yellow-400 font-bold">SUPER100</span> para dobrar o valor depositado e liberar a IA.</p>
            
            <div class="mb-4 p-3 bg-slate-800/50 rounded-xl">
              <p class="text-gray-300 text-sm mb-1">Oferta expira em:</p>
              <p class="text-xl font-bold text-white">{{ countdownTime }}</p>
            </div>
          </div>
          
          <button @click="redirectToDeposit" 
            class="w-full text-white font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            <i class="fas fa-wallet"></i>
            DEPOSITAR AGORA
          </button>
        </div>
      </div>
    </div>
    
    <div class="min-h-screen" :style="`background-color: ${backgroundColor}`">
      <div v-if="!accessBlocked && !showFirstAccessModal" class="p-4 lg:p-6 max-w-7xl mx-auto">
        <div class="mb-8">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">Trade Auto Pilot</h1>
              <p class="text-gray-400">Bem-vindo(a), {{ userDisplayName }}</p>
            </div>

            <div class="flex items-center gap-4">
              <div class="glass-card px-6 py-3 rounded-xl">
                <div class="flex items-center gap-3">
                  <div>
                    <p class="text-xs text-gray-400">Saldo</p>
                    <p class="text-xl font-bold" :style="`color: ${primaryColor}`">{{ formatCurrency(showTutorial ? fictionalBalance : balance) }}</p>
                  </div>
                  <div class="w-px h-10" :style="`background-color: color-mix(in srgb, ${primaryColor} 30%, #374151)`"></div>
                  <button @click="switchAccount"
                    class="px-3 py-1.5 rounded-lg transition-all text-sm"
                    :style="`background-color: color-mix(in srgb, ${primaryColor} 20%, transparent); color: ${primaryColor};`">
                    {{ accountType === 'real' ? 'REAL' : 'REAL' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg-col-span-1 space-y-6">
            <div id="asset-selection" class="glass-card p-6 rounded-2xl">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-coins" :style="`color: ${primaryColor}`"></i>
                Selecionar Ativo
              </h3>

              <div class="space-y-3">
                <div class="relative">
                  <select v-model="selectedAsset"
                    class="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none transition-all"
                    :style="`&:focus { border-color: ${primaryColor}; }`">
                  
                    <option v-for="asset in availableAssets" :key="asset.name" :value="asset.name">
                      {{ asset.name }}
                    </option>
                  </select>
                </div>

                <div id="time-selection">
                  <label class="text-sm text-gray-400 mb-2 block">Tempo de Expiração</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button v-for="time in [1, 5]" :key="time" @click="selectedTime = time"
                      :class="['py-2 rounded-lg font-medium transition-all', selectedTime === time ? 'text-white' : 'bg-slate-900/50 text-gray-400 border border-slate-700']"
                      :style="selectedTime === time ? `background-color: ${primaryColor}` : `&:hover { border-color: ${primaryColor}; }`">
                      {{ time }}M
                    </button>
                  </div>
                </div>

                </div>
            </div>

            <div id="generate-signal-button" class="glass-card p-6 rounded-2xl">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-robot" :style="`color: ${primaryColor}`"></i>
                Gerador de Sinais IA
              </h3>
              <div class="space-y-4">
                <button @click="handleGenerateSignal"
                        :disabled="isGeneratingSignal || isTradeInProgress || isWaitingForEntryTime"
                        class="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
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
            <div id="chart-container" class="glass-card p-6 rounded-2xl h-full min-h-[500px] relative">
              <div class="flex justify-between items-center mb-4">
                 <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-chart-line" :style="`color: ${primaryColor}`"></i>
                  Gráfico de Atividade
                </h3>
              </div>

              <div class="bg-slate-900/50 rounded-xl">
                 <apexchart
                   ref="chart"
                   v-if="chartSeries[0].data.length > 0"
                   type="candlestick"
                   height="400"
                   :options="chartOptions"
                   :series="chartSeries"
                 ></apexchart>
                 <div v-else class="h-[400px] flex flex-col items-center justify-center text-gray-500">
                    <i class="fas fa-spinner fa-spin text-4xl" :style="`color: color-mix(in srgb, ${primaryColor} 50%, transparent)`"></i>
                    <p class="mt-4">Carregando dados do gráfico...</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="`background-color: color-mix(in srgb, ${primaryColor} 20%, transparent)`">
                <i class="fas fa-trophy" :style="`color: ${primaryColor}`"></i>
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
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="`background-color: color-mix(in srgb, ${primaryColor} 20%, transparent)`">
                <i class="fas fa-exchange-alt" :style="`color: ${primaryColor}`"></i>
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
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="`background-color: color-mix(in srgb, ${primaryColor} 20%, transparent)`">
                <i class="fas fa-chart-line" :style="`color: ${primaryColor}`"></i>
              </div>
              <span class="text-2xl font-bold" :style="`color: ${primaryColor}`">{{ formatCurrency(transactionStats.totalProfit) }}</span>
            </div>
            <h4 class="text-gray-400 text-sm">Lucro Total</h4>
            <div class="mt-3">
              <span class="text-xs text-gray-500">ROI: {{ roiStats.totalROI }}%</span>
            </div>
          </div>

          <div class="glass-card p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="`background-color: color-mix(in srgb, ${primaryColor} 20%, transparent)`">
                <i class="fas fa-users" :style="`color: ${primaryColor}`"></i>
              </div>
              <span class="text-2xl font-bold text-white">1,234</span>
            </div>
            <h4 class="text-gray-400 text-sm">Traders Ativos</h4>
            <div class="mt-3">
              <span class="text-xs" :style="`color: ${primaryColor}`">+12% hoje</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fas fa-history" :style="`color: ${primaryColor}`"></i>
              Operações Recentes
            </h3>
            <button @click="showTransactionHistory" class="transition-all text-sm" :style="`color: ${primaryColor}`">
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
                  class="border-t transition-colors cursor-pointer"
                  :style="`border-color: color-mix(in srgb, ${backgroundColor} 80%, #555); &:hover { background-color: color-mix(in srgb, ${backgroundColor} 30%, transparent); }`"
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
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '@/components/AppLayout.vue'
import Apexchart from 'vue3-apexcharts'
import axios from 'axios'
import apiClient from '@/api'
const router = useRouter()

// --- Variáveis do Tutorial ---
const showTutorial = ref(false)
const tutorialStep = ref(0)
const fictionalBalance = ref(100)
const tooltip = ref(null)
const tooltipStyle = ref({})
const showFakeAnalysis = ref(false)
const showProfitAnimation = ref(false)
const tutorialProfit = ref(0)
const profitAnimationPosition = ref({})
const chart = ref(null)
let fakeChartInterval = null;
const tutorialSteps = [
  {
    functionalHighlightTarget: '#asset-selection',
    visualHighlightTarget: '#asset-selection',
    tooltipTarget: '#asset-selection',
    title: 'Passo 1: Seleção de Ativos',
    text: 'Primeiro, escolha o par de moedas que nossa IA deve analisar para encontrar a melhor oportunidade de lucro.',
    position: 'bottom'
  },
  {
    functionalHighlightTarget: '#asset-selection',
    visualHighlightTarget: '#time-selection',
    tooltipTarget: '#time-selection',
    title: 'Passo 2: Tempo de Expiração',
    text: 'Agora, defina por quanto tempo a operação ficará aberta. Para começar, 1 minuto é uma ótima escolha.',
    position: 'bottom'
  },
  {
    functionalHighlightTarget: '#generate-signal-button',
    visualHighlightTarget: '#generate-signal-button',
    tooltipTarget: '#generate-signal-button',
    title: 'Passo 3: Gerar Sinal!',
    text: 'Tudo pronto! Agora, clique no botão "Gerar Sinal" para que a IA faça a análise e encontre uma oportunidade para você.',
    position: 'top'
  }
]


// State variables
const userDisplayName = ref('Usuário(a)')
const balance = ref(0)
const currency = ref('BRL')
const accountType = ref('demo')
const isGeneratingSignal = ref(false)
const history = ref([])
const initialBalance = ref(null)

// Configurações dinâmicas de cores da API
const primaryColor = ref('#3b82f6')
const backgroundColor = ref('#0f172a')

// --- Variáveis para verificação de acesso e saldo ---
const isFirstAccess = ref(false)
const accessBlocked = ref(false)
const showBonusModal = ref(false)
const showFirstAccessModal = ref(false)
const checkingBalanceInterval = ref(null)
const userEmail = ref(localStorage.getItem('userEmail') || '')
let fakeNotificationInterval = null;

// --- Variáveis para novos modais de bônus ---
const showBonusTripleModal = ref(false);
const showBonusRedemptionTripleModal = ref(false);
const showBonusDoubleModal = ref(false);
const showBonusRedemptionDoubleModal = ref(false);
const countdownTime = ref('30:00');
let bonusCountdownInterval = null;
let lastBalanceCheck = 0; // Timestamp da última verificação de saldo
const LOW_BALANCE_THRESHOLD = 20; // Limiar para exibir o modal de bônus triplo (R$20)

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
const defaultUserSettings = { entryValue: 10 }
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
  series: [{ data: chartSeries.value[0].data, }],
  annotations: {}
}));

const updateChart = async () => {
  try {
    // Usar candles falsos durante o tutorial
    if (showTutorial.value) {
      console.log('Usando candles falsos para o tutorial');
      chartSeries.value = generateFakeCandles();
      return;
    }
    
    // Usar dados reais fora do tutorial
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

// --- Funções de verificação de acesso e saldo ---
const verifyUserAccess = async () => {
  if (!userEmail.value) {
    console.error('Email do usuário não encontrado para verificação.');
    return;
  }
  try {
    const { data } = await apiClient.post('/api/verify-user', { email: userEmail.value });
    if (data.success) {
      isFirstAccess.value = data.user.isFirstAccess;

      if (isFirstAccess.value) {
        startTutorial();
        return;
      }
      
      await updateBalance();
      
      const userStr = localStorage.getItem('user');
      if (!userStr) return 
      const user = JSON.parse(userStr);
      
      if (!isFirstAccess.value && balance.value <= 0) {
        accessBlocked.value = true;
        if (!isTradeInProgress.value && !isWaitingForEntryTime.value) {
          showBonusDoubleModal.value = true;
        }
        startCheckingBalance();
        startFakeNotifications();
      } else if (!isFirstAccess.value && balance.value > 0 && balance.value < LOW_BALANCE_THRESHOLD) {
        console.log('Saldo baixo: exibindo modal de bônus triplo');
        accessBlocked.value = false;
        if (!isTradeInProgress.value && !isWaitingForEntryTime.value) {
          showBonusTripleModal.value = true;
        }
      } else {
        console.log('Acesso liberado');
        accessBlocked.value = false;
      }
    } else {
      showToast('Erro ao verificar suas informações de acesso.', 'error');
    }
  } catch (error) {
    console.error('Falha na API de verificação de usuário:', error);
    showToast('Não foi possível conectar para verificar seu acesso.', 'error');
  }
};

const showNewUserOffers = async () => {
  await updateBalance();
  await updateChart();
  chartUpdateInterval = setInterval(updateChart, 15000);
  const userStr = localStorage.getItem('user');
  if (!userStr) return;
  const user = JSON.parse(userStr);
  const { firstName: first_name, lastName: last_name, userId: userid } = user;

  if (balance.value <= 0) {
    console.log('Post-tutorial com saldo zero: mostrando modal do cupom');
    showFirstAccessModal.value = true;
  } else {
    console.log('Post-tutorial com saldo positivo: mostrando modal de bônus');
    showBonusModal.value = true;
  }

  try {
    const slug = window.getAppSlug();
    console.log('Registrando primeiro acesso na API com slug:', slug);
    await apiClient.post('/api/register-first-access', { 
      email: userEmail.value, 
      firstName: first_name, 
      lastName: last_name, 
      userId: userid, 
      slug 
    });
    console.log('Usuário registrado na API como não sendo mais primeiro acesso. Slug:', slug);
  } catch (error) {
    console.error('Erro ao registrar o primeiro acesso:', error);
  }
};

// --- Funções do Tutorial ---
const startTutorial = () => {
  showTutorial.value = true
  
  // Inicializar o gráfico com candles falsos
  updateChart();
  
  // Configurar atualização contínua dos candles falsos durante o tutorial
  if (chartUpdateInterval) clearInterval(chartUpdateInterval);
  chartUpdateInterval = setInterval(() => {
    if (showTutorial.value) {
      chartSeries.value = generateFakeCandles();
    }
  }, 15000);
  
  nextTick(() => {
    updateTutorialStepUI();
  });
}

const updateTutorialStepUI = () => {
  document.querySelectorAll('.tutorial-functional-highlight, .tutorial-visual-highlight').forEach(el => {
    el.classList.remove('tutorial-functional-highlight', 'tutorial-visual-highlight');
  });

  const step = tutorialSteps[tutorialStep.value];
  const functionalElement = document.querySelector(step.functionalHighlightTarget);
  const visualElement = document.querySelector(step.visualHighlightTarget);
  const tooltipElement = document.querySelector(step.tooltipTarget);

  if (functionalElement && visualElement && tooltipElement) {
    functionalElement.classList.add('tutorial-functional-highlight');
    visualElement.classList.add('tutorial-visual-highlight');
    positionTooltip(tooltipElement);
  }
};

const positionTooltip = (targetElement) => {
  if (!tooltip.value || !targetElement) return;

  const targetRect = targetElement.getBoundingClientRect();
  const tooltipRect = tooltip.value.getBoundingClientRect();
  const step = tutorialSteps[tutorialStep.value];
  let top = 0, left = 0;
  const offset = 15;

  switch (step.position) {
    case 'bottom':
      top = targetRect.bottom + offset;
      left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
      break;
    case 'top':
      top = targetRect.top - tooltipRect.height - offset;
      left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
      break;
  }

  if (left < offset) left = offset;
  if (left + tooltipRect.width > window.innerWidth - offset) left = window.innerWidth - tooltipRect.width - offset;
  if (top < offset) top = offset;
  if (top + tooltipRect.height > window.innerHeight - offset) top = window.innerHeight - tooltipRect.height - offset;

  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    position: 'fixed'
  };
};

const nextTutorialStep = () => {
  if (tutorialStep.value < tutorialSteps.length - 1) {
    tutorialStep.value++;
    nextTick(() => {
      updateTutorialStepUI();
    });
  }
}

const finishTutorial = async () => {
  document.querySelectorAll('.tutorial-functional-highlight, .tutorial-visual-highlight').forEach(el => {
    el.classList.remove('tutorial-functional-highlight', 'tutorial-visual-highlight');
  });
  
  showTutorial.value = false;
  isFirstAccess.value = false;
  
  // Limpar o intervalo anterior de atualização do gráfico
  if (chartUpdateInterval) {
    clearInterval(chartUpdateInterval);
    chartUpdateInterval = null;
  }
  
  // Iniciar a atualização com dados reais
  
  
  await showNewUserOffers();
};

const generateFakeCandles = () => {
    let candles = [];
    let lastClose = 1.05000;
    let time = new Date();
    time.setMinutes(time.getMinutes() - 40);

    for (let i = 0; i < 40; i++) {
        const open = lastClose;
        const close = open + (Math.random() - 0.48) * 0.0005;
        const high = Math.max(open, close) + Math.random() * 0.0002;
        const low = Math.min(open, close) - Math.random() * 0.0002;
        candles.push({ x: time.getTime(), y: [open, high, low, close] });
        lastClose = close;
        time.setMinutes(time.getMinutes() + 1);
    }
    return [{ data: candles }];
}

// --- Funções para lidar com os novos modais de bônus ---
const formatCountdownTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const startBonusCountdown = () => {
  if (bonusCountdownInterval) clearInterval(bonusCountdownInterval);
  let timeLeft = 1800;
  countdownTime.value = formatCountdownTime(timeLeft);
  
  bonusCountdownInterval = setInterval(() => {
    timeLeft--;
    
    if (timeLeft <= 0) {
      clearInterval(bonusCountdownInterval);
      showBonusRedemptionTripleModal.value = false;
      showBonusRedemptionDoubleModal.value = false;
    } else {
      countdownTime.value = formatCountdownTime(timeLeft);
    }
  }, 1000);
};

const showBonusTripleRedemption = () => {
  showBonusTripleModal.value = false;
  showBonusRedemptionTripleModal.value = true;
  startBonusCountdown();
};

const showBonusDoubleRedemption = () => {
  showBonusDoubleModal.value = false;
  showBonusRedemptionDoubleModal.value = true;
  startBonusCountdown();
};

const redirectToDeposit = async () => {
  showFirstAccessModal.value = false;
  showBonusModal.value = false;
  accessBlocked.value = true;
  startCheckingBalance();
  startFakeNotifications();
  
  showToast('Conta pré-ativada! Complete o depósito para começar.', 'success');
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
      showFirstAccessModal.value = false;
      stopCheckingBalance();
      stopFakeNotifications();
      
      Swal.fire({
        icon: 'success',
        title: 'Conta Ativada!',
        text: 'Seu depósito foi recebido. Acesso à IA liberado!',
        background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
        color: '#fff',
        confirmButtonColor: primaryColor.value,
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
          message = `<i class="fas fa-chart-line mr-2" style="color: #10b981"></i> <strong>${notification.name}</strong> lucrou <strong>${formatCurrency(notification.amount)}</strong> no par ${notification.pair}`;
      } else {
          message = `<i class="fas fa-user-check mr-2" style="color: ${primaryColor.value}"></i> ${activationNotifications[Math.floor(Math.random() * activationNotifications.length)]}`;
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

// Função para carregar configurações de cores da API
const loadSettings = async () => {
  try {
    const slug = window.getAppSlug();
    const response = await apiClient.get(`/api/settings/${slug}`);
    if (response.data.success) {
      const settings = response.data.settings;
      primaryColor.value = settings.primaryColor || '#3b82f6';
      backgroundColor.value = settings.backgroundColor || '#0f172a';
      
      applyCustomColors();
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }
}

const applyCustomColors = () => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', primaryColor.value)
  root.style.setProperty('--background-color', backgroundColor.value)
}


// --- Funções Utilitárias e de Lógica de Negociação (COMPLETAS) ---
function showToast(title, icon = 'info', timer = 4000) {
  if (isTradeInProgress.value && timer !== undefined && !showTutorial.value) {
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
  if (showTutorial.value) {
    handleTutorialSignal()
    return
  }

  if (isTradeInProgress.value) {
    showToast('Não é possível gerar um novo sinal enquanto uma operação está em andamento.', 'warning', 6000);
    return;
  }
  if (isWaitingForEntryTime.value) {
    showToast('Não é possível gerar um novo sinal enquanto aguarda o horário de entrada.', 'warning', 6000);
    return;
  }

  if (balance.value <= 0) {
    accessBlocked.value = true;
    return;
  }
  if (
    (currency.value === 'USD' && balance.value < 10) ||
    (currency.value === 'BRL' && balance.value < 60)
  ) {
    showToast(
      currency.value === 'USD'
        ? 'Saldo insuficiente. Deposite pelo menos $10,00 para operar.'
        : 'Saldo insuficiente. Deposite pelo menos R$60,00 para operar.',
      'warning',
      6000
    );
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
    const response = signalResponse.data;
    console.log("Sinal gerado:", signalResponse.data.trade_action);
    if (!response || !response.data || !response.data.trade_action || !response.data.entry_time) {
      throw new Error('Sinal não encontrado, tente novamente.');
    }
    
    Swal.close();
    
    const data = {
      pair,
      timeframe: period * 60,
      ...response.data
    };
    showSignalConfirmationPopup(data);

  } catch (error) {
    console.error("Erro ao gerar sinal:", error);
    showToast(error.message, 'error', 6000);
  } finally {
    isGeneratingSignal.value = false;
  }
};

const handleTutorialSignal = async () => {
  isGeneratingSignal.value = true;
  showFakeAnalysis.value = true;

  await new Promise(resolve => setTimeout(resolve, 2500));

  showFakeAnalysis.value = false;
  isGeneratingSignal.value = false;

  const fakeSignal = {
    pair: selectedAsset.value,
    timeframe: selectedTime.value * 60,
    entry_time: new Date().toISOString(),
    trade_action: 'BUY'
  };

  showSignalConfirmationPopup(fakeSignal);
}

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
      if (showTutorial.value) {
        executeTutorialTrade()
        return
      }
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

const executeTutorialTrade = async () => {
  isTradeInProgress.value = true;
  showTutorial.value = false; 
  document.querySelectorAll('.tutorial-functional-highlight, .tutorial-visual-highlight').forEach(el => el.classList.remove('tutorial-functional-highlight', 'tutorial-visual-highlight'));
  
  // 1. Gerar e aplicar dados falsos
  const fakeCandles = generateFakeCandles();
  chartSeries.value = fakeCandles;

  await nextTick(); // Espera o Vue re-renderizar o gráfico com os dados falsos

  // 2. Marcar a linha de entrada
  const entryCandle = fakeCandles[0].data[fakeCandles[0].data.length - 2];
  const entryPrice = entryCandle.y[3]; // Preço de fechamento da penúltima vela
  chart.value.addYaxisAnnotation({
      y: entryPrice,
      borderColor: '#FFFFFF',
      strokeDashArray: 4,
      label: {
          borderColor: primaryColor.value,
          style: { color: '#fff', background: primaryColor.value, },
          text: 'Sua Entrada',
      }
  });

  // 3. Simular a última vela se movendo
  const simulatedWaitTime = 5000;
  const startTime = Date.now();
  if(fakeChartInterval) clearInterval(fakeChartInterval);

  fakeChartInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= simulatedWaitTime) {
          clearInterval(fakeChartInterval);
          finalizeTutorialTrade(entryPrice);
          return;
      }
      
      const lastCandleIndex = chartSeries.value[0].data.length - 1;
      const lastCandle = chartSeries.value[0].data[lastCandleIndex];
      const newClose = lastCandle.y[3] + (Math.random() - 0.45) * 0.0001;
      const newHigh = Math.max(lastCandle.y[1], newClose);
      
      const newData = [...chartSeries.value[0].data];
      newData[lastCandleIndex] = { ...lastCandle, y: [lastCandle.y[0], newHigh, lastCandle.y[2], newClose] };
      chart.value.updateSeries([{ data: newData }]);

  }, 300);
};

const finalizeTutorialTrade = async (entryPrice) => {
    // Garante que a última vela termine em vitória
    const lastCandleIndex = chartSeries.value[0].data.length - 1;
    const lastCandle = chartSeries.value[0].data[lastCandleIndex];
    const finalClose = entryPrice + 0.0003;
    const finalHigh = Math.max(lastCandle.y[1], finalClose);
    const finalData = [...chartSeries.value[0].data];
    finalData[lastCandleIndex] = { ...lastCandle, y: [lastCandle.y[0], finalHigh, lastCandle.y[2], finalClose] };
    chart.value.updateSeries([{ data: finalData }]);

    const profit = fictionalBalance.value * 0.87;
    tutorialProfit.value = profit;

    const chartElement = document.getElementById('chart-container');
    if (chartElement) {
        const rect = chartElement.getBoundingClientRect();
        profitAnimationPosition.value = {
            top: `${rect.top + 20}px`,
            left: `${rect.right - 200}px`, 
        };
    }
    showProfitAnimation.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    showProfitAnimation.value = false;
    fictionalBalance.value += profit;
    
    if (chart.value) {
        chart.value.clearAnnotations();
    }
        
    Swal.fire({
        icon: 'success',
        title: 'Você Venceu!',
        html: `
        <div class="text-white">
            Parabéns, você lucrou 
            <strong class="text-green-400">${formatCurrency(profit)}</strong> 
            nesta operação!
            <p class="text-gray-300 mt-4">Viu como é fácil? Agora é só ativar sua conta para começar a lucrar de verdade.</p>
        </div>
        `,
        background: 'linear-gradient(135deg, rgba(26,31,53,0.98) 80%, rgba(99,102,241,0.13) 100%)',
        color: '#fff',
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'Continuar',
    }).then(() => {
        isTradeInProgress.value = false;
        finishTutorial();
    });
}

const executeTradeFromSignal = async (signalData) => {
  const { pair, direction, period } = signalData;
  isTradeInProgress.value = true;
  currentTradeInfo.value = { pair, direction, period };
  showTradeNotification(`Iniciando para ${pair}...`, pair);

  await updateBalance();
  initialBalance.value = balance.value;

  const botSettings = JSON.parse(localStorage.getItem('botSettings') || '{"gales": 2}');
  const maxAttempts = botSettings.gales + 1;
  
  let operationValue = userSettings.value.entryValue;
  let finalResult = { status: 'error', message: 'Operação não finalizada.' };
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (balance.value <= 0) {
      accessBlocked.value = true;
      finalResult = { status: 'error', message: 'Saldo insuficiente.' }; break;
    }

    if (balance.value < operationValue){
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
      if (period === 300) {
        const now = await getServerTime();
        const minutes = now.getMinutes();

        const nextFive = Math.ceil((minutes + 1) / 5) * 5;
        let target = new Date(now);
        target.setMinutes(nextFive, 0, 0);
        
        target.setSeconds(target.getSeconds() - 30);

        let msToWait = target.getTime() - now.getTime();
        if (msToWait > 0) {
            const targetTime = new Date(Date.now() + msToWait);
            const formattedTime = `${Math.floor(msToWait / 60000)}m ${Math.floor((msToWait % 60000) / 1000)}s`;
            const formattedHour = targetTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            showTradeNotification(`Aguardando o próximo ciclo de 5 minutos... (${formattedTime})<br>Horário de entrada: <strong>${formattedHour}</strong>`, pair);
          await new Promise(resolve => setTimeout(resolve, msToWait));
        }
      }
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

  await updateAccountGrowthData();
  initialBalance.value = null;
  await updateBalance();
  
  if (balance.value === 0 && !isFirstAccess.value) {
    console.log('Operação finalizada com saldo zero: bloqueando acesso');
    accessBlocked.value = true;
    showBonusDoubleModal.value = true;
    showBonusRedemptionDoubleModal.value = false;
    showBonusTripleModal.value = false;
    showBonusRedemptionTripleModal.value = false;
  } 
  else if (balance.value > 0 && balance.value < LOW_BALANCE_THRESHOLD && !isFirstAccess.value) {
    console.log('Operação finalizada com saldo baixo: exibindo modal de bônus triplo');
    showBonusTripleModal.value = true;
    showBonusRedemptionTripleModal.value = false;
    showBonusDoubleModal.value = false;
    showBonusRedemptionDoubleModal.value = false;
  }
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
  if (value === null || value === undefined) value = 0;
  if (typeof value !== 'number') value = Number(value) || 0;
  
  value = Math.round(value * 100) / 100;
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: currency.value,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const switchAccount = async () => {
  accountType.value = 'real';
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
      confirmButtonColor: primaryColor.value,
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
          localStorage.setItem("user", JSON.stringify({
            firstName: response.data.data.firstName || 'Usuário(a)',
            email: email
          }));
          localStorage.setItem("userId", response.data.data.userId);
          localStorage.setItem("firstName", response.data.data.firstName);
          localStorage.setItem("lastName", response.data.data.lastName);
          userDisplayName.value = response.data.data.firstName.charAt(0).toUpperCase() + response.data.data.firstName.slice(1) || 'Usuário(a)';
          console.log('Nome de usuário obtido via API:', userDisplayName.value);
          
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
    currency.value = account.currency;
    balance.value = account ? account.amount : 0;
    
    if (balance.value === 0 && !isFirstAccess.value) {
      accessBlocked.value = true;
      showBonusTripleModal.value = false;
      showBonusRedemptionTripleModal.value = false;
      return balance.value;
    } 
    else if (balance.value > 0) {
      accessBlocked.value = false;
    }
    
    const canShowBonusModal = !isFirstAccess.value && !isTradeInProgress.value && !isWaitingForEntryTime.value;
    
    if (canShowBonusModal) {
      if (balance.value === 0) {
        if (!accessBlocked.value) {
          showBonusTripleModal.value = false;
          showBonusRedemptionTripleModal.value = false;
          
          if (!showBonusDoubleModal.value && !showBonusRedemptionDoubleModal.value) {
            console.log('Saldo zero detectado: exibindo modal de bônus duplo');
            showBonusDoubleModal.value = true;
          }
        }
      } 
      else if (balance.value > 0 && balance.value < LOW_BALANCE_THRESHOLD) {
        showBonusDoubleModal.value = false;
        showBonusRedemptionDoubleModal.value = false;
        
        if (!showBonusTripleModal.value && !showBonusRedemptionTripleModal.value) {
          console.log('Saldo baixo detectado: exibindo modal de bônus triplo');
          showBonusTripleModal.value = true;
        }
      }
    }
    
    return balance.value;
  } catch (e) { 
    console.error('Erro ao atualizar saldo:', e);
    balance.value = 0;
    if (!isFirstAccess.value) {
      accessBlocked.value = true;
    }
    return 0;
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
  if (saved) {
    const botSettings = JSON.parse(saved);
    userSettings.value = { 
      entryValue: botSettings.entryValue || defaultUserSettings.entryValue
    };
  }
}


// --- Lifecycle Hooks ---
onMounted(async () => {
  console.log('Dashboard montado, iniciando configuração...');
  
  await loadSettings();
  
  loadUserSettings();
  await startSdk();
  
  await updateBalance();
  console.log('Saldo inicial:', formatCurrency(balance.value));
  
  await verifyUserAccess();
  
  await updateAccountGrowthData();
  console.log('Histórico de transações carregado:', history.value.length, 'operações');

  try {
    const assets = await getAvailableAssets();
    if(Array.isArray(assets) && assets.length > 0) {
        availableAssets.value = assets;
        selectedAsset.value = assets[0].name;
        console.log('Ativos disponíveis carregados:', assets.length);
    }
  } catch (e) { console.error("Não foi possível carregar os ativos", e) }

  // if (!isFirstAccess.value) {
  //   await updateChart();
  //   chartUpdateInterval = setInterval(updateChart, 15000);
  // }
  window.addEventListener('resize', updateTutorialStepUI);
  console.log('Dashboard configurado com sucesso');
});

onUnmounted(() => {
  if (chartUpdateInterval) clearInterval(chartUpdateInterval);
  stopCheckingBalance();
  stopFakeNotifications();
  window.removeEventListener('resize', updateTutorialStepUI);
  
  if (bonusCountdownInterval) clearInterval(bonusCountdownInterval);
});

watch(balance, (newBalance, oldBalance) => {
  if (showTutorial.value) return;

  console.log(`Saldo alterado: ${formatCurrency(oldBalance)} -> ${formatCurrency(newBalance)}`);
  
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
  
  if (newBalance === 0 && !isFirstAccess.value && oldBalance > 0) {
    console.log('Saldo zerado detectado');
    accessBlocked.value = true;
  }
  
  if (!isTradeInProgress.value && !isWaitingForEntryTime.value && !isFirstAccess.value) {
    if (oldBalance > 0 && newBalance === 0) {
      console.log('Saldo zero detectado no watch: exibindo modal de bônus duplo');
      showBonusDoubleModal.value = true;
      showBonusTripleModal.value = false;
      showBonusRedemptionTripleModal.value = false;
      showBonusRedemptionDoubleModal.value = false;
    }
    else if (newBalance > 0 && newBalance < LOW_BALANCE_THRESHOLD && 
            (oldBalance >= LOW_BALANCE_THRESHOLD || oldBalance === 0)) {
      console.log('Saldo baixo detectado no watch: exibindo modal de bônus triplo');
      showBonusTripleModal.value = true;
      showBonusDoubleModal.value = false;
      showBonusRedemptionDoubleModal.value = false;
      showBonusRedemptionTripleModal.value = false;
    }
  }
});

watch([selectedAsset, selectedTime], async () => {
  if (chartUpdateInterval) clearInterval(chartUpdateInterval);
  chartSeries.value = [{ data: [] }];
  await updateChart();
  chartUpdateInterval = setInterval(updateChart, 15000);
});

</script>

<style>
/* Estilo para destacar o elemento do tutorial */
@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

@keyframes fade-in-pop {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in-pop {
    animation: fade-in-pop 0.3s ease-out forwards;
}


.tutorial-functional-highlight {
  position: relative;
  z-index: 210; /* Acima do overlay para ser funcional */
}

.tutorial-visual-highlight {
  position: relative;
  z-index: 210; /* Acima do overlay para ser funcional */
  border-radius: 0.75rem;
  animation: pulse-glow 2s infinite;
}


.glass-card {
  background: linear-gradient(135deg, color-mix(in srgb, var(--background-color) 80%, #1e293b), color-mix(in srgb, var(--background-color) 40%, #334155));
  border: 1px solid color-mix(in srgb, var(--primary-color) 20%, transparent);
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
  background-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
}
.tab-button.active {
  background-color: color-mix(in srgb, var(--primary-color) 20%, transparent);
  color: var(--primary-color);
}

/* Aplicar cor primária aos textos azuis */
.text-blue-400 { 
  color: var(--primary-color) !important; 
  background: none !important; 
}

/* Remover fundo azul dos botões e textos verdes customizados */
.text-green-400, .bg-gradient-to-r.from-green-500 {
  color: var(--primary-color) !important;
  background: none !important;
  border-color: var(--primary-color) !important;
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