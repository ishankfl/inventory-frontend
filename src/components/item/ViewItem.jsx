import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProducts } from '../../api/item';
import Header from '../common/Header';
import SearchBox from '../common/SearchBox';
import AddItemForm from '../Receipt/AddItemForm';
import EditProduct from './EditItem';
import '../../styles/view.scss'; // Import styles with @apply

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [error, setError] = useState('');
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = Math.ceil(totalProducts / limit);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const res = await getAllProducts(page, limit);
      setProducts(res.data.data);
      setTotalProducts(res.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    }
  };

  const handleSearchFilter = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
    // Optional: implement server-side search later
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteProducts(id);
      fetchProducts(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

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

      {/* Pagination */}
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

      {/* Modal */}
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
