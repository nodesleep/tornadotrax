<template>
  <div>
    <section class="py-12 md:py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          Advanced Tornado Data Analysis
        </h1>
        <p class="text-xl text-primary-500 mb-8">
          Explore comprehensive tornado data with powerful visualization and
          analysis tools.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/map" class="btn btn-primary">
            Explore Map
          </router-link>
          <router-link to="/data" class="btn btn-outline">
            View Data
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-12 bg-primary-50">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">Key Features</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card flex flex-col items-center text-center p-6">
            <div class="bg-accent-500 p-4 rounded-full text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Interactive Mapping</h3>
            <p class="text-primary-600">
              Visualize tornado paths and hotspots with our interactive mapping
              tools.
            </p>
          </div>

          <div class="card flex flex-col items-center text-center p-6">
            <div class="bg-accent-500 p-4 rounded-full text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p class="text-primary-600">
              Generate insights with comprehensive data analysis and
              visualization tools.
            </p>
          </div>

          <div class="card flex flex-col items-center text-center p-6">
            <div class="bg-accent-500 p-4 rounded-full text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Research Tools</h3>
            <p class="text-primary-600">
              Access powerful filtering and export capabilities for academic and
              professional research.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">2023 Statistics</h2>

        <div v-if="isLoading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"
          ></div>
          <p class="mt-4 text-primary-600">Loading tornado statistics...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <div class="text-danger mb-2">Failed to load statistics</div>
          <button @click="loadInitialData" class="btn btn-primary mt-4">
            Retry
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="card">
            <h3 class="text-xl font-semibold mb-4">
              States with Most Tornadoes
            </h3>
            <div class="h-64">
              <StateBarChart
                v-if="tornadoesByState.length"
                :chart-data="tornadoesByState"
              />
              <div
                v-else
                class="h-full flex items-center justify-center text-primary-400"
              >
                No data available
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="text-xl font-semibold mb-4">Tornadoes by Magnitude</h3>
            <div class="h-64">
              <MagnitudePieChart
                v-if="tornadoesByMagnitude.length"
                :chart-data="tornadoesByMagnitude"
              />
              <div
                v-else
                class="h-full flex items-center justify-center text-primary-400"
              >
                No data available
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-primary-50">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Explore?</h2>
        <p class="text-xl text-primary-600 mb-8 max-w-3xl mx-auto">
          Start exploring our comprehensive tornado database with interactive
          maps, detailed data analysis, and powerful research tools.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/map" class="btn btn-primary">
            View Tornado Map
          </router-link>
          <router-link to="/data" class="btn btn-outline">
            Explore Data
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useTornadoStore } from "../stores/tornadoStore";
import StateBarChart from "../components/charts/StateBarChart.vue";
import MagnitudePieChart from "../components/charts/MagnitudePieChart.vue";

const tornadoStore = useTornadoStore();

const isLoading = computed(() => tornadoStore.isLoading);
const error = computed(() => tornadoStore.error);
const tornadoesByState = computed(() =>
  tornadoStore.tornadoesByState.slice(0, 10)
);
const tornadoesByMagnitude = computed(() => tornadoStore.tornadoesByMagnitude);

async function loadInitialData() {
  // Load a limited sample of data to show statistics
  await tornadoStore.fetchTornadoes({
    // Recent data with a reasonable limit
    year: "2023",
  });
}

onMounted(() => {
  loadInitialData();
});
</script>
