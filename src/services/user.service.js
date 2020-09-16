import axios from "axios";
import config from '../config/api.config';
const API_ROUTES = [
    "/api/get/table",
    "/api/set/table"
];

export const userApiRequest = {
    methods: {
        getTableData(runNr, tableID) {
            return axios.post(config.API_URL + API_ROUTES[0], {
                'tableID': tableID.toString(),
                'runNr': runNr
            })
        },
        setTableData(changedData, token, tableID) {
            return axios.post(config.API_URL + API_ROUTES[1], {
                'tableID': tableID.toString(),
                'changedData': changedData
            }, {headers: {'x-access-token': token}})
        }
    }
};