<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'id'
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ]
})

useSeoMeta({
  title: 'Rasa Rantau | Masakan Nusantara',
  description: 'Nikmati masakan rumahan Nusantara dengan cita rasa yang selalu dirindukan.'
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
