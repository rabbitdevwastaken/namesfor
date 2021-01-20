import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Store from "./store";
import vuetify from './plugins/vuetify';
import VueGtag from "vue-gtag";

Vue.use(VueGtag, {
  config: { id: 'G-Y2MDXFL7YM' }
});

Vue.config.productionTip = false

const store = Store();

const app = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

window.app = app;

export { store, app };