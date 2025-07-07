import { useEffect, useState } from 'react';
import '../../styles/form.scss';
import { getDepartmentById, updateDepartment } from '../../api/departments';
import { departmentSchema } from '../../utils/yup/department-validation';

const EditDepartment = ({ onClose, id, fetchAllDepartments }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(id);
        if (response.status === 200) {
          const { name, description } = response.data;
          setName(name);
          setDescription(description);
        } else {
          setErrors({ api: 'Failed to load department data.' });
        }
      } catch (error) {
        console.error('Error fetching department:', error);
        setErrors({ api: 'An error occurred while fetching department.' });
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { name, description };

    try {
      await departmentSchema.validate(formData, { abortEarly: false });

      const response = await updateDepartment(id, name, description);
      if (response.status === 200) {
        alert('Department updated successfully!');
        fetchAllDepartments();
        onClose();
      } else {
        setErrors({ api: 'Failed to update department.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error updating department:', err);
        setErrors({ api: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  if (loading) return <p>Loading department data...</p>;

  return (
    <div className="!bg-white container">
      <h2>Edit Department</h2>
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
          <button type="submit" className="text-white">
            Update
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

export default EditDepartment;
