<template>
    <div class="tableClass overflow-auto resize-handle">
        <!--Print header-->
        <b-card v-if="printView">
            <h1>Test print</h1>
            <p>Test 123 123 123
                Test123 123 123
            </p>
        </b-card>
        <form v-if="!printView" class="form-inline mt-1 mb-1">
            <!--Save/Print table-->
            <b-form-checkbox id="checkAll" class="ml-3 w-20" v-if="canEdit && !printView" v-on:change="toggleAll"/>
            <b-button v-on:click="saveTableData()" class="tableButtons w-auto" v-if="canEdit" variant="primary">Saglabāt tabulu</b-button>
            <b-button v-if="canEdit && !printView" v-on:click="printTable()" class="tableButtons w-auto">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-printer" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2H5a1 1 0 0 0-1 1v2H3V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h-1V3a1 1 0 0 0-1-1zm3 4H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v1H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z"/>
                    <path fill-rule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM5 8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5z"/>
                    <path d="M3 7.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                </svg>
            </b-button>

            <!--Search fields-->
            <b-input v-on:keydown.enter.prevent=""  v-model="keyword" placeholder="Meklēt..." class="tableSearch ml-2"></b-input>

            <!--Select table-->
            <b-form-select v-model="selectedTableID" class="ml-2 col-auto" v-on:change="updateTable">
                <b-form-select-option :value="null" v-if="!selectedTableID">Izvēlieties sportistu grupu</b-form-select-option>
                <b-form-select-option value="0">Vīrieši</b-form-select-option>
                <b-form-select-option value="1">Sievietes</b-form-select-option>
            </b-form-select>

            <!--Select run-->
            <b-form-select v-model="selectedRunNr" class="ml-2 col-auto" v-on:change="updateTable">
                <b-form-select-option :value="null" v-if="!selectedRunNr">Izvēlieties skrējienu</b-form-select-option>
                <b-form-select-option value="0">Visi skrējieni</b-form-select-option>
                <b-form-select-option v-for="index in 10" :key="index" :value="index">{{ index }} Skrējiens</b-form-select-option>
            </b-form-select>
        </form>
        <b-table striped hover class="container-fluid" @sort-changed="sortingChanged" :no-sort-reset="true" :no-local-sorting="true" :items="getItems()" :busy="isBusy" :fields="fields" :per-page="maxPerPage" :current-page="currentPage" responsive="sm">
            <!--Table input-->
            <template v-if="canEdit && isAdmin && !printView" v-slot:cell(checked)="row">
                <b-form-checkbox-group>
                    <b-form-checkbox v-model="selected" :value="row.item.id" class="w-auto mt-2 ml-1 mr-auto"/>
                </b-form-checkbox-group>
            </template>
            <template v-if="canEdit && !printView" v-slot:cell(name)="row">
                <b-form-input v-model="row.item.name"/>
            </template>
            <template v-if="canEdit && !printView" v-slot:cell(schoolID)="row">
                <b-form-select v-model="row.item.schoolID">
                    <b-form-select-option v-for="school in schoolNames" :key="school.schoolID" :value="school.schoolID">{{school.name}}</b-form-select-option>
                </b-form-select>
            </template>
            <template v-if="canEdit && !printView" v-slot:cell(year)="row">
                <b-form-input type="number" min="1900" max="2100" step="1" v-model="row.item.year"/>
            </template>
            <template v-if="canEdit && !printView" v-slot:cell(runNr)="row">
                <b-form-input type="number" v-model="row.item.runNr"/>
            </template>
            <template v-if="canEdit && !printView" v-slot:cell(athleteNr)="row">
                <b-form-input type="number" v-model="row.item.athleteNr"/>
            </template>
            <template v-if="canEdit && !printView" v-slot:cell(result)="row">
