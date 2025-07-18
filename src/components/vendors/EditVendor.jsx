import { useEffect, useState } from 'react';
import '../../styles/form.scss';
import { getVendorById, updateVendor } from '../../api/vendors';
import { vendorSchema } from '../../utils/yup/vendor-validation';

const EditVendor = ({ onClose, id, fetchAllVendors }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await getVendorById(id);
        if (response.status === 200) {
          const { name, email } = response.data;
          setName(name);
          setEmail(email);
        } else {
          setErrors({ api: 'Failed to load vendor data.' });
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
        setErrors({ api: 'An error occurred while fetching vendor.' });
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { name, email };

    try {
      await vendorSchema.validate(formData, { abortEarly: false });

      const response = await updateVendor(id, name, email);
      if (response.status === 200) {
        alert('Vendor updated successfully!');
        fetchAllVendors();
        onClose();
      } else {
        setErrors({ api: 'Failed to update vendor.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error updating vendor:', err);
        setErrors({ api: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  if (loading) return <p>Loading vendor data...</p>;

  return (
    <div className="!bg-white container">
      <h2>Edit Vendor</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && (
          <label className="error-msg" style={{ color: 'red', marginBottom: '1rem', display: 'block' }}>
            {errors.api}
          </label>
        )}

        <div>
          <label>Vendor Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter vendor name"
          />
          {errors.name && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label>Vendor Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter vendor email"
          />
          {errors.email && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.email}
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

export default EditVendor;
