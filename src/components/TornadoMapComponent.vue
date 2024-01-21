<template>
    <div ref="mapContainer" class="map-component"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import states from '../data/states.json';
import L from 'leaflet';

const { selectedState, tornadoTracks, isLightMode } = defineProps(['selectedState', 'tornadoTracks', 'isLightMode']);

const mapContainer = ref(null);

const stateCenters = states;

onMounted(() => {
    initializeMap();
});

const initializeMap = () => {
    if (mapContainer.value && selectedState) {
        // Initialize Leaflet map
        const map = L.map(mapContainer.value).setView(getStateCenter(selectedState), 7);

        // Determine which Tile layer to use
        const tileLayerUrl = isLightMode
            ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
            : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

        // Add OpenStreetMap tile layer
        L.tileLayer(tileLayerUrl, {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
    const tracksLayer = L.layerGroup().addTo(map);

    tracks.forEach((track) => {
        const startLatLon = [track.slat, track.slon];
        const endLatLon = [track.elat, track.elon];

        // Map magnitude to color gradient
        const color = getMagnitudeColor(track.mag);

        // Add a polyline to represent the tornado track
        const polyline = L.polyline([startLatLon, endLatLon], {
            color,
            weight: 4,
            smoothFactor: 4,
        });

        // Create a popup for the polyline
        const popupContent = `
            <div>
                <strong>Tornado #${track.om}</strong><br>
                Rating: EF${track.mag}<br>
                Date: ${track.date} at ${track.time}<br>
                Fatalities: ${track.fat}<br>
                Injuries: ${track.inj}<br>
                Distance: ${track.len} mi.<br>
                Max Width: ${track.wid} yds.
            </div>
        `;

        // Add the popup to the polyline
        polyline.bindPopup(popupContent, {
            closeButton: true, // You can set this to true if you want a close button
        });

        // Add polyline to the layer group
        tracksLayer.addLayer(polyline);
    });
};

// Function to map magnitude to color gradient
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

const getStateCenter = (state) => {
    // Lookup center coordinates based on the selected state
    return stateCenters[state] || [0, 0];
};
</script>
