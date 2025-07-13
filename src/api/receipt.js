import axios from "axios";
import { server } from './server';
import { authHeader } from '../utils/tokenutils'; // Assuming you have this

// Vendor endpoints
export const fetchAllVendors = async () => {
  return await axios.get(`${server}/api/Vendor`, authHeader());
};

export const getVendorById = async (id) => {
  return await axios.get(`${server}/api/Vendor/${id}`, authHeader());
};

export const createVendor = async (vendorData) => {
  return await axios.post(`${server}/api/Vendor`, vendorData, authHeader());
};

// Item endpoints
export const fetchAllItems = async () => {
  return await axios.get(`${server}/api/Item`, authHeader());
};

export const getItemById = async (id) => {
  return await axios.get(`${server}/api/Item/${id}`, authHeader());
};

export const addNewItem = async (name, unit, price) => {
  return await axios.post(`${server}/api/Item`, { name, unit, price }, authHeader());
};

export const updateItem = async (id, itemData) => {
  return await axios.put(`${server}/api/Item/${id}`, itemData, authHeader());
};

export const deleteItem = async (id) => {
  return await axios.delete(`${server}/api/Item/${id}`, authHeader());
};

// Receipts endpoints
export const fetchAllReceipts = async () => {
  return await axios.get(`${server}/api/Receipts`, authHeader());
};

export const fetchReceiptById = async (id) => {
  try {
    const response = await axios.get(`${server}/api/Receipts/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt:', error);
    throw error;
  }
};

export const fetchReceiptsByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${server}/api/Receipts`, {
      params: { startDate, endDate },
      ...authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching receipts by date range:', error);
    throw error;
  }
};

export const createReceipt = async (receiptData) => {
  return await axios.post(`${server}/api/Receipts`, receiptData, authHeader());
};

export const updateReceipt = async (id, receiptData) => {
  return await axios.put(`${server}/api/Receipts/${id}`, receiptData, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader().headers,
    }
  });
};

export const deleteReceipt = async (id) => {
  return await axios.delete(`${server}/api/Receipts/${id}`, authHeader());
};

export const addReceiptDetail = async (receiptId, detailData) => {
  return await axios.post(`${server}/api/Receipts/${receiptId}/details`, detailData, authHeader());
};

export const updateReceiptDetail = async (receiptId, detailId, detailData) => {
  return await axios.put(`${server}/api/Receipts/${receiptId}/details/${detailId}`, detailData, authHeader());
};

export const deleteReceiptDetail = async (receiptId, detailId) => {
  return await axios.delete(`${server}/api/Receipts/${receiptId}/details/${detailId}`, authHeader());
};

// Issue endpoints
export const fetchAllIssues = async () => {
  return await axios.get(`${server}/api/Issue`, authHeader());
};

export const getIssueById = async (id) => {
  return await axios.get(`${server}/api/Issue/${id}`, authHeader());
};

export const createIssue = async (issue) => {
  return await axios.post(`${server}/api/Issue`, issue, authHeader());
};

export const updateIssue = async (id, data) => {
  return await axios.put(`${server}/api/Issue/${id}`, data, authHeader());
};
