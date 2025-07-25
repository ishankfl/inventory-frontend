import axios from "axios";
import { server } from "./server";
import { authHeader } from "../utils/tokenutils";

// ─── Vendor Endpoints ────────────────────────────────────────
export const fetchAllVendors = async () => {
    return await axios.get(`${server}/api/Vendor`, authHeader());
};

// ─── Item Endpoints ──────────────────────────────────────────
export const fetchAllItems = async () => {
    return await axios.get(`${server}/api/Item/allname`, authHeader());
};

// ─── Receipt Endpoints ───────────────────────────────────────
export const fetchAllReceipts = async (page = 1, limit = 6) => {
    return await axios.get(
        `${server}/api/Receipts/paginate?page=${page}&limit=${limit}`,
        authHeader()
    );
};

export const fetchReceiptById = async (id) => {
    try {
        const response = await axios.get(`${server}/api/Receipts/${id}`, authHeader());
        return response.data;
    } catch (error) {
        console.error("Error fetching receipt:", error);
        throw error;
    }
};

export const createReceipt = async (receiptData) => {
    return await axios.post(`${server}/api/Receipts`, receiptData, authHeader());
};

export const updateReceipt = async (id, receiptData) => {
    return await axios.put(`${server}/api/Receipts/${id}`, receiptData, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader().headers,
        },
    });
};

// ─── Issue Endpoints ─────────────────────────────────────────
export const fetchAllIssue = async (page = 1, limit = 6) => {
    return await axios.get(`${server}/api/Issue/paginated?page=${page}&limit=${limit}`, authHeader());
};


export const fetchIssueById = async (id) => {
    return await axios.get(`${server}/api/Issue/${id}`, authHeader());
};

export const createIssue = async (issueData) => {
    return await axios.post(`${server}/api/Issue`, issueData, authHeader());
};

export const updateIssue = async (id, updatedData) => {
    return await axios.put(`${server}/api/Issue/${id}`, updatedData, authHeader());
};
