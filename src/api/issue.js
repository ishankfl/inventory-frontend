import axios from "axios";
import { server } from "./server";

export const issueProducts = (data) => {
  return axios.post(`${server}/api/issues`, data);
};
export const viewIssue = (data) => {
  return axios.get(`${server}/api/issues`)
};
