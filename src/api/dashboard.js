import axios from 'axios';
import { server } from './server.js';
import { authHeader } from '../utils/tokenutils.js'; // Reusable header function

// Fetch Top 10 Items by Quantity
export const fetchTop10ItemsByQty = () => {
  return axios.get(`${server}/api/Dashboard/TopProductByQty`, { ...authHeader() });
};

// Fetch Top 10 Issued Products
export const fetchTop10IssuedProduct = () => {
  return axios.get(`${server}/api/Dashboard/GetTopIssuedProducts`, { ...authHeader() });
};

// Fetch Count for Dashboard Cards
export const fetchCountForCard = () => {
  return axios.get(`${server}/api/Dashboard/GetCount`, { ...authHeader() });
};
