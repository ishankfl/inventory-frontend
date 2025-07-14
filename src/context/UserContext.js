import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../api/user';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.status === 200) {
        setUsers(response.data);
        setOriginalUsers(response.data);
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
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setOriginalUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        originalUsers,
        loading,
        error,
        fetchUsers,
        removeUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
