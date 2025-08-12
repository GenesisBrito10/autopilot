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
          <h1 class="text-3xl font-bold text-white mb-2">{{ t.tutorials }}</h1>
          <p class="text-gray-400">{{ t.tutorialsSubtitle }}</p>
        </div>

        <!-- Video Tutorials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Tutorial Card 1: Introdução -->
          <div class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs text-blue-300 font-medium">
                  Básico
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-book text-blue-400"></i>
                {{ t.introTutorial }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ t.introTutorialDesc }}
              </p>
              <button @click="showVideo('intro')" 
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>

          <!-- Tutorial Card 2: Configuração -->
          <div class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 bg-gradient-to-br from-emerald-600/20 to-green-600/20 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-emerald-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm rounded-full text-xs text-emerald-300 font-medium">
                  Configuração
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-cog text-emerald-400"></i>
                {{ t.setupTutorial }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ t.setupTutorialDesc }}
              </p>
              <button @click="showVideo('setup')" 
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>

          <!-- Tutorial Card 3: Estratégias -->
          <div class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 bg-gradient-to-br from-purple-600/20 to-violet-600/20 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full text-xs text-purple-300 font-medium">
                  Estratégias
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-chart-line text-purple-400"></i>
                {{ t.strategyTutorial }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ t.strategyTutorialDesc }}
              </p>
              <button @click="showVideo('strategy')" 
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 hover:from-purple-500/30 hover:to-violet-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>

          <!-- Tutorial Card 4: Trading Automático -->
          <div class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 bg-gradient-to-br from-orange-600/20 to-amber-600/20 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-orange-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full text-xs text-orange-300 font-medium">
                  Automação
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-robot text-orange-400"></i>
                {{ t.autoTradingTutorial }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ t.autoTradingTutorialDesc }}
              </p>
              <button @click="showVideo('autotrading')" 
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 hover:from-orange-500/30 hover:to-amber-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>

          <!-- Tutorial Card 5: Gerenciamento de Risco -->
          <div class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 bg-gradient-to-br from-red-600/20 to-rose-600/20 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full text-xs text-red-300 font-medium">
                  Avançado
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-shield-alt text-red-400"></i>
                {{ t.riskManagementTutorial }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ t.riskManagementTutorialDesc }}
              </p>
              <button @click="showVideo('risk')" 
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 hover:from-red-500/30 hover:to-rose-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>

          <!-- Tutorial Card 6: Dicas Avançadas -->
          <div class="glass-card rounded-2xl overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 bg-gradient-to-br from-cyan-600/20 to-teal-600/20 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </div>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs text-cyan-300 font-medium">
                  Pro Tips
                </span>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <i class="fas fa-lightbulb text-cyan-400"></i>
                {{ t.advancedTipsTutorial }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">
                {{ t.advancedTipsTutorialDesc }}
              </p>
              <button @click="showVideo('advanced')" 
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                <i class="fas fa-play-circle"></i>
                {{ t.watchVideo }}
              </button>
            </div>
          </div>
        </div>

        <!-- FAQ and Support Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- FAQ Section -->
          <div class="lg:col-span-2">
            <div class="glass-card rounded-2xl p-6">
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <i class="fas fa-question-circle text-blue-400"></i>
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
                      <i :class="['fas fa-chevron-circle-right text-blue-400 transition-transform duration-300', { 'rotate-90': faq.open }]"></i>
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

          <!-- Support Section -->
     
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '@/components/AppLayout.vue'

// Tradução
const translations = {
  pt: {
    tutorials: 'Tutoriais',
    tutorialsSubtitle: 'Aprenda a utilizar todas as funcionalidades do Copy Trader IA',
    introTutorial: 'Introdução à Plataforma',
    introTutorialDesc: 'Conheça a interface e as principais funcionalidades do Copy Trader.',
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
    tutorialsSubtitle: 'Learn how to use all the features of Copy Trader AI',
    introTutorial: 'Platform Introduction',
    introTutorialDesc: 'Get to know the interface and main features of Copy Trader.',
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

// Listen for language changes from other components
onMounted(() => {
  window.addEventListener('app:language-changed', (event) => {
    if (event.detail && event.detail.language && event.detail.language !== currentLanguage.value) {
      currentLanguage.value = event.detail.language
    }
  })
})

// FAQ section
const faqs = ref([
  {
    question: currentLanguage.value === 'pt' ? 'Como funciona o Copy Trader automático?' : 'How does the automated Copy Trader work?',
    answer: currentLanguage.value === 'pt' 
      ? 'O Copy Trader automático replica operações de traders experientes em tempo real. Você escolhe o trader para seguir e o sistema copia automaticamente todas as operações proporcionalmente ao seu capital.'
      : 'The automated Copy Trader replicates operations from experienced traders in real-time. You choose the trader to follow and the system automatically copies all operations proportionally to your capital.',
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
    question: currentLanguage.value === 'pt' ? 'O Copy Trader é seguro?' : 'Is Copy Trader safe?',
    answer: currentLanguage.value === 'pt'
      ? 'Sim, o Copy Trader utiliza tecnologia de criptografia avançada para proteger seus dados e transações. Além disso, não temos acesso direto aos seus fundos, que são gerenciados pelas corretoras parceiras.'
      : 'Yes, Copy Trader uses advanced encryption technology to protect your data and transactions. In addition, we do not have direct access to your funds, which are managed by partner brokers.',
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
const showVideo = (videoType) => {
  const videoTitles = {
    intro: t.value.introTutorial,
    setup: t.value.setupTutorial,
    strategy: t.value.strategyTutorial,
    autotrading: t.value.autoTradingTutorial,
    risk: t.value.riskManagementTutorial,
    advanced: t.value.advancedTipsTutorial
  }

  Swal.fire({
    title: videoTitles[videoType],
    html: `
      <div class="video-placeholder" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.6)); border-radius: 12px; padding: 80px 20px; text-align: center;">
        <i class="fas fa-video" style="font-size: 48px; color: #3b82f6; margin-bottom: 16px; display: block;"></i>
        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 8px;">Tutorial em breve disponível</p>
        <p style="color: #64748b; font-size: 14px;">Estamos preparando conteúdo de alta qualidade para você</p>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    width: '600px',
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
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  bottom: 10%;
  right: 20%;
  animation-delay: 7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
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
  border: 1px solid rgba(59, 130, 246, 0.2);
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