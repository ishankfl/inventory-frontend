import axios from 'axios';
import { server } from './server';
import { authHeader } from '../utils/tokenutils';

export const getAllDepartments = () => {
  return axios.get(`${server}/api/Department`);
};

export const getDepartmentById = (id) => {
  return axios.get(`${server}/api/Department/${id}`);
};

// Add authHeader for non-GET request
export const updateDepartment = (id, name, description) => {
  return axios.put(
    `${server}/api/Department/${id}`,
    { name, description },
    authHeader()
  );
};

export const addDepartment = (name, description) => {
  return axios.post(`${server}/api/Department`, { name, description }, authHeader());
};

export const deleteDepartmentById = (id) => {
  return axios.delete(`${server}/api/Department/${id}`, authHeader());
};