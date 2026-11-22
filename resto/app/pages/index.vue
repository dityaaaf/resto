<script setup lang="ts">
/* eslint-disable better-tailwindcss/no-unknown-classes */

const { public: publicConfig } = useRuntimeConfig()
const supabaseConfigured = Boolean(
  publicConfig.supabase.url
  && publicConfig.supabase.key
  && publicConfig.supabase.url !== 'https://your-project.supabase.co'
  && publicConfig.supabase.key !== 'your-supabase-publishable-key'
)
const supabase = supabaseConfigured ? useSupabaseClient() : null
const user = supabaseConfigured ? useSupabaseUser() : ref(null)
const signingOut = ref(false)

async function signOut() {
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase belum dikonfigurasi.' })
  }

  signingOut.value = true
  const { error } = await supabase.auth.signOut()
  signingOut.value = false

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
}
</script>

<template>
  <main class="home-page">
    <header class="site-header">
      <NuxtLink
        class="brand"
        to="/"
        aria-label="Rasa Rantau, beranda"
      >
        <span
          class="brand-mark"
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
        <span class="brand-name">rasa<span>rantau</span></span>
      </NuxtLink>

      <nav
        class="site-nav"
        aria-label="Navigasi utama"
      >
        <a href="#cerita">Cerita kami</a>
        <a href="#menu">Menu favorit</a>
      </nav>

      <div class="header-action">
        <span
          v-if="user"
          class="signed-in"
        >Halo, {{ user.email }}</span>
        <button
          v-if="user"
          class="button button-outline header-button"
          type="button"
          :disabled="signingOut"
          @click="signOut"
        >
          {{ signingOut ? 'Keluar...' : 'Keluar' }}
        </button>
        <NuxtLink
          v-else
          class="button button-outline header-button"
          to="/login"
        >
          Masuk
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="eyebrow-line" />
          DARI DAPUR NUSANTARA
        </p>
        <h1>Rasa rumah,<br><em>di mana saja.</em></h1>
        <p class="hero-description">
          Hangatnya masakan Indonesia, diracik dari resep keluarga dan bahan pilihan. Selalu ada cerita di setiap suapan.
        </p>
        <div class="hero-actions">
          <a
            class="button button-primary"
            href="#menu"
          >
            Jelajahi menu
            <span aria-hidden="true">→</span>
          </a>
          <a
            class="text-link"
            href="#cerita"
          >Kenali cerita kami</a>
        </div>
        <div class="hero-note">
          <span
            class="note-stars"
            aria-label="Rating bintang 5"
          >★★★★★</span>
          <span>Rasa autentik, dibuat sepenuh hati</span>
        </div>
      </div>

      <div
        class="hero-art"
        aria-label="Ilustrasi hidangan masakan Nusantara"
        role="img"
      >
        <div class="art-sun" />
        <div class="art-leaf art-leaf-one" />
        <div class="art-leaf art-leaf-two" />
        <div class="art-leaf art-leaf-three" />
        <div class="art-plate">
          <div class="art-rice" />
          <div class="art-sambal" />
          <div class="art-greens" />
          <div class="art-cracker" />
          <div class="art-herb">
            ✳
          </div>
        </div>
        <div class="art-caption">
          <span class="caption-dot" />
          <span>Masakan penuh cerita</span>
        </div>
      </div>
      <div class="hero-index">
        <span>01</span> / 03
      </div>
    </section>

    <section
      id="cerita"
      class="story-section"
    >
      <div
        class="story-leaf"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 130"
          fill="none"
        >
          <path
            d="M84 9C49 8 18 21 13 53c-4 23 10 39 27 34C68 80 82 48 84 9Z"
            fill="currentColor"
          />
          <path
            d="M18 116C29 79 46 53 73 30"
            stroke="#FBF8F1"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div>
        <p class="eyebrow">
          LEBIH DARI SEKADAR MAKAN
        </p>
        <h2>Resep lama,<br><em>rasa yang selalu baru.</em></h2>
      </div>
      <p class="story-copy">
        Kami percaya masakan terbaik lahir dari kesabaran, rempah yang segar, dan resep yang diwariskan dengan cinta. Dari Jawa hingga Sumatra, kami bawa hangatnya rumah ke mejamu.
      </p>
    </section>

    <section
      id="menu"
      class="menu-section"
    >
      <div class="menu-heading">
        <div>
          <p class="eyebrow">
            PILIHAN HARI INI
          </p>
          <h2>Favorit <em>yang dirindukan.</em></h2>
        </div>
        <NuxtLink
          class="text-link menu-link"
          to="/login"
        >
          Masuk untuk pesan <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
      <div class="menu-cards">
        <article class="menu-card">
          <div
            class="dish-art dish-rendang"
            aria-hidden="true"
          >
            <span>❋</span>
          </div>
          <div class="dish-meta">
            <span>SUMATRA BARAT</span><span>01</span>
          </div>
          <h3>Rendang Sapi</h3>
          <p>Dimasak perlahan dengan rempah pilihan.</p>
        </article>
        <article class="menu-card">
          <div
            class="dish-art dish-satay"
            aria-hidden="true"
          >
            <span>✳</span>
          </div>
          <div class="dish-meta">
            <span>JAWA TENGAH</span><span>02</span>
          </div>
          <h3>Sate Ayam</h3>
          <p>Asap arang, bumbu kacang, rasa yang akrab.</p>
        </article>
        <article class="menu-card">
          <div
            class="dish-art dish-soto"
            aria-hidden="true"
          >
            <span>✿</span>
          </div>
          <div class="dish-meta">
            <span>JAWA TIMUR</span><span>03</span>
          </div>
          <h3>Soto Ayam</h3>
          <p>Kuah hangat dengan sentuhan jeruk nipis.</p>
        </article>
      </div>
    </section>

    <footer class="site-footer">
      <NuxtLink
        class="brand footer-brand"
        to="/"
      >
        <span
          class="brand-mark"
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
        <span class="brand-name">rasa<span>rantau</span></span>
      </NuxtLink>
      <span>Merayakan rasa Indonesia, setiap hari.</span>
      <span>© {{ new Date().getFullYear() }} Rasa Rantau</span>
    </footer>
  </main>
