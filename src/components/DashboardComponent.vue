<template>
    <div id="dashboard" class="container-fluid w-75 mt-2">
        <div>
            <b-card no-body>
                <b-tabs pills card>
                    <b-tab title="Lietotāja info" active>
                        <b-card-body>
                            <!--username-->
                            <div class="row">
                                <label>Lietotājvārds: <b><em>{{userData.username}}</em></b></label>
                            </div>
                            <!--accessToken-->
                            <b-button variant="danger" class="row" v-on:click="toggleShowCode">Piekļuves kods</b-button>
                            <p class="row text-break" v-if="showCode"><b><em>{{userData.accessToken}}</em></b></p>
                            <!--roles-->
                            <label class="row">Lietotāja lomas:</label>
                            <p class="row my-1 ml-5" v-for="role in userData.roles" :key="role"><b><em>{{role}}</em></b></p>
                        </b-card-body>
                    </b-tab>
                    <b-tab title="Reģistrēt lietotāju" v-if="isAdmin">
                        <b-card-body>
                            <b-form @submit.prevent="" @submit="registerUser" @reset="onReset">
                                <div class="form-row">
                                    <label>Lietotājvārds</label>
                                    <b-form-input type="text" v-model="username"/>
                                </div>
                                <div class="form-row">
                                    <label>Parole</label>
                                    <b-form-input type="password" v-model="password"/>
                                </div>
                                <div class="row">
                                    <b-form-checkbox class="ml-2" v-for="role in availableRoles" :key="role" :value="role" v-model="selectedRoles">{{role}}</b-form-checkbox>
                                </div>
                                <div v-if="submited" v-bind:class="error ? 'alert-danger' : 'alert-success'" class="alert ml-2 w-100" role="alert">
                                    {{error ? exists ? 'Lietotājs jau eksistē' : 'Kļūme reģistrējot lietotāju' : 'Lietotājs reģistrēts'}}
                                </div>
                                <div class="form-row mt-3">
                                    <b-button variant="primary" type="submit">Reģistrēt</b-button>
                                </div>
                            </b-form>
                        </b-card-body>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>
<script>
    import authService from '../services/auth.service'

    export default {
        data() {
            return {
                userData: authService.getCurrentUser(),
                isAdmin: authService.getIsAdmin,
                showCode: false,
                submited: false,
                error: false,
                exists: false,
                username: '',
                password: '',
                availableRoles: ["USER", "MODERATOR", "ADMIN"],
                selectedRoles: []
            }
        },
        methods: {
            toggleShowCode() {
                this.showCode = !this.showCode
            },
            registerUser() {
                if (this.username && this.password) {
                    if (this.selectedRoles.length > 0) {
                        this.submited = true;
                        authService.register(this.username, this.password, this.selectedRoles, (registerSuccess, response) => {
                            if (response.status === 200) {
                                this.error = false;
                            } else if (response.status === 400 || !registerSuccess) {
                                this.exists = true;
                                this.error = true;
                            } else if (!registerSuccess) {
                                this.error = true;
                                this.exists = false;
                            }
                        })
                    } else {
                        console.log("Select atleast one role")
                    }
                }
            },
            onReset() {
                this.exists = false;
                this.error = false;
                this.submited = false;
                this.username = '';
                this.password = '';
            },
        }
    }
</script>