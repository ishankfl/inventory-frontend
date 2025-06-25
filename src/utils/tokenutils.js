// tokenUtils.js

import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = 'authToken';
export const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});
// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Save token to localStorage
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Get user ID from token
export const getUserId = () => {
    const token = getToken();
    if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        return decoded.id;
    }
    return null;
};

// Check if token is expired and if user is logged in
export const isLoggedIn = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);

        // Check if 'exp' (expiration) exists and compare with current time
        if (decoded.exp) {
            const now = Date.now() / 1000; // current time in seconds
            if (decoded.exp < now) {
                // Token is expired
                console.warn("Token expired");
                removeToken(); // Optionally remove the token
                return false;
            }
            return true; // Token is valid
        } else {
            // No expiration in token? Consider it invalid
            console.warn("No expiration in token");
            return false;
        }
    } catch (err) {
        console.error("Error decoding token:", err);
        return false;
    }
};
