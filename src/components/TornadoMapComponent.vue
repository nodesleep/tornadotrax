<template>
	<div ref="mapContainer" class="map-component"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import states from '../data/states.json';
import L from 'leaflet';

const { selectedState, tornadoTracks, isLightMode } = defineProps([
	'selectedState',
	'tornadoTracks',
	'isLightMode',
]);

const mapContainer = ref(null);

const stateCenters = states;

onMounted(() => {
	initializeMap();
});

const initializeMap = () => {
	if (mapContainer.value) {
		// Set a default center and zoom for map initialization
		const defaultCenter = [39.8283, -98.5795]; // Center of the US
		const defaultZoom = 4;

		// Initialize Leaflet map with default center and zoom
		const map = L.map(mapContainer.value).setView(
			defaultCenter,
			defaultZoom,
		);

		const tileLayerUrl = isLightMode
			? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
			: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

		L.tileLayer(tileLayerUrl, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		}).addTo(map);

		// Check if there are tracks to render and adjust map accordingly
		if (tornadoTracks && tornadoTracks.length > 0) {
			renderTornadoTracks(map, tornadoTracks);
		}
	} else {
		console.error('Map container not found');
	}
};

const renderTornadoTracks = (map, tracks) => {
	const tracksLayer = L.layerGroup().addTo(map);
	let bounds = [];

	tracks.forEach((track) => {
		const startLatLon = [track.slat, track.slon];
		const endLatLon = [track.elat, track.elon];
		bounds.push(startLatLon, endLatLon);

		const polyline = L.polyline([startLatLon, endLatLon], {
			color: getMagnitudeColor(track.mag),
			weight: 4,
		}).addTo(tracksLayer);
		polyline.bindPopup(`<div>
    <strong>Tornado #${track.om}</strong><br>
    Rating: EF${track.mag}<br>
    Date: ${track.date} at ${track.time}<br>
    Fatalities: ${track.fat}<br>
    Injuries: ${track.inj}<br>
    Distance: ${track.len} mi.<br>
    Max Width: ${track.wid} yds.
</div>
`);
	});

	if (bounds.length > 0) {
		// Use bounds to fit map view
		map.fitBounds(bounds);
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
</script>
