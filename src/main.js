import Vue from 'vue';
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import VueEditableGrid from 'vue-editable-grid'

import App from './components/AppComponent'
import Dashboard from './components/DashboardComponent';
import About from './components/AboutComponent';
import Login from './components/LoginComponent';
import Table from './components/TableComponent';
import authService from './services/auth.service';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);



function requireAuth (to, from, next) {
  if (!authService.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Table },
    { path: '/about', component: About },
    { path: '/dashboard', component: Dashboard, beforeEnter: requireAuth },
    { path: '/login', component: Login,
      beforeEnter(to, from, next) {
        if (authService.loggedIn()) {
          next('/dashboard')
        } else next()
      }
    },
    { path: '/logout',
      beforeEnter (to, from, next) {
        authService.logout(); //Log out
        next('/');
        window.location.reload()
      }
    }
  ]
});

new Vue({
  el: "#app",
  router,

  render: h => h(App)
});
