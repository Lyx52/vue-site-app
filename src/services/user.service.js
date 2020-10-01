import axios from "axios";
import config from '../config/api.config';

export default {
    getTableData(runNr, tableID) {
        return axios.post(config.getRoute('getTable'), {
            'tableID': tableID.toString(),
            'runNr': runNr
        })
    },
    setTableData(tableData, token) {
        return axios.post(config.getRoute('updateTable'), {
            'tableData': tableData
        }, {headers: {'x-access-token': token}})
    },
    deleteTableData(rows, token) {
        return axios.post(config.getRoute('deleteTableRows'), {
            'rows': rows
        }, {headers: {'x-access-token': token}})
    },
    insertTableData(rowData, token, tableID) {
        return axios.post(config.getRoute('insertTableRow'), {
            'tableID': tableID.toString(),
            'rowData': rowData
        }, {headers: {'x-access-token': token}})
    },
    insertSchoolName(schoolName, token) {
        return axios.post(config.getRoute('createSchool'), {
            'schoolName': schoolName
        }, {headers: {'x-access-token': token}})
    },
    getSchools() {
        return axios.get(config.getRoute('getSchools'))
    },
    deleteSchools(schools, token) {
        return axios.post(config.getRoute('deleteSchools'), {
            'schools': schools
        }, {headers: {'x-access-token': token}})
    },
    getSchoolResults(tableID) {
        return axios.post(config.getRoute('getTotalResults'), {
            'tableID': tableID
        })
    },
    importTable(file, token) {
        console.log(file)
        return axios.post(config.getRoute('importTable'), file,
            {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            })
    },
    downloadTable(genderID, tableID, token) {
        return axios.post(config.getRoute('downloadTable'),
            {
                'genderID': genderID,
                'tableID': tableID
            },
            {responseType: 'blob', headers: {'x-access-token': token}}
        )
    }
};