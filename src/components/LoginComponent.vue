<template>
    <div class="container h-100">
        <b-form @submit="login" @reset="onReset" class="row h-100 justify-content-center align-items-center">
                <b-form-group class="loginForm">
                    <b-form-input
                            class="formInputs"
                            id="input-1"
                            v-model="username"
                            type="text"
                            required
                            placeholder="Username"
                    ></b-form-input>
                    <b-form-input
                            class="formInputs"
                            id="input-2"
                            v-model="password"
                            type="password"
                            required
                            placeholder="Password"
                    ></b-form-input>
                    <b-button class="formInputs" type="submit" variant="primary">Login</b-button>
                </b-form-group>
        </b-form>
    </div>
</template>

<script>
    import authService from '../services/auth.service'
    export default {
        data() {
            return {
                username: '',
                password: '',
                error: false
            }
        },
        methods: {
            async login() {
                // Logging in
                await authService.login(this.username, this.password, loggedIn => {
                    if (!loggedIn) {
                        // Not logged in
                        this.error = true;
                        this.$router.replace(this.$route.query.redirect || '/login')
                    } else {
                        //Login
                        this.$router.replace(this.$route.query.redirect || '/')
                    }
                })
            },
            onReset() {
                this.username = '';
                this.password = '';
            }
        }
    }
</script>
<style>
    body {
        background: beige !important;
        min-height: 100vh;
        font-weight: 400;
    }
    .loginForm {
        width: 25%;
        margin-top: 25%;
    }
    .formInputs {
        margin: 2.5%;
    }
</style>