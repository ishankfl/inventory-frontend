import React, { useEffect, useState } from 'react';
import { addProduct } from '../../api/product';
import { getAllCategories } from '../../api/category';
import { getUserId } from '../../utils/tokenutils';

const AddProduct = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err.message);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !quantity || !price || !categoryId) {
      setError("All fields except description are required");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Pass proper types to API
      const response = await addProduct(
        name,
        description,
        parseInt(quantity, 10),
        parseFloat(price),
        categoryId,
        getUserId()
      );

      if (response.status === 200 || response.status === 201) {
        // Optionally replace alert with better UI feedback
        alert("Product added successfully!");

        // Clear form
        setName('');
        setDescription('');
        setQuantity('');
        setPrice('');
        setCategoryId('');
        setError('');

        // Close modal (if passed)
        if (onClose) onClose();
      } else {
        setError("Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err.message);
      setError("An error occurred while adding the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}

        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            disabled={isSubmitting}
            min={0}
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={isSubmitting}
            min={0}
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={isSubmitting}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div >
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>{' '}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
             
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
