import { useState } from 'react';
import '../../styles/form.scss';
import { addDepartment } from '../../api/departments';
import { departmentSchema } from '../../utils/yup/department-validation';

const AddDepartment = ({ onClose, fetchAllDepartments }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { name, description };

    try {
      await departmentSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const response = await addDepartment(name, description);

      if (response.status === 201 || response.status === 200) {
        alert('Department added successfully!');
        setName('');
        setDescription('');
        fetchAllDepartments();
        onClose();
      } else {
        setErrors({ api: 'Failed to add department. Please try again.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error adding department:', err);
        setErrors({ api: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!bg-white container">
      <h2>Add New Department</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && (
          <label className="error-msg" style={{ color: 'red', marginBottom: '1rem', display: 'block' }}>
            {errors.api}
          </label>
        )}

        <div>
          <label>Department Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
          />
          {errors.name && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label>Department Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter department description"
          />
          {errors.description && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.description}
            </p>
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" className="text-white" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="!bg-red-600 hover:!bg-red-700 text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
