<script setup lang="ts">
/* eslint-disable better-tailwindcss/no-unknown-classes */

definePageMeta({
  middleware: ['guest-only']
})

const { public: publicConfig } = useRuntimeConfig()
const supabaseConfigured = Boolean(
  publicConfig.supabase.url
  && publicConfig.supabase.key
  && publicConfig.supabase.url !== 'https://your-project.supabase.co'
  && publicConfig.supabase.key !== 'your-supabase-publishable-key'
)
const supabase = supabaseConfigured ? useSupabaseClient() : null
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

async function signIn() {
  errorMessage.value = ''

  if (!supabase) {
    errorMessage.value = 'Konfigurasi Supabase belum tersedia. Periksa URL dan publishable key di file .env.'
    return
  }

  isSubmitting.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  })

  isSubmitting.value = false

  if (error) {
    errorMessage.value = error.message.toLowerCase().includes('invalid login credentials')
      ? 'Email atau kata sandi tidak sesuai. Coba lagi, atau daftar jika belum memiliki akun.'
      : error.message
    return
  }

  await navigateTo('/')
}
</script>

<template>
  <main class="login-page">
    <NuxtLink
      class="login-brand"
      to="/"
      aria-label="Kembali ke beranda Rasa Rantau"
    >
      <span
        class="login-brand-mark"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M31.8 7.7C21.4 7.7 12.7 10.1 9.7 16.8c-2.2 4.9.4 10.3 5.3 10.3 8.5 0 15.2-8.8 16.8-19.4Z"
            fill="currentColor"
          />
          <path
            d="M9.3 32.2c3.1-7.5 8.7-12.5 16.5-16.5"
            stroke="#FBF8F1"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span class="login-brand-name">rasa<span>rantau</span></span>
    </NuxtLink>

    <div class="login-layout">
      <section class="welcome-panel">
        <p class="welcome-eyebrow">
          SELAMAT DATANG KEMBALI
        </p>
        <h1>Selalu ada<br><em>rasa untuk pulang.</em></h1>
        <div
          class="welcome-art"
          aria-hidden="true"
        >
          <div class="welcome-art-circle" />
          <div class="welcome-leaf welcome-leaf-one" />
          <div class="welcome-leaf welcome-leaf-two" />
          <div class="welcome-leaf welcome-leaf-three" />
          <div class="welcome-plate">
            <span class="welcome-rice" />
            <span class="welcome-side" />
            <span class="welcome-greens" />
          </div>
        </div>
        <NuxtLink
          class="back-home"
          to="/"
        >
          <span aria-hidden="true">←</span> Kembali ke beranda
        </NuxtLink>
      </section>

      <section class="login-panel">
        <div class="login-card">
          <div
            class="card-leaf"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 70 82"
              fill="none"
            >
              <path
                d="M61 7C35 7 12 16 9 39c-3 17 7 29 20 25C49 59 59 35 61 7Z"
                fill="currentColor"
              />
              <path
                d="M12 73c8-27 21-46 41-62"
                stroke="#fffdf8"
                stroke-width="2.4"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div
            class="card-mark"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M31.8 7.7C21.4 7.7 12.7 10.1 9.7 16.8c-2.2 4.9.4 10.3 5.3 10.3 8.5 0 15.2-8.8 16.8-19.4Z"
                fill="currentColor"
              />
              <path
                d="M9.3 32.2c3.1-7.5 8.7-12.5 16.5-16.5"
                stroke="#fffdf8"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <p class="card-eyebrow">
            AKUN RASA RANTAU
          </p>
          <h2>Masuk ke akunmu.</h2>
          <p class="card-description">
            Gunakan email dan kata sandi untuk melanjutkan.
          </p>

          <form
            class="login-form"
            @submit.prevent="signIn"
          >
            <p
              v-if="!supabaseConfigured"
              class="form-error"
              role="status"
            >
              Konfigurasi Supabase belum tersedia. Periksa URL dan publishable key di file .env.
            </p>

            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              autocomplete="email"
              inputmode="email"
              name="email"
              placeholder="contoh@email.com"
              required
              type="email"
            >

            <div class="password-label">
              <label for="password">Kata sandi</label>
            </div>
            <div class="password-input">
              <input
                id="password"
                v-model="password"
                autocomplete="current-password"
                name="password"
                placeholder="Masukkan kata sandi"
                required
                :type="showPassword ? 'text' : 'password'"
              >
              <button
                class="show-password"
                type="button"
                :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Sembunyikan' : 'Tampilkan' }}
              </button>
            </div>

            <p
              v-if="errorMessage"
              class="form-error"
              role="alert"
            >
              {{ errorMessage }}
            </p>

            <button
              class="submit-button"
              type="submit"
              :disabled="isSubmitting || !supabaseConfigured"
            >
              {{ isSubmitting ? 'Sedang memproses...' : supabaseConfigured ? 'Masuk' : 'Supabase belum terhubung' }}
              <span
                v-if="!isSubmitting"
                aria-hidden="true"
              >→</span>
            </button>
          </form>

          <p class="login-help">
            Belum memiliki akun?
            <NuxtLink
              class="register-link"
              to="/register"
            >Daftar sekarang</NuxtLink>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--color-paper);
}

