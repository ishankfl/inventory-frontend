import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts, deleteProducts } from '../api/item';

const ItemContext = createContext();

export const useItem = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(7);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = Math.ceil(totalProducts / limit);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getAllProducts(page, limit, searchQuery);
      setProducts(res.data.data);
      setTotalProducts(res.data.total);
    } catch (err) {
      console.error(err);
      setFetchError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteProducts(id);
      fetchProducts(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

  const value = {
    products,
    totalProducts,
    currentPage,
    limit,
    totalPages,
    loading,
    fetchError,
    error,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    fetchProducts,
    removeProduct,
    setError,
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};
