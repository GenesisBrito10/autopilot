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
      <div class="p-4 lg:p-6 max-w-4xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <img :src="logoUrl" alt="Polarium" class="w-16 h-16 object-contain">
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Polarium Copy Trader</h1>
          <p class="text-gray-400">Todos os nossos links em um só lugar</p>
        </div>

        <!-- Main Links -->
        <div class="space-y-4 mb-8">
          <!-- Website -->
          <a href="https://polariumbroker.com" target="_blank" 
            class="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30">
              <i class="fas fa-globe text-white text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-white font-semibold text-lg">Site Oficial</h3>
              <p class="text-gray-400 text-sm">Acesse nossa plataforma principal</p>
            </div>
            <i class="fas fa-arrow-up-right-from-square text-gray-500 group-hover:text-white transition-colors"></i>
          </a>

          <!-- Telegram Channel -->
          <a href="https://t.me/polariumchannel" target="_blank" 
            class="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
            <div class="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-sky-500/30">
              <i class="fab fa-telegram text-white text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-white font-semibold text-lg">Canal do Telegram</h3>
              <p class="text-gray-400 text-sm">Sinais e atualizações em tempo real</p>
            </div>
            <i class="fas fa-arrow-up-right-from-square text-gray-500 group-hover:text-white transition-colors"></i>
          </a>

          <!-- WhatsApp Support -->
          <a href="https://wa.me/5511999999999" target="_blank" 
            class="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/30">
              <i class="fab fa-whatsapp text-white text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-white font-semibold text-lg">Suporte WhatsApp</h3>
              <p class="text-gray-400 text-sm">Fale diretamente com nossa equipe</p>
            </div>
            <i class="fas fa-arrow-up-right-from-square text-gray-500 group-hover:text-white transition-colors"></i>
          </a>

          <!-- Instagram -->
          <a href="https://instagram.com/polariumtrader" target="_blank" 
            class="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
            <div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30">
              <i class="fab fa-instagram text-white text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-white font-semibold text-lg">Instagram</h3>
              <p class="text-gray-400 text-sm">Dicas diárias e conteúdo exclusivo</p>
            </div>
            <i class="fas fa-arrow-up-right-from-square text-gray-500 group-hover:text-white transition-colors"></i>
          </a>

          <!-- YouTube -->
          <a href="https://youtube.com/@polariumtrader" target="_blank" 
            class="glass-card p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
            <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/30">
              <i class="fab fa-youtube text-white text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-white font-semibold text-lg">YouTube</h3>
              <p class="text-gray-400 text-sm">Tutoriais e análises de mercado</p>
            </div>
            <i class="fas fa-arrow-up-right-from-square text-gray-500 group-hover:text-white transition-colors"></i>
          </a>
        </div>

        <!-- Secondary Links Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <!-- Discord -->
          <a href="https://discord.gg/polarium" target="_blank" 
            class="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-500/30 transition-colors">
                <i class="fab fa-discord text-indigo-400 text-xl"></i>
              </div>
              <h4 class="text-white font-medium text-sm">Discord</h4>
              <p class="text-gray-500 text-xs mt-1">Comunidade</p>
            </div>
          </a>

          <!-- Facebook -->
          <a href="https://facebook.com/polariumtrader" target="_blank" 
            class="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600/30 transition-colors">
                <i class="fab fa-facebook text-blue-400 text-xl"></i>
              </div>
              <h4 class="text-white font-medium text-sm">Facebook</h4>
              <p class="text-gray-500 text-xs mt-1">Página oficial</p>
            </div>
          </a>

          <!-- Twitter/X -->
          <a href="https://twitter.com/polariumtrader" target="_blank" 
            class="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-slate-700/70 transition-colors">
                <i class="fab fa-x-twitter text-white text-xl"></i>
              </div>
              <h4 class="text-white font-medium text-sm">X (Twitter)</h4>
              <p class="text-gray-500 text-xs mt-1">Atualizações</p>
            </div>
          </a>

          <!-- TikTok -->
          <a href="https://tiktok.com/@polariumtrader" target="_blank" 
            class="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:from-pink-500/30 group-hover:to-blue-500/30 transition-colors">
                <i class="fab fa-tiktok text-white text-xl"></i>
              </div>
              <h4 class="text-white font-medium text-sm">TikTok</h4>
              <p class="text-gray-500 text-xs mt-1">Vídeos curtos</p>
            </div>
          </a>

          <!-- LinkedIn -->
          <a href="https://linkedin.com/company/polarium" target="_blank" 
            class="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-blue-700/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-700/30 transition-colors">
                <i class="fab fa-linkedin text-blue-500 text-xl"></i>
              </div>
              <h4 class="text-white font-medium text-sm">LinkedIn</h4>
              <p class="text-gray-500 text-xs mt-1">Profissional</p>
            </div>
          </a>

          <!-- Email -->
          <a href="mailto:contato@polariumtrader.com" 
            class="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-500/30 transition-colors">
                <i class="fas fa-envelope text-orange-400 text-xl"></i>
              </div>
              <h4 class="text-white font-medium text-sm">E-mail</h4>
              <p class="text-gray-500 text-xs mt-1">Contato</p>
            </div>
          </a>
        </div>

        <!-- Resources Section -->
        <div class="glass-card rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-book text-purple-400"></i>
            Recursos Úteis
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Documentation -->
            <a href="#" class="group">
              <div class="p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-file-alt text-purple-400"></i>
                  </div>
                  <div>
                    <h4 class="text-white font-medium">Documentação</h4>
                    <p class="text-gray-500 text-xs">Guias e tutoriais completos</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- FAQ -->
            <a href="#" class="group">
              <div class="p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-question-circle text-cyan-400"></i>
                  </div>
                  <div>
                    <h4 class="text-white font-medium">FAQ</h4>
                    <p class="text-gray-500 text-xs">Perguntas frequentes</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- API Docs -->
            <a href="#" class="group">
              <div class="p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-code text-green-400"></i>
                  </div>
                  <div>
                    <h4 class="text-white font-medium">API</h4>
                    <p class="text-gray-500 text-xs">Documentação técnica</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- Blog -->
            <a href="#" class="group">
              <div class="p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-newspaper text-yellow-400"></i>
                  </div>
                  <div>
                    <h4 class="text-white font-medium">Blog</h4>
                    <p class="text-gray-500 text-xs">Notícias e atualizações</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-gray-500 text-sm">
            © 2024 Polarium Copy Trader. Todos os direitos reservados.
          </p>
          <div class="flex justify-center gap-4 mt-4">
            <a href="#" class="text-gray-600 hover:text-white transition-colors text-xs">
              Termos de Uso
            </a>
            <span class="text-gray-700">•</span>
            <a href="#" class="text-gray-600 hover:text-white transition-colors text-xs">
              Política de Privacidade
            </a>
            <span class="text-gray-700">•</span>
            <a href="#" class="text-gray-600 hover:text-white transition-colors text-xs">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import logoUrl from '../assets/polarium.png'
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
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  bottom: 10%;
  right: -5%;
  animation-delay: 7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
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