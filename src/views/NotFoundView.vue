<template>
  <div class="py-12 md:py-24">
    <div class="max-w-xl mx-auto text-center">
      <div class="text-accent-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-6">Page Not Found</h1>
      <p class="text-xl text-primary-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <router-link to="/" class="btn btn-primary"> Return Home </router-link>
        <button @click="goBack" class="btn btn-outline">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function goBack() {
  window.history.length > 1
    ? window.history.go(-1)
    : (window.location.href = "/");
}
</script>
