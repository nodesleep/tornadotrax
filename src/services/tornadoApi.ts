import axios from "axios";
import type {
  TornadoQueryParams,
  TornadoResponse,
  Tornado,
} from "@/types/tornado";

// Create axios instance with base URL and default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log which API URL is being used (only in development)
if (import.meta.env.DEV) {
  console.log(`API URL: ${apiClient.defaults.baseURL}`);
}

// Add request interceptor for cross-environment handling
apiClient.interceptors.request.use((config) => {
  // You can add environment-specific logic here if needed
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different errors based on environment
    if (import.meta.env.DEV) {
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  }
);

export const tornadoApi = {
  /**
   * Fetches tornado data based on provided query parameters
   */
  async getTornadoData(params: TornadoQueryParams): Promise<TornadoResponse> {
    try {
      const response = await apiClient.post("/tornado", params);
      return response.data;
    } catch (error) {
      console.error("Error fetching tornado data:", error);
      throw error;
    }
  },

  /**
   * Gets a summary of all available years in the database
   */
  async getYearsSummary(): Promise<{ year: string; count: number }[]> {
    try {
      const response = await apiClient.post("/tornado", {});
      const data: Tornado[] = response.data.data;

      // Group by year and count occurrences
      const yearCounts = data.reduce((acc, tornado) => {
        const year = tornado.yr;
        if (!acc[year]) {
          acc[year] = 0;
        }
        acc[year]++;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array of objects
      return Object.entries(yearCounts)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } catch (error) {
      console.error("Error fetching years summary:", error);
      throw error;
    }
  },

  /**
   * Gets a summary of states with most tornado activity
   */
  async getStatesSummary(): Promise<{ state: string; count: number }[]> {
    try {
      const response = await apiClient.post("/tornado", {});
      const data: Tornado[] = response.data.data;

      // Group by state and count occurrences
      const stateCounts = data.reduce((acc, tornado) => {
        const state = tornado.st;
        if (!acc[state]) {
          acc[state] = 0;
        }
        acc[state]++;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array of objects and sort by count (descending)
      return Object.entries(stateCounts)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error fetching states summary:", error);
      throw error;
    }
  },

  /**
   * Gets a summary of tornado magnitudes
   */
  async getMagnitudeSummary(): Promise<{ magnitude: string; count: number }[]> {
    try {
      const response = await apiClient.post("/tornado", {});
      const data: Tornado[] = response.data.data;

      // Group by magnitude and count occurrences
      const magCounts = data.reduce((acc, tornado) => {
        const mag = tornado.mag;
        if (!acc[mag]) {
          acc[mag] = 0;
        }
        acc[mag]++;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array of objects and sort by magnitude (ascending)
      return Object.entries(magCounts)
        .map(([magnitude, count]) => ({ magnitude, count }))
        .sort((a, b) => parseInt(a.magnitude) - parseInt(b.magnitude));
    } catch (error) {
      console.error("Error fetching magnitude summary:", error);
      throw error;
    }
  },
};
