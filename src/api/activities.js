import axios from "axios";
import { server } from "./server";
import { authHeader } from "../utils/tokenutils";

export const fetchAllActivities = async () => {
  try {
    const response = await axios.get(`${server}/api/activity`, authHeader());
    return response;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};
