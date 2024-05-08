<script setup>
import { computed, ref } from 'vue';
const { data } = defineProps(['data']);

// Total number of tornadoes
const tornadoCount = computed(() => {
	return data.length;
});

// Count of violent tornadoes (magnitude 4 or higher)
const violentTornadoesCount = computed(() => {
	return data.filter((tornado) => tornado.mag >= 4).length;
});

// Total fatalities
const totalFatalities = computed(() => {
	return data.reduce((acc, tornado) => acc + Number(tornado.fat), 0);
});

// Total injuries
const totalInjuries = computed(() => {
	return data.reduce((acc, tornado) => acc + Number(tornado.inj), 0);
});

// Count of unique states impacted
const uniqueStatesCount = computed(() => {
	const states = new Set();
	data.forEach((tornado) => {
		states.add(tornado.st);
	});
	return states.size; // Returns the number of unique states
});

// Total damage cost formatted as compact currency
const totalDamageCost = computed(() => {
	const total = data.reduce(
		(acc, tornado) => acc + Number(tornado.loss) * 1000000,
		0,
	);
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'USD',
	}).format(total);
});

// Organizing tornado data by magnitude with count for each
const countByMagnitude = computed(() => {
	const counts = {};
	data.forEach((tornado) => {
		const mag = tornado.mag;
		if (counts[mag]) {
			counts[mag]++;
		} else {
			counts[mag] = 1;
		}
	});
	return counts;
});
</script>
<template>
	<div
		class="bg-white shadow-xl dark:bg-gray-800 dark:text-white text-center p-4 rounded-xl"
	>
		<div class="grid grid-flow-col auto-cols-max gap-6">
			<div class="col-1">
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					Total Events
				</h1>
				<h1 class="text-lg font-bold">
					{{ tornadoCount }}
				</h1>
			</div>
			<div class="col-1">
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					States
				</h1>
				<h1 class="text-lg font-bold">
					{{ uniqueStatesCount }}
				</h1>
			</div>
			<div class="col-1">
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					Violent Tor
				</h1>
				<h1 class="text-lg font-bold">
					{{ violentTornadoesCount }}
				</h1>
			</div>
			<div class="col-1">
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					Fatalities
				</h1>
				<h1 class="text-lg font-bold">
					{{ totalFatalities }}
				</h1>
			</div>
			<div class="col-1">
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					Injuries
				</h1>
				<h1 class="text-lg font-bold">
					{{ totalInjuries }}
				</h1>
			</div>
			<div class="col-1">
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					Cost
				</h1>
				<h1 class="text-lg font-bold">
					{{ totalDamageCost }}
				</h1>
			</div>
			<div
				class="col-1"
				v-for="(count, mag) in countByMagnitude"
				:key="mag"
			>
				<h1
					class="text-xs text-cyan-700 dark:text-cyan-500 font-medium"
				>
					EF{{ mag }}
				</h1>
				<h1 class="text-lg font-bold">
					{{ count }}
				</h1>
			</div>
		</div>
	</div>
</template>
