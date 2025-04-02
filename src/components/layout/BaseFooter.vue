<template>
  <footer class="bg-primary-50 border-t border-primary-200">
    <div class="container mx-auto px-4 py-8 md:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">TornadoTrax</h3>
          <p class="text-primary-600 max-w-xs">
            Advanced tornado data visualization and analysis tool for
            researchers and weather enthusiasts.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link
                :to="link.to"
                class="text-primary-600 hover:text-accent-500"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Data Sources</h3>
          <ul class="space-y-2 text-primary-600">
            <li>
              <a
                href="https://www.ncdc.noaa.gov/stormevents/"
                target="_blank"
                rel="noopener"
                class="hover:text-accent-500"
              >
                NOAA Storm Events Database
              </a>
            </li>
            <li>
              <a
                href="https://www.spc.noaa.gov/gis/svrgis/"
                target="_blank"
                rel="noopener"
                class="hover:text-accent-500"
              >
                NOAA SPC Severe Weather Database
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-8 pt-6 border-t border-primary-200 flex flex-col md:flex-row justify-between items-center"
      >
        <p class="text-primary-500 text-sm">
          © {{ currentYear }} TornadoTrax. All rights reserved.
        </p>
        <div class="mt-4 md:mt-0 text-primary-500 text-sm">
          <router-link to="/privacy" class="hover:text-accent-500 mr-4"
            >Privacy Policy</router-link
          >
          <router-link to="/terms" class="hover:text-accent-500"
            >Terms of Service</router-link
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());

const quickLinks = [
  { name: "Home", to: "/" },
  { name: "Tornado Map", to: "/map" },
  { name: "Data Explorer", to: "/data" },
  { name: "Analysis Tools", to: "/analysis" },
  { name: "About", to: "/about" },
];
</script>
