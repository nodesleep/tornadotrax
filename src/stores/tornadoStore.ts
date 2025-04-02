import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { tornadoApi } from "@/services/tornadoApi";
import type {
  Tornado,
  TornadoQueryParams,
  TornadoMapPoint,
} from "@/types/tornado";

export const useTornadoStore = defineStore("tornado", () => {
  // State
  const tornadoes = ref<Tornado[]>([]);
  const totalEntries = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastQueryParams = ref<TornadoQueryParams>({});

  // Computed properties
  const tornadoMapPoints = computed((): TornadoMapPoint[] => {
    return tornadoes.value
      .filter(
        (t) =>
          t.slat &&
          t.slon &&
          !isNaN(parseFloat(t.slat)) &&
          !isNaN(parseFloat(t.slon))
      )
      .map((t) => ({
        id: t.id,
        lat: parseFloat(t.slat),
        lng: parseFloat(t.slon),
        magnitude: t.mag,
        date: t.date,
        state: t.st,
        injuries: t.inj,
        fatalities: t.fat,
        length: t.len,
        width: t.wid,
      }));
  });

  const tornadoesByMagnitude = computed(() => {
    const countByMag: Record<string, number> = {};

    tornadoes.value.forEach((tornado) => {
      const mag = tornado.mag || "Unknown";
      countByMag[mag] = (countByMag[mag] || 0) + 1;
    });

    return Object.entries(countByMag)
      .map(([magnitude, count]) => ({ magnitude, count }))
      .sort((a, b) => Number(a.magnitude) - Number(b.magnitude));
  });

  const tornadoesByState = computed(() => {
    const countByState: Record<string, number> = {};

    tornadoes.value.forEach((tornado) => {
      const state = tornado.st || "Unknown";
      countByState[state] = (countByState[state] || 0) + 1;
    });

    return Object.entries(countByState)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);
  });

  const tornadoesByYear = computed(() => {
    const countByYear: Record<string, number> = {};

    tornadoes.value.forEach((tornado) => {
      const year = tornado.yr || "Unknown";
      countByYear[year] = (countByYear[year] || 0) + 1;
    });

    return Object.entries(countByYear)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  });

  // Actions
  async function fetchTornadoes(params: TornadoQueryParams = {}) {
    isLoading.value = true;
    error.value = null;
    lastQueryParams.value = params;

    try {
      const response = await tornadoApi.getTornadoData(params);
      tornadoes.value = response.data;
      totalEntries.value = response.total_entries;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "An error occurred fetching tornado data";
      console.error("Error in fetchTornadoes:", err);
    } finally {
      isLoading.value = false;
    }
  }

  function resetFilters() {
    lastQueryParams.value = {};
  }

  return {
    // State
    tornadoes,
    totalEntries,
    isLoading,
    error,
    lastQueryParams,

    // Computed
    tornadoMapPoints,
    tornadoesByMagnitude,
    tornadoesByState,
    tornadoesByYear,

    // Actions
    fetchTornadoes,
    resetFilters,
  };
});
