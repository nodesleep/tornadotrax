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

                <!-- Display OpenStreetMap map of tornado tracks that is 20% vh in height and full width -->
                <div class="max-h-[65vh] w-[40vw] border border-gray-400 mt-3">
                    <TornadoMapComponent
                        :selectedState="selectedState"
                        :tornadoTracks="tornadoTracks"
                        :key="selectedState + selectedYear"
                    />
                </div>

                <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 z-10 bg-white w-full">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">Tor #</th>
                                <th scope="col" class="px-6 py-3">Date</th>
                                <th scope="col" class="px-6 py-3">Time</th>
                                <th scope="col" class="px-6 py-3">Start Lat/Lon</th>
                                <th scope="col" class="px-6 py-3">End Lat/Lon</th>
                                <th scope="col" class="px-6 py-3">Track Length (mi)</th>
                                <th scope="col" class="px-6 py-3">Width (yds)</th>
                                <th scope="col" class="px-6 py-3">Rating (F/EF-9 = Unknown)</th>
                                <th scope="col" class="px-6 py-3">Injuries</th>
                                <th scope="col" class="px-6 py-3">Fatalities</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(event, index) in sortedData"
                                :key="index"
                                class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-400 hover:text-white"
                            >
                                <td class="px-6 py-4">{{ event.om }}</td>
                                <td class="px-6 py-4">{{ event.date }}</td>
                                <td class="px-6 py-4">{{ event.time }}</td>
                                <td class="px-6 py-4">{{ event.slat }}/{{ event.slon }}</td>
                                <td class="px-6 py-4">{{ event.elat }}/{{ event.elon }}</td>
                                <td class="px-6 py-4">{{ event.len }}</td>
                                <td class="px-6 py-4">{{ event.wid }}</td>
                                <td class="px-6 py-4">F/EF{{ event.mag }}</td>
                                <td class="px-6 py-4">{{ event.inj }}</td>
                                <td class="px-6 py-4">{{ event.fat }}</td>
                            </tr>
                        </tbody>
                    </table>
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
                slat: parseFloat(event.slat),
                slon: parseFloat(event.slon),
                elat: parseFloat(event.elat),
                elon: parseFloat(event.elon),
                mag: parseFloat(event.mag),
            };
        });
});
</script>
