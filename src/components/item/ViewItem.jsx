import React, { useState } from 'react';
import Header from '../common/Header';
import SearchBox from '../common/SearchBox';
import AddItemForm from '../common/AddItemForm';
import EditProduct from './EditItem';
import { useItem } from '../../context/ItemContext';

const ViewProducts = () => {
  const {
    products,
    totalProducts,
    currentPage,
    totalPages,
    loading,
    fetchError,
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

  const handleSearchFilter = (q) => {
    // setSearchQuery(q);
    // setCurrentPage(1);
    // fetchProducts(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await removeProduct(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-700">
        <svg
          className="animate-spin h-12 w-12 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-lg font-medium">Loading, please wait...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-5 rounded-lg text-center shadow-lg max-w-md w-full">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3v1m0 16v1m8.485-8.485l-1.414-1.414M3 12H2m1.515-3.515l1.414 1.414M16.95 7.05l1.414-1.414"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="mb-4 break-words">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Header
        title="Product Management"
        btnTitle="New Product"
        handleButton={() => setIsAddModal(true)}
        description="Manage your inventory products"
      />

      <SearchBox handleSearchFilter={handleSearchFilter} label="Product" />
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Quantity</th>
              <th className="table-header">Price</th>
              <th className="table-header text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(p => {
                const qty = Array.isArray(p.stock)
                  ? p.stock.reduce((sum, s) => sum + (s.currentQuantity || 0), 0)
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="table-cell">{p.name}</td>
                    <td className="table-cell">{qty}</td>
                    <td className="table-cell">Rs. {p.price.toFixed(2)}</td>
                    <td className="table-cell text-center space-x-2">
                      <button
                        onClick={() => { setEditProductId(p.id); setIsEditModal(true); }}
                        className="action-button button-blue"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="action-button button-red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {(isAddModal || isEditModal) && (
        <div className="modal-overlay" onClick={() => { setIsAddModal(false); setIsEditModal(false); }}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {isAddModal && (
              <AddItemForm
                onClose={() => setIsAddModal(false)}
                fetchAllItem={() => fetchProducts(currentPage)}
              />
            )}
            {isEditModal && (
              <EditProduct
                productId={editProductId}
                onClose={() => setIsEditModal(false)}
                fetchAllItem={() => fetchProducts(currentPage)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
