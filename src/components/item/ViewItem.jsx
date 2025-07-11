import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProducts, getAllProducts } from '../../api/item';
import '../../styles/view.scss';
// import AddProduct from './AddItem';
import EditProduct from './EditItem';
import SearchBox from '../common/SearchBox';
import AddItemForm from '../Receipt/AddItemForm';
// import { fetchAllItems } from '../../api/receipt';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isAddModelOpened, setIsAddModelOpened] = useState(false);
  const [isEditModelOpened, setIsEditModelOpened] = useState(false);
  const [productId, setProductId] = useState('');
  const [originalProducts, setOriginalProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
      setOriginalProducts(res.data);
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
    setProductId(id);
    setIsEditModelOpened(true);
  };

  const handleAddNewProduct = () => {
    setIsAddModelOpened(true);
  };

  const closeModal = () => {
    // fetchProducts()
    setIsAddModelOpened(false);
    setIsEditModelOpened(false);
  };

  const handleSearchFilter = (details) => {
    if (!details) {
      setProducts(originalProducts);
      return;
    }

    const filteredProduct = originalProducts.filter(item =>
      item.name.toLowerCase().startsWith(details.toLowerCase()) ||
      (item.description?.toLowerCase().startsWith(details.toLowerCase()))
    );
    setProducts(filteredProduct);
  };

  return (
    <div className="main-container-box relative">
      <button className="nav-item" onClick={handleAddNewProduct}>+ Add New Product</button>

      <div
        className={`view-container overflow-x-auto transition-all duration-300 ${isAddModelOpened || isEditModelOpened ? "blur-sm pointer-events-none select-none" : ""}`}
      >
        <div className='flex justify-between items-center'>
          <h2>Product List</h2>
          <SearchBox handleSearchFilter={handleSearchFilter} label={'Product'} />
        </div>

        {error && <p className="error-msg">{error}</p>}

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0" className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>
                    {Array.isArray(p.stock)
                      ? p.stock.reduce((sum, stock) => sum + (stock.currentQuantity || 0), 0)
                      : 0}
                  </td>
                  <td>Rs. {p.price.toFixed(2)}</td>
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

      {(isAddModelOpened || isEditModelOpened) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isAddModelOpened && <AddItemForm onClose={closeModal} fetchAllItem={fetchProducts} />}
            {isEditModelOpened && <EditProduct onClose={closeModal} productId={productId} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
