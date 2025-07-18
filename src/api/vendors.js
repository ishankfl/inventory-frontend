import axios from 'axios';
import { server } from './server';
import { authHeader } from '../utils/tokenutils';

// Get all vendors
export const getAllVendors = () => {
  return axios.get(`${server}/api/Vendor`, authHeader());
};
// Get vendors with pagination and search
export const searchVendors = (searchTerm = 'werwr', pageNumber = 1, pageSize = 10) => {
  return axios.get(`${server}/api/Vendor`, {
    params: { searchTerm, pageNumber, pageSize },
    ...authHeader()
  });
};
// Get a single vendor by ID
export const getVendorById = (id) => {
  return axios.get(`${server}/api/Vendor/${id}`, authHeader());
};

// Add a new vendor
export const addVendor = (name, email) => {
  return axios.post(`${server}/api/Vendor`, { name, email }, authHeader());
};

// Update a vendor
export const updateVendor = (id, name, email) => {
  return axios.put(`${server}/api/Vendor/${id}`, { name, email }, authHeader());
};

// Delete a vendor by ID
export const deleteVendorById = (id) => {
  return axios.delete(`${server}/api/Vendor/${id}`, authHeader());
};
