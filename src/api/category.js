import axios from "axios";
import { server } from './server.js';
import { getToken } from '../utils/tokenutils.js'; // this should be your token utility

export const addCategory = (name, description, userId) => {
    const token = getToken(); // gets the token from localStorage

    return axios.post(
        `${server}/api/Category`, // Fix the endpoint if needed
        { name, description, userId },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const getAllCategories = () => {
    const token = getToken(); // gets the token from localStorage

    return axios.get(`${server}/api/Category`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteCategory = (id) => {
    const token = getToken(); // gets the token from localStorage

    return axios.delete(`${server}/api/Category/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getCategoryById = (id) => {
    const token = getToken(); // gets the token from localStorage

    return axios.get(`${server}/api/Category/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateCategory = (id, name, description) => {
    const token = getToken(); // gets the token from localStorage
    console.log(id,name, description);
    return axios.put(`${server}/api/Category/${id}`,{name, description}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}