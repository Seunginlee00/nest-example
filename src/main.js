import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@assets/scss/style.scss';

import './assets/index.css'; // 기존 index.css
import './assets/App.css'; // 기존 App.css

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
