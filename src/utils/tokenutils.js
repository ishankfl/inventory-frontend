// tokenUtils.js

import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = 'authToken'; // Change this key if you use a different one

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Optional: Save token to localStorage
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Optional: Remove token (logout)
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getUserId = () => {
    const token = getToken()
    if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        // You can access the payload like:
        const userId = decoded.id;
        const userEmail = decoded.email;
        console.log(userId)
        return userId;
    }
}

