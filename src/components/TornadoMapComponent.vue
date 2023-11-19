<!-- TornadoMapComponent.vue -->

<template>
    <div ref="mapContainer" class="h-[60vh] w-full"></div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from 'vue';
import L from 'leaflet';

const { selectedState, tornadoTracks } = defineProps(['selectedState', 'tornadoTracks']);

const mapContainer = ref(null);

const stateCenters = {
    AL: [32.806671, -86.79113],
    AK: [61.016028, -149.105208],
    AZ: [33.729759, -111.431221],
    // Add more states and their center coordinates as needed
};

onMounted(() => {
    initializeMap();
});

watch([selectedState, tornadoTracks], () => {
    if (mapContainer.value) {
        initializeMap();
    }
});

const initializeMap = () => {
    if (mapContainer.value && selectedState) {
        // Initialize Leaflet map
        const map = L.map(mapContainer.value).setView(getStateCenter(selectedState), 8);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Render tornado tracks on the map
        if (tornadoTracks) {
            renderTornadoTracks(map, tornadoTracks);
        }
    } else {
        console.error('Map container not found or selectedState is not set');
    }
};

const renderTornadoTracks = (map, tracks) => {
    tracks.forEach((track) => {
        const startLatLon = [track.slat, track.slon];
        const endLatLon = [track.elat, track.elon];

        // Add markers for start and end points
        L.marker(startLatLon).addTo(map);
        L.marker(endLatLon).addTo(map);

        // Add a polyline to represent the tornado track
        const polyline = L.polyline([startLatLon, endLatLon], {
            color: 'red',
        }).addTo(map);
    });
};

const getStateCenter = (state) => {
    // Lookup center coordinates based on the selected state
    return stateCenters[state] || [0, 0]; // Default to center if state not found
};
</script>

<style scoped>
/* Add styles for the map container if needed */
</style>
