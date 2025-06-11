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