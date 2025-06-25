import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDepartment } from '../../api/departments';
import '../../styles/form.scss';

const AddDepartment = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Department name is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await addDepartment(name, description);
      if (response.status === 201 || response.status === 200) {
        alert('Department added successfully!');
        navigate('/view-departments');
      } else {
        setErrors({ api: 'Failed to add department.' });
      }
    } catch (error) {
      console.error('Error adding department:', error);
      setErrors({ api: 'An error occurred while adding department.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add Department</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && <p className="error-msg">{errors.api}</p>}

        <div>
          <label>Department Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div>
          <label>Department Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="error-msg">{errors.description}</p>}
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Department'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
