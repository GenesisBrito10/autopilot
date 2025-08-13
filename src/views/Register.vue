<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Mobile Layout -->
    <div class="lg:hidden w-full max-w-md mx-auto p-6">
      <!-- Mobile Header -->
      <div class="text-center mb-6">
        <img :src="logoUrl" class="w-40 h-20 object-contain mx-auto mb-4">
        <h1 class="text-2xl font-bold text-white mb-2">Junte-se ao Futuro</h1>
        <p class="text-sm text-gray-400">
          Comece agora sua jornada no trading com IA
        </p>
      </div>

      <!-- Mobile Form -->
      <div class="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
        <h2 class="text-xl font-bold text-white mb-6 text-center">{{ t.createAccount }}</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name Fields Row -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Nome</label>
              <input type="text" v-model="firstName" :placeholder="'Nome'"
                class="w-full bg-slate-900/40 border border-slate-800 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600 text-sm"
                required>
            </div>
            <div>
              <label class="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Sobrenome</label>
              <input type="text" v-model="lastName" :placeholder="'Sobrenome'"
                class="w-full bg-slate-900/40 border border-slate-800 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600 text-sm"
                required>
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label class="flex items-center text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              <i class="fas fa-envelope mr-2 text-blue-400 text-xs"></i>
              E-MAIL
            </label>
            <input type="email" v-model="email" :placeholder="'seu@email.com'"
              class="w-full bg-slate-900/40 border border-slate-800 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600 text-sm"
              required>
          </div>

          <!-- Password Field -->
          <div>
            <label class="flex items-center text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              <i class="fas fa-lock mr-2 text-blue-400 text-xs"></i>
              SENHA
            </label>
            <input type="password" v-model="password" @input="validatePassword" :placeholder="'••••••••'"
              class="w-full bg-slate-900/40 border border-slate-800 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600 text-sm"
              required>
            <div class="mt-2 text-xs space-y-1">
              <div class="flex items-center">
                <i
                  :class="[hasMinLength ? 'fas fa-check text-green-400 text-xs' : 'fas fa-circle text-gray-600 text-xs', 'mr-2 w-3']"></i>
                <span :class="hasMinLength ? 'text-green-400' : 'text-gray-500'">Mínimo de 8 caracteres</span>
              </div>
              <div class="flex items-center">
                <i
                  :class="[hasNumber ? 'fas fa-check text-green-400 text-xs' : 'fas fa-circle text-gray-600 text-xs', 'mr-2 w-3']"></i>
                <span :class="hasNumber ? 'text-green-400' : 'text-gray-500'">Pelo menos um número</span>
              </div>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start">
            <input type="checkbox" id="termsCheckbox" v-model="termsAccepted"
              class="mt-1 rounded border-blue-400/30 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0">
            <label for="termsCheckbox" class="ml-2 text-gray-400 text-xs leading-relaxed">
              Confirmo que tenho 18 anos ou mais e aceito os
              <a href="#" class="text-blue-400 hover:text-blue-300">Termos</a>
            </label>
          </div>

          <!-- Register Button -->
          <button type="submit" :disabled="isLoading || !isFormValid"
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span class="flex items-center">
              {{ isLoading ? t.creatingAccount : 'Criar conta' }}
              <i v-if="!isLoading" class="fas fa-arrow-right ml-2 text-xs"></i>
            </span>
          </button>

          <!-- Login Link -->
          <div class="text-center pt-2">
            <p class="text-gray-400 text-sm">
              Já tem uma conta?
              <router-link to="/login" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Fazer login
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden lg:flex w-full max-w-7xl mx-auto shadow-2xl rounded-2xl overflow-hidden m-4">

      <!-- Left Side - Welcome Section -->
      <div class="lg:w-5/12 relative bg-gradient-to-br from-slate-800/90 via-blue-900/30 to-slate-800/90 p-12">
        <!-- Background Pattern -->
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div class="floating-orb orb-left-1"></div>
          <div class="floating-orb orb-left-2"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col justify-center w-full">
          <div class="mb-8">
            <img :src="logoUrl" class="w-48 h-24 object-contain">
          </div>

          <h1 class="text-3xl font-bold text-white mb-4 leading-tight">Comece Agora<br>Sua Jornada</h1>
          <p class="text-base text-gray-300 mb-10 leading-relaxed">
            Crie sua conta e aproveite o poder da<br>
            inteligência artificial para maximizar<br>
            seus resultados no trading.
          </p>

          <!-- Benefits -->
          <div class="space-y-4">
            <div
              class="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/5">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i class="fas fa-bolt text-blue-400 text-sm"></i>
              </div>
              <span class="text-white/80 text-base">Setup em 2 minutos</span>
            </div>

            <div
              class="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/5">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i class="fas fa-gift text-blue-400 text-sm"></i>
              </div>
              <span class="text-white/80 text-base">Teste grátis disponível</span>
            </div>

            <div
              class="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/5">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i class="fas fa-headset text-blue-400 text-sm"></i>
              </div>
              <span class="text-white/80 text-base">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Register Form -->
      <div class="lg:w-7/12 flex items-center justify-center p-10 bg-[#0a0f1f]">

        <!-- Register Form Container -->
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">Criar conta</h2>
            <p class="text-gray-400 text-base">Preencha os dados abaixo para começar</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Name Fields Row -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-gray-400 text-sm font-medium mb-2 block uppercase tracking-wider">Nome</label>
                <input type="text" v-model="firstName" :placeholder="'Nome'"
                  class="w-full bg-slate-900/40 border border-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600"
                  required>
              </div>
              <div>
                <label class="text-gray-400 text-sm font-medium mb-2 block uppercase tracking-wider">Sobrenome</label>
                <input type="text" v-model="lastName" :placeholder="'Sobrenome'"
                  class="w-full bg-slate-900/40 border border-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600"
                  required>
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label class="flex items-center text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">
                <i class="fas fa-envelope mr-2 text-blue-400"></i>
                E-MAIL
              </label>
              <input type="email" v-model="email" :placeholder="'seu@email.com'"
                class="w-full bg-slate-900/40 border border-slate-800 text-white px-4 py-3.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600"
                required>
            </div>

            <!-- Password Field -->
            <div>
              <label class="flex items-center text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">
                <i class="fas fa-lock mr-2 text-blue-400"></i>
                SENHA
              </label>
              <input type="password" v-model="password" @input="validatePassword" :placeholder="'••••••••'"
                class="w-full bg-slate-900/40 border border-slate-800 text-white px-4 py-3.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-slate-900/60 transition-all duration-300 placeholder-gray-600"
                required>
              <div class="mt-2 text-xs space-y-1">
                <div class="flex items-center">
                  <i
                    :class="[hasMinLength ? 'fas fa-check text-green-400' : 'fas fa-circle text-gray-600', 'mr-2 text-xs w-3']"></i>
                  <span :class="hasMinLength ? 'text-green-400' : 'text-gray-500'">Mínimo de 8 caracteres</span>
                </div>
                <div class="flex items-center">
                  <i
                    :class="[hasNumber ? 'fas fa-check text-green-400' : 'fas fa-circle text-gray-600', 'mr-2 text-xs w-3']"></i>
                  <span :class="hasNumber ? 'text-green-400' : 'text-gray-500'">Pelo menos um número</span>
                </div>
              </div>
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-start">
              <input type="checkbox" id="termsCheckboxDesktop" v-model="termsAccepted"
                class="mt-1 rounded border-blue-400/30 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0">
              <label for="termsCheckboxDesktop" class="ml-3 text-gray-400 text-sm leading-relaxed">
                Confirmo que tenho 18 anos ou mais e aceito os
                <a href="#" class="text-blue-400 hover:text-blue-300">Termos e Condições</a>
              </label>
            </div>

            <!-- Register Button -->
            <button type="submit" :disabled="isLoading || !isFormValid"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span class="flex items-center">
                {{ isLoading ? t.creatingAccount : 'Criar conta' }}
                <i v-if="!isLoading" class="fas fa-arrow-right ml-2"></i>
              </span>
            </button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-[#0a0f1f] text-gray-500">ou</span>
              </div>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-gray-400">
                Já tem uma conta?
                <router-link to="/login" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors ml-1">
                  Fazer login
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import logoUrl from '../assets/polarium.png'
import Polarium from '../assets/polarium.png'

import { translations, languageNames } from '@/locales'

// Bandeira do Brasil em base64
const brazilFlagBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDMyMCAzMDI0Ij48cGF0aCBmaWxsPSIjMDA5YjNhIiBkPSJNMCAwaDQzMjB2MzAyNEgweiIvPjxwYXRoIGQ9Ik0yMTYwIDE1MTJsMS0xIDIwNTkgMS0xMDMwIDczMy0xMDMwLTczMXoiIGZpbGw9IiNmZWRmMDAiLz48Y2lyY2xlIGN4PSIyMTYwIiBjeT0iMTUxMiIgcj0iNzM1IiBmaWxsPSIjMDAyNzc2Ii8+PHBhdGggZD0iTTE3NDMgMTU0MmgyMXEzMS0yNiA0OC03MVE2OCAxMjA5IDIxNTkgOTQwcTIwOTUgMjcwIDIwOTAgNTMwbC0xIDE1cTc0IDEwMSAyMiAyMDItMTIgMjEtMzYgNDFsLTEzIDhxLTY1IDIzLTEzOSAyNS03MyAwLTEyOC0xOC01NC0xOC0xMDItNTAtNDktMzEtOTQtNjgtNDUtMzYtODctNzYtNDItMzktODEtNzgtMzktNDAtNzUtODAtMzYtNDEtNjgtODItMzItNDAtNjAtNzktMjktMzktNTMtNzctMjUtMzktNDMtNzUtMTktMzctMzEtNzItMTItMzQtMTgtNjYtNi0zMS02LTU4IDAtMzAgNy02MCA4LTMwIDIxLTYwIDEzLTMwIDMzLTU4IDIwLTI4IDQ2LTU0IDI2LTI2IDU4LTQ5IDMxLTIzIDY3LTQxIDM3LTE5IDc3LTMyIDQwLTEzIDgzLTE5IDQzLTYgODctNHQ4OCA3bDg5IDE1cTQ0IDggODQgMjBsMTM0IDQ4IDQ3IDIxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTIiLz48cGF0aCBkPSJNMTc2NCAxNDk1aDIwLjdxMC0yIDQuMy03dDEwLjQtMTIuNiAxNS4zLTE3LjMgMTguOS0yMHEyNC45LTI0IDU2LjMtNDZ0NjgtNDIuNXE0MC0yMiA4Mi44LTQwLjggNDMtMTkgODguMy0zNC41IDQ1LjYtMTUgOTIuMy0yNi40IDQ3LTEyIDk0LjQtMTkgNDcuNy03IDk0LjMtOS43IDQ2LjctMyA5MS44LS4zIDQ1LjIgMi43IDg4IDEwLjQgNDIuOCA3LjcgODIuMyAyMCA0MC4zIDEyLjcgNzYuNiAyOS43IDM2LjYgMTcgNjkgMzguMyAzMi40IDIxLjQgNjAgNDcgMjcuOCAyNS44IDUwLjQgNTQuNyAyMi42IDI5IDQwIDYxLjcgMTcuMiAzMyAyOCA2OSA0LjUgMTUuMyA3LjMgMzAuOCAyLjggMTUuNSA0IDMxLjMgMS4yIDE1LjggMC4zIDMxLjQtMSAxNS44LTMuNCAzMS4zLTUgMzEuMy0xNC44IDYxLjQtMTAgMzAtMjQuNiA1OC4zLTE0LjcgMjguMy0zNC4yIDU0LjctMTkuNCAyNi4zLTQzLjQgNTAuMy0yNCAyNC0xNDAuOCAxMTQuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEyIi8+PHBhdGggZD0iTTIwMTAgMTM4MmE5NiA5NiAwIDEgMCAwLTE5MiA5NiA5NiAwIDAgMCAwIDE5MnptMTUwIDBhOTYgOTYgMCAxIDAgMC0xOTIgOTYgOTYgMCAwIDAgMCAxOTJ6bTE1MCAwYTk2IDk2IDAgMSAwIDAtMTkyIDk2IDk2IDAgMCAwIDAgMTkyem0tMzAwIDEyMGE5NiA5NiAwIDEgMCAwLTE5MiA5NiA5NiAwIDAgMCAwIDE5MnptMTUwIDBhOTYgOTYgMCAxIDAgMC0xOTIgOTYgOTYgMCAwIDAgMCAxOTJ6bTE1MCAwYTk2IDk2IDAgMSAwIDAtMTkyIDk2IDk2IDAgMCAwIDAgMTkyem0tMzAwIDEyMGE5NiA5NiAwIDEgMCAwLTE5MiA5NiA5NiAwIDAgMCAwIDE5MnptMTUwIDBhOTYgOTYgMCAxIDAgMC0xOTIgOTYgOTYgMCAwIDAgMCAxOTJ6bTE1MCAwYTk2IDk2IDAgMSAwIDAtMTkyIDk2IDk2IDAgMCAwIDAgMTkyeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=="

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const country = ref('Brasil')
const email = ref('')
const password = ref('')
// Phone field removed
const termsAccepted = ref(false)
const isLoading = ref(false)
const currentLanguage = ref(localStorage.getItem('language') || 'pt')
const isLanguageDropdownOpen = ref(false)
const hasMinLength = ref(false)
const hasNumber = ref(false)

const t = computed(() => translations[currentLanguage.value])

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
}