.login-brand {
  position: absolute;
  z-index: 2;
  top: 30px;
  left: max(42px, calc((100% - 1220px) / 2));
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.login-brand-mark,
.card-mark {
  display: grid;
  width: 36px;
  color: var(--color-green);
  place-items: center;
}

.login-brand-mark svg,
.card-mark svg {
  width: 100%;
}

.login-brand-name {
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.login-brand-name span {
  color: var(--color-green);
}

.login-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1fr) minmax(460px, 0.94fr);
}

.welcome-panel {
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  padding: 175px max(50px, calc((100vw - 1200px) / 2));
  padding-right: 56px;
  background: #f1eee5;
}

.welcome-eyebrow,
.card-eyebrow {
  margin: 0 0 18px;
  color: var(--color-green);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.65px;
}

.welcome-panel h1 {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 5vw, 66px);
  font-weight: 400;
  letter-spacing: -2.5px;
  line-height: 1.08;
}

.welcome-panel h1 em {
  color: var(--color-green);
  font-weight: 400;
}

.welcome-panel > p:not(.welcome-eyebrow) {
  position: relative;
  z-index: 1;
  max-width: 390px;
  margin: 19px 0 0;
  color: #747469;
  font-size: 13px;
  line-height: 1.9;
}

.welcome-art {
  position: absolute;
  right: 3%;
  bottom: 105px;
  display: grid;
  width: min(380px, 41vw);
  aspect-ratio: 1;
  place-items: center;
}

.welcome-art-circle {
  position: absolute;
  inset: 5%;
  border-radius: 50%;
  background: #e8dfce;
}

.welcome-plate {
  position: relative;
  z-index: 1;
  width: 72%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 14px solid #fffdf8;
  border-radius: 50%;
  background: #e5dbc6;
  box-shadow: 0 18px 40px #49351c1c, 0 0 0 1px #d8cebb;
  transform: rotate(-15deg);
}

.welcome-plate::before {
  position: absolute;
  inset: 10px;
  border: 1px solid #d8cbb1;
  border-radius: 50%;
  content: "";
}

