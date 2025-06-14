import axios from "axios"
import {server} from './server.js'

export const loginApi = (email, password) => {
    return axios.post(`${server}/api/Users/Login`, {
        email,
        password
    });
}


export const getAllUsers = () => {
    return axios.get(`${server}/api/Users/`,);
}

export const deleteUser = (id) => {
    return axios.delete(`${server}/api/Users/${id}`,);
}
export const addStaff = (fullName, email, password, role) => {
  return axios.post(`${server}/api/Users`, {
    fullName,
    email,
    password,  // ✅ match exactly as expected in DTO
    role
  });
};