const selectLanguage = (lang) => {
  currentLanguage.value = lang
  localStorage.setItem('language', lang)
  isLanguageDropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.language-dropdown')
    if (dropdown && !dropdown.contains(e.target)) {
      isLanguageDropdownOpen.value = false
    }
  })
})

const validatePassword = () => {
  hasMinLength.value = password.value.length >= 8
  hasNumber.value = /\d/.test(password.value)
}

const isFormValid = computed(() => {
  return firstName.value && lastName.value && email.value && password.value &&
    termsAccepted.value && hasMinLength.value && hasNumber.value
})

const showToast = (message, isError = false) => {
  Swal.fire({
    text: message,
    icon: isError ? 'error' : 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: 'rgba(26, 31, 53, 0.95)',
    color: '#fff',
    customClass: {
      popup: 'custom-toast ' + (isError ? 'error' : 'success')
    }
  })
}

const handleRegister = async (event) => {
  event.preventDefault()

  if (!isFormValid.value) {
    showToast(t.value.fillFields, true)
    return
  }

  try {
    isLoading.value = true

    const data = {
      identifier: email.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
      accepted: ['terms', 'privacy policy'],
      country_id: 30,
      timezone: 'America/Sao_Paulo'
    }

    const response = await axios.post('/api/register', data, {
      baseURL: '/',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200 || response.status === 201) {
      showToast('Conta criada com sucesso!\nRedirecionando para o dashboard...')
      isLoading.value = false
      localStorage.setItem('userEmail', email.value)
      localStorage.setItem('userPassword', password.value)


    }



  } catch (error) {
    let errorMessage = t.value.registrationFailed || 'Falha no registro';

    if (error.response && error.response.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    }

    showToast(errorMessage, true);
    console.log('Registration error:', error);
  }

  try {
    isLoading.value = true

    // Save credentials to localStorage
    localStorage.setItem('userEmail', email.value)
    localStorage.setItem('userPassword', password.value)

    // Try to start SDK (login)
    const response = await axios.post('/api/sdk/start', {
      email: email.value,
      password: password.value
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 200) {
      showToast(t.value.loginSuccess)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      showToast(t.value.loginError, true)
    }
  } catch (error) {
    console.error('Login error:', error)
    // Check for array of messages in error response
    const messages = error.response?.data?.message
    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach(msg => showToast(msg, true))
    } else {
      showToast(error.response?.data?.error || t.value.loginError, true)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Grid Pattern for Left Side */
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(40px, 40px);
  }
}

/* Floating Orbs for Left Side */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float-orb 20s infinite ease-in-out;
}

.orb-left-1 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  top: 10%;
  left: -100px;
  animation-delay: 0s;
}

