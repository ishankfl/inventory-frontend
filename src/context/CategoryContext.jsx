// context/CategoryContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getAllCategories, deleteCategory } from '../api/category';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async (page = 1, query = '') => {
    try {
      setLoading(true);
      const response = await getAllCategories(page, query); // Your API should return paginated data
      if (response.status === 200) {
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Failed to fetch categories.');
      }
    } catch (err) {
      setError('Error fetching categories.');
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    await fetchCategories(currentPage, searchQuery);
  };

  useEffect(() => {
    fetchCategories(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        fetchCategories,
        removeCategory,
        setError,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
