<template>
    <div class="container h-100">
        <div class="row h-100 justify-content-center align-items-center">
            <b-card class="userInfoCard" title="Card title" sub-title="Card subtitle">
                <b-container class="bv-example-row">
                    <b-row>
                        <b-col>Username</b-col>
                        <b-col>{{user ? user.username : 'Null'}}</b-col>
                    </b-row>
                    <b-row>
                        <b-col>Roles</b-col>
                        <b-col>{{user ? user.roles.toString() : 'Null'}}</b-col>
                    </b-row>
                    <b-row>
                        <b-col>AccessToken</b-col>
                        <b-col style="font-size:14px">{{user && showToken  ? user.accessToken : 'Null'}}</b-col>
                    </b-row>
                </b-container>
            </b-card>
        </div>
    </div>
</template>
<style scoped>
    .userInfoCard {
        margin-top: 10%;
        height: 200%;
    }
</style>
<script>
    import authService from '../services/auth.service'
    export default {
        data() {
            return {
                user: authService.getCurrentUser(),
                showToken: true
            }
        }
    }
</script>