.orb-left-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #1d4ed8, #0284c7);
  bottom: 10%;
  right: -100px;
  animation-delay: 8s;
}

@keyframes float-orb {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(40px, -30px) scale(1.1);
  }

  50% {
    transform: translate(-30px, 40px) scale(0.95);
  }

  75% {
    transform: translate(20px, 20px) scale(1.05);
  }
}

/* Input Field Effects */
input[type="email"],
input[type="password"],
input[type="text"] {
  transition: all 0.3s ease;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus {
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 0 20px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

/* Button Shine Effect */
button[type="submit"] {
  position: relative;
  overflow: hidden;
}

button[type="submit"]::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%);
  transform: rotate(45deg) translate(-100%, -100%);
  transition: transform 0.6s;
}

button[type="submit"]:hover::after {
  transform: rotate(45deg) translate(100%, 100%);
}

/* Checkbox Custom Style */
input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Link Underline Animation */
a {
  position: relative;
  text-decoration: none;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  transition: width 0.3s ease;
}

a:hover::after {
  width: 100%;
}

/* Toast Notifications */
.custom-toast {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 14px 24px;
}

.custom-toast.success {
  border-left: 4px solid #10B981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.95));
}

.custom-toast.error {
  border-left: 4px solid #EF4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(15, 23, 42, 0.95));
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Apply animations on load */
.hidden.lg\:flex {
  animation: fadeIn 0.8s ease-out;
}

form>* {
  animation: slideInRight 0.6s ease-out backwards;
}

form>*:nth-child(1) {
  animation-delay: 0.1s;
}

form>*:nth-child(2) {
  animation-delay: 0.2s;
}

form>*:nth-child(3) {
  animation-delay: 0.3s;
}

form>*:nth-child(4) {
  animation-delay: 0.4s;
}

form>*:nth-child(5) {
  animation-delay: 0.5s;
}

form>*:nth-child(6) {
  animation-delay: 0.6s;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #06b6d4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2563eb, #0891b2);
}

/* Mobile Optimizations */
@media (max-width: 1024px) {
  .floating-orb {
    display: none;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>