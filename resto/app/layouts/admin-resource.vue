<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { search } = useDashboardSearch()

const title = computed(() => typeof route.meta.title === 'string' ? route.meta.title : 'Dashboard')
const searchPlaceholder = computed(() => typeof route.meta.searchPlaceholder === 'string' ? route.meta.searchPlaceholder : 'Search...')
const showSearch = computed(() => ['/admin/products', '/admin/users', '/admin/categories'].includes(route.path))
const items = computed<NavigationMenuItem[]>(() => {
  const routeItems = route.meta.navItems

  if (!Array.isArray(routeItems)) {
    return []
  }

  return (routeItems as NavigationMenuItem[]).map(item => ({
    ...item,
    active: item.to === route.path
  }))
})
</script>

<template>
  <UDashboardGroup>
    <AdminSidebar />
    <UDashboardPanel resizable>
      <template #header>
        <UDashboardNavbar
          :title="title"
          icon="i-lucide-house"
        />
        <UDashboardToolbar>
          <div class="flex w-full flex-wrap items-center justify-center gap-2 md:justify-between">
            <UNavigationMenu
              :items="items"
              highlight
              class="sm:flex-1"
            />
            <UInput
              v-if="showSearch"
              v-model="search"
              icon="i-lucide-search"
              size="lg"
              name="title"
              variant="subtle"
              :placeholder="searchPlaceholder"
            />
          </div>
        </UDashboardToolbar>
      </template>
      <template #body>
        <main class="p-5 md:p-8">
          <slot />
        </main>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
