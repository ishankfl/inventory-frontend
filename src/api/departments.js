import axios from 'axios';
import { server } from './server';
export  const getAllDepartments=()=>{
 return axios.get(`${server}/api/Department`);

} 

export const loginApi = (email, password) => {
    return axios.post(`${server}/api/Users/Login`, {
        email,
        password
    });
}