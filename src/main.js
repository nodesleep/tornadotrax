import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { GiTornado } from 'oh-vue-icons/icons';

addIcons(GiTornado);

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.mount('#app');
