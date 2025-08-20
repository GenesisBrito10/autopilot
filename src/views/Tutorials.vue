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
      <div class="p-4 lg:p-6 max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">{{ t.tutorials }}</h1>
          <p class="text-gray-400">{{ t.tutorialsSubtitle }}</p>
        </div>

        <!-- Video Tutorials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Cards dinâmicos das aulas do banco -->
          <div v-for="lesson in lessons.filter(l => l.isActive).sort((a, b) => a.order - b.order)" :key="lesson.id" 
            class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 overflow-hidden" :style="`background: linear-gradient(to bottom right, color-mix(in srgb, ${primaryColor} 60%, transparent), color-mix(in srgb, ${primaryColor} 40%, transparent))`">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              
              <!-- Thumbnail do YouTube -->
              <img v-if="getYouTubeThumbnail(lesson.youtubeUrl)" 
                :src="getYouTubeThumbnail(lesson.youtubeUrl)" 
                class="absolute inset-0 w-full h-full object-cover opacity-30"
                :alt="lesson.title">
              
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300" :style="`background: color-mix(in srgb, ${primaryColor} 30%, transparent)`">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium" :style="`background: color-mix(in srgb, ${primaryColor} 20%, transparent); color: ${primaryColor}`">
                  {{ lesson.category }}
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-play-circle" :style="`color: ${primaryColor}`"></i>
                {{ lesson.title }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ lesson.description }}
              </p>
              <button @click="showVideo(lesson.id)" 
                class="w-full py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium" 
                :style="`background: linear-gradient(to right, color-mix(in srgb, ${primaryColor} 20%, transparent), color-mix(in srgb, ${primaryColor} 15%, transparent)); color: ${primaryColor}; &:hover { background: linear-gradient(to right, color-mix(in srgb, ${primaryColor} 30%, transparent), color-mix(in srgb, ${primaryColor} 25%, transparent)); }`">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>
          
          <!-- Fallback se não houver aulas -->
          <div v-if="lessons.length === 0" class="col-span-full">
            <div class="glass-card rounded-2xl p-8 text-center">
              <i class="fas fa-video text-4xl mb-4" :style="`color: ${primaryColor}`"></i>
              <h3 class="text-lg font-bold text-white mb-2">Nenhuma aula disponível</h3>
              <p class="text-gray-400">As aulas serão carregadas em breve.</p>
            </div>
          </div>
        </div>
<!-- 
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div class="glass-card rounded-2xl p-6">
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="`background: color-mix(in srgb, ${primaryColor} 20%, transparent)`">
                  <i class="fas fa-question-circle" :style="`color: ${primaryColor}`"></i>
                </div>
                {{ t.faqTitle }}
              </h3>

              <div class="space-y-3">
                <div v-for="(faq, index) in faqs" :key="index" 
                  class="border border-slate-800 rounded-xl overflow-hidden transition-all duration-300"
                  :class="{ 'bg-slate-900/30': faq.open }">
                  <button 
                    @click="toggleFaq(index)" 
                    class="w-full px-5 py-4 flex justify-between items-center hover:bg-slate-900/20 transition-colors duration-200"
                  >
                    <h4 class="font-medium text-left text-white flex items-center gap-3">
                      <i :class="['fas fa-chevron-circle-right transition-transform duration-300', { 'rotate-90': faq.open }]" :style="`color: ${primaryColor}`"></i>
                      {{ faq.question }}
                    </h4>
                  </button>
                  <transition name="faq">
                    <div v-if="faq.open" class="px-5 pb-4">
                      <p class="text-gray-400 text-sm pl-8">{{ faq.answer }}</p>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>

     
        </div> -->
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '@/components/AppLayout.vue'
import axios from 'axios'

