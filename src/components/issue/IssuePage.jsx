import React, { useEffect, useState } from "react";
import { getAllDepartments } from "../../api/departments";
import { getAllProducts } from "../../api/product";
import { addNewProduct, completeIssue, fetchIssuedItemByDept, issueProducts, removeProductFromIssue } from "../../api/issue";
import { getToken, getUserId } from "../../utils/tokenutils";

const IssuePage = () => {
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [issuedById, setIssuedById] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const [departmentItems, setDepartmentItems] = useState([]);
  const [error, setError] = useState("");
  const [issueId, setIssueId] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchProducts();
    getIssuedById();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartments();
      setDepartments(res.data);
    } catch (err) {
      setError("Failed to load departments");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    }
  };

  const getIssuedById = () => {
    const token = getUserId();
    setIssuedById(token);
  };

  const handleQuantityChange = (productId, productName, quantity) => {
    const newQuantities = { ...productQuantities };
    newQuantities[productId] = { productName, quantity: parseInt(quantity || 0) };
    setProductQuantities(newQuantities);
  };

  const handleAddProduct = async (productId) => {
    if (!selectedDept || !productQuantities[productId]) return;

    try {
      const response = await addNewProduct(
        selectedDept,
        issuedById,
        productId,
        productQuantities[productId].quantity
      );
      
      if (response.status === 200) {
        // Update product quantities in the list
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, quantity: product.quantity - productQuantities[productId].quantity }
              : product
          )
        );
        
        setProductQuantities(prev => ({
          ...prev,
          [productId]: { ...prev[productId], quantity: 0 }
        }));
        
        fetchIssuedItemsByDept();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchIssuedItemsByDept = async () => {
    if (!selectedDept) return;

    try {
      const response = await fetchIssuedItemByDept(selectedDept);
      if (response.status === 204) {
        setDepartmentItems([]);
      } else {
        setIssueId(response.data.id);
        setDepartmentItems(response.data);
      }
    } catch (e) {
      console.log(e);
      setDepartmentItems([]);
    }
  };

  const handleDepartmentSelection = (department) => {
    setSelectedDept(department);
    if (department) {
      fetchIssuedItemsByDept();
    } else {
      setDepartmentItems([]);
    }
  };

  const handleIssueProducts = async () => {
    try {
      const response = await completeIssue(issueId);
      if (response.status === 200) {
        alert("Products issued successfully!");
        // Refresh products to get updated quantities
        fetchProducts();
        setDepartmentItems([]);
        setProductQuantities({});
      }
    } catch (err) {
      console.error("Failed to issue products", err);
      alert("An error occurred while issuing products.");
    }
  };

  const handleRemoveItem = async (productId, quantity) => {
    try {
      const response = await removeProductFromIssue(issueId, productId);
      if (response.status === 200) {
        // Update product quantities in the list
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, quantity: product.quantity + quantity }
              : product
          )
        );
        fetchIssuedItemsByDept();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="main-container-box !mr-0">
          <div className="view-container overflow-x-auto">
            <h2>Issue Products</h2>
            {error && (
              <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-700 text-sm">{error}</p>
              </div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Available Qty</th>
                  <th>Enter Qty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                      {prod.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">
                      {prod.description || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prod.quantity > 10 ? 'status-high' :
                        prod.quantity > 0 ? 'status-medium' : 'status-low'
                      }`}>
                        {prod.quantity}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        max={prod.quantity}
                        value={productQuantities[prod.id]?.quantity || ""}
                        onChange={(e) => handleQuantityChange(prod.id, prod.name, e.target.value)}
                        className="input-field w-20 text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        disabled={
                          !selectedDept ||
                          !productQuantities[prod.id]?.quantity ||
                          productQuantities[prod.id]?.quantity <= 0 ||
                          prod.quantity < productQuantities[prod.id]?.quantity
                        }
                        onClick={() => handleAddProduct(prod.id)}
                        className="btn-primary px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        Add to Dept
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <label htmlFor="department" className="block text-sm font-semibold text-gray-900 mb-3">
            Select Department
          </label>
          <select
            id="department"
            value={selectedDept}
            onChange={(e) => handleDepartmentSelection(e.target.value)}
            className="input-field"
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SelectedProduct
            departmentItems={departmentItems}
            onIssueProducts={handleIssueProducts}
            selectedDept={selectedDept}
            departments={departments}
            issueId={issueId}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

const SelectedProduct = ({ departmentItems, onIssueProducts, selectedDept, departments, issueId, onRemoveItem }) => {
  const issuedItemsForDepartment = departmentItems.issueItems ?? [];
  const selectedDepartment = departments.find(d => d.id === selectedDept);

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Products</h3>

      {!selectedDept ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-gray-500 text-sm">Please select a department first</p>
        </div>
      ) : issuedItemsForDepartment.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-sm mb-2">No products selected yet</p>
          <p className="text-gray-400 text-xs">
            Add products from the table to issue to {selectedDepartment?.name}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-primary-600 text-lg mr-3">🏢</div>
              <div>
                <p className="font-medium text-primary-900">Issuing to:</p>
                <p className="text-primary-700 text-sm">{selectedDepartment?.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {issuedItemsForDepartment.map((item) => (
              <div key={item.product.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{item.product.name}</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Qty: {item.quantityIssued}</span>
                    </div>
                  </div>
                  <button
                    className="ml-4 w-8 h-8 flex items-center justify-center text-danger-500 hover:bg-danger-50 rounded-full transition-colors duration-200"
                    title="Remove product"
                    onClick={() => onRemoveItem(item.product.id, item.quantityIssued)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onIssueProducts}
              className="btn-success w-full"
            >
              Issue All Products ({issuedItemsForDepartment.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuePage;