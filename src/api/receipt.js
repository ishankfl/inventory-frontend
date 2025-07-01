import axios from "axios";
import {server} from './server'
export const fetchAllVendors= async ()=>{
    return  await axios.get(`${server}/api/Vendor`)
}

export const fetchAllItems= async ()=>{
    return  await axios.get(`${server}/api/Item`)
}
