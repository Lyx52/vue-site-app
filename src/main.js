import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue'
import App from './components/AppComponent'
import {router} from './services/router.service';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
new Vue({
  el: "#app",
  router,

  render: h => h(App)
});
