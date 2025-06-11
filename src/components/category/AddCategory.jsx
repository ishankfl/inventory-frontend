import { useState } from 'react';
import '../../styles/form.scss';
import { addCategory } from '../../api/category';
import { getUserId } from '../../utils/tokenutils';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {

  
  e.preventDefault();
  const userId =(getUserId())
    console.log(userId);
  const newErrors = {};
  if (!categoryName.trim()) newErrors.categoryName = 'Category Name is required';
  if (!categoryDescription.trim()) newErrors.categoryDescription = 'Description is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await addCategory(categoryName, categoryDescription,userId);
    if (response.status === 201 || response.status === 200) {
      console.log('Category added:', response.data);

      // Optionally show success message
      alert('Category added successfully');

      // Reset form
      setCategoryName('');
      setCategoryDescription('');
      setErrors({});
    }
  } catch (error) {
    console.error('Error adding category:', error);
    setErrors({ api: 'Failed to add category. Please try again.' });
  }
};

  return (
    <div className="container">
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit}>
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
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
