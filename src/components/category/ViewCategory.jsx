import React, { useState } from 'react';
import { useCategory } from '../../context/CategoryContext';
import AddEditCategoryForm from './AddEditCategoryForm';
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
    removeCategory,
    fetchCategories,
  } = useCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAdd = () => {
    setSelectedCategory(null); // No initial data = add mode
    setModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category); // Pass full category object
    setModalOpen(true);
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

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories(); // refresh list after add/edit
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <div className={`transition-all duration-300 ${modalOpen ? 'blur-sm' : ''}`}>
        <Header
          description="Manage and track all inventory categories"
          handleButton={handleAdd}
          title="Category Management"
          btnTitle="New Category"
        />

        <SearchBox
          value={searchQuery}
          onChange={(e) => handleSearchFilter(e.target.value)}
          label="Category"
        />

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
                        onClick={() => handleEdit(cat)}
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

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >
            <AddEditCategoryForm
              initialData={selectedCategory}
              onClose={handleCloseModal}
              onSubmitSuccess={handleSuccess}
            />
        </div>
      )}
    </div>
  );
};

export default ViewCategory;
