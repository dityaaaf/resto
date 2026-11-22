<script setup lang="ts">
/* eslint-disable better-tailwindcss/no-unknown-classes */

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { profile, profileError, fetchProfile } = useProfile()
const isLoggingOut = ref(false)
const logoutError = ref('')

if (user.value) {
  await fetchProfile()
}

watch(
  () => user.value?.sub,
  async (id, previousId) => {
    if (!id) {
      profile.value = null
      profileError.value = null
      return
    }

    if (id !== previousId) {
      await fetchProfile(true)
    }
  }
)

async function logout() {
  logoutError.value = ''
  isLoggingOut.value = true
  const { error } = await supabase.auth.signOut()
  isLoggingOut.value = false

  if (error) {
    logoutError.value = error.message
    return
  }

  profile.value = null
  profileError.value = null
  await navigateTo('/')
}
</script>

<template>
  <div class="header-layout">
    <header class="site-header">
      <NuxtLink
        to="/"
        class="brand"
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
        <NuxtLink to="/#cerita">Cerita kami</NuxtLink>
        <NuxtLink to="/#menu">Menu favorit</NuxtLink>
      </nav>

      <div class="header-action">
        <ClientOnly>
          <template #fallback>
            <NuxtLink
              class="header-button header-button-primary"
              to="/register"
            >Daftar</NuxtLink>
            <NuxtLink
              class="header-button header-button-outline"
              to="/login"
            >Masuk</NuxtLink>
          </template>
          <template v-if="!user">
            <NuxtLink
              class="header-button header-button-primary"
              to="/register"
            >Daftar</NuxtLink>
            <NuxtLink
              class="header-button header-button-outline"
              to="/login"
            >Masuk</NuxtLink>
          </template>
          <template v-else>
            <span class="signed-in">{{ profile?.name || user.email }}</span>
            <NuxtLink
              v-if="profile?.role === 'admin'"
              class="header-button header-button-primary"
              to="/admin"
            >
              Admin Dashboard
            </NuxtLink>
            <button
              class="header-button header-button-outline"
              type="button"
              :disabled="isLoggingOut"
              @click="logout"
            >
              {{ isLoggingOut ? 'Keluar...' : 'Keluar' }}
            </button>
          </template>
        </ClientOnly>
      </div>
    </header>

    <ClientOnly>
      <p
        v-if="profileError || logoutError"
        class="profile-error"
        role="alert"
      >
        {{ profileError || logoutError }}
      </p>
    </ClientOnly>
    <slot />
  </div>
</template>

<style scoped>
.site-header {
  display: flex;
  width: min(1160px, calc(100% - 96px));
  height: 88px;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  border-bottom: 1px solid #e8e2d6;
  background: var(--color-cream);
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

.site-nav,
.header-action {
  display: flex;
  align-items: center;
}

.site-nav {
  gap: 38px;
  color: #6f6e63;
  font-size: 13px;
}

.site-nav a,
.header-button {
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease;
}

.site-nav a:hover {
  color: var(--color-green);
}

.header-action {
  gap: 10px;
}

.signed-in {
  max-width: 200px;
  overflow: hidden;
  color: var(--color-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0 17px;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.header-button:focus-visible,
.site-nav a:focus-visible {
  outline: 3px solid #9cac8e;
  outline-offset: 3px;
}

.header-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.header-button-primary {
  background: var(--color-green);
  color: #fffdf8;
}

.header-button-primary:hover {
  background: var(--color-green-dark);
}

.header-button-outline {
  border-color: #d7d2c7;
  background: transparent;
  color: var(--color-brown-dark);
}

.header-button-outline:hover {
  border-color: var(--color-green);
  background: #f3f3e9;
}

.profile-error {
  width: min(1160px, calc(100% - 96px));
  margin: 12px auto;
  color: #a33d2f;
  font-size: 12px;
}

@media (max-width: 760px) {
  .site-header {
    width: min(100% - 40px, 560px);
    height: 72px;
  }

  .site-nav {
    display: none;
  }

  .header-action {
    gap: 7px;
  }

  .header-button {
    min-height: 36px;
    padding: 0 11px;
    font-size: 11px;
  }

  .signed-in {
    display: none;
  }

  .profile-error {
    width: min(100% - 40px, 560px);
  }
}
</style>
