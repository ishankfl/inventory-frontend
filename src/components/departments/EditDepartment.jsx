import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartmentById, updateDepartment } from '../../api/departments';
import '../../styles/form.scss';

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(id);
        console.log(response.status);
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

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Department name is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await updateDepartment(id, name, description);
      if (response.status === 200) {
        alert('Department updated successfully!');
        navigate('/view-departments'); // redirect after update
      } else {
        setErrors({ api: 'Failed to update department.' });
      }
    } catch (error) {
      console.error('Error updating department:', error);
      setErrors({ api: 'An error occurred during update.' });
    }
  };

  if (loading) return <p>Loading department data...</p>;

  return (
    <div className="container">
      <h2>Edit Department</h2>
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
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartment;
