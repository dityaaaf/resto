<script setup lang="ts">
import type { User, UserFormValues } from '~~/shared/types/user'
import { getUserErrorMessage } from '~/utils/userErrorMessage'
import { updateUserSchema } from '~~/shared/utils/userSchema'

definePageMeta({
  layout: 'admin-resource',
  middleware: 'admin',
  title: 'Edit user',
  navItems: [
    { label: 'Products', to: '/admin/products', icon: 'i-lucide-package' },
    { label: 'Categories', to: '/admin/categories', icon: 'i-lucide-tags' },
    { label: 'Users', to: '/admin/users', icon: 'i-lucide-users' }
  ]
})

const route = useRoute()
const id = computed(() => typeof route.params.id === 'string' ? route.params.id : '')
const { data: user, error, pending } = await useFetch<User>(() => `/api/users/${encodeURIComponent(id.value)}`)
const { updateForm, editUser } = useUserAction()
const fetchErrorMessage = computed(() => getUserErrorMessage(error.value))

watch(user, (record) => {
  if (record) {
    Object.assign(updateForm, {
      name: record.name,
      email: record.email,
      password: '',
      role: record.role
    } satisfies UserFormValues)
  }
}, { immediate: true })

function submitUpdate() {
  return editUser({ id: id.value, updateForm })
}
</script>

<template>
  <section class="mx-auto w-full max-w-2xl space-y-5">
    <div>
      <h2 class="text-xl font-semibold text-highlighted">
        Edit user
      </h2>
      <p class="text-sm text-muted">
        Update this account's profile, role, or password.
      </p>
    </div>

    <UAlert
      v-if="error"
      color="error"
      title="Unable to load user"
      :description="fetchErrorMessage"
    />
    <UCard v-else-if="pending || !user">
      <p class="text-sm text-muted">
        Loading user...
      </p>
    </UCard>
    <UCard v-else>
      <FormUser
        v-model:form="updateForm"
        :schema="updateUserSchema"
        :password-optional="true"
        text-button="Save changes"
        @submit="submitUpdate"
      />
    </UCard>
  </section>
</template>