</template>

<style scoped>
.home-page {
  overflow: hidden;
  background: var(--color-cream);
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1160px, calc(100% - 96px));
  height: 88px;
  margin: auto;
  border-bottom: 1px solid #e8e2d6;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  color: var(--color-green);
  place-items: center;
}

.brand-mark svg {
  width: 100%;
}

.brand-name {
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.brand-name span {
  color: var(--color-green);
}

.site-nav {
  display: flex;
  gap: 38px;
  color: #6f6e63;
  font-size: 13px;
}

.site-nav a,
.text-link {
  transition: color 160ms ease;
}

.site-nav a:hover,
.text-link:hover {
  color: var(--color-green);
}

.header-action {
  display: flex;
  align-items: center;
  gap: 14px;
}

.signed-in {
  max-width: 200px;
  overflow: hidden;
  color: var(--color-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 17px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button:focus-visible,
.text-link:focus-visible,
.site-nav a:focus-visible {
  outline: 3px solid #9cac8e;
  outline-offset: 3px;
}

.button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.button-outline {
  min-height: 40px;
  padding: 0 17px;
  border-color: #d7d2c7;
  background: transparent;
  color: var(--color-brown-dark);
}

.button-outline:hover {
  border-color: var(--color-green);
  background: #f3f3e9;
}

.button-primary {
  background: var(--color-green);
  color: #fffdf8;
}

.button-primary:hover {
  background: var(--color-green-dark);
}

.hero {
  position: relative;
  display: grid;
  width: min(1160px, calc(100% - 96px));
  min-height: 615px;
  grid-template-columns: 1fr 0.94fr;
  align-items: center;
  gap: 45px;
  margin: auto;
  padding: 66px 0 79px;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 500px;
  padding-bottom: 7px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 23px;
  color: var(--color-green);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.65px;
}

.eyebrow-line {
  width: 24px;
  height: 1px;
  background: var(--color-green);
}

.hero h1,
.story-section h2,
.menu-heading h2 {
  margin: 0;
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(48px, 5.5vw, 72px);
  font-weight: 400;
  letter-spacing: -2.6px;
  line-height: 1.06;
}

.hero h1 em,
.story-section h2 em,
.menu-heading h2 em {
  color: var(--color-green);
  font-weight: 400;
}

.hero-description {
  max-width: 405px;
  margin: 22px 0 28px;
  color: #747469;
  font-size: 14px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.text-link {
  color: var(--color-brown-dark);
  font-size: 12px;
  font-weight: 600;
}

.hero-note {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 37px;
  color: #828176;
  font-size: 11px;
}

.note-stars {
  color: #bc8750;
  font-size: 12px;
  letter-spacing: 2px;
}

.hero-art {
  position: relative;
  display: grid;
  min-height: 420px;
  place-items: center;
}

.art-sun {
  position: absolute;
  top: 8%;
  right: 7%;
  width: 310px;
  height: 310px;
  border-radius: 50%;
  background: #f1e7d4;
}

.art-plate {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(355px, 79vw);
  aspect-ratio: 1;
  overflow: hidden;
  border: 14px solid #fffdf8;
  border-radius: 50%;
  background: #efe8d8;
  box-shadow: 0 22px 50px #50351b1c, 0 0 0 1px #e3dccd;
  transform: rotate(-9deg);
}

.art-plate::before {
  position: absolute;
  inset: 12px;
  border: 1px solid #d8cbb1;
  border-radius: 50%;
  content: "";
}

.art-rice {
  position: absolute;
  top: 20%;
  left: 18%;
  width: 49%;
  height: 44%;
  border-radius: 48% 52% 56% 44%;
  background: repeating-radial-gradient(ellipse at 42% 52%, #fffdf1 0 3px, #ede8d6 4px 5px);
  box-shadow: inset -7px -8px 0 #e7dfca;
  transform: rotate(-18deg);
}

.art-sambal {
  position: absolute;
  right: 16%;
  bottom: 20%;
  width: 43%;
  height: 36%;
  border-radius: 43% 58% 47% 54%;
  background: radial-gradient(ellipse at 30% 28%, #b75a31 0 4%, transparent 5%), radial-gradient(ellipse at 62% 35%, #e2934f 0 3%, transparent 4%), radial-gradient(ellipse at 52% 72%, #a44128 0 5%, transparent 6%), #aa492c;
  box-shadow: inset -8px -8px 0 #863b28;
  transform: rotate(12deg);
}

.art-greens {
  position: absolute;
  top: 26%;
  right: 16%;
  width: 24%;
  height: 42%;
  border-radius: 70% 20% 65% 30%;
  background: repeating-linear-gradient(128deg, #51724a 0 7px, #6e8a58 8px 12px);
  box-shadow: inset -7px -3px 0 #3f6142;
  transform: rotate(27deg);
}

.art-cracker {
  position: absolute;
  bottom: 20%;
  left: 18%;
  width: 26%;
  height: 25%;
  border: 7px dotted #bd8f55;
  border-radius: 46% 52% 50% 45%;
  background: #e6c27c;
  transform: rotate(-24deg);
}

.art-herb {
  position: absolute;
  top: 25%;
  left: 44%;
  color: #52714c;
  font-size: 40px;
}

.art-leaf {
  position: absolute;
  z-index: 2;
  border-radius: 0 100% 0 100%;
  background: #637a52;
  transform: rotate(-32deg);
}

.art-leaf-one {
  top: 10%;
  left: 12%;
  width: 32px;
  height: 53px;
}

.art-leaf-two {
  top: 23%;
  left: 9%;
  width: 22px;
  height: 40px;
  background: #879369;
  transform: rotate(-55deg);
}

.art-leaf-three {
  right: 3%;
  bottom: 13%;
  width: 23px;
  height: 40px;
  background: #879369;
  transform: rotate(30deg);
}

.art-caption {
  position: absolute;
  right: 1%;
  bottom: 7%;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 13px 17px;
  border: 1px solid #ebe4d6;
  background: #fffdf8;
  color: #67695c;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 13px;
  font-style: italic;
  box-shadow: 0 7px 22px #423b2a0a;
}

.caption-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7b8b59;
}

.hero-index {
  position: absolute;
  right: 0;
  bottom: 34px;
  color: #b6b0a3;
  font-size: 10px;
  letter-spacing: 1.5px;
}

.hero-index span {
  color: var(--color-green);
}

.story-section {
  position: relative;
  display: grid;
  min-height: 270px;
  grid-template-columns: 1fr 0.88fr;
  align-items: center;
  gap: 64px;
  padding: 59px max(48px, calc((100% - 1160px) / 2));
  background: #f1eee5;
}

.story-section .eyebrow,
.menu-heading .eyebrow {
  margin-bottom: 17px;
}

.story-section h2,
.menu-heading h2 {
  font-size: clamp(34px, 4vw, 47px);
  letter-spacing: -1.5px;
  line-height: 1.15;
}

.story-copy {
  max-width: 435px;
  margin: 17px 0 0;
  color: #747469;
  font-size: 13px;
  line-height: 1.95;
}

.story-leaf {
  position: absolute;
  top: 50%;
  right: max(45px, calc((100% - 1260px) / 2));
  width: 54px;
  color: #d8ddcb;
  transform: translateY(-50%) rotate(9deg);
}

.menu-section {
  width: min(1160px, calc(100% - 96px));
  margin: auto;
  padding: 83px 0 96px;
}

.menu-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 34px;
}

.menu-heading .eyebrow {
  margin-bottom: 13px;
}

.menu-heading h2 {
  font-size: clamp(34px, 4vw, 44px);
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.menu-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 23px;
}

.menu-card {
  padding-bottom: 8px;
}

.dish-art {
  position: relative;
  display: grid;
  height: 205px;
  overflow: hidden;
  border-radius: 3px;
  background: #ebe2d2;
  place-items: center;
}

.dish-art::before {
  width: 136px;
  height: 136px;
  border: 10px solid #fffdf8;
  border-radius: 50%;
  background: #decdb1;
  box-shadow: 0 8px 20px #49351e1a;
  content: "";
}

.dish-art::after {
  position: absolute;
  width: 72px;
  height: 63px;
  border-radius: 50%;
  background: #964b30;
  content: "";
}

.dish-art span {
  position: absolute;
  z-index: 1;
  color: #728258;
  font-size: 31px;
}

.dish-rendang::after {
  background: radial-gradient(circle at 30% 40%, #d89c5f 0 4px, transparent 5px), radial-gradient(circle at 67% 53%, #c28049 0 5px, transparent 6px), #8b442b;
  transform: rotate(-18deg);
}

.dish-rendang span {
  top: 53px;
  right: 72px;
}

.dish-satay {
  background: #e6dfd0;
}

.dish-satay::after {
  width: 96px;
  height: 21px;
  border-radius: 12px;
  background: repeating-linear-gradient(90deg, #a95530 0 19px, #d08b53 20px 25px);
  box-shadow: 0 11px #8f472e, 0 22px #aa5a34;
  transform: rotate(-22deg);
}

.dish-satay span {
  top: 44px;
  left: 75px;
}

.dish-soto {
  background: #e8e1d3;
}

.dish-soto::before {
  background: #d7b777;
}

.dish-soto::after {
  width: 83px;
  height: 78px;
  background: radial-gradient(circle at 29% 42%, #f8edcb 0 6px, transparent 7px), radial-gradient(circle at 67% 60%, #efe1ba 0 8px, transparent 9px), #d5b66e;
}

.dish-soto span {
  right: 76px;
  bottom: 45px;
}

.dish-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 19px;
  color: var(--color-green);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.35px;
}

.dish-meta span:last-child {
  color: #b2aa9b;
}

.menu-card h3 {
  margin: 9px 0 5px;
  color: var(--color-brown-dark);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;
  font-weight: 400;
}

.menu-card p {
  margin: 0;
  color: #818074;
  font-size: 12px;
}

.site-footer {
  display: flex;
  min-height: 88px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px max(48px, calc((100% - 1160px) / 2));
  border-top: 1px solid #e8e2d6;
  color: #858276;
  font-size: 11px;
}

.footer-brand .brand-mark {
  width: 30px;
}

.footer-brand .brand-name {
  font-size: 16px;
}

@media (max-width: 760px) {
  .site-header,
  .hero,
  .menu-section {
    width: min(100% - 40px, 560px);
  }

  .site-header {
    height: 72px;
  }

  .site-nav {
    display: none;
  }

  .hero {
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 62px 0 65px;
  }

  .hero-copy {
    max-width: none;
  }

  .hero h1 {
    font-size: clamp(51px, 12vw, 68px);
  }

  .hero-art {
    min-height: 350px;
    margin-top: 4px;
  }

  .art-sun {
    top: 2%;
    right: 8%;
    width: 250px;
    height: 250px;
  }

  .art-plate {
    width: min(300px, 73vw);
  }

  .art-caption {
    right: 0;
    bottom: 1%;
  }

  .hero-index {
    right: 0;
    bottom: 28px;
  }

  .story-section {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 52px 25px;
  }

  .story-leaf {
    top: 35px;
    right: 21px;
    width: 37px;
    transform: rotate(9deg);
  }

  .story-copy {
    max-width: 500px;
  }

  .menu-section {
    padding: 65px 0 70px;
  }

  .menu-heading {
    align-items: start;
    flex-direction: column;
    gap: 19px;
  }

  .menu-cards {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .dish-art {
    height: 230px;
  }

  .site-footer {
    align-items: flex-start;
    flex-direction: column;
    padding: 25px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
