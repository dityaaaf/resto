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
const passwordConfirmation = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function signUp() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!supabase) {
    errorMessage.value = 'Supabase belum dikonfigurasi. Isi URL dan key Supabase di file .env.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Konfirmasi kata sandi belum cocok.'
    return
  }

  isSubmitting.value = true
  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value
  })
  isSubmitting.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  if (data.session) {
    await navigateTo('/')
    return
  }

  successMessage.value = 'Pendaftaran berhasil. Silakan cek email untuk konfirmasi sebelum masuk.'
}
</script>

<template>
  <main class="register-page">
    <NuxtLink
      class="register-brand"
      to="/"
      aria-label="Kembali ke beranda Rasa Rantau"
    >
      <span
        class="register-brand-mark"
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
      <span class="register-brand-name">rasa<span>rantau</span></span>
    </NuxtLink>

    <div class="register-layout">
      <section class="register-welcome">
        <p class="register-eyebrow">
          SELAMAT DATANG DI MEJA KAMI
        </p>
        <h1>Temukan rasa<br><em>yang terasa rumah.</em></h1>
        <p>Buat akun untuk jadi bagian dari cerita dan cita rasa Nusantara.</p>
        <div
          class="register-art"
          aria-hidden="true"
        >
          <div class="register-art-circle" />
          <div class="register-leaf register-leaf-one" />
          <div class="register-leaf register-leaf-two" />
          <div class="register-plate">
            <span class="register-rice" />
            <span class="register-side" />
            <span class="register-greens" />
          </div>
          <span class="register-art-label">Hangat, seperti di rumah</span>
        </div>
        <NuxtLink
          class="register-back-home"
          to="/"
        >
          <span aria-hidden="true">←</span> Kembali ke beranda
        </NuxtLink>
      </section>

      <section class="register-panel">
        <div class="register-card">
          <div
            class="register-card-leaf"
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
            class="register-card-mark"
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
          <p class="register-card-eyebrow">
            AKUN RASA RANTAU
          </p>
          <h2>Buat akun baru.</h2>
          <p class="register-description">
            Isi data berikut untuk mulai bergabung.
          </p>

          <form
            class="register-form"
            @submit.prevent="signUp"
          >
            <p
              v-if="!supabaseConfigured"
              class="register-message register-error"
              role="status"
            >
              Supabase belum dikonfigurasi. Isi URL dan key Supabase di file .env.
            </p>

            <label for="register-email">Alamat email</label>
            <input
              id="register-email"
              v-model="email"
              autocomplete="email"
              inputmode="email"
              name="email"
              placeholder="nama@email.com"
              required
              type="email"
            >

            <label for="register-password">Kata sandi</label>
            <input
              id="register-password"
              v-model="password"
              autocomplete="new-password"
              minlength="6"
              name="password"
              placeholder="Minimal 6 karakter"
              required
              type="password"
            >

            <label for="register-password-confirmation">Ulangi kata sandi</label>
            <input
              id="register-password-confirmation"
              v-model="passwordConfirmation"
              autocomplete="new-password"
              minlength="6"
              name="passwordConfirmation"
              placeholder="Masukkan ulang kata sandi"
              required
              type="password"
            >

            <p
              v-if="errorMessage"
              class="register-message register-error"
              role="alert"
            >
              {{ errorMessage }}
            </p>
            <p
              v-if="successMessage"
              class="register-message register-success"
              role="status"
            >
              {{ successMessage }}
            </p>

            <button
              class="register-submit"
              type="submit"
              :disabled="isSubmitting || !supabaseConfigured"
            >
              {{ isSubmitting ? 'Sedang mendaftar...' : 'Buat akun' }}
              <span
                v-if="!isSubmitting"
                aria-hidden="true"
              >→</span>
            </button>
          </form>

          <p class="register-login">
            Sudah punya akun?
            <NuxtLink to="/login">Masuk di sini</NuxtLink>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background: var(--color-paper);
}

.register-brand {
  position: absolute;
  z-index: 2;
  top: 30px;
  left: max(42px, calc((100% - 1220px) / 2));
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.register-brand-mark,
.register-card-mark {
  display: grid;
  width: 36px;
  color: var(--color-green);
  place-items: center;
}

.register-brand-mark svg,
.register-card-mark svg {
  width: 100%;
}

.register-brand-name {
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.register-brand-name span {
  color: var(--color-green);
}

.register-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1fr) minmax(460px, 0.94fr);
}

