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
            Historical tornado data and GIS information, including the SPC
            Severe Weather Database.
          </p>
        </li>
        <li>
          <span class="font-medium">National Weather Service (NWS)</span>
          <p class="text-primary-600">
            Tornado reports, warnings, and meteorological data related to
            tornado events.
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

    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Contact & Feedback</h2>
      <p class="mb-4">
        We're constantly working to improve TornadoTrax and welcome your
        feedback, suggestions, and questions. Please reach out to us at:
      </p>

      <div class="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-primary-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span class="text-primary-600">contact@tornadotrax.com</span>
      </div>

      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-primary-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        <span class="text-primary-600">(555) 123-4567</span>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-medium mb-3">Report an Issue</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-primary-700 mb-1"
              >Your Email</label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input"
              placeholder="yourname@example.com"
              required
            />
          </div>

          <div>
            <label
              for="subject"
              class="block text-sm font-medium text-primary-700 mb-1"
              >Subject</label
            >
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              class="input"
              placeholder="Issue description"
              required
            />
          </div>

          <div>
            <label
              for="message"
              class="block text-sm font-medium text-primary-700 mb-1"
              >Message</label
            >
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="input"
              placeholder="Please provide details about the issue you encountered..."
              required
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <span
                v-if="isSubmitting"
                class="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"
              ></span>
              Submit
            </button>
          </div>
        </form>

        <div
          v-if="formSubmitted"
          class="mt-4 p-3 bg-green-50 text-green-700 rounded-md"
        >
          Thank you for your feedback! We'll review your report and get back to
          you soon.
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
