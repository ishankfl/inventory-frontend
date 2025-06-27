import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProducts, getAllProducts } from '../../api/product';
import '../../styles/view.scss';
import AddProduct from './AddProduct';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isAddModelOpened, setIsAddModelOpened] = useState(false);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to load products");
    }
  };

  const handleDelete = async (id) => {
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

  const handleAddNewProduct = () => {
    setIsAddModelOpened(true);
  };

  const closeModal = () => {
    setIsAddModelOpened(false);
  };

  return (
    <div className="main-container-box relative">
      <button className="nav-item" onClick={handleAddNewProduct}>+ Add New Product</button>

      <div
        className={`view-container overflow-x-auto transition-all duration-300 ${
          isAddModelOpened ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <h2>Product List</h2>
        {error && <p className="error-msg">{error}</p>}
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0" className="min-w-full divide-y divide-gray-20">
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

      {/* Modal Overlay with Tailwind classes */}
      {isAddModelOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-0 w-full"
            onClick={(e) => e.stopPropagation()} 
          >
            <AddProduct onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
