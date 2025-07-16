import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsersByPagination } from '../api/user'; // new api method supporting pagination/search
import { deleteUser } from '../api/user';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await getUsersByPagination(page, 6, search);
      if (response.status === 200) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Failed to fetch users.');
      }
    } catch (err) {
      setError('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      const response = await deleteUser(id);
      if (response.status === 200 || response.status === 204) {
        await fetchUsers(currentPage, searchQuery);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        fetchUsers,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
