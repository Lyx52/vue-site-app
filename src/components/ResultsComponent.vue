<template>
    <div id="resultTable" class="d-flex justify-content-center mt-5">
        <b-button @click="getSchoolResults" variant="Info" class="h-25">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
        </b-button>
        <b-table bordered hover class="w-75 my-auto bg-white" :items="resultTableData" :busy="isBusy" :fields="fields" responsive="sm"/>
    </div>
</template>

<script>
    import userService from '../services/user.service';
    import authService from '../services/auth.service';
    export default {
        name: "ResultsComponent",
        data() {
            return {
                fields: [
                    {key: 'SchoolID', sortable: true, label: "Skola",
                        formatter: (value) => {
                            // Filter schoolID in school list
                            let school = this.schoolNames.filter(item => item.SchoolID === value)[0];

                            // If school has been found return school name otherwise return empty
                            return school ? school.SchoolName : '';
                        }
                    },
                    {key: 'SchoolResult', sortable: true, label: 'Skola'}
                ],
                isBusy: false,
                resultTableData: [],
                schoolNames: []
            }
        },
        beforeMount() {
            if (authService.loggedIn())
                this.getSchoolResults()
        },
        methods: {
            async getSchoolResults() {
                this.isBusy = true;
                await userService.getSchoolResults(authService.getToken())
                    .then(response => {
                        if (response.data)
                            this.resultTableData = response.data;
                            this.getSchoolNames()
                    })
                    .catch(error => {
                        this.isBusy = false;
                        console.log(error)
                    })
            },
            async getSchoolNames() {
                await userService.getSchools()
                    .then(response => {
                        if (response.data)
                            this.schoolNames = response.data[0];
                        this.isBusy = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.isBusy = false;
                    })
            }
        }
    }
</script>