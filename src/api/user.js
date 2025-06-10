import axios from "axios"
import {server} from './server.js'

export const loginApi = (email, password) => {
    return axios.post(`${server}/api/Users/Login`, {
        email,
        password
    });
}