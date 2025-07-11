import React, { useEffect, useState } from 'react';
import { addProduct } from '../../api/item';
import { getAllCategories } from '../../api/category';
import { getUserId } from '../../utils/tokenutils';
import { productSchema } from '../../utils/yup/product-validation';
import '../../styles/form.scss';

const AddProduct = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err.message);
        setErrors({ api: 'Failed to load categories. Please try again.' });
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // clear old errors

    const formData = { name, description, quantity, price, categoryId };

    try {
      await productSchema.validate(formData, { abortEarly: false });

      setIsSubmitting(true);

      const response = await addProduct(
        name,
        description,
        parseInt(quantity, 10),
        parseFloat(price),
        categoryId,
        getUserId()
      );

      if (response.status === 200 || response.status === 201) {
        alert('Product added successfully!');
        setName('');
        setDescription('');
        setQuantity('');
        setPrice('');
        setCategoryId('');
        onClose?.();
      } else {
        setErrors({ api: 'Failed to add product. Please try again.' });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error adding product:', err);
        setErrors({ api: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="!bg-white container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {errors.api && (
          <label className="error-msg" style={{ color: 'red', marginBottom: '1rem', display: 'block' }}>
            {errors.api}
          </label>
        )}

        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Enter product name"
          />
          {errors.name && <p className="error-msg" style={{ color: 'red' }}>{errors.name}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            placeholder="Enter product description (optional)"
          />
          {errors.description && <p className="error-msg" style={{ color: 'red' }}>{errors.description}</p>}
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={isSubmitting}
            min={0}
            placeholder="Enter quantity"
          />
          {errors.quantity && <p className="error-msg" style={{ color: 'red' }}>{errors.quantity}</p>}
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isSubmitting}
            min={0}
            placeholder="Enter price"
          />
          {errors.price && <p className="error-msg" style={{ color: 'red' }}>{errors.price}</p>}
        </div>

        <div>
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting || categories.length === 0}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="error-msg" style={{ color: 'red' }}>{errors.categoryId}</p>}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="!bg-red-600 hover:!bg-red-700 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
