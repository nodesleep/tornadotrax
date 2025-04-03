<template>
  <div>
    <div class="mb-6">
      <h1>About TornadoTrax</h1>
      <p class="text-primary-600">
        Learn about the TornadoTrax project, our data sources, and how to use
        the platform.
      </p>
    </div>

    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Project Overview</h2>
      <p class="mb-4">
        TornadoTrax is a comprehensive tornado data visualization and analysis
        platform designed for researchers, meteorologists, and weather
        enthusiasts. The application provides interactive maps, detailed data
        tables, and powerful analysis tools to explore tornado events across the
        United States.
      </p>
      <p>
        Our goal is to make historical tornado data more accessible and easier
        to analyze, providing insights into patterns, trends, and
        characteristics of tornado occurrences.
      </p>
    </div>

    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Data Sources</h2>
      <p class="mb-4">
        TornadoTrax utilizes data from the following primary sources:
      </p>

      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>
          <span class="font-medium">NOAA Storm Events Database</span>
          <p class="text-primary-600">
            Comprehensive records of storm events in the United States,
            including detailed information about tornado occurrences, paths, and
            impacts.
          </p>
        </li>
        <li>
          <span class="font-medium">NOAA Storm Prediction Center (SPC)</span>
          <p class="text-primary-600">
            Historical tornado data sourced from the SPC's raw database dump
            including all tornadoes from 1950-2023. Found
            <a
              href="https://www.spc.noaa.gov/wcm/data/1950-2023_all_tornadoes.csv"
              target="_blank"
              class="text-blue-500 underline"
              >here</a
            >.
          </p>
        </li>
      </ul>

      <p>
        All data is regularly updated to include the most recent tornado events
        as they become available from official sources.
      </p>
    </div>

    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Using TornadoTrax</h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium mb-2">Interactive Map</h3>
          <p class="text-primary-600">
            The Map view displays tornado occurrences geographically. You can
            filter by year, state, magnitude, and other criteria. Toggle the
            heatmap view to see tornado density patterns.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">Data Explorer</h3>
          <p class="text-primary-600">
            The Data view allows you to search and filter tornado records with
            precise criteria. Results can be viewed in a table and exported for
            further analysis.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">Analysis Tools</h3>
          <p class="text-primary-600">
            The Analysis view provides visualizations and statistics about
            tornado patterns, trends over time, and geographical distribution.
            Compare tornado characteristics across different time periods and
            regions.
          </p>
        </div>
      </div>
    </div>

    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Technology Stack</h2>
      <p class="mb-4">TornadoTrax is built with modern web technologies:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-medium mb-2">Frontend</h3>
          <ul class="list-disc pl-6 space-y-1">
            <li>Vue 3 with Composition API and TypeScript</li>
            <li>Tailwind CSS for styling</li>
            <li>Leaflet.js for interactive mapping</li>
            <li>Chart.js for data visualization</li>
            <li>Pinia for state management</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">Backend</h3>
          <ul class="list-disc pl-6 space-y-1">
            <li>Express.js server</li>
            <li>SQLite database for data storage</li>
            <li>Node.js for server-side operations</li>
            <li>RESTful API architecture</li>
            <li>Data processing and analysis utilities</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

// Form state
const form = reactive({
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const formSubmitted = ref(false);

// Submit form handler
function submitForm() {
  isSubmitting.value = true;

  // Simulate API call
  setTimeout(() => {
    // Reset form
    form.email = "";
    form.subject = "";
    form.message = "";

    // Show success message
    formSubmitted.value = true;
    isSubmitting.value = false;

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSubmitted.value = false;
    }, 5000);
  }, 1500);
}
</script>
