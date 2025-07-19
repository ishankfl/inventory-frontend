// src/components/products/ViewProducts.jsx
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import SearchBox from '../common/SearchBox';
import AddEditItemForm from './AddEditItemForm';
import { useItem } from '../../context/ItemContext';
import ToastNotification from '../common/ToggleNotification';
import '../../styles/view.scss';

const ViewProducts = () => {
  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    fetchProducts,
    removeProduct,
    setError,
  } = useItem();

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState('');
  const [toast, setToast] = useState(null);

  // Debounce search query with 1 second delay
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(1, searchQuery);
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchQuery, fetchProducts, setCurrentPage]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await removeProduct(id);
      setToast({
        type: 'success',
        message: 'Product deleted successfully.',
        duration: 3000,
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to delete product. Please try again.',
        duration: 3000,
      });
      setError(err.message);
    }
  };

  const closeModal = () => {
    setIsAddModal(false);
    setIsEditModal(false);
  };

  return (
    <div className="p-6 relative">
      {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={`transition-all duration-300 ${
          isAddModal || isEditModal ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <Header
          title="Product Management"
          btnTitle="Add"
          handleButton={() => setIsAddModal(true)}
          description="View and manage your product inventory"
        />

        <SearchBox value={searchQuery} onChange={handleSearchChange} label="Product" />

        <div className="table-container mt-4 min-h-[300px] border rounded overflow-hidden shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">S.N.</th>
                <th className="table-header">Name</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Price</th>
                <th className="table-header">Unit</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    {searchQuery ? 'No products match your search.' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const quantity = Array.isArray(product.stock)
                    ? product.stock.reduce((sum, stock) => sum + (stock.currentQuantity || 0), 0)
                    : 0;

                  return (
                    <tr key={product.id || index} className="hover:bg-gray-50">
                      <td className="table-cell">{(currentPage - 1) * 6 + index + 1}</td>
                      <td className="table-cell">{product.name}</td>
                      <td className="table-cell">{quantity}</td>
                      <td className="table-cell">Rs. {product.price?.toFixed(2)}</td>
                      <td className="table-cell">{product.unit}</td>
                      <td className="table-cell text-center space-x-2">
                        <button
                          onClick={() => {
                            setEditProductId(product.id);
                            setIsEditModal(true);
                          }}
                          className="action-button button-blue"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="action-button button-red"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {products.length > 0 && !loading && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {(isAddModal || isEditModal) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <AddEditItemForm
              initialData={isEditModal ? { id: editProductId } : null}
              onClose={closeModal}
              onSubmitSuccess={() => fetchProducts(currentPage, searchQuery)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
