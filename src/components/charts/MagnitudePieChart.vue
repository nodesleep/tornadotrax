<template>
  <div class="h-full w-full">
    <Pie
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
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Props
const props = defineProps<{
  chartData: { magnitude: string; count: number }[];
}>();

// Chart configuration
const chartConfig = computed(() => {
  // Generate colors based on magnitude
  const colors = [
    "#94a3b8", // EF0/F0 - gray-400
    "#4ade80", // EF1/F1 - green-400
    "#facc15", // EF2/F2 - yellow-400
    "#fb923c", // EF3/F3 - orange-400
    "#ef4444", // EF4/F4 - red-500
    "#a855f7", // EF5/F5 - purple-500
  ];

  return {
    data: {
      labels: props.chartData.map(
        (item) => `EF${item.magnitude}/F${item.magnitude}`
      ),
      datasets: [
        {
          data: props.chartData.map((item) => item.count),
          backgroundColor: colors.slice(0, props.chartData.length),
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "right" as const,
          labels: {
            color: "#1e293b", // primary-800
            padding: 16,
            font: {
              size: 11,
            },
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
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const total = context.dataset.data.reduce(
                (acc: number, val: number) => acc + val,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value} tornadoes (${percentage}%)`;
            },
          },
        },
      },
    },
  };
});
</script>