.welcome-rice {
  position: absolute;
  top: 19%;
  left: 18%;
  width: 47%;
  height: 42%;
  border-radius: 50%;
  background: repeating-radial-gradient(ellipse at 45% 45%, #fffdf1 0 3px, #ece5d2 4px 5px);
}

.welcome-side {
  position: absolute;
  right: 16%;
  bottom: 19%;
  width: 46%;
  height: 34%;
  border-radius: 48%;
  background: radial-gradient(circle at 35% 36%, #d58a4c 0 4px, transparent 5px), #994b2f;
  box-shadow: inset -7px -7px 0 #7f3b2a;
}

.welcome-greens {
  position: absolute;
  top: 23%;
  right: 16%;
  width: 23%;
  height: 37%;
  border-radius: 75% 20% 64% 30%;
  background: repeating-linear-gradient(130deg, #4a7046 0 7px, #809363 8px 12px);
  transform: rotate(22deg);
}

.welcome-leaf {
  position: absolute;
  z-index: 2;
  border-radius: 0 100% 0 100%;
  background: #627951;
  transform: rotate(-34deg);
}

.welcome-leaf-one {
  top: 1%;
  left: 8%;
  width: 36px;
  height: 58px;
}

.welcome-leaf-two {
  top: 16%;
  left: 2%;
  width: 22px;
  height: 39px;
  background: #89976a;
  transform: rotate(-58deg);
}

.welcome-leaf-three {
  right: 6%;
  bottom: 9%;
  width: 26px;
  height: 44px;
  background: #89976a;
  transform: rotate(27deg);
}

.welcome-art-label {
  position: absolute;
  z-index: 3;
  right: -3%;
  bottom: 8%;
  padding: 12px 15px;
  border: 1px solid #e3dccd;
  background: #fffdf8;
  color: #67695c;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-style: italic;
  box-shadow: 0 7px 22px #423b2a0a;
}

.back-home {
  position: absolute;
  bottom: 36px;
  left: max(50px, calc((100vw - 1200px) / 2));
  color: #717265;
  font-size: 12px;
  font-weight: 600;
}

.back-home span {
  margin-right: 9px;
  color: var(--color-green);
}

.login-panel {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 85px 45px 56px;
}

.login-card {
  position: relative;
  width: min(100%, 418px);
  padding: 48px 45px 38px;
  border: 1px solid #eee8dc;
  border-radius: 5px;
  background: #fffdf8;
  box-shadow: 0 16px 55px #4c3b210c;
}

.card-leaf {
  position: absolute;
  top: -20px;
  right: 22px;
  width: 53px;
  color: #74845b;
  transform: rotate(13deg);
}

.card-mark {
  width: 40px;
  margin-bottom: 25px;
}

.card-eyebrow {
  margin-bottom: 10px;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.login-card h2 {
  margin: 0;
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 35px;
  font-weight: 400;
  letter-spacing: -0.7px;
}

.card-description {
  margin: 8px 0 30px;
  color: #858276;
  font-size: 12px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form label {
  margin-bottom: 8px;
  color: #504b41;
  font-size: 11px;
  font-weight: 600;
}

.login-form input {
  width: 100%;
  height: 47px;
  padding: 0 13px;
  border: 1px solid #e2ded4;
  border-radius: 3px;
  outline: none;
  background: #fffefa;
  color: #39392f;
  font-size: 12px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.login-form input::placeholder {
  color: #b0ac9f;
}

.login-form input:focus {
  border-color: #78906c;
  box-shadow: 0 0 0 3px #78906c20;
}

.password-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 82px;
}

.show-password {
  position: absolute;
  top: 0;
  right: 0;
  height: 47px;
  padding: 0 13px;
  border: 0;
  background: transparent;
  color: var(--color-green);
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
}

.show-password:focus-visible,
.back-home:focus-visible,
.login-brand:focus-visible {
  outline: 3px solid #9cac8e;
  outline-offset: 3px;
}

.form-error {
  margin: 13px 0 0;
  color: #a33d2f;
  font-size: 11px;
  line-height: 1.5;
}

.submit-button {
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  margin-top: 25px;
  padding: 0 16px;
  border: 0;
  border-radius: 3px;
  background: var(--color-green);
  color: #fffdf8;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 160ms ease, transform 160ms ease;
}

.submit-button:hover:not(:disabled) {
  background: var(--color-green-dark);
  transform: translateY(-1px);
}

.submit-button:focus-visible {
  outline: 3px solid #9cac8e;
  outline-offset: 3px;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.75;
}

.login-help {
  margin: 22px 0 0;
  color: #8c887c;
  font-size: 10px;
  line-height: 1.7;
  text-align: center;
}

.login-help span {
  color: var(--color-brown);
}

.register-link {
  color: var(--color-green);
  font-weight: 700;
}

.register-link:hover {
  text-decoration: underline;
}

.register-link:focus-visible {
  outline: 3px solid #9cac8e;
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .login-layout {
    grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  }

  .welcome-panel {
    padding-top: 165px;
    padding-right: 25px;
    padding-left: 35px;
  }

  .welcome-panel h1 {
    font-size: clamp(40px, 5vw, 54px);
  }

  .welcome-art {
    right: -10%;
    bottom: 115px;
    width: 350px;
  }

  .back-home {
    left: 35px;
  }

  .login-panel {
    padding-right: 30px;
    padding-left: 30px;
  }
}

@media (max-width: 680px) {
  .login-brand {
    top: 22px;
    left: 21px;
  }

  .login-layout {
    min-height: 100vh;
    grid-template-columns: 1fr;
  }

  .welcome-panel {
    display: none;
  }

  .login-panel {
    min-height: 100vh;
    padding: 88px 20px 60px;
    background: #f1eee5;
  }

  .login-card {
    width: min(100%, 420px);
    padding: 42px 28px 34px;
  }

}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
  }
}
</style>
