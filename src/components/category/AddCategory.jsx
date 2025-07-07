import { useState } from 'react';
import * as Yup from 'yup';
import '../../styles/form.scss';
import { addCategory } from '../../api/category';
import { getUserId } from '../../utils/tokenutils';
import { useNavigate } from 'react-router-dom';
import { categorySchema } from '../../utils/yup/category-validation';


const AddCategory = ({ closeModal }) => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const userId = getUserId();
    const formData = { categoryName, categoryDescription };

    try {
      await categorySchema.validate(formData, { abortEarly: false });

      const response = await addCategory(categoryName, categoryDescription, userId);
      if (response.status === 201 || response.status === 200) {
        alert('Category added successfully');
        setCategoryName('');
        setCategoryDescription('');
        navigate('/view-category');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error adding category:', err);
        setErrors({ api: 'Failed to add category. Please try again.' });
      }
    }
  };

  return (
    <div className="!bg-white container">
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && (
          <label className="error-msg" style={{ color: 'red', marginBottom: '1rem', display: 'block' }}>
            {errors.api}
          </label>
        )}

        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
          {errors.categoryName && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.categoryName}
            </p>
          )}
        </div>

        <div>
          <label>Category Description</label>
          <input
            type="text"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
          />
          {errors.categoryDescription && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.categoryDescription}
            </p>
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            className="!bg-[#C62300] hover:!bg-[#F14A00] text-white"
          >
            Add
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="!bg-red-600 hover:!bg-red-700 text-white ml-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
