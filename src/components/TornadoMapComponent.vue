<template>
    <div ref="mapContainer" class="h-[60vh] w-[40vw]"></div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from 'vue';
import states from '../data/states.json';
import L from 'leaflet';

const { selectedState, tornadoTracks } = defineProps(['selectedState', 'tornadoTracks']);

const mapContainer = ref(null);

const stateCenters = states;

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
        const map = L.map(mapContainer.value).setView(getStateCenter(selectedState), 7);

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

        // Map magnitude to color gradient
        const color = getMagnitudeColor(track.mag);

        // Add a polyline to represent the tornado track
        const polyline = L.polyline([startLatLon, endLatLon], {
            color,
        }).addTo(map);
    });
};

// Function to map magnitude to color gradient
const getMagnitudeColor = (magnitude) => {
    // Use a color gradient from cool to warm based on magnitude
    const colorGradient = [
        '#4CAF50', // Green
        '#FFC107', // Amber
        '#FF9800', // Orange
        '#FF5722', // Deep Orange
        '#E91E63', // Pink
        '#9C27B0', // Purple
    ];

    // Map magnitude (0 to 5) to index in color gradient array
    const index = Math.round((magnitude / 5) * (colorGradient.length - 1));

    // Return the corresponding color
    return colorGradient[index];
};

const getStateCenter = (state) => {
    // Lookup center coordinates based on the selected state
    return stateCenters[state] || [0, 0]; // Default to center if state not found
};
</script>
