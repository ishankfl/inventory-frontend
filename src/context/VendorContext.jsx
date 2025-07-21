// src/context/VendorContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { searchVendors, deleteVendorById } from '../api/vendors';

const VendorContext = createContext();

export const useVendor = () => useContext(VendorContext);

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVendors = async (term = "a", page = 1) => {
    try {
      setLoading(true);
      const res = await searchVendors(term, page, pageSize);
      if (res.status === 200) {
        setVendors(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setError("Failed to fetch vendors.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching vendors.");
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    await deleteVendorById(id);
    fetchVendors(searchTerm, pageNumber);
  };

  useEffect(() => {
    fetchVendors(searchTerm, pageNumber);
  }, [searchTerm, pageNumber]);

  return (
    <VendorContext.Provider
      value={{
        vendors,
        loading,
        error,
        pageNumber,
        pageSize,
        totalPages,
        searchTerm,
        setSearchTerm,
        setPageNumber,
        fetchVendors,
        deleteVendor,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
