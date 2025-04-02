<template>
  <header class="bg-white border-b border-primary-200">
    <div class="container mx-auto px-4 py-4 md:px-6">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="flex items-center">
            <div class="h-8 w-8">
              <img src="/assets/images/tornadotrax_logo.svg" alt="Logo" />
            </div>
            <span class="ml-2 text-xl font-bold text-primary-900"
              >TornadoTrax</span
            >
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="text-primary-600 hover:text-accent-500 py-2"
            active-class="font-medium text-accent-500 border-b-2 border-accent-500"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden text-primary-500 hover:text-primary-700"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 py-4 border-t border-primary-100"
      >
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="block py-2 text-primary-600 hover:text-accent-500"
          active-class="font-medium text-accent-500"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mobileMenuOpen = ref(false);

const navigation = [
  { name: "Home", to: "/" },
  { name: "Map", to: "/map" },
  { name: "Data Explorer", to: "/data" },
  { name: "Analysis", to: "/analysis" },
  { name: "About", to: "/about" },
];
</script>
