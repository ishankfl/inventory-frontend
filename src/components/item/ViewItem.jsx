import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import SearchBox from '../common/SearchBox';
import { useItem } from '../../context/ItemContext';
import AddEditItemForm from './AddEditItemForm';

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

  // Debounce searchQuery changes
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(1, searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await removeProduct(id);
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <Header
        title="Product Management"
        btnTitle="Add New Product"
        handleButton={() => setIsAddModal(true)}
        description="View and manage your product inventory"
      />

      <div className="flex justify-between items-center mb-4">
        <SearchBox
          value={searchQuery}
          onChange={handleSearchChange}
          label="Product"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border min-h-[300px]">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => {
                  const quantity = Array.isArray(product.stock)
                    ? product.stock.reduce((sum, stock) => sum + (stock.currentQuantity || 0), 0)
                    : 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rs. {product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rs. {product.unit}
                      </td>
                      <td className="table-cell text-center space-x-2">
                        <button
                          onClick={() => { setEditProductId(product.id); setIsEditModal(true); }}
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
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    {searchQuery ? 'No products match your search.' : 'No products found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          Next
        </button>
      </div>

      {/* {(isAddModal || isEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {isAddModal && (
              <AddItemForm
                onClose={() => setIsAddModal(false)}
                fetchAllItem={() => fetchProducts(currentPage, searchQuery)}
              />
            )}
            {isEditModal && (
              <EditProduct
                productId={editProductId}
                onClose={() => setIsEditModal(false)}
                fetchAllItem={() => fetchProducts(currentPage, searchQuery)}
              />
            )}
          </div>
        </div>
      )} */}
      {(isAddModal || isEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <AddEditItemForm
              initialData={isEditModal ? { id: editProductId } : null} // you can pass full object if you want
              onClose={() => {
                if (isAddModal) setIsAddModal(false);
                if (isEditModal) setIsEditModal(false);
              }}
              onSubmitSuccess={() => fetchProducts(currentPage, searchQuery)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewProducts;
