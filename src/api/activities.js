import axios from "axios";
import { server } from "./server";

export const fetchAllActivities= async ()=>{
    console.log("Fetch api called")
    return await axios.get(`${server}/api/activity`)
}