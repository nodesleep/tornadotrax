<template>
	<main class="content" :class="{ light: isLightMode }">
		<section class="if-mobile">
			<div>
				<v-icon name="gi-tornado" scale="4" fill="#0ea5e9" />
				<p>
					It would appear you're trying to access TornadoTrax from a
					mobile device. While the concept of "mobile first" is
					industry standard, this application is suited only for
					desktop users. Sorry about that!
				</p>
			</div>
		</section>
		<section class="content-grid">
			<section class="sidebar">
				<div class="site-title">
					<v-icon name="gi-tornado" scale="2" fill="#0ea5e9" />
					<h2>TornadoTrax</h2>
				</div>
				<p>
					An visual archive and path of every US Tornado from
					1950-2022*
				</p>
				<div class="select-area">
					<label for="stateDropdown"
						>Select one or more states: (optional)</label
					>
					<select
						class="light-select"
						id="stateDropdown"
						v-model="selectedStates"
						multiple
					>
						<option
							v-for="(coords, state) in states"
							:key="state"
							:value="state"
						>
							{{ state }}
						</option>
					</select>
				</div>
				<div class="select-area">
					<label for="startDate">Start Date:</label>
					<input
						type="date"
						id="startDate"
						v-model="startDate"
						class="light-select"
					/>
				</div>
				<div class="select-area">
					<label for="endDate">End Date:</label>
					<input
						type="date"
						id="endDate"
						v-model="endDate"
						class="light-select"
					/>
				</div>
				<div class="select-area">
					<label for="magRating">EF Rating: (optional)</label>
					<select
						name="magRatingSelect"
						id="magRating"
						class="light-select"
						v-model="magRating"
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
				<button @click="fetchData">Submit</button>
				<div class="options">
					<div class="legend">
						<div
							v-for="(count, rating) in efRatingCounts"
							:key="rating"
							class="legend-item"
						>
							<div
								class="legend-color"
								:style="{
									background: getMagnitudeColor(
										Number(rating),
									),
								}"
							></div>
							<div class="legend-label">EF{{ rating }}</div>
						</div>
					</div>
					<p class="note">
						<strong>*Disclaimer:</strong> Some tornado records do
						not have an end coordinate and therefore have been
						omitted. Tornadoes with an unknown rating are also
						omitted. These outliers don't render correctly in the
						map.
					</p>
					<p class="note">
						Tornadoes are plotted based on their state of origin,
						irrespective of the states they should travel into.
					</p>
					<p class="note">
						TornadoTrax is an open source project under the GPL-3.0
						license.
						<a
							href="https://github.com/themattbook/tornadotrax"
							target="_blank"
							>View it on Github</a
						>
					</p>
					<ul>
						<li @click="toggleDarkMode">
							<v-icon
								name="ri-sun-fill"
								scale="1"
								v-if="!isLightMode"
							/>
							<v-icon
								name="ri-moon-fill"
								scale="1"
								v-if="isLightMode"
							/>
						</li>
					</ul>
				</div>
			</section>
			<section class="tornado-map-area">
				<p v-if="!mapReady">
					Map will render once a query has been submitted...
				</p>
				<TornadoMapComponent
					:selectedState="selectedStates.join(',')"
					:tornadoTracks="tornadoTracks"
					:key="mapKey"
					:isLightMode="isLightMode"
					v-if="mapReady"
				/>
			</section>
		</section>
	</main>
</template>

<script setup>
import { ref, computed } from 'vue';
import states from '../data/states.json';
import TornadoMapComponent from '../components/TornadoMapComponent.vue';

const isLightMode = ref(false);
const selectedStates = ref([]);
const startDate = ref('');
const endDate = ref('');
const magRating = ref('');
const tornadoTracks = ref([]);
const mapReady = ref(false);

const mapKey = computed(
	() =>
		`${selectedStates.value.join(',')}-${startDate.value}-${
			endDate.value
		}-${isLightMode.value}`,
);

const fetchData = async () => {
	mapReady.value = false;
	if (startDate.value && endDate.value) {
		const statesQuery = selectedStates.value.join(',');
		const queryParams = new URLSearchParams({
			...(statesQuery && { state: statesQuery }),
			startDate: startDate.value,
			endDate: endDate.value,
			mag: magRating.value,
		}).toString();

		try {
			console.log(
				`${import.meta.env.VITE_APP_BASE_API}/tornado?${queryParams}`,
			);
			const response = await fetch(
				`${import.meta.env.VITE_APP_BASE_API}/tornado?${queryParams}`,
			);
			if (response.ok) {
				const { data } = await response.json();
				const filteredData = data.filter(
					(track) => track.elat != '0.0' && track.elon !== '0.0',
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

const getMagnitudeColor = (magnitude) => {
	const colorGradient = [
		'#94a3b8', // EF0
		'#0ea5e9', // EF1
		'#fcd34d', // EF2
		'#ea580c', // EF3
		'#dc2626', // EF4
		'#c026d3', // EF5
	];

	const index = Math.round((magnitude / 5) * (colorGradient.length - 1));
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

	tornadoTracks.value.forEach((event) => {
		const rating = event.mag;
		if (rating in counts) {
			counts[rating]++;
		}
	});

	return counts;
});

// EF Ratings and Magnitude Color remain unchanged

const toggleDarkMode = () => {
	isLightMode.value = !isLightMode.value;
};
</script>
