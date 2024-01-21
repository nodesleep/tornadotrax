<template>
    <main class="content">
        <section class="if-mobile">
            <div>
                <v-icon name="gi-tornado" scale="4" fill="#6366f1" />
                <p>
                    It would appear you're trying to access TornadoTrax from a mobile device. While the concept of
                    "mobile first" is industry standard, this application is suited only for desktop users. Sorry about
                    that!
                </p>
            </div>
        </section>
        <section class="content-grid">
            <section class="sidebar">
                <div class="site-title">
                    <v-icon name="gi-tornado" scale="2" fill="#6366f1" />
                    <h2>TornadoTrax</h2>
                </div>
                <p>An visual archive and path of every actual US Tornado from 1950-2022</p>
                <div class="select-area">
                    <label for="stateDropdown">Select State:</label>
                    <select class="light-select" id="stateDropdown" v-model="selectedState">
                        <option value="" disabled selected>State</option>
                        <option v-for="state in sortedStates" :key="state">{{ state }}</option>
                    </select>
                </div>
                <div v-if="selectedState" class="select-area">
                    <label for="yearDropdown">Select Year:</label>
                    <select class="light-select" id="yearDropdown" v-model="selectedYear" placeholder="Year">
                        <option value="" disabled selected>Year</option>
                        <option v-for="year in sortedYears" :key="year">{{ year }}</option>
                    </select>
                </div>
                <p class="note">
                    <strong>Note:</strong> Some tornadoes do not have an end latitude or longitude and therefore have
                    been omitted. Tornadoes with an unknown rating are also omitted.
                </p>
                <div class="legend">
                    <div v-for="(count, rating) in efRatingCounts" :key="rating" class="legend-item">
                        <div class="legend-color" :style="{ background: getMagnitudeColor(Number(rating)) }"></div>
                        <div class="legend-label">EF{{ rating }}</div>
                    </div>
                </div>
            </section>
            <section class="tornado-map-area">
                <p v-if="!mapReady">Please select a state to continue...</p>
                <TornadoMapComponent
                    :selectedState="selectedState"
                    :tornadoTracks="tornadoTracks"
                    :key="selectedState + selectedYear"
                    v-if="mapReady"
                />
            </section>
        </section>
    </main>
</template>
<script setup>
import { ref, computed } from 'vue';
import jsonData from './data/data.json';
import TornadoMapComponent from './components/TornadoMapComponent.vue';

const mapReady = ref(false);
const selectedState = ref('');
const selectedYear = ref('');
let states = Array.from(new Set(jsonData.map((event) => event.st)));
let years = Array.from(new Set(jsonData.map((event) => event.yr)));

// Sort the states and years alphabetically
states = states.sort();
years = years.sort();

const sortedStates = computed(() => {
    return states;
});

const sortedYears = computed(() => {
    mapReady.value = true;
    return years;
});

const filteredData = computed(() => {
    let filtered = jsonData;
    if (selectedState.value) {
        filtered = filtered.filter((event) => event.st === selectedState.value);
    }
    if (selectedYear.value) {
        filtered = filtered.filter((event) => event.yr === selectedYear.value);
    }
    return filtered;
});

const sortedData = computed(() => {
    return filteredData.value.slice().sort((a, b) => {
        return a.date.localeCompare(b.date);
    });
});

const getMagnitudeColor = (magnitude) => {
    // Use a color gradient from cool to warm based on magnitude
    const colorGradient = [
        '#94a3b8', // EF0
        '#0ea5e9', // EF1
        '#fcd34d', // EF2
        '#ea580c', // EF3
        '#dc2626', // EF4
        '#c026d3', // EF5
    ];

    // Map magnitude (0 to 5) to index in color gradient array
    const index = Math.round((magnitude / 5) * (colorGradient.length - 1));

    // Return the corresponding color
    return colorGradient[index];
};

// Compute counts for each EF rating
const efRatingCounts = computed(() => {
    const counts = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };

    filteredData.value.forEach((event) => {
        const rating = event.mag;
        if (rating in counts) {
            counts[rating]++;
        }
    });

    return counts;
});

// Define a computed property to extract tornadoTracks based on selected state and year
const tornadoTracks = computed(() => {
    if (!selectedState.value || !selectedYear.value) {
        return [];
    }

    return sortedData.value
        .filter(
            (event) =>
                event.slat &&
                event.slon &&
                event.elat !== '0.0' && // Add this condition to exclude elat = 0.0
                event.elon !== '0.0' && // Add this condition to exclude elon = 0.0
                event.mag,
        )
        .map((event) => {
            return {
                slat: event.slat,
                slon: event.slon,
                elat: event.elat,
                elon: event.elon,
                mag: parseFloat(event.mag),
                fat: parseFloat(event.fat),
                inj: parseFloat(event.inj),
                len: parseFloat(event.len),
                wid: parseFloat(event.wid),
                date: event.date,
                time: event.time,
                om: event.om,
            };
        });
});
</script>
