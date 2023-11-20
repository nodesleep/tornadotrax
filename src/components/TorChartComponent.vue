<template>
    <div class="mt-5">
        <h2 class="font-bold text-xl">Tornado Rating Chart</h2>
        <Bar :data="chartData" :options="chartOptions"></Bar>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import { Bar } from 'vue-chartjs';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale } from 'chart.js';

Chart.register(CategoryScale, LinearScale);

const { efRatingCounts } = defineProps(['efRatingCounts']);

const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Labels will be the months of the year
    datasets: [
        {
            label: 'Tornado Count',
            backgroundColor: '#3490dc',
            data: [],
        },
    ],
});

const chartOptions = ref({
    scales: {
        x: {
            type: 'category',
        },
        y: {
            beginAtZero: true,
        },
    },
    responsive: true,
    maintainAspectRatio: true,
});

const updateChartData = () => {
    if (efRatingCounts.value) {
        // Assuming efRatingCounts has keys for each EF rating (0 to 5)
        chartData.value.labels = Object.keys(efRatingCounts.value);
        chartData.value.datasets[0].data = Object.values(efRatingCounts.value);
    }
};

onMounted(() => {
    updateChartData();
});

watch(efRatingCounts, () => {
    updateChartData();
});
</script>

<style scoped>
/* Add any custom styling for the chart component if needed */
</style>
