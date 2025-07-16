// context/CategoryContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getAllCategories, deleteCategory, getAllCategoriesByPagination } from '../api/category';

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
            setError('');
            const response = await getAllCategoriesByPagination(page, query);

            if (response.status === 200) {
                const { categories, totalPages } = response.data;
                setCategories(categories);
                setTotalPages(totalPages || 1); // fallback to 1 if backend misses it
            } else {
                setError('Failed to fetch categories.');
                setCategories([]);
            }
        } catch (err) {
            setError('Error fetching categories.');
            setCategories([]);
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
