<template>
  <div class="h-full w-full">
    <Line
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
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

// Props
const props = defineProps<{
  chartData: { month: string; count: number }[];
}>();

// Chart configuration
const chartConfig = computed(() => {
  return {
    data: {
      labels: props.chartData.map((item) => item.month),
      datasets: [
        {
          label: "Tornadoes by Month",
          data: props.chartData.map((item) => item.count),
          backgroundColor: "rgba(234, 88, 12, 0.2)", // accent-500 with opacity
          borderColor: "#ea580c", // accent-500
          borderWidth: 2,
          pointBackgroundColor: "#ea580c",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          fill: true,
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
          callbacks: {
            label: (context: any) => {
              return `Tornadoes: ${context.raw}`;
            },
          },
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
