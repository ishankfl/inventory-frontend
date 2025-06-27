import React, { useEffect, useState } from 'react';
import { deleteCategory, getAllCategories } from '../../api/category';
import { useNavigate } from 'react-router-dom';
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'


// import '../../styles/viewCategory.scss'; // Optional styling
import '../../styles/view.scss';
const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddModelOpened, setIsAddModelOpened] = useState(false);
  const [isEditModelOpened, setIsEditModelOpened] = useState(false);
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
    console.log(id)
    setCategoryId(id);
    setIsEditModelOpened(true);
    // navigate(`/edit-product/${id}`);
  };

  const handleAddNewCategory = () => {
    setIsAddModelOpened(true);
  };

  const closeModal = () => {
    setIsAddModelOpened(false);
    setIsEditModelOpened(false);
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
  // const handleAddNewCategory = ()=>{
  //   // navigate('/add-product')
  //   navigate('/add-category')
  // }
  return (
    <div className="main-container-box relative">
      <button className='nav-item' onClick={handleAddNewCategory}>+ Add New Category</button>

      <div className={`view-container  overflow-x-auto transition-all duration-300 ${
          (isAddModelOpened ||isEditModelOpened)  ? "blur-sm pointer-events-none select-none" :  ""
        }`}>
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
      {(isAddModelOpened || isEditModelOpened) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isAddModelOpened && <AddCategory closeModal={closeModal} />}
            {isEditModelOpened && <EditCategory closeModal={closeModal} catId={categoryId} />}
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewCategory;
