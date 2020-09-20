<template>
    <div class="container h-100">
        <b-form @submit.prevent="" @submit="login" @reset="onReset" class="row h-100 justify-content-center align-items-center">
                <b-form-group class="loginForm mobileStyle">
                    <b-form-input
                            class="formInputs w-auto"
                            v-model="username"
                            type="text"
                            required
                            placeholder="Username"
                    ></b-form-input>
                    <b-form-input
                            class="formInputs w-auto"
                            v-model="password"
                            type="password"
                            required
                            placeholder="Password"
                    ></b-form-input>
                    <div v-if="error" class="alert alert-danger ml-2 w-100" role="alert">
                        Nepareizi pieslēgšanās dati!
                    </div>
                    <b-button class="formInputs" type="submit" variant="primary">Pieslēgties</b-button>
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
                await authService.login(this.username, this.password, (loggedIn, error) => {
                    if (!loggedIn) {
                        this.error = true;
                        console.log(error);
                        this.onReset();
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
    @media screen and (max-width: 321px) {
        .mobileStyle {margin-right:40%;}
    }
</style>