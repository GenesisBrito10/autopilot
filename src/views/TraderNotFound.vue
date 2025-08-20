<template>
  <div class="min-h-screen flex items-center justify-center" :style="`background: linear-gradient(to bottom right, ${backgroundColor}, color-mix(in srgb, ${backgroundColor} 70%, ${primaryColor} 30%), ${backgroundColor})`">
    <div class="text-center p-8 max-w-md mx-auto backdrop-blur-sm rounded-2xl border border-white/20" :style="`background: color-mix(in srgb, ${backgroundColor} 50%, transparent)`">
      <div class="mb-6">
        <i class="fas fa-exclamation-triangle text-4xl mb-4" :style="`color: ${primaryColor}`"></i>
        <h1 class="text-2xl font-bold text-white mb-4">Trader não encontrado</h1>
        <p class="text-gray-300 mb-6">
          O trader solicitado não foi encontrado. Por favor, verifique o link e tente novamente.
        </p>
        <!-- <div class="flex justify-center">
          <a href="https://polariumbroker.com" class="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:opacity-90" :style="`background: linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #fff 20%))`">
            Voltar ao site principal
          </a>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Cores padrão
const primaryColor = ref('#3b82f6')
const backgroundColor = ref('#0f172a')

// Função para carregar as configurações do servidor
const loadSettings = async () => {
  try {
    const response = await axios.get('/api/settings/default')
    
    if (response.data.success && response.data.settings) {
      const settings = response.data.settings
      
      // Atualizar as cores com base nas configurações
      primaryColor.value = settings.primaryColor || '#3b82f6'
      backgroundColor.value = settings.backgroundColor || '#0f172a'
      
      // Aplicar as cores CSS customizadas
      applyCustomColors()
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    // Usar configurações padrão em caso de erro
  }
}

// Função para aplicar cores personalizadas via CSS custom properties
const applyCustomColors = () => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', primaryColor.value)
  root.style.setProperty('--background-color', backgroundColor.value)
  
  // Gerar variações da cor primária automaticamente
  root.style.setProperty('--primary-light', primaryColor.value + '20') // 20% opacity
  root.style.setProperty('--primary-dark', primaryColor.value + 'dd') // darker
}

onMounted(() => {
  // Carregar configurações do servidor
  loadSettings()
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>