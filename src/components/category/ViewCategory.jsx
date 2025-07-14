import React, { useEffect, useState } from 'react';
import { deleteCategory, getAllCategories } from '../../api/category';
import { useNavigate } from 'react-router-dom';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import '../../styles/view.scss';
import SearchBox from '../common/SearchBox';
import Header from '../common/Header';

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpened, setIsAddModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200) {
        setCategories(response.data);
        setOriginalCategories(response.data);
      } else {
        setError('Failed to fetch categories.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setCategoryId(id);
    setIsEditModalOpened(true);
  };

  const handleAddNewCategory = () => {
    setIsAddModalOpened(true);
  };

  const closeModal = () => {
    setIsAddModalOpened(false);
    setIsEditModalOpened(false);
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      const response = await deleteCategory(categoryId);
      if (response.status === 200 || response.status === 204) {
        alert('Category deleted successfully.');
        fetchCategories();
      } else {
        alert('Failed to delete category. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category.');
    }
  };

  const handleSearchFilter = (details) => {
    if (!details) {
      setCategories(originalCategories);
      return;
    }

    const filteredCategories = originalCategories.filter(item =>
      item.name.toLowerCase().startsWith(details.toLowerCase()) ||
      item.description.toLowerCase().startsWith(details.toLowerCase())
    );
    setCategories(filteredCategories);
  };

  return (
    <div className="p-6">
      <div className={`transition-all duration-300 ${(isAddModalOpened || isEditModalOpened) ? "blur-sm" : ""}`}>
        <Header 
          description="Manage and track all inventory issues" 
          handleButton={handleAddNewCategory} 
          title="Category Management" 
          btnTitle="New Category" 
        />
        
        <SearchBox handleSearchFilter={handleSearchFilter} label="Category" />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!loading && !error && categories.length === 0 && (
          <p className="empty-state">No categories found.</p>
        )}

        {!loading && categories.length > 0 && (
          <div className="table-container">
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
                {categories.map((cat, index) => (
                  <tr key={cat.id || index} className="hover:bg-gray-50">
                    <td className="table-cell">{index + 1}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(isAddModalOpened || isEditModalOpened) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {isAddModalOpened && (
              <AddCategory 
                closeModal={closeModal} 
                fetchCategories={fetchCategories}
              />
            )}
            {isEditModalOpened && (
              <EditCategory 
                closeModal={closeModal} 
                catId={categoryId}
                fetchCategories={fetchCategories}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategory;