import Axios from 'axios';
import crypto from 'crypto';
import config from '../config/api.config'

let authPaths = ['/api/auth/login', '/api/auth/register'];

export default {
    async login(username, password, callback) {
        let hashedPassword = crypto.createHmac('sha256', password).digest('hex');
        await Axios.post(config.API_URL + authPaths[0], {
            username: username,
            password: hashedPassword
        })
            .then(response => {
                console.log(response);
                localStorage.setItem("user", JSON.stringify(response.data));
                this.onChange(true);

                callback(true)
            })
            .catch(error => {
                console.log(error);
                this.onChange(false);

                callback(true)
            })
    },
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },
    logout() {
        this.onChange(false);
        localStorage.removeItem('user')
    },
    getToken() {
        return this.getCurrentUser().accessToken;
    },
    loggedIn() {
        let user = this.getCurrentUser();
        if (user) {
            return this.getCurrentUser().accessToken;
        } else return false;
    },
    onChange () {}
}