// Tradução
const translations = {
  pt: {
    tutorials: 'Tutoriais',
    tutorialsSubtitle: 'Aprenda a utilizar todas as funcionalidades do Trade Auto Pilot IA',
    introTutorial: 'Introdução à Plataforma',
    introTutorialDesc: 'Conheça a interface e as principais funcionalidades do Trade Auto Pilot.',
    setupTutorial: 'Configuração Inicial',
    setupTutorialDesc: 'Aprenda a configurar sua conta e personalizar suas preferências de trading.',
    strategyTutorial: 'Estratégias de Trading',
    strategyTutorialDesc: 'Conheça as principais estratégias de trading utilizadas por traders profissionais.',
    autoTradingTutorial: 'Trading Automático',
    autoTradingTutorialDesc: 'Configure o bot para realizar operações automáticas seguindo sua estratégia.',
    riskManagementTutorial: 'Gerenciamento de Risco',
    riskManagementTutorialDesc: 'Aprenda a gerenciar seu capital e minimizar riscos nas operações.',
    advancedTipsTutorial: 'Dicas Avançadas',
    advancedTipsTutorialDesc: 'Técnicas avançadas para melhorar seus resultados no trading.',
    watchVideo: 'Assistir Vídeo',
    faqTitle: 'Perguntas Frequentes',
    supportTitle: 'Suporte',
    supportDesc: 'Está com dúvidas? Entre em contato com nossa equipe.',
    contactWhatsapp: 'WhatsApp',
    contactEmail: 'E-mail',
    language: 'pt-BR',
  },
  en: {
    tutorials: 'Tutorials',
    tutorialsSubtitle: 'Learn how to use all the features of Trade Auto Pilot AI',
    introTutorial: 'Platform Introduction',
    introTutorialDesc: 'Get to know the interface and main features of Trade Auto Pilot.',
    setupTutorial: 'Initial Setup',
    setupTutorialDesc: 'Learn how to set up your account and customize your trading preferences.',
    strategyTutorial: 'Trading Strategies',
    strategyTutorialDesc: 'Learn the main trading strategies used by professional traders.',
    autoTradingTutorial: 'Automated Trading',
    autoTradingTutorialDesc: 'Configure the bot to perform automatic operations following your strategy.',
    riskManagementTutorial: 'Risk Management',
    riskManagementTutorialDesc: 'Learn how to manage your capital and minimize risks in operations.',
    advancedTipsTutorial: 'Advanced Tips',
    advancedTipsTutorialDesc: 'Advanced techniques to improve your trading results.',
    watchVideo: 'Watch Video',
    faqTitle: 'Frequently Asked Questions',
    supportTitle: 'Support',
    supportDesc: 'Have questions? Contact our team.',
    contactWhatsapp: 'WhatsApp',
    contactEmail: 'Email',
    language: 'en-US',
  }
}

const currentLanguage = ref(localStorage.getItem('language') || 'pt')
const t = computed(() => translations[currentLanguage.value] || translations.pt)

// Configurações dinâmicas de cores da API
const primaryColor = ref('#3b82f6')
const backgroundColor = ref('#0f172a')

// Aulas carregadas do banco de dados
const lessons = ref([])

