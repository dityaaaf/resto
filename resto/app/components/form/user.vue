<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import type { ZodType } from 'zod'
import type { UserFormValues } from '~~/shared/types/user'
import { USER_ROLES } from '~~/shared/utils/userSchema'

defineProps<{
  schema: ZodType
  textButton: string
  passwordOptional?: boolean
}>()

const form = defineModel<UserFormValues>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const roleOptions: { label: string, value: UserFormValues['role'] }[] = USER_ROLES.map(role => ({
  label: role === 'admin' ? 'Administrator' : 'User',
  value: role
}))

const submitColor: ButtonProps['color'] = 'primary'
</script>

<template>
  <UForm
    :schema="schema"
    :state="form"
    class="space-y-5"
    @submit="emit('submit')"
  >
    <UFormField
      label="Name"
      name="name"
      required
    >
      <UInput
        v-model="form.name"
        autocomplete="name"
        class="w-full"
        placeholder="Full name"
      />
    </UFormField>

    <UFormField
      label="Email"
      name="email"
      required
    >
      <UInput
        v-model="form.email"
        autocomplete="email"
        class="w-full"
        placeholder="name@example.com"
        type="email"
      />
    </UFormField>

    <UFormField
      :label="passwordOptional ? 'New password (optional)' : 'Password'"
      name="password"
      :required="!passwordOptional"
    >
      <UInput
        v-model="form.password"
        autocomplete="new-password"
        class="w-full"
        :placeholder="passwordOptional ? 'Leave blank to keep the current password' : 'At least 6 characters'"
        type="password"
      />
    </UFormField>

    <UFormField
      label="Role"
      name="role"
      required
    >
      <USelect
        v-model="form.role"
        :items="roleOptions"
        class="w-full"
      />
    </UFormField>

    <UButton
      :color="submitColor"
      block
      type="submit"
    >
      {{ textButton }}
    </UButton>
  </UForm>
</template>
