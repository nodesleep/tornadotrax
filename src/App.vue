<template>
  <div class="min-h-screen flex flex-col">
    <BaseHeader />

    <main class="flex-grow container mx-auto px-4 py-6 md:px-6">
      <router-view />
    </main>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import BaseHeader from "./components/layout/BaseHeader.vue";
import BaseFooter from "./components/layout/BaseFooter.vue";
</script>
