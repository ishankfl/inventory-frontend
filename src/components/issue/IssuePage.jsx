import React, { useEffect, useState } from "react";
import { getAllDepartments } from "../../api/departments";
import { getAllProducts } from "../../api/product";
import { addNewProduct, completeIssue, fetchIssuedItemByDept, removeProductFromIssue, updateProduct } from "../../api/issue";
import { getUserId } from "../../utils/tokenutils";
import { useNavigate } from "react-router-dom";
import QuantityCard from "./QuantityCard";

const IssuePage = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [issuedById, setIssuedById] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const [departmentItems, setDepartmentItems] = useState([]);
  const [error, setError] = useState("");
  const [issueId, setIssueId] = useState("");
  const [quantity, setQuantity] = useState();


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
    const userId = getUserId();
    setIssuedById(userId);
  };

  const handleQuantityChange = (productId, productName, quantity) => {
    const newQuantities = { ...productQuantities };
    newQuantities[productId] = { productName, quantity: parseInt(quantity || 0) };
    setProductQuantities(newQuantities);
  };

  const handleAddProduct = async (productId) => {
    if (!selectedDept || !productQuantities[productId]) {
      setError("Please select a department and enter a quantity");
      return;
    }

    try {
      const response = await addNewProduct(
        selectedDept,
        issuedById,
        productId,
        productQuantities[productId].quantity
      );

      if (response.status === 200) {
        // Update product quantities in the main list
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === productId
              ? { ...product, quantity: product.quantity - productQuantities[productId].quantity }
              : product
          )
        );

        // Reset the input field for the added product
        setProductQuantities(prev => ({
          ...prev,
          [productId]: { ...prev[productId], quantity: 0 }
        }));

        // Refresh the department items
        await fetchIssuedItemsByDept(selectedDept);
      }
    } catch (e) {
      console.error("Failed to add product:", e);
      setError("Failed to add product to department");
    }
  };

  const fetchIssuedItemsByDept = async (deptId) => {
    if (!deptId) {
      setDepartmentItems([]);
      return;
    }

    try {
      const response = await fetchIssuedItemByDept(deptId);
      if (response.status === 204) {
        setDepartmentItems([]);
        setIssueId("");
      } else {
        setIssueId(response.data.id);
        setDepartmentItems(response.data);
      }
    } catch (e) {
      console.error("Failed to fetch department items:", e);
      setDepartmentItems([]);
      setIssueId("");
      setError("Failed to load department items");
    }
  };

  const handleDepartmentSelection = async (departmentId) => {
    setSelectedDept(departmentId);
    setProductQuantities({});
    setError("");

    if (departmentId) {
      await fetchIssuedItemsByDept(departmentId);
    } else {
      setDepartmentItems([]);
      setIssueId("");
    }
  };

  const handleIssueProducts = async () => {
    if (!issueId) {
      setError("No issue to complete");
      return;
    }

    try {
      const response = await completeIssue(issueId);
      if (response.status === 200) {
        alert("Products issued successfully!");
        // Refresh all data
        fetchProducts();
        setDepartmentItems([]);
        setProductQuantities({});
        setIssueId("");
        setSelectedDept("");
      }
    } catch (err) {
      console.error("Failed to issue products:", err);
      setError("Failed to complete the issue");
    }
  };

  const handleRemoveItem = async (productId, quantity) => {
    if (!issueId) {
      setError("No active issue to modify");
      return;
    }

    try {
      const response = await removeProductFromIssue(issueId, productId);
      if (response.status === 200) {
        // Update product quantities in the main list
        // setProducts(prevProducts =>
        //   prevProducts.map(product =>
        //     product.id === productId
        //       ? { ...product, quantity: product.quantity + quantity }
        //       : product
        //   )
        // );
        // Refresh department items
        await fetchIssuedItemsByDept(selectedDept);
        fetchProducts()
      }
    } catch (e) {
      console.error("Failed to remove product:", e);
      setError("Failed to remove product from issue");
    }
  };
  const handleViewIssueClicked = () => {
    // navigate('/add-product')
    navigate('/view-issues')
  }
  const updateQty = (productId, newQty) => {
    // Update local state only
    const updatedItems = departmentItems.issueItems.map(item =>
      item.product.id === productId
        ? { ...item, quantityIssued: newQty }
        : item
    );

    setDepartmentItems(prev => ({
      ...prev,
      issueItems: updatedItems,
    }));
  };

  const handleIncrement = async (issueId, productId, currentQty) => {
    try {
      if (currentQty < 2) {
        setError('Quantity must be at least 2 to increment');
        return;
      }

      const selectedItem = departmentItems.issueItems.find(item => item.product.id === productId);
      const availableProduct = products.find(p => p.id === productId);

      if (!selectedItem || !availableProduct) {
        setError('Product not found');
        return;
      }

      const newQty = currentQty + 1;

      // Check if we have enough available quantity
      if (availableProduct.quantity <= 1) {
        setError(`Only ${availableProduct.quantity} items available`);
        return;
      }

      updateQty(productId, newQty);

      const response = await updateProduct(issueId, productId, newQty);
      if (response.status === 200) {
        await fetchProducts();
        setError('');
      } else {
        updateQty(productId, currentQty);
        setError('Failed to update quantity');
      }
    } catch (e) {
      console.error('Failed to update product:', e);
      setError('Failed to update product quantity');
    }
  };

  const handleDecrement = async (issueId, productId, currentQty) => {
    if (currentQty <= 1) return; // prevent qty < 1

    try {
      const newQty = currentQty - 1;

      updateQty(productId, newQty);

      const response = await updateProduct(issueId, productId, newQty);
      if (response.status === 200) {
        await fetchProducts();
        setError('');
      } else {
        // Rollback if API call fails
        updateQty(productId, currentQty);
        setError('Failed to update quantity');
      }
    } catch (e) {
      console.error('Failed to update product:', e);
      setError('Failed to update product quantity');
    }
  };


  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="main-container-box !mr-0">
          <button className="nav-item" onClick={handleViewIssueClicked}>View Previous Hisotory</button>

          <div className="view-container overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Issue Products</h2>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <table className="">
              <thead>
                <tr>
                  <th >Name</th>
                  <th >Description</th>
                  <th>Available Qty</th>
                  <th>Enter Qty</th>
                  <th >Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{prod.name}</td>
                    <td className="px-4 py-3 text-gray-600">{prod.description || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prod.quantity > 10 ? 'bg-green-100 text-green-800' :
                        prod.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {prod.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        max={prod.quantity}
                        value={productQuantities[prod.id]?.quantity || ""}
                        onChange={(e) => handleQuantityChange(prod.id, prod.name, e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        placeholder="0"
                        disabled={!selectedDept}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        disabled={
                          !selectedDept ||
                          !productQuantities[prod.id]?.quantity ||
                          productQuantities[prod.id]?.quantity <= 0 ||
                          prod.quantity < productQuantities[prod.id]?.quantity
                        }
                        onClick={() => handleAddProduct(prod.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
                      >
                        Add to Dept
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <label htmlFor="department" className="block text-sm font-semibold text-gray-900 mb-3">
            Select Department
          </label>
          <select
            id="department"
            value={selectedDept}
            onChange={(e) => handleDepartmentSelection(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
          {selectedDept ? (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Products</h3>

              {departmentItems.issueItems?.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="text-blue-600 text-lg mr-3">🏢</div>
                      <div>
                        <p className="font-medium text-blue-900">Issuing to:</p>
                        <p className="text-blue-700 text-sm">
                          {departments.find(d => d.id === selectedDept)?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {departmentItems.issueItems.map((item) => (
                      // <div key={item.product.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      //   <div className="flex items-start justify-between">
                      //     <div className="flex-1">
                      //       <h4 className="font-medium text-gray-900 mb-2">{item.product.name}</h4>
                      //       <div className="flex items-center space-x-3">
                      //         <span className="text-sm text-gray-600">Qty: {item.quantityIssued}</span>
                      //       </div>
                      //     </div>
                      //     <button
                      //       className="ml-4 w-8 h-8 flex items-center justify-center  hover:bg-red-50 hover:text-red-500  rounded-full transition-colors duration-200"
                      //       title="Remove product"
                      //       onClick={() => handleRemoveItem(item.product.id, item.quantityIssued)}
                      //     >
                      //       ×
                      //     </button>
                      //   </div>
                      // </div>
                      <QuantityCard handleRemoveItem={handleRemoveItem} item={item} issueId={issueId} handleDecrement={handleDecrement} handleIncrement={handleIncrement} />
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleIssueProducts}
                      className="primary-btn w-full"
                    >
                      Issue All Products ({departmentItems.issueItems.length})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-sm mb-2">No products selected yet</p>
                  <p className="text-gray-400 text-xs">
                    Add products from the table to issue to {departments.find(d => d.id === selectedDept)?.name}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-gray-500 text-sm">Please select a department first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;