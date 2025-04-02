<template>
  <div class="h-full w-full">
    <div v-if="hasData">
      <Line :data="chartDataFormatted" :options="chartOptions" />
    </div>
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
  ScatterController,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  ScatterController
);

// Define interfaces
interface TornadoDataset {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor?: string;
  borderWidth?: number;
  borderDash?: number[];
  fill?: boolean;
  tension?: number;
}

interface SignificantYear {
  year: string;
  value: number;
  label: string;
}

interface TornadoChartData {
  labels: string[];
  datasets: TornadoDataset[];
  significantYears?: SignificantYear[];
}

// Props
const props = defineProps<{
  chartData: TornadoChartData;
}>();

// Check if we have data to display
const hasData = computed(() => {
  return (
    props.chartData &&
    props.chartData.labels &&
    props.chartData.labels.length > 0 &&
    props.chartData.datasets &&
    props.chartData.datasets.length > 0
  );
});

// Computed properties that transform the data format
const chartDataFormatted = computed(() => {
  if (!hasData.value) {
    // Return empty chart data if no data is available
    return {
      labels: [],
      datasets: [],
    } as ChartData<"line">;
  }

  // Regular line datasets - add type annotation to suppress TS errors
  const lineDatasets = props.chartData.datasets.map((dataset) => {
    return {
      ...dataset,
      // Not adding type to avoid TS error - Chart.js will treat as line by default
    };
  });

  const result: ChartData<"line"> = {
    labels: props.chartData.labels,
    datasets: lineDatasets,
  };

  // Add significant years as points
  if (
    props.chartData.significantYears &&
    props.chartData.significantYears.length > 0
  ) {
    // We need to use a special technique to add scatter points to a line chart
    // Instead of a separate dataset, we'll add them as annotation plugins
    // This avoids the type mismatch between 'line' and 'scatter'
    // This is handled in the chart options below
  }

  return result;
});

// Chart options
const chartOptions = computed((): ChartOptions<"line"> => {
  // Special handling for significant years - we'll create markers/annotations
  const significantYears = props.chartData.significantYears || [];

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      point: {
        // Custom function to make certain points larger and a different color
        radius: (context) => {
          if (!hasData.value) return 3;

          const index = context.dataIndex;
          const label = props.chartData.labels[index];

          // Check if this point is a significant year
          if (significantYears.some((y) => y.year === label)) {
            return 8; // Larger radius for significant years
          }

          return 3; // Default radius
        },
        backgroundColor: (context: any) => {
          if (!hasData.value) return "#3b82f6";

          const index = context.dataIndex;
          const label = props.chartData.labels[index];

          // Check if this point is a significant year
          if (significantYears.some((y) => y.year === label)) {
            return "#dc2626"; // Red for significant years
          }

          return context.dataset.backgroundColor || "#3b82f6";
        },
        borderColor: (context) => {
          if (!hasData.value) return "#ffffff";

          const index = context.dataIndex;
          const label = props.chartData.labels[index];

          // Check if this point is a significant year
          if (significantYears.some((y) => y.year === label)) {
            return "#ffffff"; // White border for significant years
          }

          return "#ffffff";
        },
        borderWidth: (context) => {
          if (!hasData.value) return 1;

          const index = context.dataIndex;
          const label = props.chartData.labels[index];

          // Check if this point is a significant year
          if (significantYears.some((y) => y.year === label)) {
            return 2; // Thicker border for significant years
          }

          return 1;
        },
        hoverRadius: (context) => {
          if (!hasData.value) return 4;

          const index = context.dataIndex;
          const label = props.chartData.labels[index];

          // Check if this point is a significant year
          if (significantYears.some((y) => y.year === label)) {
            return 10; // Larger hover radius for significant years
          }

          return 4;
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1e293b", // primary-800
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a", // primary-900
        padding: 12,
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (items) => {
            if (!items || items.length === 0) return "";

            // Check if this is a significant year
            const year = String(items[0].label);
            const significantYear = significantYears.find(
              (sy) => sy.year === year
            );

            if (significantYear) {
              return `${year} - ${significantYear.label}`;
            }

            return year;
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
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
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
  };
});
</script>
