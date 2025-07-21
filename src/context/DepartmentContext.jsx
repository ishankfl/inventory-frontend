import { createContext, useContext, useEffect, useState } from 'react';
import { searchDepartments, deleteDepartmentById } from '../api/departments';

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDepartments(searchTerm, pageNumber);
  }, [searchTerm, pageNumber]);

  const fetchDepartments = async (term = '', page = 1) => {
    try {
      setLoading(true);
      const res = await searchDepartments(term, page, pageSize);
      if (res.status === 200) {
        setDepartments(res.data.data);
        setTotalPages(res.data.totalPages);
      } else {
        setError('Failed to fetch departments.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching departments.');
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    await deleteDepartmentById(id);
    fetchDepartments(searchTerm, pageNumber);
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        setDepartments,
        searchTerm,
        setSearchTerm,
        loading,
        error,
        pageNumber,
        setPageNumber,
        totalPages,
        pageSize,
        fetchDepartments,
        deleteDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartmentContext = () => useContext(DepartmentContext);
