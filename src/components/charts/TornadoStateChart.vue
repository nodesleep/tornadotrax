<template>
  <div class="h-full w-full">
    <HorizontalBar
      v-if="chartData && chartData.length > 0"
      :data="chartConfig.data"
      :options="chartConfig.options"
    />
    <div
      v-else
      class="h-full flex items-center justify-center text-primary-400"
    >
      No data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Alias for horizontal bar chart
const HorizontalBar = Bar;

// Props
const props = defineProps<{
  chartData: { state: string; count: number }[];
}>();

// Chart configuration
const chartConfig = computed(() => {
  // Get top states and sort by count (descending)
  const topStates = [...props.chartData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Generate colors with different shades
  const generateColors = () => {
    const baseColor = [100, 116, 139]; // primary-400 in RGB

    return topStates.map((_, index) => {
      const shade = 1 - index * 0.07;
      return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${shade})`;
    });
  };

  const activeColors = generateColors();
  const hoverColors = Array(topStates.length).fill("#ea580c"); // accent-500

  return {
    data: {
      labels: topStates.map((item) => item.state),
      datasets: [
        {
          label: "Number of Tornadoes",
          data: topStates.map((item) => item.count),
          backgroundColor: activeColors,
          hoverBackgroundColor: hoverColors,
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0f172a", // primary-900
          padding: 10,
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          titleFont: {
            size: 12,
          },
          bodyFont: {
            size: 12,
          },
          displayColors: false,
          callbacks: {
            title: (tooltipItems: any[]) => {
              const stateCode = tooltipItems[0].label;
              const stateName = getStateFullName(stateCode);
              return stateName || stateCode;
            },
            label: (context: any) => {
              return `Tornadoes: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: "#e2e8f0", // primary-200
          },
          ticks: {
            color: "#475569", // primary-600
            precision: 0,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#475569", // primary-600
          },
        },
      },
    },
  };
});

// Helper function to get state full name from state code
function getStateFullName(stateCode: string): string {
  const stateMap: Record<string, string> = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
    DC: "District of Columbia",
  };

  return stateMap[stateCode] || stateCode;
}
</script>
