import React, { useEffect, useState } from 'react';
import { addProduct } from '../../api/product';
import { getAllCategories, getCategories } from '../../api/category';
import { getUserId } from '../../utils/tokenutils';
// import '../../styles/product.scss'; // Optional CSS

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

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

    if (!name || !quantity || !price || !categoryId) {
      setError("All fields except description are required");
      return;
    }

    const newProduct = {
      name,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      categoryId
    };

    try {
      const response = await addProduct(name,description,quantity, price,categoryId,getUserId());
      console.log(response)
      if (response.status === 200 || response.status == 201) {
        alert("Product added successfully!");
        setName('');
        setDescription('');
        setQuantity('');
        setPrice('');
        setCategoryId('');
        setError('');
      } else {
        setError("Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err.message);
      setError("An error occurred while adding the product");
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}
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
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