<!--                <b-form-input type="text" v-model="row.item.result" maxlength="8" @input="formatResultTime(row.index)"/>-->
                <the-mask type="text" :masked="true" class="form-control rounded" v-model="row.item.result" mask="##:##.##"/>
            </template>
            <!--Table busy animation-->
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>
        <b-form v-if="canEdit && !printView && selectedTableID && selectedRunNr">
            <div class="form-row row-md-3">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <button v-on:click="insertRow" class="btn btn-outline-secondary ml-3" type="button">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </button>
                    </div>
                    <b-input v-bind:class="invalidInsertInput && !rowData.name ? 'is-invalid' : ''" v-model="rowData.name" type="text" class="form-control rounded ml-1" placeholder="Vārds uzvārds" aria-label=""/>
                    <b-form-select v-model="rowData.schoolID">
                        <b-form-select-option v-bind:class="invalidInsertInput && !rowData.schoolID ? 'is-invalid' : ''" v-for="school in schoolNames" :key="school.schoolID" :value="school.schoolID">{{school.name}}</b-form-select-option>
                    </b-form-select>
                    <b-input v-bind:class="invalidInsertInput && !rowData.year || invalidInsertInput && (rowData.year < 1900 || rowData.year > 2100) ? 'is-invalid' : ''" type="number" min="1900" max="2100" step="1" v-model="rowData.year" class="form-control rounded ml-1" placeholder="Dzimšanas gads" aria-label=""/>
                    <b-input v-bind:class="invalidInsertInput && !rowData.runNr ? 'is-invalid' : ''" v-model="rowData.runNr" type="number" class="form-control rounded ml-1" placeholder="Skrējiena Nr" aria-label=""/>
                    <b-input v-bind:class="invalidInsertInput && !rowData.athleteNr ? 'is-invalid' : ''" v-model="rowData.athleteNr" type="number" class="form-control rounded ml-1" placeholder="Sportista Nr" aria-label=""/>
                    <the-mask type="text" :masked="true" class="form-control rounded ml-1 mr-3" v-model="rowData.result" mask="##:##.##" placeholder="Rezultāts"/>
                </div>
            </div>
        </b-form>
        <div class="d-inline-flex row">
            <b-pagination
                    responsive="sm"
                    v-if="!printView"
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="maxPerPage"
                    aria-controls="my-table"
                    class="ml-4"
            ></b-pagination>
            <b-form-select v-model="maxPerPage" v-if="!printView" class="ml-2 w-auto">
                <b-form-select-option :value="10">10</b-form-select-option>
                <b-form-select-option :value=25>25</b-form-select-option>
                <b-form-select-option :value="100">100</b-form-select-option>
                <b-form-select-option :value="rows">Visi</b-form-select-option>
            </b-form-select>
            <b-button class="ml-2 h-50" v-if="selected.length > 0" v-on:click="deleteTableData">Delete selected!</b-button>
        </div>
    </div>
</template>

<script>
import userService from '../services/user.service'
import authService from '../services/auth.service';
import utils from "../utils/utils";

