import { createApp } from 'vue';
import 'vue-sonner/style.css';
import App from './App.vue';
import './style.css';

import { vueQueryPlugin } from './core/plugins/vue-query.plugin';
import { router } from './core/routes';

const app = createApp(App);

app.use(router);
app.use(vueQueryPlugin);

app.mount('#app');
