import React, { useState } from 'react';
import { useCategory } from '../../context/CategoryContext';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import SearchBox from '../common/SearchBox';
import Header from '../common/Header';
import '../../styles/view.scss';

const ViewCategory = () => {
  const {
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
  } = useCategory();

  const [isAddModalOpened, setIsAddModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [categoryId, setCategoryId] = useState('');

  const handleEdit = (id) => {
    setCategoryId(id);
    setIsEditModalOpened(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await removeCategory(id);
      } catch {
        alert('Error deleting category.');
      }
    }
  };

  const handleSearchFilter = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className={`transition-all duration-300 ${(isAddModalOpened || isEditModalOpened) ? 'blur-sm' : ''}`}>
        <Header
          description="Manage and track all inventory categories"
          handleButton={() => setIsAddModalOpened(true)}
          title="Category Management"
          btnTitle="New Category"
        />

        <SearchBox
          value={searchQuery}
          onChange={(e) => handleSearchFilter(e.target.value)}
          label="Category"
        />

        {/* Table Container */}
        <div className="table-container mt-4 min-h-[300px] border rounded overflow-hidden shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">S.N.</th>
                <th className="table-header">Name</th>
                <th className="table-header">Description</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">Loading categories...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-red-500">{error}</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.id || index} className="hover:bg-gray-50">
                    <td className="table-cell">{(currentPage - 1) * 6 + index + 1}</td>
                    <td className="table-cell">{cat.name}</td>
                    <td className="table-cell">{cat.description}</td>
                    <td className="table-cell text-center space-x-2">
                      <button
                        className="action-button button-blue"
                        onClick={() => handleEdit(cat.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button button-red"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {categories.length > 0 && !loading && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {(isAddModalOpened || isEditModalOpened) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setIsAddModalOpened(false);
            setIsEditModalOpened(false);
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {isAddModalOpened && (
              <AddCategory closeModal={() => setIsAddModalOpened(false)} fetchCategories={fetchCategories} />
            )}
            {isEditModalOpened && (
              <EditCategory closeModal={() => setIsEditModalOpened(false)} catId={categoryId} fetchCategories={fetchCategories} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategory;
