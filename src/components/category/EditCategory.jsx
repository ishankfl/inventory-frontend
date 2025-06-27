import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../api/category';
import '../../styles/form.scss';

const EditCategory = ({ closeModal, catId }) => {
  // console.log(catId);
  const id = catId;
  // const id  =id ;
  // console.log(id)
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
          console.log(response.data)
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

    const newErrors = {};
    if (!categoryName.trim()) newErrors.categoryName = 'Category Name is required';
    if (!categoryDescription.trim()) newErrors.categoryDescription = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await updateCategory(id, categoryName, categoryDescription);
      if (response.status === 200) {
        alert('Category updated successfully!');
        navigate('/view-categories'); // Redirect back to view page
      } else {
        setErrors({ api: 'Failed to update category.' });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setErrors({ api: 'An error occurred during update.' });
    }
  };

  if (loading) return <p>Loading category data...</p>;

  return (
    <div className="container">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && <p className="error-msg">{errors.api}</p>}
        { }
        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {errors.categoryName && <p className="error-msg">{errors.categoryName}</p>}
        </div>

        <div>
          <label>Category Description</label>
          <input
            type="text"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
          {errors.categoryDescription && <p className="error-msg">{errors.categoryDescription}</p>}
        </div>

        <div>
          <button type="submit">Update</button>
          <button type="button" onClick={closeModal}
          >Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
