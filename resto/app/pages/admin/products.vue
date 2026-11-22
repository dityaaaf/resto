<script setup lang="ts">
definePageMeta({
  layout: 'admin-resource',
  middleware: 'admin',
  title: 'Products',
  searchPlaceholder: 'Search products...',
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
      Products
    </h2>
    <p class="text-muted">
      Halaman pengelolaan produk siap dikembangkan.
    </p>
  </section>
</template>
