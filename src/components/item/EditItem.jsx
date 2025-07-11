import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../../api/item';
import FormInput from '../common/FormInput';
import '../../styles/form.scss';
import { editProductSchema } from '../../utils/yup/receipt-form.vaid';

const EditProduct = ({ onClose, productId }) => {
  const id = productId;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        console.log(res.data)
        console.log(res.status)
        const data = res.data;
        setUnit(data.unit)
        setName(data.name || '');
        setQuantity(
          data.stock?.reduce((sum, s) => sum + (s.currentQuantity || 0), 0)?.toString() || ''
        );
        setPrice(data.price?.toString() || '');
        setUserId(data.userId || '');
      } catch (err) {
        console.log(err)
        setErrors({ api: 'Could not load product details.' });
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = { name, unit, price };

    try {
      await editProductSchema.validate(formData, { abortEarly: false });

      setIsSubmitting(true);
console.log({ id, name, unit, price });

      const response = await updateProduct(
        id,
        name,
        unit,
        parseInt(price),
      );

      if (response.status === 200) {
        alert('Product updated successfully!');
        onClose ? onClose() : navigate('/view-products');
      } else {
        setErrors({ api: 'Failed to update product. Please try again.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ api: 'Unexpected error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="!bg-white container">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

      {errors.api && <p className="text-red-600 mb-3">{errors.api}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Product Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
          disabled={isSubmitting}
        />

        <FormInput
          label="Unit"
          name="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          error={errors.name}
          required
          disabled={isSubmitting}
        />


        {/* Quantity is not editable here but included for API call */}

        <FormInput
          label="Price (Rs)"
          name="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
          required
          disabled={isSubmitting}
          min={0}
          step="0.01"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
