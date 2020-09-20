import axios from "axios";
import config from '../config/api.config';

export default {
    getTableData(runNr, tableID) {
        return axios.post(config.getRoute('getTable'), {
            'tableID': tableID.toString(),
            'runNr': runNr
        })
    },
    setTableData(changedData, token, tableID) {
        return axios.post(config.getRoute('updateTable'), {
            'tableID': tableID.toString(),
            'changedData': changedData
        }, {headers: {'x-access-token': token}})
    },
    deleteTableData(deleteData, token, tableID) {
        return axios.post(config.getRoute('deleteTableRows'), {
            'tableID': tableID.toString(),
            'deleteData': deleteData
        }, {headers: {'x-access-token': token}})
    },
    insertTableData(rowData, token, tableID) {
        return axios.post(config.getRoute('insertTableRow'), {
            'tableID': tableID.toString(),
            'rowData': rowData
        }, {headers: {'x-access-token': token}})
    }
};