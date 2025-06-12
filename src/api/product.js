import axios from "axios";
import { server } from "./server";
import { getToken } from "../utils/tokenutils";

export const addProduct = (name,description,quantity, price,categoryId,userId) => {
  return axios.post(`${server}/api/Product`, {name,description,quantity, price, categoryId,userId}, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};
export const updateProduct = (id, name,description,quantity, price,categoryId,userId) => {
  console.log(id,name,description,quantity,price,categoryId, userId  )
  return axios.put(`${server}/api/Product/${id}`, {name,description,quantity, price, categoryId,userId}, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};
export const getAllProducts = () => {
  return axios.get(`${server}/api/Product`);
};

export const deleteProducts = (id) => {
  return axios.get(`${server}/api/Product/${id}`);
};


export const getProductById = (id) => {
  return axios.get(`${server}/api/Product/${id}`);
};