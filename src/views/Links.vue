<template>
  <AppLayout>
    <div class="min-h-screen" :style="`background-color: ${backgroundColor}`">
      <!-- Floating Orbs -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>

      <!-- Main Container -->
      <div class="p-4 lg:p-6 max-w-4xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <!-- <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" :style="`background: linear-gradient(to bottom right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, #8b5cf6 20%))`">
            <img :src="logoUrl" alt="Polarium" class="w-16 h-16 object-contain">
          </div> -->
          <h1 class="text-3xl font-bold text-white mb-2">{{ appName }} Trade Auto Pilot</h1>
          <p class="text-gray-400">Todos os nossos links em um só lugar</p>
        </div>

        <!-- Main Links (do banco de dados) -->
        <div class="space-y-4 mb-8">
          <!-- Links principais dinâmicos -->
          <a v-for="link in socialLinks.filter(l => l.isActive && l.isMain).sort((a, b) => a.order - b.order)" 
            :key="link.id" 
            :href="link.url" 
            target="_blank" 
            class="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" 
              :style="`background: linear-gradient(to bottom right, ${link.color || primaryColor}, color-mix(in srgb, ${link.color || primaryColor} 80%, #fff 20%)); box-shadow: 0 4px 16px color-mix(in srgb, ${link.color || primaryColor} 30%, transparent)`">
              <i :class="link.icon + ' text-white text-xl'"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-white font-semibold text-lg">{{ link.name }}</h3>
              <p class="text-gray-400 text-sm">{{ link.description }}</p>
            </div>
            <i class="fas fa-arrow-up-right-from-square text-gray-500 group-hover:text-white transition-colors"></i>
          </a>
          
          <!-- Fallback se não houver links principais -->
          <div v-if="socialLinks.filter(l => l.isActive && l.isMain).length === 0" class="glass-card p-8 rounded-2xl text-center">
            <i class="fas fa-link text-4xl mb-4" :style="`color: ${primaryColor}`"></i>
            <h3 class="text-lg font-bold text-white mb-2">Nenhum link principal configurado</h3>
            <p class="text-gray-400">Os links serão carregados em breve.</p>
          </div>
        </div>

  
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import defaultLogoUrl from '../assets/polarium.png'
import axios from 'axios'

// Configurações dinâmicas de cores da API
const logoUrl = ref(defaultLogoUrl)
const primaryColor = ref('#3b82f6')
const backgroundColor = ref('#0f172a')
const appName = ref('Polarium Trade Auto Pilot')

// Links dinâmicos do banco de dados
const socialLinks = ref([])

// Função para carregar configurações de cores e links da API
const loadSettings = async () => {
  try {
    // Obter o slug da URL ou usar 'default'
    const slug = window.getAppSlug()
    const response = await axios.get(`http://localhost:2006/api/settings/${slug}`)
    if (response.data.success) {
      const settings = response.data.settings
      logoUrl.value = settings.logoUrl || defaultLogoUrl
      primaryColor.value = settings.primaryColor || '#3b82f6'
      backgroundColor.value = settings.backgroundColor || '#0f172a'
      appName.value = settings.appName || 'Polarium Trade Auto Pilot'
      socialLinks.value = settings.socialLinks || []
      
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
}

onMounted(async () => {
  // Carregar configurações de cores e links da API
  await loadSettings()
})
</script>

<style scoped>
/* Glass Card Effect */
.glass-card {
  background: linear-gradient(135deg, color-mix(in srgb, var(--background-color) 60%, transparent), color-mix(in srgb, var(--background-color) 30%, transparent));
  border: 1px solid color-mix(in srgb, var(--primary-color) 10%, transparent);
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
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 80%, #8b5cf6 20%));
  top: 10%;
  left: -5%; /* Este orb fica perto da sidebar */
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 70%, #ec4899 30%), color-mix(in srgb, var(--primary-color) 80%, #8b5cf6 20%));
  bottom: 10%;
  right: -5%;
  animation-delay: 7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 80%, #06b6d4 20%), var(--primary-color));
  top: 60%;
  left: 70%;
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