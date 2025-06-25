import axios from 'axios';
import { server } from './server.js';
import { authHeader } from '../utils/tokenutils.js'; // Reusable header function

export const fetchTop10ItemsByQty=()=>{
    return axios.get(`${server}/api/Dashboard/TopProductByQty`)
}

export const fetchTop10IssuedProduct=()=>{
    return axios.get(`${server}/api/Dashboard/GetTopIssuedProducts`)
}