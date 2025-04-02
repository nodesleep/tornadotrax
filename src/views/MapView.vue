<template>
  <div>
    <div class="mb-6">
      <h1>Tornado Map</h1>
      <p class="text-primary-600">
        Interactive map of tornado events. Use filters to visualize specific
        tornado data.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filters Panel -->
      <div class="lg:col-span-1">
        <div class="card sticky top-4">
          <h2 class="text-xl font-semibold mb-4">Filters</h2>

          <div class="space-y-4">
            <!-- Year Range -->
            <div>
              <label class="block text-sm font-medium text-primary-700 mb-1">
                Year Range
              </label>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="filters.yearMin"
                  type="number"
                  placeholder="From"
                  class="input"
                  min="1950"
                  :max="currentYear"
                />
                <input
                  v-model="filters.yearMax"
                  type="number"
                  placeholder="To"
                  class="input"
                  min="1950"
                  :max="currentYear"
                />
              </div>
            </div>

            <!-- States -->
            <div>
              <label class="block text-sm font-medium text-primary-700 mb-1">
                States
              </label>
              <select v-model="filters.states" multiple class="select h-32">
                <option
                  v-for="option in stateOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Magnitude -->
            <div>
              <label class="block text-sm font-medium text-primary-700 mb-1">
                Magnitude (EF/F Scale)
              </label>
              <div class="space-y-1">
                <div
                  v-for="mag in magnitudeOptions"
                  :key="mag.value"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    :id="`mag-${mag.value}`"
                    :value="mag.value"
                    v-model="filters.magnitudes"
                    class="h-4 w-4 text-accent-500 rounded border-primary-300 focus:ring-accent-500"
                  />
                  <label
                    :for="`mag-${mag.value}`"
                    class="ml-2 text-sm text-primary-900"
                  >
                    {{ mag.label }} - {{ mag.description }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-primary-700 mb-1">
                Date Range
              </label>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="filters.startDate" type="date" class="input" />
                <input v-model="filters.endDate" type="date" class="input" />
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col space-y-2 pt-4">
              <button
                @click="applyFilters"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"
                ></span>
                Apply Filters
              </button>

              <button
                @click="resetFilters"
                class="btn btn-outline"
                :disabled="isLoading"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="lg:col-span-3">
        <div class="card h-[75vh]">
          <div
            v-if="isLoading && !initialMapLoaded"
            class="h-full flex flex-col items-center justify-center"
          >
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"
            ></div>
            <p class="mt-4 text-primary-600">Loading tornado data...</p>
          </div>

          <div
            v-else-if="error"
            class="h-full flex flex-col items-center justify-center"
          >
            <div class="text-danger mb-2">{{ error }}</div>
            <button @click="applyFilters" class="btn btn-primary mt-4">
              Retry
            </button>
          </div>

          <TornadoMap
            v-else
            :tornado-points="tornadoMapPoints"
            :loading="isLoading"
            :show-heatmap="showHeatmap"
            @map-loaded="initialMapLoaded = true"
          />

          <div
            class="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2"
          >
            <button
              @click="showHeatmap = !showHeatmap"
              class="btn btn-secondary px-3 py-2 text-sm shadow-md"
              :class="{ 'bg-accent-500 text-white': showHeatmap }"
            >
              {{ showHeatmap ? "Hide Heatmap" : "Show Heatmap" }}
            </button>
          </div>
        </div>

        <div class="mt-4 card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Results</h2>
            <div class="text-primary-600">
              {{ totalEntries }} tornados found
            </div>
          </div>

          <div class="overflow-hidden rounded-lg border border-primary-200">
            <table class="min-w-full divide-y divide-primary-200">
              <thead class="bg-primary-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
                  >
                    State
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
                  >
                    Magnitude
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
                  >
                    Injuries
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
                  >
                    Fatalities
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-primary-200">
                <tr
                  v-for="tornado in displayedTornadoes"
                  :key="tornado.id"
                  class="hover:bg-primary-50"
                >
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-primary-900"
                  >
                    {{ tornado.date }}
                  </td>
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-primary-900"
                  >
                    {{ tornado.st }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getMagnitudeClass(tornado.mag)"
                    >
                      {{ getMagnitudeLabel(tornado.mag) }}
                    </span>
                  </td>
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-primary-900"
                  >
                    {{ tornado.inj }}
                  </td>
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-primary-900"
                  >
                    {{ tornado.fat }}
                  </td>
                </tr>
                <tr v-if="displayedTornadoes.length === 0">
                  <td
                    colspan="5"
                    class="px-4 py-8 text-center text-primary-500"
                  >
                    No tornado data found with the current filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-sm text-primary-500">
              Showing {{ displayedTornadoes.length > 0 ? 1 : 0 }} to
              {{ displayedTornadoes.length }} of {{ totalEntries }} results
            </div>

            <div class="flex space-x-2">
              <button
                @click="loadMoreTornadoes"
                class="btn btn-outline px-4 py-1 text-sm"
                v-if="displayedTornadoes.length < totalEntries"
                :disabled="isLoading"
              >
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useTornadoStore } from "../stores/tornadoStore";
import { MAGNITUDE_SCALE, STATE_OPTIONS } from "../types/tornado";
import type { TornadoQueryParams } from "../types/tornado";
import TornadoMap from "../components/map/TornadoMap.vue";

const tornadoStore = useTornadoStore();
const showHeatmap = ref(false);
const initialMapLoaded = ref(false);
const currentYear = new Date().getFullYear();

// Filters
const filters = reactive({
  yearMin: "",
  yearMax: "",
  states: [] as string[],
  magnitudes: [] as string[],
  startDate: "",
  endDate: "",
});

// Computed properties
const isLoading = computed(() => tornadoStore.isLoading);
const error = computed(() => tornadoStore.error);
const tornadoMapPoints = computed(() => tornadoStore.tornadoMapPoints);
const displayedTornadoes = computed(() => tornadoStore.tornadoes);
const totalEntries = computed(() => tornadoStore.totalEntries);
const stateOptions = STATE_OPTIONS;
const magnitudeOptions = MAGNITUDE_SCALE;

// Methods
function buildQueryParams(): TornadoQueryParams {
  const params: TornadoQueryParams = {};

  // Year range
  if (filters.yearMin && filters.yearMax) {
    // Need to handle year range -> convert to dates
    params.startDate = `${filters.yearMin}-01-01`;
    params.endDate = `${filters.yearMax}-12-31`;
  } else if (filters.yearMin) {
    params.year = filters.yearMin;
  } else if (filters.yearMax) {
    params.year = filters.yearMax;
  }

  // States
  if (filters.states.length > 0) {
    params.state = filters.states.join(",");
  }

  // Magnitudes
  if (filters.magnitudes.length > 0) {
    params.mag = filters.magnitudes.join(",");
  }

  // Date range
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  return params;
}

async function applyFilters() {
  const params = buildQueryParams();
  await tornadoStore.fetchTornadoes(params);
}

function resetFilters() {
  filters.yearMin = "";
  filters.yearMax = "";
  filters.states = [];
  filters.magnitudes = [];
  filters.startDate = "";
  filters.endDate = "";

  tornadoStore.resetFilters();
  tornadoStore.fetchTornadoes();
}

async function loadMoreTornadoes() {
  // Implement pagination loading
  console.log("Load more tornadoes - to be implemented");
}

function getMagnitudeClass(magnitude: string): string {
  // Get CSS class based on magnitude
  const magNum = parseInt(magnitude);

  if (isNaN(magNum)) {
    return "bg-primary-100 text-primary-800";
  }

  switch (magNum) {
    case 0:
      return "bg-primary-100 text-primary-800";
    case 1:
      return "bg-green-100 text-green-800";
    case 2:
      return "bg-yellow-100 text-yellow-800";
    case 3:
      return "bg-orange-100 text-orange-800";
    case 4:
      return "bg-red-100 text-red-800";
    case 5:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-primary-100 text-primary-800";
  }
}

function getMagnitudeLabel(magnitude: string): string {
  const magNum = parseInt(magnitude);

  if (isNaN(magNum)) {
    return "Unknown";
  }

  const scaleItem = MAGNITUDE_SCALE.find((item) => item.value === magnitude);
  return scaleItem ? scaleItem.label : `EF${magnitude}/F${magnitude}`;
}

// Initialize
onMounted(async () => {
  // Load initial data with default filters
  await tornadoStore.fetchTornadoes({
    // Start with a reasonable default - last year's data
    year: (currentYear - 1).toString(),
  });
});
</script>
