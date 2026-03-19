<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
navigateTo('/country/' + id, { redirectCode: 301 })
</script>
<template><div /></template>
