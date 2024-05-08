<script setup>
import { ref, watchEffect, computed } from 'vue';
import RatingLegend from './components/RatingLegend.vue';
import TornadoMapComponent from './components/TornadoMapComponent.vue';
import states from './data/states.json';

import {
	CircleStackIcon,
	CalendarDaysIcon,
	ChartBarIcon,
	GlobeAmericasIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Cog6ToothIcon,
} from '@heroicons/vue/24/outline';
import TornadoAnalyticsComponent from './components/TornadoAnalyticsComponent.vue';

// Visibility Toggles for Sidebar
const dateVisible = ref(false);
const stateVisible = ref(false);
const magVisible = ref(false);
const settingsVisible = ref(false);

// Settings
const showLegend = ref(true);
const darkMode = ref(true);
const showAnalytics = ref(true);

// Model and Tracking Refs
const startDate = ref('2018-01-01');
const endDate = ref('2022-12-31');
const selectedStates = ref([]);
const magRating = ref([]);
const tornadoTracks = ref([]);
const analyticsData = ref([]);

// Loading and Map Ready
const isLoading = ref(false);
const mapReady = ref(false);

// Watch for Dark Mode Toggle
watchEffect(() => {
	if (darkMode.value) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
});

// Generate Unique Key for Each Tornado Track
const mapKey = computed(
	() =>
		`${selectedStates.value.join(',')}-${startDate.value}-${
			endDate.value
		}-${darkMode.value}`,
);

// Fetching Data from API
const fetchData = async () => {
	mapReady.value = false;
	isLoading.value = true;
	if (startDate.value && endDate.value) {
		const statesQuery = selectedStates.value.join(',');
		const magQuery = magRating.value.join(',');
		const requestBody = {
			...(statesQuery && { state: statesQuery }),
			...(magQuery && { mag: magQuery }),
			startDate: startDate.value,
			endDate: endDate.value,
		};

		try {
			const response = await fetch(
				`${import.meta.env.VITE_APP_BASE_API}/tornado`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestBody),
				},
			);

			if (response.ok) {
				const { data } = await response.json();
				analyticsData.value = data;
				const filteredData = data.filter(
					(track) => track.elat !== '0.0' && track.elon !== '0.0',
				);
				tornadoTracks.value = filteredData.map((track) => ({
					...track,
					mag: parseFloat(track.mag),
					fat: parseFloat(track.fat),
					inj: parseFloat(track.inj),
					len: parseFloat(track.len),
					wid: parseFloat(track.wid),
				}));
				mapReady.value = true;
				isLoading.value = false;
			} else {
				console.error('Failed to fetch tornado data');
			}
		} catch (error) {
			console.error('Error fetching tornado data:', error);
		}
	} else {
		tornadoTracks.value = [];
	}
};

// Same day input
const sameDay = () => {
	endDate.value = startDate.value;
};

// Clear Filters on Request
const clearFilters = () => {
	startDate.value = '2018-01-01';
	endDate.value = '2022-12-31';
	selectedStates.value = [];
	magRating.value = [];
	tornadoTracks.value = [];
	mapReady.value = false;
};
</script>

