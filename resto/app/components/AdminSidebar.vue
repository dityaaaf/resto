<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, profileError, fetchProfile } = useProfile()
const isSidebarOpen = ref(true)
const logoutError = ref('')

if (user.value) {
  await fetchProfile()
}

async function logout() {
  logoutError.value = ''
  const { error } = await supabase.auth.signOut()

  if (error) {
    logoutError.value = error.message
    return
  }

  profile.value = null
  profileError.value = null
  await navigateTo('/')
}

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/admin',
      active: route.path === '/admin'
    },
    {
      label: 'Products',
      icon: 'i-lucide-package',
      to: '/admin/products',
      active: route.path.startsWith('/admin/products')
    },
    {
      label: 'Categories',
      icon: 'i-lucide-tags',
      to: '/admin/categories',
      active: route.path.startsWith('/admin/categories')
    },
    {
      label: 'Users',
      icon: 'i-lucide-users',
      to: '/admin/users',
      active: route.path.startsWith('/admin/users')
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => logout()
    }
  ]
])

defineShortcuts({
  o: () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }
})
</script>

<template>
  <UDashboardSidebar
    v-model:open="isSidebarOpen"
    collapsible
    resizable
    :ui="{ footer: 'border-t border-default' }"
  >
    <template #header="{ collapsed }">
      <NuxtLink
        v-if="!collapsed"
        to="/"
        class="inline-flex h-8 items-center gap-2 text-lg font-semibold"
      >
        <UIcon
          name="i-lucide-leaf"
          class="size-6 text-primary"
        />
        Rasa Rantau
      </NuxtLink>
      <UIcon
        v-else
        name="i-lucide-leaf"
        class="mx-auto size-6 text-primary"
        aria-label="Rasa Rantau"
      />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
        :ui="{ item: 'my-2.5' }"
      />
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
        :ui="{ item: 'my-2.5' }"
      />
      <p
        v-if="logoutError"
        class="px-3 text-sm text-error"
        role="alert"
      >
        {{ logoutError }}
      </p>
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :icon="collapsed ? 'i-lucide-circle-user-round' : undefined"
        :label="collapsed ? undefined : (profile?.name || user?.email || 'User')"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>
