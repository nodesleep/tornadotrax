<template>
    <div class="mt-3">
        <div class="flex">
            <div>
                <label for="stateDropdown">Select State:</label>
                <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[10rem]"
                    id="stateDropdown"
                    v-model="selectedState"
                >
                    <option v-for="state in sortedStates" :key="state">{{ state }}</option>
                </select>
            </div>
            <div v-if="selectedState" class="ml-10">
                <label for="yearDropdown">Select Year:</label>
                <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[10rem]"
                    id="yearDropdown"
                    v-model="selectedYear"
                >
                    <option v-for="year in sortedYears" :key="year">{{ year }}</option>
                </select>
            </div>
        </div>

        <!-- Display year dropdown and table only if a state is selected -->
        <div class="mt-2" v-if="selectedState">
            <div class="mt-5" v-if="selectedState && selectedYear">
                <h2 class="font-bold text-xl">
                    Events in {{ selectedState }}{{ selectedYear ? `, ${selectedYear}` : '' }}
                </h2>

                <div class="mt-3">
                    <!-- Display OpenStreetMap map of tornado tracks that is 20% vh in height and full width -->
                    <div class="h-[50vh] w-full border border-gray-400">
                        <TornadoMapComponent
                            :selectedState="selectedState"
                            :tornadoTracks="tornadoTracks"
                            :key="selectedState + selectedYear"
                        />
                    </div>
                </div>
                <div class="mt-3">
                    <!-- <div class="h-[20vh] w-full border border-gray-400"> -->
                        <!-- Display Tornado Chart Component -->
                        <!-- <TorChartComponent :efRatingCounts="efRatingCounts" :key="selectedYear + selectedState" /> -->
                    <!-- </div> -->
                </div>
            </div>

            <div v-else>
                <p>No events for the selected state and year.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import jsonData from '../data/data.json';
import TornadoMapComponent from './TornadoMapComponent.vue';
import TorChartComponent from './TorChartComponent.vue';

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
        .filter((event) => event.slat && event.slon && event.elat && event.elon && event.mag)
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

const getBackgroundColorClass = (mag) => {
    if (mag >= 3 && mag < 4) {
        return 'bg-amber-400 text-black font-bold';
    } else if (mag >= 4 && mag < 5) {
        return 'bg-red-400 text-black font-bold';
    } else if (mag >= 5) {
        return 'bg-purple-400 text-black font-bold';
    } else {
        return ''; // Default background color class or an empty string if no match
    }
};
</script>
