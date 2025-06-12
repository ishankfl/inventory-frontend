import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../api/product';
import { getAllCategories } from '../../api/category'; // <-- import your category API
import '../../styles/form.scss';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [userId, setUserId] = useState('');
  const [categories, setCategories] = useState([]); // For dropdown
  const [error, setError] = useState('');

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await getProductById(id);
        const data = res.data;
        console.log("Fetched product:", data);

        setName(data.name || '');
        setDescription(data.description || '');
        setQuantity(data.quantity || '');
        setPrice(data.price || '');
        setCategoryId(data.category?.id || '');
        setUserId(data.userId || '');
      } catch (err) {
        console.error("Failed to fetch product:", err.message);
        setError("Could not load product details.");
      }
    }

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, name, description, quantity, price, categoryId, userId);
      navigate('/view-products');
    } catch (err) {
      console.error("Error updating product:", err.message);
      setError("Failed to update product.");
    }
  };

  return (
    <div className="container">
      <h2>Edit Product</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Category:</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Update Product</button>
          <button type="button" onClick={() => navigate('/view-products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