<template>
	<div class="h-screen relative">
		<div class="flex w-full items-center absolute z-50">
			<div
				class="flex flex-col h-screen w-1/3 xl:w-1/6 px-6 space-y-10 overflow-y-auto border-r border-gray-300 dark:border-none bg-white dark:bg-gray-800"
			>
				<h1
					class="font-bold text-xl flex items-center pt-6 dark:text-gray-100"
				>
					<img
						src="/favicon-32x32.png"
						alt="tornado trax icon"
						class="w-[8%] mr-2"
					/>
					Tornado<span class="text-cyan-600 dark:text-cyan-500"
						>Trax</span
					>
				</h1>
				<ul
					class="flex flex-col space-y-5 w-full text-gray-800 dark:text-gray-200"
				>
					<li class="text-cyan-600 dark:text-cyan-500 font-bold">
						Search Filters
					</li>
					<li
						class="flex flex-col justify-center font-medium select-none cursor-pointer"
					>
						<div
							class="flex items-center"
							@click="dateVisible = !dateVisible"
						>
							<CalendarDaysIcon class="size-5 mr-3" /> Date
							<div class="ml-auto">
								<ChevronDownIcon
									class="size-4"
									v-if="!dateVisible"
								/>
								<ChevronUpIcon class="size-4" v-else />
							</div>
						</div>
						<Transition name="slide-fade">
							<div
								class="flex flex-col justify-center pt-5"
								v-if="dateVisible"
							>
								<label
									for="fromDate"
									class="text-sm font-normal text-cyan-800 dark:text-cyan-500"
									>Start Date</label
								>
								<input
									class="outline-none border-gray-300 text-sm rounded-lg p-3 w-full dark:bg-gray-700 dark:border-none"
									type="date"
									id="fromDate"
									min="1950-01-01"
									max="2022-12-31"
									v-model="startDate"
								/>
								<label
									for="endDate"
									class="text-sm font-normal text-cyan-800 dark:text-cyan-500 pt-4 cursor-pointer"
									@click="sameDay"
									>End Date (Click here for same-day)</label
								>
								<input
									class="outline-none border-gray-300 text-sm rounded-lg p-3 w-full dark:bg-gray-700 dark:border-none"
									type="date"
									id="endDate"
									min="1950-01-01"
									max="2022-12-31"
									v-model="endDate"
								/>
							</div>
						</Transition>
					</li>
					<li
						class="flex flex-col justify-center font-medium select-none cursor-pointer"
					>
						<div
							class="flex items-center"
							@click="magVisible = !magVisible"
						>
							<ChartBarIcon class="size-5 mr-3" /> EF-Rating
							<div class="ml-auto">
								<ChevronDownIcon
									class="size-4"
									v-if="!magVisible"
								/>
								<ChevronUpIcon class="size-4" v-else />
							</div>
						</div>
						<Transition name="slide-fade">
							<div
								class="flex flex-col justify-center"
								v-if="magVisible"
							>
								<label
									for="magRating"
									class="text-sm font-normal text-cyan-800 dark:text-cyan-500 pt-4"
									>Select one or more ratings
									(optional)</label
								>
								<select
									name="magRatingSelect"
									id="magRating"
									class="outline-none border-gray-300 text-sm rounded-lg p-3 w-full dark:bg-gray-700 dark:border-none"
									v-model="magRating"
									multiple
								>
									<option value="" selected>None</option>
									<option value="0">EF0</option>
									<option value="1">EF1</option>
									<option value="2">EF2</option>
									<option value="3">EF3</option>
									<option value="4">EF4</option>
									<option value="5">EF5</option>
								</select>
							</div>
						</Transition>
					</li>
					<li
						class="flex flex-col justify-center font-medium select-none cursor-pointer"
					>
						<div
							class="flex items-center"
							@click="stateVisible = !stateVisible"
						>
							<GlobeAmericasIcon class="size-5 mr-3" /> State
							<div class="ml-auto">
								<ChevronDownIcon
									class="size-4"
									v-if="!stateVisible"
								/>
								<ChevronUpIcon class="size-4" v-else />
							</div>
						</div>
						<Transition name="slide-fade">
							<div
								class="flex items-center pt-3 w-full"
								v-if="stateVisible"
							>
								<div class="select-area w-full">
									<label
										for="stateDropdown"
										class="text-sm font-normal text-cyan-800 dark:text-cyan-500"
										>Select one or more states
										(optional)</label
									>
									<select
										class="outline-none border-gray-300 text-sm rounded-lg p-3 w-full dark:bg-gray-700 dark:border-none"
										id="stateDropdown"
										v-model="selectedStates"
										multiple
									>
										<option>None</option>
										<option
											v-for="(coords, state) in states"
											:key="state"
											:value="state"
										>
											{{ state }}
										</option>
									</select>
								</div>
							</div>
						</Transition>
					</li>
					<li
						class="flex flex-col justify-center font-medium select-none cursor-pointer"
					>
						<div
							class="flex items-center"
							@click="settingsVisible = !settingsVisible"
						>
							<Cog6ToothIcon class="size-5 mr-3" /> Settings
							<div class="ml-auto">
								<ChevronDownIcon
									class="size-4"
									v-if="!settingsVisible"
								/>
								<ChevronUpIcon class="size-4" v-else />
							</div>
						</div>
						<Transition name="slide-fade">
							<div
								class="flex flex-col justify-center pt-5"
								v-if="settingsVisible"
							>
								<label
									class="inline-flex items-center cursor-pointer mt-2"
								>
									<input
										type="checkbox"
										value="0"
										class="sr-only peer"
										v-model="showLegend"
									/>
									<div
										class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"
									></div>
									<span
										class="ms-3 text-sm font-regular text-gray-900 dark:text-gray-300"
										>EF Rating Legend</span
									>
								</label>
								<label
									class="inline-flex items-center cursor-pointer mt-2"
								>
									<input
										type="checkbox"
										value="0"
										class="sr-only peer"
										v-model="showAnalytics"
									/>
									<div
										class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"
									></div>
									<span
										class="ms-3 text-sm font-regular text-gray-900 dark:text-gray-300"
										>Analytics Bar</span
									>
								</label>
								<label
									class="inline-flex items-center cursor-pointer pt-2"
								>
									<input
										type="checkbox"
										value=""
										class="sr-only peer"
										v-model="darkMode"
									/>
									<div
										class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"
									></div>
									<span
										class="ms-3 text-sm font-regular text-gray-900 dark:text-gray-300"
										>Dark Mode</span
									>
								</label>
							</div>
						</Transition>
					</li>
					<li
						class="flex flex-col justify-center font-medium select-none cursor-pointer"
					>
						<button
							class="p-3 text-white text-sm bg-cyan-600 dark:bg-cyan-700 rounded-lg flex items-center justify-center w-full"
							@click="fetchData"
						>
							Generate
						</button>
						<button
							class="p-3 mt-2 text-white text-sm bg-gray-500 rounded-lg flex items-center justify-center w-full"
							@click="clearFilters"
						>
							Clear Filters
						</button>
					</li>
				</ul>
			</div>
			<div
				class="flex-1 flex flex-col h-screen items-center justify-center bg-gray-300 dark:bg-gray-700 relative"
			>
				<div
					class="absolute bottom-0 left-0 p-3 z-20"
					v-if="showLegend"
				>
					<RatingLegend />
				</div>
				<div
					class="absolute bottom-0 right-50 p-3 z-20"
					v-if="mapReady"
				>
					<TornadoAnalyticsComponent
						:data="analyticsData"
						v-show="showAnalytics"
					/>
				</div>
				<div
					class="flex flex-col items-center justify-center"
					v-if="isLoading"
				>
					<CircleStackIcon
						class="size-10 text-cyan-600 animate-pulse"
					/>
				</div>
				<div
					class="flex items-center justify-center h-full w-full absolute z-10"
				>
					<TornadoMapComponent
						:selectedState="selectedStates.join(',')"
						:tornadoTracks="tornadoTracks"
						:key="mapKey"
						:isLightMode="!darkMode"
						v-if="mapReady"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
label {
	margin-bottom: 5px;
}
</style>
