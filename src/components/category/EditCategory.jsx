import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../api/category';
import * as Yup from 'yup';
import '../../styles/form.scss';
import { categorySchema } from '../../utils/yup/category-validation';


const EditCategory = ({ closeModal, catId }) => {
  const id = catId;
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(id);
        if (response.status === 200) {
          const { name, description } = response.data;
          setCategoryName(name);
          setCategoryDescription(description);
        } else {
          setErrors({ api: 'Failed to load category data.' });
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setErrors({ api: 'An error occurred while fetching category.' });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { categoryName, categoryDescription };

    try {
      await categorySchema.validate(formData, { abortEarly: false });

      const response = await updateCategory(id, categoryName, categoryDescription);
      if (response.status === 200) {
        alert('Category updated successfully!');
        navigate('/view-categories');
      } else {
        setErrors({ api: 'Failed to update category.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error updating category:', err);
        setErrors({ api: 'An error occurred during update.' });
      }
    }
  };

  if (loading) return <p>Loading category data...</p>;

  return (
    <div className="!bg-white container">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && (
          <p className="error-msg" style={{ color: 'red', marginBottom: '1rem' }}>
            {errors.api}
          </p>
        )}

        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
            Update
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

export default EditCategory;
