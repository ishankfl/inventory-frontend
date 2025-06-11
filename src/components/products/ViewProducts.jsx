import React, { useEffect, useState } from 'react';
// import { getAllProducts, deleteProduct } from '../../api/product';
import { useNavigate } from 'react-router-dom';
import { deleteProducts, getAllProducts } from '../../api/product';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to load products");
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProducts(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err.message);
      setError("Failed to delete product");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  return (
    <div className="product-container">
      <h2>Product List</h2>
      {error && <p className="error-msg">{error}</p>}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description || '-'}</td>
                <td>{p.quantity}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.category?.name || 'N/A'}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(p.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewProducts;
