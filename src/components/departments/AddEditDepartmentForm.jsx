import { useEffect, useState } from 'react';
import '../../styles/form.scss';
import {
  addDepartment,
  getDepartmentById,
  updateDepartment,
} from '../../api/departments';
import { departmentSchema } from '../../utils/yup/department-validation';

const AddEditDepartmentForm = ({ id, onClose, fetchAllDepartments }) => {
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
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
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { name, description };

    try {
      await departmentSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const response = isEditMode
        ? await updateDepartment(id, name, description)
        : await addDepartment(name, description);

      const successStatus = isEditMode ? 200 : 201;

      if (response.status === successStatus || response.status === 200) {
        alert(`Department ${isEditMode ? 'updated' : 'added'} successfully!`);
        fetchAllDepartments();
        onClose();
      } else {
        setErrors({
          api: `Failed to ${isEditMode ? 'update' : 'add'} department.`,
        });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error in department form:', err);
        setErrors({
          api: `An unexpected error occurred. Please try again.`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p>Loading department data...</p>;

  return (
    <div className="!bg-white container">
      <h2>{isEditMode ? 'Edit Department' : 'Add New Department'}</h2>
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
            {loading ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update' : 'Add'}
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

export default AddEditDepartmentForm;
