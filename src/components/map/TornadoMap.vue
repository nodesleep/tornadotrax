<template>
  <div class="h-full w-full relative" ref="mapContainer">
    <div
      class="absolute top-4 left-4 z-[1000] bg-white rounded-md shadow-md p-3 text-sm"
    >
      <div class="font-semibold mb-2">Tornado Magnitude</div>
      <div
        v-for="mag in magnitudes"
        :key="mag.value"
        class="flex items-center mb-1"
      >
        <span
          class="inline-block w-4 h-4 rounded-full mr-2"
          :style="{ backgroundColor: getMagnitudeColor(mag.value) }"
        ></span>
        <span>{{ mag.label }}</span>
      </div>
    </div>

    <div
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-[999]"
    >
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"
        ></div>
        <p class="mt-2 text-primary-600">Updating map...</p>
      </div>
    </div>
  </div>
</template>

<script>
// Using plain JavaScript to avoid TypeScript issues completely
import { ref, onMounted, onUnmounted, watch } from "vue";
import L from "leaflet";
import "leaflet.heat";
import { MAGNITUDE_SCALE } from "../../types/tornado";

export default {
  name: "TornadoMap",
  props: {
    tornadoPoints: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showHeatmap: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["map-loaded"],
  setup(props, { emit }) {
    const mapContainer = ref(null);
    const map = ref(null);
    const markersLayer = ref(null);
    const heatmapLayer = ref(null);

    const magnitudes = MAGNITUDE_SCALE;

    function getMagnitudeColor(magnitude) {
      const magNum = parseInt(magnitude);

      if (isNaN(magNum)) {
        return "#94a3b8"; // gray-400
      }

      switch (magNum) {
        case 0:
          return "#94a3b8"; // gray-400
        case 1:
          return "#4ade80"; // green-400
        case 2:
          return "#facc15"; // yellow-400
        case 3:
          return "#fb923c"; // orange-400
        case 4:
          return "#ef4444"; // red-500
        case 5:
          return "#a855f7"; // purple-500
        default:
          return "#94a3b8"; // gray-400
      }
    }

    function initializeMap() {
      if (!mapContainer.value) return;

      // Default to US center if no points
      const defaultCenter = [39.8283, -98.5795];
      const defaultZoom = 4;

      // Create the map
      map.value = L.map(mapContainer.value).setView(defaultCenter, defaultZoom);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.value);

      // Create layers for markers and heatmap
      markersLayer.value = L.layerGroup().addTo(map.value);

      // Notify parent that map is loaded
      emit("map-loaded");
    }

    function updateMarkers() {
      if (!map.value || !markersLayer.value) return;

      // Clear existing markers
      markersLayer.value.clearLayers();

      // Add tornado markers
      props.tornadoPoints.forEach((point) => {
        const marker = L.circleMarker([point.lat, point.lng], {
          radius: 6,
          fillColor: getMagnitudeColor(point.magnitude),
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });

        // Add popup
        marker.bindPopup(`
          <div class="tornado-popup">
            <div class="font-semibold">${point.date} - ${point.state}</div>
            <div>Magnitude: EF${point.magnitude}/F${point.magnitude}</div>
            <div>Injuries: ${point.injuries || "0"}</div>
            <div>Fatalities: ${point.fatalities || "0"}</div>
            ${
              point.length
                ? `<div>Path Length: ${point.length} miles</div>`
                : ""
            }
            ${point.width ? `<div>Path Width: ${point.width} yards</div>` : ""}
          </div>
        `);

        marker.addTo(markersLayer.value);
      });

      // Fit bounds if we have points
      if (props.tornadoPoints.length > 0) {
        const latLngs = props.tornadoPoints.map((point) => [
          point.lat,
          point.lng,
        ]);
        map.value.fitBounds(latLngs);
      }
    }

    function updateHeatmap() {
      if (!map.value) return;

      // Remove existing heatmap layer
      if (heatmapLayer.value) {
        map.value.removeLayer(heatmapLayer.value);
        heatmapLayer.value = null;
      }

      // Add heatmap if enabled and we have points
      if (props.showHeatmap && props.tornadoPoints.length > 0) {
        const heatData = props.tornadoPoints.map((point) => {
          // Intensity based on magnitude (0-5)
          const intensity = Math.min(parseInt(point.magnitude) || 0, 5) / 5;
          return [point.lat, point.lng, intensity * 0.8 + 0.2]; // Scale 0.2-1.0
        });

        // Create and add the heat layer
        heatmapLayer.value = L.heatLayer(heatData, {
          radius: 20,
          blur: 15,
          maxZoom: 10,
          max: 1.0,
          gradient: {
            0.2: "#94a3b8", // gray-400
            0.4: "#4ade80", // green-400
            0.6: "#facc15", // yellow-400
            0.8: "#fb923c", // orange-400
            1.0: "#ef4444", // red-500
          },
        });

        heatmapLayer.value.addTo(map.value);
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      initializeMap();
      updateMarkers();
      updateHeatmap();
    });

    onUnmounted(() => {
      if (map.value) {
        map.value.remove();
      }
    });

    // Watch for changes
    watch(
      () => props.tornadoPoints,
      () => {
        updateMarkers();
        updateHeatmap();
      },
      { deep: true }
    );

    watch(
      () => props.showHeatmap,
      () => {
        updateHeatmap();
      }
    );

    return {
      mapContainer,
      magnitudes,
      getMagnitudeColor,
    };
  },
};
</script>

<style>
.tornado-popup {
  min-width: 150px;
}
</style>
