import axios from "axios";
import { server } from './server';

// Vendor endpoints
export const fetchAllVendors = async () => {
    return await axios.get(`${server}/api/Vendor`);
}

export const getVendorById = async (id) => {
    return await axios.get(`${server}/api/Vendor/${id}`);
}

export const createVendor = async (vendorData) => {
    return await axios.post(`${server}/api/Vendor`, vendorData);
}

// Item endpoints
export const fetchAllItems = async () => {
    return await axios.get(`${server}/api/Item`);
}

export const getItemById = async (id) => {
    return await axios.get(`${server}/api/Item/${id}`);
}

export const AddNewItem = async (name, unit) => {
    return await axios.post(`${server}/api/Item`, { name, unit });
}

export const updateItem = async (id, itemData) => {
    return await axios.put(`${server}/api/Item/${id}`, itemData);
}

export const deleteItem = async (id) => {
    return await axios.delete(`${server}/api/Item/${id}`);
}

export const fetchAllReceipts = async () => {
    return await axios.get(`${server}/api/Receipts`);
}

export const getReceiptById = async (id) => {
    return await axios.get(`${server}/api/Receipts/${id}`);
}

export const createReceipt = async (receiptData) => {
    return await axios.post(`${server}/api/Receipts`, receiptData);
}

export const updateReceipt = async (id, receiptData) => {
    return await axios.put(`${server}/api/Receipts/${id}`, receiptData);
}

export const deleteReceipt = async (id) => {
    return await axios.delete(`${server}/api/Receipts/${id}`);
}

export const addReceiptDetail = async (receiptId, detailData) => {
    return await axios.post(`${server}/api/Receipts/${receiptId}/details`, detailData);
}

export const updateReceiptDetail = async (receiptId, detailId, detailData) => {
    return await axios.put(`${server}/api/Receipts/${receiptId}/details/${detailId}`, detailData);
}

export const deleteReceiptDetail = async (receiptId, detailId) => {
    return await axios.delete(`${server}/api/Receipts/${receiptId}/details/${detailId}`);
}

// // Utility function to handle errors consistently
// const handleApiError = (error) => {
//     if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error('API Error:', error.response.data);
//         throw error.response.data;
//     } else if (error.request) {
//         // The request was made but no response was received
//         console.error('API Error: No response received');
//         throw { message: 'No response received from server' };
//     } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error('API Error:', error.message);
//         throw { message: error.message };
//     }
// };

// // Add response interceptor to handle errors globally
// axios.interceptors.response.use(
//     response => response.data,
//     error => handleApiError(error)
// );

// // You can also create specific Axios instances if needed
// export const receiptApi = axios.create({
//     baseURL: `${server}/api/Receipts`,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// });