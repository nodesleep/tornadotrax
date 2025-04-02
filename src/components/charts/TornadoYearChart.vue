<template>
  <div class="h-full w-full">
    <Bar
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

// Props
const props = defineProps<{
  chartData: { year: string; count: number }[];
}>();

// Chart configuration
const chartConfig = computed(() => {
  return {
    data: {
      labels: props.chartData.map((item) => item.year),
      datasets: [
        {
          label: "Number of Tornadoes",
          data: props.chartData.map((item) => item.count),
          backgroundColor: "#64748b", // primary-500
          hoverBackgroundColor: "#ea580c", // accent-500
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
          labels: {
            color: "#1e293b", // primary-800
          },
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
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#475569", // primary-600
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "#e2e8f0", // primary-200
          },
          ticks: {
            color: "#475569", // primary-600
            precision: 0,
          },
        },
      },
    },
  };
});
</script>
