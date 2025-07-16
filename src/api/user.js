import axios from "axios";
import { server } from './server.js';
import { authHeader } from '../utils/tokenutils.js'; // Import authHeader

//  Login (no token required)
export const loginApi = (email, password) => {
  console.log(email, password)
  return axios.post(`${server}/api/Users/Login`, {
    email,
    password
  });
};

//  Get all users (requires token)
export const getAllUsers = () => {
  return axios.get(`${server}/api/Users`, authHeader());
};

//  Delete a user (requires token)
export const deleteUser = (id) => {
  return axios.delete(`${server}/api/Users/${id}`, authHeader());
};

//  Add staff (requires token)
export const addStaff = (fullName, email, password, role) => {
  return axios.post(`${server}/api/Users`, {
    fullName,
    email,
    password,
    role
  }, authHeader());
};

export const getUsersByPagination = (page, pageSize,  search) => {
  // const pageSize = 6;
  const params = { page, pageSize };
  if (search) params.search = search;

  return axios.get(`${server}/api/users/pagination`, {
    params,
    headers: authHeader().headers
  });
};
