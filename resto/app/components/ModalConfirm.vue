<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

withDefaults(defineProps<{
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmColor?: ButtonProps['color']
}>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'error'
})

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
  >
    <template #body>
      <slot />
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="outline"
          @click="emit('close', false)"
        >
          {{ cancelText }}
        </UButton>
        <UButton
          :color="confirmColor"
          @click="emit('close', true)"
        >
          {{ confirmText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
