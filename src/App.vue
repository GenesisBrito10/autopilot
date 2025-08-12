<template>
  <div id="app">
    <div class="loading-overlay" v-if="isLoading">
      <div class="spinner">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoading: false
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.isLoading = true;
      next();
    });
    
    this.$router.afterEach(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });

    // Adiciona meta tags para controle da cor da barra de status
    this.setMobileThemeColor();
  },
  methods: {
    setMobileThemeColor() {
      // Atualiza a meta tag de cor do tema dinamicamente
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.content = '#000000';

      // Atualiza a meta tag para iOS
      let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!appleMeta) {
        appleMeta = document.createElement('meta');
        appleMeta.name = 'apple-mobile-web-app-status-bar-style';
        document.head.appendChild(appleMeta);
      }
      appleMeta.content = 'black';
    }
  }
}
</script>

<style>
@import '@fortawesome/fontawesome-free/css/all.min.css';

html, body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  background-size: cover;
  min-height: 100vh;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #10B981;
  animation: pulse 1.5s infinite ease-in-out;
}

.dot1 {
  animation-delay: 0s;
}

.dot2 {
  animation-delay: 0.2s;
}

.dot3 {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style> 