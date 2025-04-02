<template>
  <div>
    <div class="mb-6">
      <h1>Tornado Data Explorer</h1>
      <p class="text-primary-600">
        Search, filter, and analyze tornado data. Apply multiple filters to
        narrow down results.
      </p>
    </div>

    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Search Filters</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Year, Month, Day -->
        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Year</label
          >
          <input
            v-model="filters.year"
            type="text"
            placeholder="e.g. 2020"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Month</label
          >
          <select v-model="filters.month" class="select">
            <option value="">All Months</option>
            <option
              v-for="(month, index) in months"
              :key="index"
              :value="String(index + 1).padStart(2, '0')"
            >
              {{ month }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Day</label
          >
          <input
            v-model="filters.day"
            type="text"
            placeholder="e.g. 15"
            class="input"
          />
        </div>

        <!-- State, Magnitude Range, Injuries Range -->
        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >State</label
          >
          <select v-model="filters.state" class="select">
            <option value="">All States</option>
            <option
              v-for="option in stateOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Magnitude Range</label
          >
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="filters.magMin"
              type="text"
              placeholder="Min"
              class="input"
            />
            <input
              v-model="filters.magMax"
              type="text"
              placeholder="Max"
              class="input"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Injuries Range</label
          >
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="filters.injMin"
              type="text"
              placeholder="Min"
              class="input"
            />
            <input
              v-model="filters.injMax"
              type="text"
              placeholder="Max"
              class="input"
            />
          </div>
        </div>

        <!-- Date Range -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Date Range</label
          >
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input v-model="filters.startDate" type="date" class="input" />
            </div>
            <div>
              <input v-model="filters.endDate" type="date" class="input" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-end space-x-2">
          <button
            @click="searchTornadoes"
            class="btn btn-primary flex-grow"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"
            ></span>
            Search
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

    <!-- Results Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card p-4 flex items-center">
        <div class="bg-primary-100 p-3 rounded-full mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-primary-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <div class="text-sm text-primary-500">Total Results</div>
          <div class="text-xl font-semibold">{{ totalEntries }}</div>
        </div>
      </div>

      <div class="card p-4 flex items-center">
        <div class="bg-primary-100 p-3 rounded-full mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-primary-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <div class="text-sm text-primary-500">Average Magnitude</div>
          <div class="text-xl font-semibold">{{ averageMagnitude }}</div>
        </div>
      </div>

      <div class="card p-4 flex items-center">
        <div class="bg-primary-100 p-3 rounded-full mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-primary-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <div class="text-sm text-primary-500">Total Injuries</div>
          <div class="text-xl font-semibold">{{ totalInjuries }}</div>
        </div>
      </div>

      <div class="card p-4 flex items-center">
        <div class="bg-primary-100 p-3 rounded-full mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-primary-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <div class="text-sm text-primary-500">Total Fatalities</div>
          <div class="text-xl font-semibold">{{ totalFatalities }}</div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Results</h2>
        <div class="flex space-x-2">
          <button
            @click="exportCSV"
            class="btn btn-outline text-sm px-3 py-1 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-12"
      >
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"
        ></div>
        <p class="mt-4 text-primary-600">Loading tornado data...</p>
      </div>

      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-12"
      >
        <div class="text-danger mb-2">{{ error }}</div>
        <button @click="searchTornadoes" class="btn btn-primary mt-4">
          Retry
        </button>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-primary-200">
            <thead class="bg-primary-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-primary-200">
              <tr
                v-for="tornado in tornadoes"
                :key="tornado.id"
                class="hover:bg-primary-50"
              >
                <td
                  v-for="column in columns"
                  :key="`${tornado.id}-${column.key}`"
                  class="px-4 py-2 whitespace-nowrap text-sm text-primary-900"
                >
                  <template v-if="column.key === 'mag'">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getMagnitudeClass(tornado[column.key as keyof Tornado])"
                    >
                      {{
                        getMagnitudeLabel(tornado[column.key as keyof Tornado])
                      }}
                    </span>
                  </template>
                  <template v-else>
                    {{ tornado[column.key as keyof Tornado] }}
                  </template>
                </td>
              </tr>
              <tr v-if="tornadoes.length === 0">
                <td
                  :colspan="columns.length"
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
            Showing {{ tornadoes.length > 0 ? 1 : 0 }} to
            {{ tornadoes.length }} of {{ totalEntries }} results
          </div>

          <div class="flex space-x-2">
            <button
              @click="loadMore"
              class="btn btn-outline px-4 py-1 text-sm"
              v-if="tornadoes.length < totalEntries"
              :disabled="isLoading"
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, ref } from "vue";
import { useTornadoStore } from "../stores/tornadoStore";
import { STATE_OPTIONS, MAGNITUDE_SCALE } from "../types/tornado";
import type { TornadoQueryParams, Tornado } from "../types/tornado";

