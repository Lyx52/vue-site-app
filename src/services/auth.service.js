import Axios from 'axios';
import crypto from 'crypto';
import config from '../config/api.config'

export default {
    async login(username, password, callback) {
        let hashedPassword = crypto.createHmac('sha256', password).digest('hex');
        await Axios.post(config.getRoute('login'), {
            username: username,
            password: hashedPassword
        })
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response.data));
                this.onLogin(true);
                callback(true)
            })
            .catch(error => {
                this.onLogin(false);
                callback(false, error)
            })
    },
    async register(username, password, roles, callback) {
        let hashedPassword = crypto.createHmac('sha256', password).digest('hex');
        await Axios.post(config.getRoute('register'), {
            username: username,
            password: hashedPassword,
            roles: roles
        }, {headers: {'x-access-token': this.getToken()}})
            .then(response => {
                callback(true, response)
            })
            .catch(error => {
                callback(false, error)
            })
    },
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },
    logout() {
        localStorage.removeItem('user')
    },
    getToken() {
        return this.getCurrentUser().accessToken;
    },
    getCanEdit() {
        let user = this.getCurrentUser();

        if (user) {
            return user.roles.includes("MODERATOR") || user.roles.includes("ADMIN")
        } else return false;
    },
    getIsAdmin() {
        let user = this.getCurrentUser();

        if (user) {
            return user.roles.includes("ADMIN")
        } else return false;
    },
    loggedIn() {
        let user = this.getCurrentUser();
        if (user) {
            return user.accessToken != null;
        } else return false;
    },
    onLogin() {}
}