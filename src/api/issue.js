import axios from "axios";
import { server } from "./server";
import { getToken } from "../utils/tokenutils";
// import { getToken } from "./tokenutils"; // make sure this path is correct

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const issueProducts = (data) => {
  return axios.post(`${server}/api/issues`, data, authHeader());
};

export const viewIssue = () => {
  return axios.get(`${server}/api/issues`, authHeader());
};

export const addNewProduct = (departmentId, issuedById, productId, quantityIssued) => {
  return axios.post(`${server}/api/issues/OneProduct`, {
    departmentId,
    issuedById,
    productId,
    quantityIssued
  }, authHeader());
};

export const fetchIssuedItemByDept = (departmentId) => {
  return axios.get(`${server}/api/issues/deptId/${departmentId}`, authHeader());
};

export const completeIssue = (issueId) => {
  console.log("on completeIssue");
  console.log(issueId);
  return axios.post(`${server}/api/issues/CompleteIssue/${issueId}`, {}, authHeader());
};
