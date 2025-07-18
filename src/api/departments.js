import axios from 'axios';
import { server } from './server';
import { authHeader } from '../utils/tokenutils';

// Correctly passes authHeader() as full config (includes headers inside)
export const searchDepartments = (searchTerm = '', pageNumber = 1, pageSize = 6) => {
  return axios.get(`${server}/api/Department/search`, {
    ...authHeader(),
    params: { searchTerm, pageNumber, pageSize },
  });
};

export const getAllDepartments = () => {
  return axios.get(`${server}/api/Department`, authHeader());
};

export const getDepartmentById = (id) => {
  return axios.get(`${server}/api/Department/${id}`, authHeader());
};

export const updateDepartment = (id, name, description) => {
  return axios.put(
    `${server}/api/Department/${id}`,
    { name, description },
    authHeader()
  );
};

export const addDepartment = (name, description) => {
  return axios.post(
    `${server}/api/Department`,
    { name, description },
    authHeader()
  );
};

export const deleteDepartmentById = (id) => {
  return axios.delete(`${server}/api/Department/${id}`, authHeader());
};
