import axios from "axios";
import { server } from "./server";
import { authHeader } from "../utils/tokenutils";

// Create Product (POST)
export const addProduct = (name, description, quantity, price, categoryId, userId) => {
  return axios.post(
    `${server}/api/Item`,
    { name, description, quantity, price, categoryId, userId },
    authHeader()
  );
};

// Update Product (PUT)
export const updateProduct = (id, name, unit, price) => {
  return axios.put(
    `${server}/api/Item/${id}`,
    { name, unit, price },
    authHeader()
  );
};

export const getAllProducts = (page = 1, limit = 10, search = '') =>
  axios.get(`${server}/api/item?page=${page}&limit=${limit}&search=${search}`, authHeader());

// Delete Product (DELETE)
export const deleteProducts = (id) => {
  return axios.delete(`${server}/api/Item/${id}`, authHeader());
};

// Get Single Product by ID (GET)
export const getProductById = (id) => {
  return axios.get(`${server}/api/Item/${id}`, authHeader());
};
