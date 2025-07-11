// import axios from "axios";
// import { server } from "./server";
// import { authHeader } from "../utils/tokenutils";

// //  Create Product (POST)
// export const addProduct = (name, description, quantity, price, categoryId, userId) => {
//   return axios.post(`${server}/api/Product`, {
//     name,
//     description,
//     quantity,
//     price,
//     categoryId,
//     userId
//   }, authHeader());
// };

// //  Update Product (PUT)
// export const updateProduct = (id, name, description, quantity, price, categoryId, userId) => {
//   console.log(id, name, description, quantity, price, categoryId, userId);
//   return axios.put(`${server}/api/Product/${id}`, {
//     name,
//     description,
//     quantity,
//     price,
//     categoryId,
//     userId
//   }, authHeader());
// };

// //  Get All Products (no token required unless backend demands it)
// export const getAllProducts = () => {
//   return axios.get(`${server}/api/Product`);
// };

// //  FIXED: This should be DELETE instead of GET
// export const deleteProducts = (id) => {
//   return axios.delete(`${server}/api/Product/${id}`, authHeader());
// };

// //  Get Single Product by ID
// export const getProductById = (id) => {
//   return axios.get(`${server}/api/Product/${id}`);
// };

import axios from "axios";
import { server } from "./server";
import { authHeader } from "../utils/tokenutils";

//  Create Product (POST)
export const addProduct = (name, description, quantity, price, categoryId, userId) => {
  return axios.post(`${server}/api/Item`, {
    name,
    description,
    quantity,
    price,
    categoryId,
    userId
  }, authHeader());
};

//  Update Product (PUT)
export const updateProduct = (id, name, description, quantity, price, categoryId, userId) => {
  console.log(id, name, description, quantity, price, categoryId, userId);
  return axios.put(`${server}/api/Product/${id}`, {
    name,
    description,
    quantity,
    price,
    categoryId,
    userId
  }, authHeader());
};

//  Get All Products (no token required unless backend demands it)
export const getAllProducts = () => {
  return axios.get(`${server}/api/Item`);
};

//  FIXED: This should be DELETE instead of GET
export const deleteProducts = (id) => {
  return axios.delete(`${server}/api/Product/${id}`, authHeader());
};

//  Get Single Product by ID
export const getProductById = (id) => {
  return axios.get(`${server}/api/Product/${id}`);
};
