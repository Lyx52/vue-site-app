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
                    <b-tab title="Skolu izveide/dzēšana" v-on:click="getSchools">
                        <b-card-body>
                            <b-form @submit.prevent="" @submit="createSchool" @reset="schoolName = ''" class="row">
                                <b-button class="col mr-2" type="submit" variant="primary">Pievienot skolu</b-button>
                                <b-form-input maxlength="150" class="col-10 mr-2" v-model="schoolName" placeholder="Skolas nosaukums..." required/>
                            </b-form>
                            <div class="row mt-3">
                                <b-button @click="getSchools" variant="Info" class="col">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                    </svg>
                                </b-button>
                                <b-table striped hover class="container-fluid" :items="schoolNames" :busy="isBusy" :fields="fields" responsive="sm">
                                    <template v-if="isAdmin" v-slot:cell(checked)="row">
                                        <b-form-checkbox-group>
                                            <b-form-checkbox v-model="selected" :value="row.item.schoolID" class="w-auto mt-2 ml-1 mr-auto"/>
                                        </b-form-checkbox-group>
                                    </template>
                                </b-table>
                                <div class="row-2">
                                    <b-button @click="deleteSchools" variant="danger" v-if="selected.length > 0">Dzēst skolas</b-button>
                                </div>
                            </div>
                        </b-card-body>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>
<script>
    import authService from '../services/auth.service'
    import userService from '../services/user.service'
    export default {
        data() {
            return {
                fields: [
                    {key: 'schoolID', sortable: true, label: 'Skolas ID'},
                    {key: 'name', sortable: true, label: 'Skolas nosaukums'},
                ],
                userData: authService.getCurrentUser(),
                isAdmin: authService.getIsAdmin,
                showCode: false,
                submited: false,
                error: false,
                exists: false,
                username: '',
                password: '',
                availableRoles: ["USER", "MODERATOR", "ADMIN"],
                selectedRoles: [],
                schoolName: '',
                isBusy: false,
                schoolNames: [],
                selected: []
            }
        },
        beforeMount() {
            this.fields.unshift({key: 'checked', label: '', sortable: false})
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
            async getSchools() {
                this.isBusy = true;
                await userService.getSchools()
                  .then(response => {
                    console.log(response.data)
                      console.log(`RESPONSE: ${response.data.message}`)
                      if (response.data.fulfilled)
                          this.schoolNames = response.data.data;
                      this.isBusy = false;
                  })
                  .catch(err => {
                      console.log(`RESPONSE: ${err.data.message}`)
                      this.isBusy = false;
                  })
            },
            createSchool() {
                console.log(`Creating school ${this.schoolName}`);
                if (this.schoolName) {
                    userService.insertSchoolName(this.schoolName, authService.getToken())
                        .then(response => {
                            console.log(`RESPONSE: ${response.data.message}`);
                            this.getSchools()
                        })
                        .catch(err => {
                          console.log(`RESPONSE: ${err.data.message}`);
                        })
                }
                this.schoolName = '';
            },
            deleteSchools() {
                if (this.selected) {
                    userService.deleteSchools(this.selected, authService.getToken())
                        .then(response => {
                            console.log(`RESPONSE: ${response.data.message}`);
                            if (response.data.fulfilled)
                              this.getSchools();
                        })
                        .catch(err => {
                          console.log(`ERROR: ${err.data.message}`);
                        })
                }
            }
        }
    }
</script>