// Função para carregar configurações de cores e aulas da API
const loadSettings = async () => {
  try {
    // Obter o slug da URL ou usar 'default'
    const slug = window.getAppSlug()
    const response = await axios.get(`http://localhost:2006/api/settings/${slug}`)
    if (response.data.success) {
      const settings = response.data.settings
      primaryColor.value = settings.primaryColor || '#3b82f6'
      backgroundColor.value = settings.backgroundColor || '#0f172a'
      lessons.value = settings.lessons || []
      
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

// Função para extrair ID do vídeo do YouTube
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

// Função para gerar thumbnail do YouTube
const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}

// Listen for language changes from other components
onMounted(async () => {
  // Carregar configurações de cores da API
  await loadSettings()
  
  window.addEventListener('app:language-changed', (event) => {
    if (event.detail && event.detail.language && event.detail.language !== currentLanguage.value) {
      currentLanguage.value = event.detail.language
    }
  })
})

// FAQ section
const faqs = ref([
  {
    question: currentLanguage.value === 'pt' ? 'Como funciona o Trade Auto Pilot automático?' : 'How does the automated Trade Auto Pilot work?',
    answer: currentLanguage.value === 'pt' 
      ? 'O Trade Auto Pilot automático replica operações de traders experientes em tempo real. Você escolhe o trader para seguir e o sistema copia automaticamente todas as operações proporcionalmente ao seu capital.'
      : 'The automated Trade Auto Pilot replicates operations from experienced traders in real-time. You choose the trader to follow and the system automatically copies all operations proportionally to your capital.',
    open: false
  },
  {
    question: currentLanguage.value === 'pt' ? 'Qual é a diferença entre conta demo e conta real?' : 'What is the difference between a demo account and a real account?',
    answer: currentLanguage.value === 'pt'
      ? 'A conta demo usa dinheiro virtual para que você possa praticar suas estratégias sem riscos. A conta real utiliza dinheiro real para operações com potencial de lucro ou perda real.'
      : 'The demo account uses virtual money so you can practice your strategies without risk. The real account uses real money for operations with potential for real profit or loss.',
    open: false
  },
  {
    question: currentLanguage.value === 'pt' ? 'Como posso sacar meus lucros?' : 'How can I withdraw my profits?',
    answer: currentLanguage.value === 'pt'
      ? 'Para sacar seus lucros, acesse a seção de finanças da sua conta, selecione a opção de saque e siga as instruções para transferir os fundos para sua conta bancária ou carteira digital.'
      : 'To withdraw your profits, go to the finance section of your account, select the withdrawal option and follow the instructions to transfer the funds to your bank account or digital wallet.',
    open: false
  },
  {
    question: currentLanguage.value === 'pt' ? 'Quais estratégias são mais eficientes?' : 'Which strategies are most efficient?',
    answer: currentLanguage.value === 'pt'
      ? 'A eficiência das estratégias varia de acordo com as condições de mercado e perfil do investidor. Recomendamos começar com estratégias mais conservadoras como seguir tendências e diversificar suas operações.'
      : 'The efficiency of strategies varies according to market conditions and investor profile. We recommend starting with more conservative strategies such as following trends and diversifying your operations.',
    open: false
  },
  {
    question: currentLanguage.value === 'pt' ? 'O Trade Auto Pilot é seguro?' : 'Is Trade Auto Pilot safe?',
    answer: currentLanguage.value === 'pt'
      ? 'Sim, o Trade Auto Pilot utiliza tecnologia de criptografia avançada para proteger seus dados e transações. Além disso, não temos acesso direto aos seus fundos, que são gerenciados pelas corretoras parceiras.'
      : 'Yes, Trade Auto Pilot uses advanced encryption technology to protect your data and transactions. In addition, we do not have direct access to your funds, which are managed by partner brokers.',
    open: false
  }
])

// Update FAQ language when language changes
watch(currentLanguage, (newLang) => {
  faqs.value = faqs.value.map(faq => {
    return {
      ...faq,
      question: newLang === 'pt' 
        ? translations.pt.faqQuestions?.[faqs.value.indexOf(faq)] || faq.question
        : translations.en.faqQuestions?.[faqs.value.indexOf(faq)] || faq.question,
      answer: newLang === 'pt'
        ? translations.pt.faqAnswers?.[faqs.value.indexOf(faq)] || faq.answer
        : translations.en.faqAnswers?.[faqs.value.indexOf(faq)] || faq.answer
    }
  })
})

// Toggle FAQ open/close
const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}

// Show video modal
const showVideo = (lessonId) => {
  const lesson = lessons.value.find(l => l.id === lessonId)
  
  if (!lesson) {
    Swal.fire({
      title: 'Aula não encontrada',
      text: 'Esta aula ainda não está disponível.',
      icon: 'warning',
      confirmButtonColor: primaryColor.value
    })
    return
  }

  const videoId = getYouTubeVideoId(lesson.youtubeUrl)
  
  if (!videoId) {
    Swal.fire({
      title: 'Erro no vídeo',
      text: 'URL do YouTube inválida.',
      icon: 'error',
      confirmButtonColor: primaryColor.value
    })
    return
  }

  Swal.fire({
    title: lesson.title,
    html: `
      <div style="margin-bottom: 16px;">
        <p style="color: #94a3b8; font-size: 14px; text-align: left;">${lesson.description}</p>
      </div>
      <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; border-radius: 12px; overflow: hidden; background: #000;">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          allowfullscreen>
        </iframe>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    width: '800px',
    background: 'rgba(15, 23, 42, 0.98)',
    color: '#ffffff',
    customClass: {
      popup: 'tutorial-modal',
      closeButton: 'text-gray-400 hover:text-white'
    }
  })
}
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
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 80%, #06b6d4 20%));
  top: 10%;
  left: 10%; /* Este orb fica perto da sidebar */
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 90%, #6366f1 10%), var(--primary-color));
  bottom: 10%;
  right: 20%;
  animation-delay: 7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 80%, #06b6d4 20%), color-mix(in srgb, var(--primary-color) 70%, #0ea5e9 30%));
  top: 50%;
  right: 5%;
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

/* FAQ Transition */
.faq-enter-active,
.faq-leave-active {
  transition: all 0.3s ease;
}

.faq-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.faq-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Line Clamp Utility */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tutorial Modal Custom Styles */
:deep(.tutorial-modal) {
  border: 1px solid color-mix(in srgb, var(--primary-color) 20%, transparent);
  backdrop-filter: blur(10px);
}

:deep(.swal2-close) {
  color: #94a3b8;
  font-size: 24px;
}

:deep(.swal2-close:hover) {
  color: #ffffff;
}
</style>