.register-welcome {
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

.register-eyebrow,
.register-card-eyebrow {
  margin: 0 0 18px;
  color: var(--color-green);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.65px;
}

.register-welcome h1 {
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

.register-welcome h1 em {
  color: var(--color-green);
  font-weight: 400;
}

.register-welcome > p:not(.register-eyebrow) {
  position: relative;
  z-index: 1;
  max-width: 390px;
  margin: 19px 0 0;
  color: #747469;
  font-size: 13px;
  line-height: 1.9;
}

.register-art {
  position: absolute;
  right: 3%;
  bottom: 105px;
  display: grid;
  width: min(380px, 41vw);
  aspect-ratio: 1;
  place-items: center;
}

.register-art-circle {
  position: absolute;
  inset: 5%;
  border-radius: 50%;
  background: #e8dfce;
}

.register-plate {
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

.register-plate::before {
  position: absolute;
  inset: 10px;
  border: 1px solid #d8cbb1;
  border-radius: 50%;
  content: "";
}

.register-rice {
  position: absolute;
  top: 19%;
  left: 18%;
  width: 47%;
  height: 42%;
  border-radius: 50%;
  background: repeating-radial-gradient(ellipse at 45% 45%, #fffdf1 0 3px, #ece5d2 4px 5px);
}

.register-side {
  position: absolute;
  right: 16%;
  bottom: 19%;
  width: 46%;
  height: 34%;
  border-radius: 48%;
  background: radial-gradient(circle at 35% 36%, #d58a4c 0 4px, transparent 5px), #994b2f;
  box-shadow: inset -7px -7px 0 #7f3b2a;
}

.register-greens {
  position: absolute;
  top: 23%;
  right: 16%;
  width: 23%;
  height: 37%;
  border-radius: 75% 20% 64% 30%;
  background: repeating-linear-gradient(130deg, #4a7046 0 7px, #809363 8px 12px);
  transform: rotate(22deg);
}

.register-leaf {
  position: absolute;
  z-index: 2;
  border-radius: 0 100% 0 100%;
  background: #627951;
  transform: rotate(-34deg);
}

.register-leaf-one {
  top: 1%;
  left: 8%;
  width: 36px;
  height: 58px;
}

.register-leaf-two {
  right: 6%;
  bottom: 9%;
  width: 26px;
  height: 44px;
  background: #89976a;
  transform: rotate(27deg);
}

.register-art-label {
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

.register-back-home {
  position: absolute;
  bottom: 36px;
  left: max(50px, calc((100vw - 1200px) / 2));
  color: #717265;
  font-size: 12px;
  font-weight: 600;
}

.register-back-home span {
  margin-right: 9px;
  color: var(--color-green);
}

.register-panel {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 84px 45px 40px;
}

.register-card {
  position: relative;
  width: min(100%, 418px);
  padding: 37px 45px 29px;
  border: 1px solid #eee8dc;
  border-radius: 5px;
  background: #fffdf8;
  box-shadow: 0 16px 55px #4c3b210c;
}

.register-card-leaf {
  position: absolute;
  top: -20px;
  right: 22px;
  width: 53px;
  color: #74845b;
  transform: rotate(13deg);
}

.register-card-mark {
  width: 36px;
  margin-bottom: 15px;
}

.register-card-eyebrow {
  margin-bottom: 8px;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.register-card h2 {
  margin: 0;
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.7px;
}

.register-description {
  margin: 7px 0 19px;
  color: #858276;
  font-size: 12px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form label {
  margin: 12px 0 7px;
  color: #504b41;
  font-size: 11px;
  font-weight: 600;
}

.register-form input {
  width: 100%;
  height: 43px;
  padding: 0 12px;
  border: 1px solid #e2ded4;
  border-radius: 3px;
  outline: none;
  background: #fffefa;
  color: #39392f;
  font-size: 12px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.register-form input::placeholder {
  color: #b0ac9f;
}

.register-form input:focus {
  border-color: #78906c;
  box-shadow: 0 0 0 3px #78906c20;
}

.register-message {
  margin: 9px 0 0;
  font-size: 11px;
  line-height: 1.5;
}

.register-error {
  color: #a33d2f;
}

.register-success {
  color: var(--color-green);
}

.register-submit {
  display: flex;
  height: 46px;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 15px;
  border: 0;
  border-radius: 3px;
  background: var(--color-green);
  color: #fffdf8;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 160ms ease, transform 160ms ease;
}

.register-submit:hover:not(:disabled) {
  background: var(--color-green-dark);
  transform: translateY(-1px);
}

.register-submit:focus-visible,
.register-brand:focus-visible,
.register-back-home:focus-visible,
.register-login a:focus-visible {
  outline: 3px solid #9cac8e;
  outline-offset: 3px;
}

.register-submit:disabled {
  cursor: wait;
  opacity: 0.75;
}

.register-login {
  margin: 18px 0 0;
  color: #8c887c;
  font-size: 10px;
  text-align: center;
}

.register-login a {
  color: var(--color-green);
  font-weight: 700;
}

.register-login a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .register-layout {
    grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  }

  .register-welcome {
    padding-top: 165px;
    padding-right: 25px;
    padding-left: 35px;
  }

  .register-welcome h1 {
    font-size: clamp(40px, 5vw, 54px);
  }

  .register-art {
    right: -10%;
    bottom: 115px;
    width: 350px;
  }

  .register-back-home {
    left: 35px;
  }

  .register-panel {
    padding-right: 30px;
    padding-left: 30px;
  }
}

@media (max-width: 680px) {
  .register-brand {
    top: 22px;
    left: 21px;
  }

  .register-layout {
    grid-template-columns: 1fr;
  }

  .register-welcome {
    display: none;
  }

  .register-panel {
    padding: 80px 20px 35px;
    background: #f1eee5;
  }

  .register-card {
    width: min(100%, 420px);
    padding: 35px 28px 29px;
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
