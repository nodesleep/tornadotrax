<template>
  <div>
    <div class="mb-6">
      <h1>Tornado Data Analysis</h1>
      <p class="text-primary-600">
        Advanced data analysis and visualization of tornado patterns and trends.
      </p>
    </div>

    <!-- Filter Bar -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >Year Range</label
          >
          <div class="flex space-x-2">
            <select v-model="filters.startYear" class="select">
              <option value="">From</option>
              <option
                v-for="year in availableYears"
                :key="`start-${year}`"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
            <select v-model="filters.endYear" class="select">
              <option value="">To</option>
              <option
                v-for="year in availableYears"
                :key="`end-${year}`"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div class="min-w-[200px]">
          <label class="block text-sm font-medium text-primary-700 mb-1"
            >States</label
          >
          <select v-model="filters.states" multiple class="select h-10">
            <option
              v-for="option in stateOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="flex-1 flex justify-end items-end">
          <button
            @click="applyFilters"
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"
            ></span>
            Update Analysis
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"
      ></div>
      <p class="mt-4 text-primary-600">Analyzing tornado data...</p>
    </div>

    <!-- Analysis Widgets -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Tornado Frequency by Year -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Tornado Frequency by Year</h2>
        <div class="h-72">
          <TornadoYearChart
            v-if="tornadoesByYear.length > 0"
            :chart-data="tornadoesByYear"
          />
          <div
            v-else
            class="h-full flex items-center justify-center text-primary-400"
          >
            No data available
          </div>
        </div>
        <div class="mt-2 text-sm text-primary-500">
          Analysis of tornado frequency across the selected years.
        </div>
      </div>

      <!-- Tornado Distribution by State -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">
          Tornado Distribution by State
        </h2>
        <div class="h-72">
          <TornadoStateChart
            v-if="tornadoesByState.length > 0"
            :chart-data="tornadoesByState"
          />
          <div
            v-else
            class="h-full flex items-center justify-center text-primary-400"
          >
            No data available
          </div>
        </div>
        <div class="mt-2 text-sm text-primary-500">
          Distribution of tornadoes across different states during the selected
          period.
        </div>
      </div>

      <!-- Monthly Distribution -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Monthly Distribution</h2>
        <div class="h-72">
          <TornadoMonthChart
            v-if="tornadoesByMonth.length > 0"
            :chart-data="tornadoesByMonth"
          />
          <div
            v-else
            class="h-full flex items-center justify-center text-primary-400"
          >
            No data available
          </div>
        </div>
        <div class="mt-2 text-sm text-primary-500">
          Tornado frequency by month showing seasonal patterns.
        </div>
      </div>

      <!-- Magnitude Distribution -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Magnitude Distribution</h2>
        <div class="h-72">
          <TornadoMagnitudeChart
            v-if="tornadoesByMagnitude.length > 0"
            :chart-data="tornadoesByMagnitude"
          />
          <div
            v-else
            class="h-full flex items-center justify-center text-primary-400"
          >
            No data available
          </div>
        </div>
        <div class="mt-2 text-sm text-primary-500">
          Distribution of tornadoes by EF/F scale magnitude.
        </div>
      </div>
    </div>

    <!-- Trend Analysis -->
    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Long-term Trends</h2>
      <div class="h-96">
        <TornadoTrendsChart :chart-data="tornadoTrends" />
      </div>
      <div class="mt-4 text-primary-600">
        <p>
          This chart shows the long-term trends in tornado occurrences and
          impact over the selected time period.
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>The blue line represents the number of tornadoes per year</li>
          <li>
            The orange line shows the 5-year moving average to highlight trends
          </li>
          <li>
            The red dots indicate years with particularly severe tornado events
          </li>
        </ul>
      </div>
    </div>

    <!-- Analysis Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-2">Casualty Statistics</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-primary-600">Average Injuries per Event:</span>
            <span class="font-medium">{{
              analysisMetrics.avgInjuries.toFixed(1)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Average Fatalities per Event:</span>
            <span class="font-medium">{{
              analysisMetrics.avgFatalities.toFixed(1)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Total Injuries:</span>
            <span class="font-medium">{{ analysisMetrics.totalInjuries }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Total Fatalities:</span>
            <span class="font-medium">{{
              analysisMetrics.totalFatalities
            }}</span>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-2">Tornado Characteristics</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-primary-600">Average Magnitude:</span>
            <span class="font-medium">{{
              analysisMetrics.avgMagnitude.toFixed(1)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Average Path Length:</span>
            <span class="font-medium"
              >{{ analysisMetrics.avgLength.toFixed(1) }} miles</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Average Path Width:</span>
            <span class="font-medium"
              >{{ analysisMetrics.avgWidth.toFixed(0) }} yards</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Most Common Magnitude:</span>
            <span class="font-medium"
              >EF{{ analysisMetrics.mostCommonMagnitude }}/F{{
                analysisMetrics.mostCommonMagnitude
              }}</span
            >
          </div>
        </div>
      </div>

      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-2">Geographic Insights</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-primary-600">Most Active State:</span>
            <span class="font-medium">{{
              analysisMetrics.mostActiveState
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Tornadoes in Top State:</span>
            <span class="font-medium">{{
              analysisMetrics.tornadoesInTopState
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Most Active Month:</span>
            <span class="font-medium">{{
              months[analysisMetrics.mostActiveMonth - 1]
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-primary-600">Percent in Peak Season:</span>
            <span class="font-medium"
              >{{ analysisMetrics.percentInPeakSeason.toFixed(1) }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Data Summary and Comparison -->
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Data Summary</h2>
      <p class="text-primary-600 mb-4">
        Based on the analysis of {{ totalTornadoes }} tornado events over
        {{ analysisYearRange }} years.
      </p>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-primary-200">
          <thead class="bg-primary-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
              >
                Metric
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
              >
                Selected Period
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
              >
                Historical Average
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider"
              >
                Difference
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-primary-200">
            <tr
              v-for="(item, index) in comparisonData"
              :key="index"
              class="hover:bg-primary-50"
            >
              <td
                class="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary-900"
              >
                {{ item.name }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-primary-900">
                {{ item.current }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-primary-900">
                {{ item.historical }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="
                    item.change > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ item.change > 0 ? "+" : "" }}{{ item.change
                  }}{{ item.unit }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useTornadoStore } from "../stores/tornadoStore";
import { STATE_OPTIONS } from "../types/tornado";
import type { Tornado, TornadoQueryParams } from "../types/tornado";
import TornadoYearChart from "../components/charts/TornadoYearChart.vue";
import TornadoStateChart from "../components/charts/TornadoStateChart.vue";
import TornadoMonthChart from "../components/charts/TornadoMonthChart.vue";
import TornadoMagnitudeChart from "../components/charts/TornadoMagnitudeChart.vue";
import TornadoTrendsChart from "../components/charts/TornadoTrendsChart.vue";

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

// Generate available years from 1950 to current year
const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: currentYear - 1950 + 1 }, (_, i) =>
  (1950 + i).toString()
);

// Reactive state
const isLoading = ref(false);
const stateOptions = STATE_OPTIONS;

const filters = reactive({
  startYear: "2010",
  endYear: "2020",
  states: [] as string[],
});

// State for chart data
const tornadoesByYear = ref<{ year: string; count: number }[]>([]);
const tornadoesByState = ref<{ state: string; count: number }[]>([]);
const tornadoesByMonth = ref<{ month: string; count: number }[]>([]);
const tornadoesByMagnitude = ref<
  { magnitude: string; count: number; label?: string }[]
>([]);

// Analysis metrics state
const analysisMetrics = reactive({
  avgInjuries: 0,
  avgFatalities: 0,
  totalInjuries: 0,
  totalFatalities: 0,
  avgMagnitude: 0,
  avgLength: 0,
  avgWidth: 0,
  mostCommonMagnitude: 0,
  mostActiveState: "",
  tornadoesInTopState: 0,
  mostActiveMonth: 5, // Default to May
  percentInPeakSeason: 0,
});

// Computed properties
const analysisYearRange = computed(() => {
  return `${filters.startYear}-${filters.endYear}`;
});

const totalTornadoes = computed(() => {
  return tornadoesByYear.value.reduce((sum, year) => sum + year.count, 0);
});

// For trend chart - more complex structure
const tornadoTrends = computed(() => {
  const labels = tornadoesByYear.value.map((item) => item.year);
  const data = tornadoesByYear.value.map((item) => item.count);

  // Calculate 5-year moving average
  const movingAvgData = labels.map((_, index) => {
    if (index < 2) return null; // Need at least 2 years before avg

    // Look back 2 years, current year, and forward 2 years if available
    const startIdx = Math.max(0, index - 2);
    const endIdx = Math.min(data.length - 1, index + 2);
    const valuesToAverage = data.slice(startIdx, endIdx + 1);
    const sum = valuesToAverage.reduce((acc, val) => acc + val, 0);
    return sum / valuesToAverage.length;
  });

  // Find significant years (years with counts >25% above average)
  const avgCount = data.reduce((sum, count) => sum + count, 0) / data.length;
  const threshold = avgCount * 1.25;

  const significantYears = labels
    .map((year, idx) => ({ year, value: data[idx] }))
    .filter((item) => item.value > threshold)
    .map((item) => ({
      ...item,
      label: "Significant Activity",
    }));

  return {
    labels,
    datasets: [
      {
        label: "Annual Tornadoes",
        data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: "5-Year Moving Average",
        data: movingAvgData,
        borderColor: "#f97316",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
    ],
    significantYears,
  };
});

// Historical comparison data for table
const comparisonData = ref([
  {
    name: "Average Annual Tornadoes",
    current: "0",
    historical: "0",
    change: 0,
    unit: "%",
  },
  {
    name: "Average Magnitude",
    current: "0",
    historical: "0",
    change: 0,
    unit: "%",
  },
  {
    name: "Average Path Length",
    current: "0 mi",
    historical: "0 mi",
    change: 0,
    unit: "%",
  },
  {
    name: "Average Injuries per Year",
    current: "0",
    historical: "0",
    change: 0,
    unit: "%",
  },
  {
    name: "Average Fatalities per Year",
    current: "0",
    historical: "0",
    change: 0,
    unit: "%",
  },
]);

// Methods
async function applyFilters() {
  isLoading.value = true;

  try {
    const queryParams: TornadoQueryParams = {};

    // Convert year range to date range for API
    if (filters.startYear && filters.endYear) {
      queryParams.startDate = `${filters.startYear}-01-01`;
      queryParams.endDate = `${filters.endYear}-12-31`;
    } else if (filters.startYear) {
      queryParams.year = filters.startYear;
    } else if (filters.endYear) {
      queryParams.year = filters.endYear;
    }

    // Add states filter if selected
    if (filters.states.length > 0) {
      queryParams.state = filters.states.join(",");
    }

    // Fetch tornado data with filters
    await tornadoStore.fetchTornadoes(queryParams);

    // Process data for charts and analysis
    processData();
  } catch (error) {
    console.error("Error fetching tornado data:", error);
  } finally {
    isLoading.value = false;
  }
}

function processData() {
  const tornadoes = tornadoStore.tornadoes;

  if (tornadoes.length === 0) {
    // Reset charts and metrics if no data
    resetChartData();
    return;
  }

  // Process tornadoes by year
  const yearCounts: Record<string, number> = {};
  tornadoes.forEach((tornado) => {
    const year = tornado.yr;
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  tornadoesByYear.value = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Process tornadoes by state
  const stateCounts: Record<string, number> = {};
  tornadoes.forEach((tornado) => {
    const state = tornado.st;
    stateCounts[state] = (stateCounts[state] || 0) + 1;
  });

  tornadoesByState.value = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  // Process tornadoes by month
  const monthCounts = Array(12).fill(0);
  tornadoes.forEach((tornado) => {
    const month = parseInt(tornado.mo) - 1; // 0-indexed months
    if (!isNaN(month) && month >= 0 && month < 12) {
      monthCounts[month]++;
    }
  });

  tornadoesByMonth.value = monthCounts.map((count, idx) => ({
    month: months[idx].substring(0, 3),
    count,
  }));

  // Process tornadoes by magnitude
  const magCounts: Record<string, number> = {};
  tornadoes.forEach((tornado) => {
    const mag = tornado.mag || "Unknown";
    magCounts[mag] = (magCounts[mag] || 0) + 1;
  });

  tornadoesByMagnitude.value = Object.entries(magCounts)
    .filter(([mag]) => !isNaN(parseInt(mag))) // Filter out non-numeric magnitudes
    .map(([magnitude, count]) => ({
      magnitude,
      count,
      label: `EF${magnitude}/F${magnitude}`,
    }))
    .sort((a, b) => parseInt(a.magnitude) - parseInt(b.magnitude));

  // Calculate analysis metrics
  calculateAnalysisMetrics(tornadoes);

  // Update comparison data
  updateComparisonData();
}

function calculateAnalysisMetrics(tornadoes: Tornado[]) {
  // Safety check
  if (tornadoes.length === 0) {
    return;
  }

  // Injuries and fatalities
  let totalInjuries = 0;
  let totalFatalities = 0;

  // Other metrics
  let totalMagnitude = 0;
  let totalLength = 0;
  let totalWidth = 0;

  // Counts for finding most common
  const magCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};
  const monthCounts: Record<string, number> = {};

  tornadoes.forEach((tornado) => {
    // Parse numeric values safely
    const injuries = parseInt(tornado.inj) || 0;
    const fatalities = parseInt(tornado.fat) || 0;
    const magnitude = parseInt(tornado.mag) || 0;
    const length = parseFloat(tornado.len) || 0;
    const width = parseFloat(tornado.wid) || 0;

    // Accumulate totals
    totalInjuries += injuries;
    totalFatalities += fatalities;
    totalMagnitude += magnitude;
    totalLength += length;
    totalWidth += width;

    // Count occurrences for finding most common
    const mag = tornado.mag || "0";
    const state = tornado.st || "";
    const month = tornado.mo || "";

    magCounts[mag] = (magCounts[mag] || 0) + 1;
    stateCounts[state] = (stateCounts[state] || 0) + 1;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  // Calculate averages
  const count = tornadoes.length;
  analysisMetrics.avgInjuries = totalInjuries / count;
  analysisMetrics.avgFatalities = totalFatalities / count;
  analysisMetrics.totalInjuries = totalInjuries;
  analysisMetrics.totalFatalities = totalFatalities;
  analysisMetrics.avgMagnitude = totalMagnitude / count;
  analysisMetrics.avgLength = totalLength / count;
  analysisMetrics.avgWidth = totalWidth / count;

  // Find most common magnitude
  analysisMetrics.mostCommonMagnitude =
    parseInt(Object.entries(magCounts).sort((a, b) => b[1] - a[1])[0][0]) || 0;

  // Find most active state
  const topStateEntry = Object.entries(stateCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (topStateEntry) {
    const [stateCode, stateCount] = topStateEntry;
    const stateData = STATE_OPTIONS.find((s) => s.value === stateCode);
    analysisMetrics.mostActiveState = stateData ? stateData.label : stateCode;
    analysisMetrics.tornadoesInTopState = stateCount;
  }

  // Find most active month
  const topMonthEntry = Object.entries(monthCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (topMonthEntry) {
    analysisMetrics.mostActiveMonth = parseInt(topMonthEntry[0]) || 5;
  }

  // Calculate peak season percentage (Apr-Jun)
  const peakMonths = ["04", "05", "06"]; // April, May, June
  const peakCount = peakMonths.reduce(
    (acc, month) => acc + (monthCounts[month] || 0),
    0
  );
  analysisMetrics.percentInPeakSeason = (peakCount / count) * 100;
}

function updateComparisonData() {
  // In a real app, we would compare with historical data from API
  // For now, we'll use hardcoded historical averages
  const historicalAverages = {
    annualTornadoes: 985,
    magnitude: 1.4,
    pathLength: 4.8,
    injuriesPerYear: 628,
    fatalitiesPerYear: 110,
  };

  // Current metrics from our analysis
  const currentMetrics = {
    annualTornadoes:
      totalTornadoes.value / Math.max(1, tornadoesByYear.value.length),
    magnitude: analysisMetrics.avgMagnitude,
    pathLength: analysisMetrics.avgLength,
    injuriesPerYear:
      analysisMetrics.totalInjuries / Math.max(1, tornadoesByYear.value.length),
    fatalitiesPerYear:
      analysisMetrics.totalFatalities /
      Math.max(1, tornadoesByYear.value.length),
  };

  // Calculate percentage changes
  const calculateChange = (current: number, historical: number) => {
    return historical === 0 ? 0 : ((current - historical) / historical) * 100;
  };

  comparisonData.value = [
    {
      name: "Average Annual Tornadoes",
      current: currentMetrics.annualTornadoes.toFixed(0),
      historical: historicalAverages.annualTornadoes.toString(),
      change: parseFloat(
        calculateChange(
          currentMetrics.annualTornadoes,
          historicalAverages.annualTornadoes
        ).toFixed(1)
      ),
      unit: "%",
    },
    {
      name: "Average Magnitude",
      current: currentMetrics.magnitude.toFixed(1),
      historical: historicalAverages.magnitude.toFixed(1),
      change: parseFloat(
        calculateChange(
          currentMetrics.magnitude,
          historicalAverages.magnitude
        ).toFixed(1)
      ),
      unit: "%",
    },
    {
      name: "Average Path Length",
      current: `${currentMetrics.pathLength.toFixed(1)} mi`,
      historical: `${historicalAverages.pathLength.toFixed(1)} mi`,
      change: parseFloat(
        calculateChange(
          currentMetrics.pathLength,
          historicalAverages.pathLength
        ).toFixed(1)
      ),
      unit: "%",
    },
    {
      name: "Average Injuries per Year",
      current: currentMetrics.injuriesPerYear.toFixed(0),
      historical: historicalAverages.injuriesPerYear.toString(),
      change: parseFloat(
        calculateChange(
          currentMetrics.injuriesPerYear,
          historicalAverages.injuriesPerYear
        ).toFixed(1)
      ),
      unit: "%",
    },
    {
      name: "Average Fatalities per Year",
      current: currentMetrics.fatalitiesPerYear.toFixed(0),
      historical: historicalAverages.fatalitiesPerYear.toString(),
      change: parseFloat(
        calculateChange(
          currentMetrics.fatalitiesPerYear,
          historicalAverages.fatalitiesPerYear
        ).toFixed(1)
      ),
      unit: "%",
    },
  ];
}

function resetChartData() {
  tornadoesByYear.value = [];
  tornadoesByState.value = [];
  tornadoesByMonth.value = [];
  tornadoesByMagnitude.value = [];

  // Reset metrics to defaults
  Object.assign(analysisMetrics, {
    avgInjuries: 0,
    avgFatalities: 0,
    totalInjuries: 0,
    totalFatalities: 0,
    avgMagnitude: 0,
    avgLength: 0,
    avgWidth: 0,
    mostCommonMagnitude: 0,
    mostActiveState: "N/A",
    tornadoesInTopState: 0,
    mostActiveMonth: 5,
    percentInPeakSeason: 0,
  });
}

// Watch for store changes
watch(
  () => tornadoStore.tornadoes,
  (newTornadoes) => {
    if (newTornadoes.length > 0 && !isLoading.value) {
      processData();
    }
  }
);

// Initialize
onMounted(async () => {
  // Fetch initial data on component mount
  await applyFilters();
});
</script>
