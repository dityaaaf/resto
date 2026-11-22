<script setup lang="ts">
definePageMeta({
  layout: 'admin-resource',
  middleware: 'admin',
  title: 'Categories',
  searchPlaceholder: 'Search categories...',
  navItems: [
    { label: 'Products', to: '/admin/products', icon: 'i-lucide-package' },
    { label: 'Categories', to: '/admin/categories', icon: 'i-lucide-tags' },
    { label: 'Users', to: '/admin/users', icon: 'i-lucide-users' }
  ]
})
</script>

<template>
  <section class="space-y-2">
    <h2 class="text-xl font-semibold text-highlighted">
      Categories
    </h2>
    <p class="text-muted">
      Halaman pengelolaan kategori siap dikembangkan.
    </p>
  </section>
</template>
