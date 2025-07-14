import axios from 'axios';
import { server } from './server.js';
import { authHeader } from '../utils/tokenutils.js'; // Reusable header function

// Fetch Top 10 Items by Quantity
export const fetchDasahboardData = () => {
  return axios.get(`${server}/api/dashboard/overview`, { ...authHeader() });

  // return axios.get(`${server}/api/Dashboard/TopProductByQty`, );
};

// // Fetch Top 10 Issued Products
// export const fetchTop10IssuedProduct = () => {
//   return axios.get(`${server}/api/Dashboard/GetTopIssuedProducts`, { ...authHeader() });
// };

// // Fetch Count for Dashboard Cards
// export const fetchCountForCard = () => {
//   return axios.get(`${server}/api/Dashboard/GetCount`, { ...authHeader() });
// };
