// src/context/ItemContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllProducts, deleteProducts } from '../api/item';

const ItemContext = createContext();

export const useItem = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = Math.ceil(totalProducts / limit);

  const fetchProducts = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setFetchError(null);
      setError('');
      try {
        const res = await getAllProducts(page, limit, search);
        setProducts(res.data.data);
        setTotalProducts(res.data.total);
      } catch (err) {
        console.error(err);
        setFetchError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, fetchProducts, searchQuery]);

  const removeProduct = async (id) => {
    setError('');
    try {
      await deleteProducts(id);
      await fetchProducts(currentPage, searchQuery);
    } catch (err) {
      if (err.response?.status === 409) {
        const conflictMessage =
          err.response?.data?.message || 'Cannot delete product because it is used in issue or receipt.';
        setError(conflictMessage);
        throw new Error(conflictMessage);
      } else if (err.response?.status === 401) {
        const unauthorizedMessage = 'Unauthorized! Please login to perform this action.';
        setError(unauthorizedMessage);
        throw new Error(unauthorizedMessage);
      } else {
        const genericMessage = err.response?.data?.message || 'Delete failed.';
        setError(genericMessage);
        throw new Error(genericMessage);
      }
    }
  };

  return (
    <ItemContext.Provider
      value={{
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
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
