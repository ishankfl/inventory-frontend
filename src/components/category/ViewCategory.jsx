import React, { useEffect, useState } from 'react';
import { deleteCategory, getAllCategories } from '../../api/category';
import { useNavigate } from 'react-router-dom';

// import '../../styles/viewCategory.scss'; // Optional styling
import '../../styles/view.scss';
const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200) {
        setCategories(response.data);
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

  // Placeholder functions for edit and delete
  // const handleEdit = (categoryId) => {
  //   console.log('Edit category with ID:', categoryId);
  //   // Navigate to edit page or open a modal (implementation dependent)
  // };
    // Placeholder functions for edit and delete
const handleEdit = (categoryId) => {
  navigate(`/edit-category/${categoryId}`);
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
      console.error('Delete failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    alert('An error occurred while deleting the category.');
  }
};
  const handleAddNewCategory = ()=>{
    // navigate('/add-product')
    navigate('/add-category')
  }
  return (
    <div className="main-container-box">
            <button className='nav-item' onClick={handleAddNewCategory}>+ Add New Category</button>

    <div className="view-container">
      <h2>View All Categories</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && categories.length === 0 && <p>No categories found.</p>}

      {!loading && categories.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id || index}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button onClick={() => handleEdit(cat.id)}>Edit</button>
                  <button onClick={() => handleDelete(cat.id)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    
    </div>
  );
};

export default ViewCategory;
