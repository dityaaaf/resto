<script setup lang="ts">
import { createUserSchema } from '~~/shared/utils/userSchema'

definePageMeta({
  layout: 'admin-resource',
  middleware: 'admin',
  title: 'Create user',
  navItems: [
    { label: 'Products', to: '/admin/products', icon: 'i-lucide-package' },
    { label: 'Categories', to: '/admin/categories', icon: 'i-lucide-tags' },
    { label: 'Users', to: '/admin/users', icon: 'i-lucide-users' }
  ]
})

const { createForm, createUser } = useUserAction()
</script>

<template>
  <section class="mx-auto w-full max-w-2xl space-y-5">
    <div>
      <h2 class="text-xl font-semibold text-highlighted">
        Create user
      </h2>
      <p class="text-sm text-muted">
        Add a dashboard account. New users will be created in Supabase Auth.
      </p>
    </div>

    <UCard>
      <FormUser
        v-model:form="createForm"
        :schema="createUserSchema"
        text-button="Create user"
        @submit="createUser"
      />
    </UCard>
  </section>
</template>
