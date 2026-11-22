<script setup lang="ts">
const titles: Record<string, string> = {
  '/admin': 'Admin'
}

const route = useRoute()
const navbarTitle = computed(() => titles[route.path] ?? 'Admin')
</script>

<template>
  <UDashboardGroup>
    <AdminSidebar />
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar
          :title="navbarTitle"
          icon="i-lucide-house"
        />
      </template>
      <template #body>
        <main class="p-5 md:p-8">
          <slot />
        </main>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
