import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from '../components/DashboardComponent';
import About from '../components/AboutComponent';
import Login from '../components/LoginComponent';
import Table from '../components/TableComponent';
import authService from "./auth.service";

Vue.use(Router);
const publicPages = ['/login', '/about', '/'];

export const router = new Router({
    mode: 'history',
    routes: [
        {path: '/', component: Table},
        {path: '/login', component: Login},
        {path: '/dashboard', component: Dashboard},
        {path: '/about', component: About},
        {path: '/logout',
            beforeEnter (to, from, next) {
                authService.logout(); //Log out
                next('/');
                window.location.reload()
            }
        },

        {path: '*', redirect: '/'}
    ]
});

router.beforeEach((to, from, next) => {
    // Check if next page will need authentication
    const authRequired = !publicPages.includes(to.path);

    // If not logged in
    if (!authService.loggedIn() && authRequired) {
        return next('/login');
    } else next();
});