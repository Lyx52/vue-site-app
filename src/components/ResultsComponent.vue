<template>
    <div>
        <b-jumbotron :container-fluid="true" class="m-5" bg-color="primary" text-variant="black" border-variant="dark">
            <template v-slot:header>
                <b>Skolu kopējie rezultāti</b>
            </template>
            <template v-slot:lead>
                <b-button v-if="!printView" @click="getSchoolResults" variant="primary" class="mt-2 mb-2">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                </b-button>
                <b-button v-if="!printView" v-on:click="printTable()" class="ml-2 w-auto">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-printer" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 2H5a1 1 0 0 0-1 1v2H3V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h-1V3a1 1 0 0 0-1-1zm3 4H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v1H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z"/>
                        <path fill-rule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM5 8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5z"/>
                        <path d="M3 7.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                    </svg>
                </b-button>
                <b-form-select @change="getSchoolResults" v-model="genderID" v-if="!printView" class="ml-2 w-auto">
                  <b-form-select-option :value="-1">Kopā</b-form-select-option>
                  <b-form-select-option :value=1>Sievietes</b-form-select-option>
                  <b-form-select-option :value="0">Vīrieši</b-form-select-option>
                </b-form-select>
                <b-button v-if="!printView" @click="downloadTable" class="ml-1" variant="success">Lejupielādēt MS Excel failā</b-button>
              <b-table id="resultTable" bordered hover class="bg-white border border-dark" :no-local-sorting="true" @sort-changed="sortingChanged" :items="resultTableData" :busy="isBusy" :fields="fields" :responsive="true"/>
            </template>
        </b-jumbotron>
    </div>
</template>

<script>
    import userService from '../services/user.service';
    import authService from '../services/auth.service';
    import utils from '../utils/utils'
    export default {
        name: "ResultsComponent",
        data() {
            return {
                genderID: -1,
                fields: [
                    {key: 'schoolID', sortable: true, label: "Skola",
                        formatter: (value) => {
                            // Filter schoolID in school list
                            let school = this.schoolNames.filter(item => item.schoolID === value)[0];

                            // If school has been found return school name otherwise return empty
                            return school ? school.name : '';
                        }
                    },
                    {key: 'schoolResult', sortable: true, label: 'Rezultāts',
                        formatter: (value) => {
                            return utils.fromMilliseconds(value, false);
                        }
                    },
                ],
                isBusy: false,
                printView: false,
                schoolNames: [],
                resultTableData: []
            }
        },
        beforeMount() {
            this.getSchoolResults()
        },
        methods: {
            sortingChanged(ctx) {
                this.resultTableData = utils.sortTable(ctx, this.resultTableData, this.schoolNames)
            },
            async getSchoolResults() {
                this.isBusy = true;
                await userService.getSchoolResults(this.genderID)
                    .then(response => {
                        if (response.data.fulfilled) {
                            this.resultTableData = response.data.data;
                            this.getSchools()
                        }
                        this.isBusy = false;
                    })
                    .catch(err => {
                      this.isBusy = false;
                      console.log(err)
                      console.log(`Could not fetch results!`)
                    })
            },
            async getSchools() {
              this.isBusy = true;
              await userService.getSchools()
                  .then(response => {
                    if (response.data.fulfilled)
                        this.schoolNames = response.data.data;
                    this.isBusy = false;
                  })
                  .catch(err => {
                    console.log(`RESPONSE: ${err.data.message}`)
                    this.isBusy = false;
                  })
            },
            printTable() {
                this.printView = true;
                setTimeout(print, 1);
                window.onafterprint = function() {
                    window.location.reload()
                }
            },
            downloadTable() {
                utils.downloadTable(this.genderID, 1, authService.getToken(), 'skolu_rezultati')
            }
        }
    }
</script>