const tornadoStore = useTornadoStore();

// Constants
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const columns = [
  { key: "date", label: "Date" },
  { key: "st", label: "State" },
  { key: "mag", label: "Magnitude" },
  { key: "len", label: "Length (mi)" },
  { key: "wid", label: "Width (yd)" },
  { key: "inj", label: "Injuries" },
  { key: "fat", label: "Fatalities" },
  { key: "slat", label: "Start Lat" },
  { key: "slon", label: "Start Lon" },
];

// Default filters for Alabama and Georgia tornado outbreak on 2011-04-27
const defaultFilters = {
  startDate: "2011-04-27",
  endDate: "2011-04-28",
  state: "AL",
};

// Track if initial loading has completed
const initialLoadComplete = ref(false);

// Reactive state
const filters = reactive<TornadoQueryParams>({
  year: "",
  month: "",
  day: "",
  state: defaultFilters.state, // Default to Alabama and Georgia
  mag: "",
  magMin: "",
  magMax: "",
  injMin: "",
  injMax: "",
  startDate: defaultFilters.startDate, // Default to April 27, 2011
  endDate: defaultFilters.endDate, // Default to April 28, 2011
});

// Computed properties
const isLoading = computed(() => tornadoStore.isLoading);
const error = computed(() => tornadoStore.error);
const tornadoes = computed(() => tornadoStore.tornadoes);
const totalEntries = computed(() => tornadoStore.totalEntries);
const stateOptions = STATE_OPTIONS;

const averageMagnitude = computed(() => {
  if (tornadoes.value.length === 0) return "N/A";

  const sum = tornadoes.value.reduce((acc, tornado) => {
    const mag = parseInt(tornado.mag);
    return isNaN(mag) ? acc : acc + mag;
  }, 0);

  return (sum / tornadoes.value.length).toFixed(1);
});

const totalInjuries = computed(() => {
  return tornadoes.value.reduce((acc, tornado) => {
    const inj = parseInt(tornado.inj);
    return isNaN(inj) ? acc : acc + inj;
  }, 0);
});

const totalFatalities = computed(() => {
  return tornadoes.value.reduce((acc, tornado) => {
    const fat = parseInt(tornado.fat);
    return isNaN(fat) ? acc : acc + fat;
  }, 0);
});

// Methods
function searchTornadoes() {
  initialLoadComplete.value = true;
  tornadoStore.fetchTornadoes(filters);
}

function resetFilters() {
  // Reset to default filters instead of completely clearing
  Object.keys(filters).forEach((key) => {
    const filterKey = key as keyof TornadoQueryParams;
    if (defaultFilters.hasOwnProperty(filterKey)) {
      filters[filterKey] =
        defaultFilters[filterKey as keyof typeof defaultFilters];
    } else {
      filters[filterKey] = "";
    }
  });

  searchTornadoes();
}

function loadMore() {
  // Implement pagination loading
  console.log("Load more tornadoes - to be implemented");
}

function exportCSV(event: Event) {
  // Prevent default behavior which might be causing navigation
  event.preventDefault();

  if (tornadoes.value.length === 0) return;

  try {
    // Convert the tornado data to CSV
    const headers = columns.map((col) => col.label).join(",");
    const rows = tornadoes.value
      .map((tornado) => {
        return columns
          .map((col) => {
            // Escape quotes and wrap values that contain commas in quotes
            const value = tornado[col.key as keyof Tornado] ?? "";
            const strValue = String(value);
            if (strValue.includes(",") || strValue.includes('"')) {
              return `"${strValue.replace(/"/g, '""')}"`;
            }
            return strValue;
          })
          .join(",");
      })
      .join("\n");

    const csv = `${headers}\n${rows}`;

    // Create a Blob with the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `tornado-data-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";

    // Append to document, trigger click, then remove
    document.body.appendChild(link);

    // Use setTimeout to ensure the link is properly added to the DOM before clicking
    setTimeout(() => {
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    console.log("CSV export initiated");
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
}

function getMagnitudeClass(magnitude: string | number | undefined): string {
  // Get CSS class based on magnitude
  if (magnitude === undefined) {
    return "bg-primary-100 text-primary-800";
  }

  const magNum =
    typeof magnitude === "number" ? magnitude : parseInt(String(magnitude));

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

function getMagnitudeLabel(magnitude: string | number | undefined): string {
  if (magnitude === undefined) {
    return "Unknown";
  }

  const magString = String(magnitude);
  const magNum = parseInt(magString);

  if (isNaN(magNum)) {
    return "Unknown";
  }

  const scaleItem = MAGNITUDE_SCALE.find((item) => item.value === magString);
  return scaleItem ? scaleItem.label : `EF${magString}/F${magString}`;
}

// Initialize
onMounted(() => {
  // Load initial data with default filters
  searchTornadoes();
});
</script>