export default {
        data() {
            return {
                // Search keyword
                keyword: '',
                // Table columns
                fields: [
                    {key: 'name', sortable: true, label: 'Vārds uzvārds'},
                    {key: 'schoolID', sortable: true, label: 'Skola',
                        formatter: (value) => {
                            // Filter schoolID in school list
                            let school = this.schoolNames.filter(item => item.schoolID === value)[0];
                            // If school has been found return school name otherwise return empty
                            return school ? school.name : '';
                        }
                    },
                    {key: 'year', sortable: true, label: 'Dzim. Gads'},
                    {key: 'runNr', sortable: true, label: 'Skrējiens'},
                    {key: 'athleteNr', sortable: true, label: 'Sportists'},
                    {key: 'result', sortable: true, label: 'Rezultāts'}
                ],
                // Current data input on data insertion row
                rowData: {
                    'name': '',
                    'schoolID': '',
                    'runNr': '',
                    'year': '',
                    'athleteNr': '',
                    'result': ''
                },

                // Table data
                data: [],

                // Is table busy dealing with requests
                isBusy: false,

                // Hide ui for print view
                printView: false,

                // Can user edit
                canEdit: false,

                // User has admin permissions
                isAdmin: false,

                // Selected table and run number
                selectedTableID: null,
                selectedRunNr: null,

                // Selected rows for deletion
                selected: [],

                // Additional beautification of row inputs
                invalidInsertInput: false,

                // Current table page and max rows per page
                currentPage: 1,
                maxPerPage: 10,

                // Array of school names for combobox
                schoolNames: []
            };
        },
        beforeMount() {
            // Setup table permissions
            let user = authService.getCurrentUser();
            if (user) {
                this.isAdmin = authService.getIsAdmin();
                this.canEdit = authService.getCanEdit();
                this.fields.unshift({key: 'checked', label: '', sortable: false})
            }
            // Prevent printing...
            window.onbeforeprint = function() {
                if (!authService.getCanEdit()) {
                    this.window.location.reload()
                }
            }
        },
        computed: {
            // Get number of rows
            rows() {
                return this.data.length;
            }
        },
        methods: {
            formatTableData(tableData, forSaving) {
                // parse result to time
                return tableData.map(item => {
                  this.formatTableRow(item, forSaving)
                  return item;
                });
            },
            formatTableRow(row, forSaving) {
                row.result = forSaving ? utils.toMilliseconds(row.result) : utils.fromMilliseconds(parseInt(row.result));
                row.runNr = forSaving && isNaN(row.runNr) ? 1 : row.runNr;
                return row;
            },
            async saveTableData() {
                this.isBusy = true;
                if (this.data) {
                    await userService.setTableData(this.formatTableData(this.data, true), authService.getToken())
                      .then(response => {
                          console.log(`RESPONSE: ${response.data.message}`)
                          this.data = this.formatTableData(this.data, false)
                          this.isBusy = false;
                      })
                      .catch(err => {
                          console.log(err)
                          this.isBusy = false;
                      })
                    this.isBusy = false;
                } else this.isBusy = false;
            },
            async deleteTableData() {
                this.isBusy = true;
                if (this.selected.length > 0) {
                  await userService.deleteTableData(this.selected, authService.getToken())
                    .then(response => {
                        if (response.data.fulfilled)
                          document.getElementById("checkAll").checked = false;
                        console.log(`RESPONSE: ${response.data.message}`)
                        this.isBusy = false;
                        this.getTableData();
                    })
                    .catch(err => {
                        console.log(`ERROR: ${err.data.message}`)
                        this.isBusy = false;
                    })
                } else this.isBusy = false;
            },
            printTable() {
                console.log(this.selected);
                this.printView = true;
                setTimeout(print, 1);
                window.onafterprint = function() {
                    window.location.reload()
                }
            },
            updateTable() {
                if (this.selectedTableID && this.selectedRunNr) {
                    this.keyword = '';
                    this.getTableData();
                }
            },
            toggleAll(checked) {
                this.selected = checked ? this.data.map(item => item.id) : [];
            },
            insertRow() {
                if (this.rowData.athleteNr && this.rowData.schoolID && this.rowData.name && this.rowData.year && this.rowData.runNr) {
                    // Add a flag to determine if row is newly added
                    this.insertTableData(this.rowData);
                    // Reset
                    this.invalidInsertInput = false;
                    this.rowData = {};
                } else this.invalidInsertInput = true;
            },
            async insertTableData(row) {
              this.isBusy = true;
              if (row) {
                await userService.insertTableData(this.formatTableRow(row, true), authService.getToken(), this.selectedTableID)
                    .then(response => {
                      console.log(`RESPONSE: ${response.data.message}`)
                      if (response.data.fulfilled) {
                        this.updateTable()
                        this.isBusy = false;
                      }
                    })
                    .catch(err => {
                      console.log(`RESPONSE: ${err.data.message}`)
                      this.isBusy = false;
                    })
              } else this.isBusy = false;
            },
            async getSchools() {
              this.isBusy = true;
              await userService.getSchools()
                  .then(response => {
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
            async getTableData () {
              this.isBusy = true;
              await userService.getTableData(this.selectedRunNr, this.selectedTableID)
                  .then(response => {
                    if (response.data.fulfilled) {
                      this.data = this.formatTableData(response.data.data, false);
                      console.log(`RESPONSE: ${response.data.message}`)
                      this.getSchools();
                    }
                  })
                  .catch(err => {
                    console.log(`RESPONSE: ${err.data.message}`)
                    this.isBusy = false;
                  })
            },
            sortingChanged(ctx) {
              this.data = utils.sortTable(ctx, this.data, this.schoolNames);
            },
            // Filter rows
            getItems() {
              return this.keyword ? this.data.filter(item =>
                  this.filterSchools(item, this.keyword.toLowerCase()) || item.runNr.toString().toLowerCase().includes(this.keyword.toLowerCase()) || item.name.toString().toLowerCase().includes(this.keyword.toLowerCase())
              ) : this.data;
            },
            filterSchools(item, keyword) {
              if (item) {
                // Filter schools by row's school column
                let _school = this.schoolNames.filter(school => school.schoolID === item.schoolID)[0];
                // If school has been found, then check if it includes keyword else return false
                return _school ? _school.name.toString().toLowerCase().includes(keyword) : false;
              } else return false;
            }
        }
    };
</script>

<style scoped>
    .tableClass {
        background: white;
        height: 100%;
    }
    .tableButtons {
        width: 10%;
        margin-left: 0.5%;
    }
    .tableSearch {
        margin-left: 0.5%;
        width: 78%;
    }
</style>