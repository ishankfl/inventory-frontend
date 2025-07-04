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


export const createReceipt = async (receiptData) => {
    return await axios.post(`${server}/api/Receipts`, receiptData);
}

export const updateReceipt = async (id, receiptData) => {
    console.log("Updating receipt with ID:", id, "and data:", receiptData);
    return await axios.put(`${server}/api/Receipts/${id}`, receiptData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
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
// export const fetchAllReceipts = async () => {
//     try {
//         const response = await axios.get(`${server}/api/receipts`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching receipts:', error);
//         throw error;
//     }
// };

export const fetchReceiptById = async (id) => {
    try {
        const response = await axios.get(`${server}/api/receipts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching receipt:', error);
        throw error;
    }
};

export const fetchReceiptsByDateRange = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${server}/api/receipts`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching receipts by date range:', error);
        throw error;
    }
};
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