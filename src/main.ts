import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "./style.css";

// Leaflet icon fix
import { Icon } from "leaflet/";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon path issues
Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("./assets/images/marker-icon-2x.png", import.meta.url)
    .href,
  iconUrl: new URL("./assets/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("./assets/images/marker-shadow.png", import.meta.url).href,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
