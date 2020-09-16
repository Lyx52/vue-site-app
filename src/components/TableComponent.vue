<template>
    <div class="tableClass">
        <b-card v-if="printView">
            <h1>Test print</h1>
            <p>Test 123 123 123
                Test123 123 123
            </p>
        </b-card>
        <form v-if="!printView" class="form-inline mt-1 mb-1">
            <b-button v-on:click="saveTableData()" class="tableButtons" v-if="canEdit">Save table</b-button>
            <b-button v-on:click="printTable()" class="tableButtons">Print table</b-button>
            <b-form-input v-model="keyword" placeholder="Search" class="tableSearch"></b-form-input>
            <label class="ml-2">Table:</label>
            <b-form-select v-model="selectedTableID" class="ml-2" v-on:change="updateTable">
                <b-form-select-option :value="null" v-if="!selectedTableID">Please select an option</b-form-select-option>
                <b-form-select-option value="0">Male athletes</b-form-select-option>
                <b-form-select-option value="1">Female athletes</b-form-select-option>
            </b-form-select>
            <label class="ml-2">Run Nr:</label>
            <b-form-select v-model="selectedRunNr" class="ml-2" v-on:change="updateTable">
                <b-form-select-option :value="null" v-if="!selectedRunNr">Please select an option</b-form-select-option>
                <b-form-select-option value="0">Get all runs</b-form-select-option>
                <b-form-select-option value="1">Run Nr 1</b-form-select-option>
                <b-form-select-option value="2">Run Nr 2</b-form-select-option>
                <b-form-select-option value="3">Run Nr 3</b-form-select-option>
                <b-form-select-option value="4">Run Nr 4</b-form-select-option>
                <b-form-select-option value="5">Run Nr 5</b-form-select-option>
                <b-form-select-option value="6">Run Nr 6</b-form-select-option>
                <b-form-select-option value="7">Run Nr 7</b-form-select-option>
                <b-form-select-option value="8">Run Nr 8</b-form-select-option>
                <b-form-select-option value="9">Run Nr 9</b-form-select-option>
                <b-form-select-option value="10">Run Nr 10</b-form-select-option>
            </b-form-select>
        </form>
        <b-table striped hover :items="getItems" :busy="isBusy" :fields="fields">
            <template v-if="canEdit && !printView" v-slot:cell(result)="row">
                <b-form-input v-model="row.item.result"/>
            </template>
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>
    </div>
</template>

<style scoped>
    .tableClass {
        background: white;
        height: 100%;
    }
</style>

<script>
    import {userApiRequest} from '@/services/user.service'
    import authService from '../services/auth.service';
    let tableData = null;
    export default {
        data() {
            return {
                keyword: '',
                fields: [
                    {key: 'name'},
                    {key: 'school'},
                    {key: 'runNr', sortable: true},
                    {key: 'athleteNr', sortable: true},
                    {key: 'result', sortable: true},
                ],
                data: [],
                isBusy: false,
                printView: false,
                canEdit: false,
                selectedTableID: null,
                selectedRunNr: null
            };
        },
        beforeMount() {

            let user = authService.getCurrentUser();
            if (user) {
                this.canEdit = user.roles.includes('MODERATOR') || user.roles.includes('ADMIN')
            } else this.canEdit = false;
        },
        computed: {
            getItems() {
                return this.keyword ? this.data.filter(item =>
                    item.school.includes(this.keyword) || item.runNr.includes(this.keyword) || item.name.includes(this.keyword)
                ) : this.data;
            }
        },
        methods: {
            async getTableData () {
                this.isBusy = true;
                try {
                    const response = await userApiRequest.methods.getTableData(this.selectedRunNr, this.selectedTableID);
                    if (response.data.fulfilled)
                        tableData = response.data.data;
                        this.data = tableData;
                        this.isBusy = false;
                        this.error = false;
                } catch(requestException) {
                    console.log(`Request failed with exception ${requestException}`);
                    this.isBusy = false;
                    this.error = true;
                }
            },
            async saveTableData() {
                // Todo: Maybe think of something better than sending the whole table array
                this.isBusy = true;
                if (this.data) {
                    try {
                        const response = await userApiRequest.methods.setTableData(this.data, authService.getToken(), this.selectedTableID);
                        if (response.data.fulfilled) {
                            console.log(response.data.message);
                            this.isBusy = false;
                            this.error = false;
                        } else console.log(response.data.message)

                    } catch (requestException) {
                        console.log(`Request failed with exception ${requestException}`)
                        this.isBusy = false;
                        this.error = true;
                    }
                } else {
                    console.log("Cannot post empty table!")
                }
            },
            printTable() {
                this.printView = true;
                setTimeout(print, 1);
                window.onafterprint = function() {
                    window.location.reload()
                }
            },
            updateTable() {
                if (this.selectedTableID && this.selectedRunNr) {
                    this.getTableData();
                }
            }
        }
    };
</script>
<style scoped>
    .tableButtons {
        width: 10%;
        margin-left: 0.5%;
    }
    .tableSearch {
        margin-left: 0.5%;
        width: 78%;
    }
</style>