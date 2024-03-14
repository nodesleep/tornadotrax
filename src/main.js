import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // Import the router

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { GiTornado, RiSunFill, RiMoonFill } from 'oh-vue-icons/icons';

addIcons(GiTornado, RiSunFill, RiMoonFill);

const app = createApp(App);
app.use(router);
app.component('v-icon', OhVueIcon);
app.mount('#app');
