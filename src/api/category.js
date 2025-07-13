import axios from 'axios';
import { server } from './server.js';
import { authHeader } from '../utils/tokenutils.js';

export const addCategory = (name, description, userId) => {
  return axios.post(
    `${server}/api/Category`,
    { name, description, userId },
    authHeader()
  );
};

export const getAllCategories = () => {
  return axios.get(`${server}/api/Category`, authHeader());
};

export const deleteCategory = (id) => {
  return axios.delete(`${server}/api/Category/${id}`, authHeader());
};

export const getCategoryById = (id) => {
  return axios.get(`${server}/api/Category/${id}`, authHeader());
};

export const updateCategory = (id, name, description) => {
  return axios.put(
    `${server}/api/Category/${id}`,
    { name, description },
    authHeader()
  );
};
