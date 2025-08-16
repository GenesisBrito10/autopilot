<template>
  <AppLayout>
    <div class="min-h-screen">
      <!-- Floating Orbs -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
      </div>

      <!-- Main Container -->
      <div class="p-4 lg:p-6 max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p class="text-gray-400">Personalize as configurações do seu Copy Trader</p>
        </div>

        <!-- Settings Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Trading Settings -->
          <div class="lg:col-span-2">
            <div class="glass-card p-6 rounded-2xl">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <i class="fas fa-chart-line text-blue-400 text-xl"></i>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Configurações de Trading</h2>
                  <p class="text-sm text-gray-400">Ajuste os parâmetros do bot</p>
                </div>
              </div>

              <form @submit.prevent="saveSettings" class="space-y-6">
                <!-- Entry Value -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <i class="fas fa-dollar-sign text-blue-400"></i>
                    Valor da Entrada
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                    <input 
                      v-model="formattedEntryValue" 
                      type="text" 
                      @input="formatEntryValue"
                      @blur="onInputBlur"
                      class="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300"
                      placeholder="10,00"
                    />
                  </div>
                  <p class="text-xs text-gray-500 ml-1">Valor inicial para cada operação (ex: 10,50)</p>
                </div>

                <!-- Stop Win and Stop Loss have been removed -->

                <!-- Gale Configuration -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <i class="fas fa-redo text-yellow-400"></i>
                    Quantidade de Gales
                  </label>
                  <div class="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      @click="settings.gales = 0"
                      :class="[
                        'py-3 rounded-xl font-medium transition-all', 
                        settings.gales === 0 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                          : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-yellow-500/30'
                      ]"
                    >
                      0
                    </button>
                    <button 
                      type="button"
                      @click="settings.gales = 1"
                      :class="[
                        'py-3 rounded-xl font-medium transition-all', 
                        settings.gales === 1 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                          : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-yellow-500/30'
                      ]"
                    >
                      1
                    </button>
                    <button 
                      type="button"
                      @click="settings.gales = 2"
                      :class="[
                        'py-3 rounded-xl font-medium transition-all', 
                        settings.gales === 2 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                          : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-yellow-500/30'
                      ]"
                    >
                      2
                    </button>
                    <button 
                      type="button"
                      @click="settings.gales = 3"
                      :class="[
                        'py-3 rounded-xl font-medium transition-all', 
                        settings.gales === 3 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                          : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-yellow-500/30'
                      ]"
                    >
                      3
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 ml-1">Número de tentativas adicionais em caso de perda (Gale é uma estratégia de recuperação que dobra o valor após uma operação perdida)</p>
                </div>

                <!-- Save Button -->
                <button 
                  type="submit"
                  class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i class="fas fa-save"></i>
                  Salvar Configurações
                </button>
              </form>
            </div>

     
          </div>

          <!-- Side Panel -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Quick Stats -->
            <div class="glass-card p-6 rounded-2xl">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-info-circle text-blue-400"></i>
                Status Atual
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">Valor de Entrada</span>
                  <span class="text-white font-medium">R$ {{ formatDisplayValue(settings.entryValue) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">Gales</span>
                  <span class="text-yellow-400 font-medium">{{ settings.gales }}</span>
                </div>
              </div>
            </div>

            <!-- Risk Management Tips -->
            <div class="glass-card p-6 rounded-2xl">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-lightbulb text-yellow-400"></i>
                Dicas de Gestão
              </h3>
              <div class="space-y-3">
                <div class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-green-400 text-xs mt-1"></i>
                  <p class="text-xs text-gray-300">Use no máximo 2% do seu capital por operação</p>
                </div>
                <div class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-green-400 text-xs mt-1"></i>
                  <p class="text-xs text-gray-300">Defina stops realistas baseados no seu perfil</p>
                </div>
                <div class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-green-400 text-xs mt-1"></i>
                  <p class="text-xs text-gray-300">Revise suas configurações semanalmente</p>
                </div>
              </div>
            </div>

            <!-- Reset Button -->
            <div class="glass-card p-6 rounded-2xl">
              <button 
                @click="resetSettings"
                class="w-full bg-slate-900/50 border border-slate-700 text-gray-400 font-medium py-3 rounded-xl hover:bg-slate-900/70 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i class="fas fa-undo"></i>
                Restaurar Padrões
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import Swal from 'sweetalert2'

// Função para formatar valores monetários no formato brasileiro
const formatCurrencyBR = (value) => {
  if (typeof value !== 'number') value = 0
  return new Intl.NumberFormat('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Função para converter string formatada para número
const parseLocaleNumber = (stringValue) => {
  if (!stringValue) return 0
  const parts = stringValue.replace(/\s/g, '').split(',')
  const integerPart = parts[0].replace(/\./g, '')
  const decimalPart = parts.length > 1 ? parts[1] : '00'
  return parseFloat(`${integerPart}.${decimalPart}`)
}

// Função para formatar o valor para exibição
const formatDisplayValue = (value) => {
  if (typeof value !== 'number') return '0,00';
  
  const integerPart = Math.floor(value);
  const decimalPart = Math.round((value - integerPart) * 100);
  return integerPart + ',' + (decimalPart < 10 ? '0' + decimalPart : decimalPart);
}

const defaultSettings = {
  entryValue: 10.00,
  gales: 2,
  martingale: false,
  autoTrade: false,
  soundNotifications: true
}

const settings = ref({ ...defaultSettings })

// Variáveis para os valores formatados
const formattedEntryValue = ref('')

// Função para formatar o valor de entrada durante a digitação
const formatEntryValue = () => {
  // Armazena a posição do cursor para restaurá-la após a formatação
  const input = document.querySelector('input[v-model="formattedEntryValue"]');
  const cursorPosition = input ? input.selectionStart : 0;
  
  // Remove caracteres não numéricos, exceto vírgula
  let value = formattedEntryValue.value.replace(/[^\d,]/g, '')
  
  // Se tiver mais de uma vírgula, mantém apenas a primeira
  if (value.split(',').length > 2) {
    const parts = value.split(',');
    value = parts[0] + ',' + parts.slice(1).join('');
  }
  
  // Verifica se é um valor válido
  if (value === '' || value === ',') {
    formattedEntryValue.value = '';
    settings.value.entryValue = 0;
    return;
  }
  
  // Separa a parte inteira e decimal
  let [integerPart, decimalPart = ''] = value.split(',');
  
  // Limita a parte decimal a 2 dígitos
  if (decimalPart.length > 2) {
    decimalPart = decimalPart.substring(0, 2);
  }
  
  // Atualiza o valor numérico no settings
  const numericValue = parseFloat((integerPart + '.' + (decimalPart || '0')).replace(/\./g, ',').replace(',', '.'));
  settings.value.entryValue = numericValue;
  
  // Formata o valor para exibição (mantendo o que o usuário digitou)
  if (value.includes(',')) {
    formattedEntryValue.value = integerPart + ',' + decimalPart;
  } else {
    formattedEntryValue.value = value;
  }
  
  // Restaura a posição do cursor (com um pequeno atraso para garantir que o DOM foi atualizado)
  setTimeout(() => {
    if (input) {
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, 0);
}

// Função executada quando o usuário sai do campo de entrada
const onInputBlur = () => {
  if (formattedEntryValue.value === '') {
    formattedEntryValue.value = '0,00';
    settings.value.entryValue = 0;
    return;
  }
  
  // Garante que tenha a parte decimal
  if (!formattedEntryValue.value.includes(',')) {
    formattedEntryValue.value = formattedEntryValue.value + ',00';
  } else {
    // Se já tem vírgula, garante que tenha 2 casas decimais
    const [integerPart, decimalPart = ''] = formattedEntryValue.value.split(',');
    if (decimalPart.length === 0) {
      formattedEntryValue.value = integerPart + ',00';
    } else if (decimalPart.length === 1) {
      formattedEntryValue.value = integerPart + ',' + decimalPart + '0';
    }
  }
  
  // Atualiza o valor numérico
  const parts = formattedEntryValue.value.split(',');
  const numericValue = parseFloat(parts[0] + '.' + (parts[1] || '00'));
  settings.value.entryValue = numericValue;
}

onMounted(() => {
  const saved = localStorage.getItem('botSettings')
  if (saved) {
    const savedSettings = JSON.parse(saved)
    settings.value = { ...defaultSettings, ...savedSettings }
    
    // Inicializa o valor formatado da entrada com formato simples (apenas vírgula)
    const entryValue = settings.value.entryValue;
    const integerPart = Math.floor(entryValue);
    const decimalPart = Math.round((entryValue - integerPart) * 100);
    formattedEntryValue.value = integerPart + ',' + (decimalPart < 10 ? '0' + decimalPart : decimalPart);
  } else {
    formattedEntryValue.value = '10,00';
  }
})

function saveSettings() {
  // Garante que o valor da entrada tenha até 2 casas decimais
  settings.value.entryValue = Math.round(settings.value.entryValue * 100) / 100
  
  localStorage.setItem('botSettings', JSON.stringify(settings.value))
  Swal.fire({
    text: 'Configurações salvas com sucesso!',
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    background: 'rgba(26, 31, 53, 0.95)',
    color: '#fff',
    customClass: { popup: 'custom-toast success' }
  })
}

function resetSettings() {
  Swal.fire({
    title: 'Restaurar Configurações?',
    text: 'Isso irá restaurar todas as configurações para os valores padrão',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, restaurar',
    cancelButtonText: 'Cancelar',
    background: 'rgba(26, 31, 53, 0.98)',
    color: '#fff',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      settings.value = { ...defaultSettings }
      const entryValue = settings.value.entryValue;
      const integerPart = Math.floor(entryValue);
      const decimalPart = Math.round((entryValue - integerPart) * 100);
      formattedEntryValue.value = integerPart + ',' + (decimalPart < 10 ? '0' + decimalPart : decimalPart);
      localStorage.setItem('botSettings', JSON.stringify(settings.value))
      Swal.fire({
        text: 'Configurações restauradas!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: 'rgba(26, 31, 53, 0.95)',
        color: '#fff',
        customClass: { popup: 'custom-toast success' }
      })
    }
  })
}
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
  filter: blur(80px);
  opacity: 0.3;
  animation: float-orb 20s infinite ease-in-out;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  bottom: 20%;
  left: 5%;
  animation-delay: 10s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -40px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 30px) scale(0.95);
  }
  75% {
    transform: translate(40px, 20px) scale(1.05);
  }
}

/* Custom Toggle Animation */
input:checked ~ div {
  animation: toggle-on 0.3s ease-in-out;
}

@keyframes toggle-on {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>