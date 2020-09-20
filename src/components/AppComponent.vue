<template>
    <div id="app">
        <div>
            <b-navbar toggleable="lg" type="dark" variant="info">
                <b-navbar-brand to="/">Sākumlapa</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/about" disabled>Par mājaslapu</b-nav-item>
                        <b-nav-item-dropdown right v-if="loggedIn">
                            <template v-slot:button-content>
                                <em>User</em>
                            </template>
                            <b-dropdown-item to="/dashboard">Kontroles Panelis</b-dropdown-item>
                            <b-dropdown-item to="/logout">Izrakstīties</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item to="/login" v-if="!loggedIn">Pieslēgties</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
        <template class="jumbotron" v-if="$route.matched.length">
            <router-view></router-view>
        </template>
    </div>
</template>


<script>
    import authService from '../services/auth.service'

    export default {
        data () {
            return {
                loggedIn: authService.loggedIn()
            }
        },
        created () {
            authService.onLogin = loggedIn => {
                this.loggedIn = loggedIn
            }
        }
    }
</script>
