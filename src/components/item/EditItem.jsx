import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../../api/item';
import { getAllCategories } from '../../api/category';
import { productSchema } from '../../utils/yup/product-validation';
import '../../styles/form.scss';

const EditProduct = ({ onClose, productId }) => {
  const id = productId;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [userId, setUserId] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrors({ api: 'Failed to load categories. Please try again.' });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const data = res.data;

        setName(data.name || '');
        setDescription(data.description || '');
        setQuantity(data.quantity?.toString() || '');
        setPrice(data.price?.toString() || '');
        setCategoryId(data.category?.id || '');
        setUserId(data.userId || '');
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setErrors({ api: 'Could not load product details.' });
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    const formData = { name, description, quantity, price, categoryId };

    try {
      await productSchema.validate(formData, { abortEarly: false });

      setIsSubmitting(true);

      const response = await updateProduct(
        id,
        name,
        description,
        parseInt(quantity, 10),
        parseFloat(price),
        categoryId,
        userId
      );

      if (response.status === 200) {
        alert('Product updated successfully!');
        if (onClose) onClose();
        else navigate('/view-products');
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
        console.error('Error updating product:', err);
        setErrors({ api: 'An unexpected error occurred during update.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="!bg-white container">
      <h2>Edit Product</h2>
      {errors.api && (
        <p className="error-msg" style={{ color: 'red', marginBottom: '1rem' }}>{errors.api}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.name && <p className="error-msg" style={{ color: 'red' }}>{errors.name}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.description && <p className="error-msg" style={{ color: 'red' }}>{errors.description}</p>}
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={isSubmitting}
            min={0}
          />
          {errors.quantity && <p className="error-msg" style={{ color: 'red' }}>{errors.quantity}</p>}
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isSubmitting}
            min={0}
          />
          {errors.price && <p className="error-msg" style={{ color: 'red' }}>{errors.price}</p>}
        </div>

        <div>
          <label>Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Select Category --</option>
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
            {isSubmitting ? 'Updating...' : 'Update Product'}
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

export default EditProduct;
