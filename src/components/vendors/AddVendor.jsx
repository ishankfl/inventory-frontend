import { useState } from 'react';
import '../../styles/form.scss';
import { addVendor } from '../../api/vendors';
import { vendorSchema } from '../../utils/yup/vendor-validation';

const AddVendor = ({ onClose, fetchAllVendors }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { name, email };

    try {
      await vendorSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const response = await addVendor(name, email);

      if (response.status === 201 || response.status === 200) {
        alert('Vendor added successfully!');
        setName('');
        setEmail('');
        fetchAllVendors();
        onClose();
      } else {
        setErrors({ api: 'Failed to add vendor. Please try again.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error adding vendor:', err);
        setErrors({ api: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!bg-white container">
      <h2>Add New Vendor</h2>
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

export default AddVendor;
