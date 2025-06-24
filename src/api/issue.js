import axios from "axios";
import { server } from "./server";

export const issueProducts = (data) => {
  return axios.post(`${server}/api/issues`, data);
};
export const viewIssue = (data) => {
  return axios.get(`${server}/api/issues`)
};


export const addNewProduct= (departmentId, issuedById, productId, quantityIssued)=>{
  return axios.post(`${server}/api/issues/OneProduct`,{
    departmentId,
    issuedById,
    productId,
    quantityIssued
  })
}
export const fetchIssuedItemByDept= (departmentId)=>{
 
  return axios.get(`${server}/api/issues/deptId/${departmentId}`)
}