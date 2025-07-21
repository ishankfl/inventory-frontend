import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const VendorContext = createContext();

export const useVendor = () => useContext(VendorContext);

export const VendorProvider = ({ children }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const res = await axios.get('/api/vendors'); // Replace with your actual API route
            setVendors(res.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    return (
        <VendorContext.Provider value={{ vendors, loading, refreshVendors: fetchVendors }}>
            {children}
        </VendorContext.Provider>
    );
};
