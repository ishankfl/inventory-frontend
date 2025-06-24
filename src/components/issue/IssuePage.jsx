import React, { useEffect, useState } from "react";
import { getAllDepartments } from "../../api/departments";
import { getAllProducts } from "../../api/product";
import { addNewProduct, completeIssue, fetchIssuedItemByDept, issueProducts } from "../../api/issue";
import { getToken, getUserId } from "../../utils/tokenutils";

const IssuePage = () => {
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [issuedById, setIssuedById] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const [departmentItems, setDepartmentItems] = useState([]);
  const [error, setError] = useState("");
  const [issudeId, setIssueId] = useState("");

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
      console.log(response.status);
      // Reset quantity after adding
      setProductQuantities(prev => ({
        ...prev,
        [productId]: { ...prev[productId], quantity: 0 }
      }));
      // Refresh department items
      fetchIssuedItemsByDept();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchIssuedItemsByDept = async () => {
    if (!selectedDept) return;
    
    try {
      const response = await fetchIssuedItemByDept(selectedDept);
      if (response.status === 204) {
        console.log("No content");
        setDepartmentItems([]);
      } else {
        console.log(response.status);
        console.log(response.data);
        setIssueId(response.data.id)
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
      const response = await completeIssue(issudeId);
      console.log(response.data);
      // const itemsByDepartment = {};
      // departmentItems.forEach(item => {
      //   if (!itemsByDepartment[item.departmentId]) {
      //     itemsByDepartment[item.departmentId] = [];
      //   }
      //   itemsByDepartment[item.departmentId].push(item);
      // });

      // for (const deptId in itemsByDepartment) {
      //   const payload = {
      //     departmentId: deptId,
      //     issuedById,
      //     items: itemsByDepartment[deptId].map(item => ({
      //       productId: item.productId,
      //       quantityIssued: item.quantity,
      //     })),
      //   };
      // }

      alert("Products issued successfully!");
      setDepartmentItems([]);
      setProductQuantities({});
    } catch (err) {
      console.error("Failed to issue products", err);
      alert("An error occurred while issuing products.");
    }
  };

  // const onUpdateQuantity=()=>{

  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Issue Products</h2>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                        Available Qty
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                        Enter Qty
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                        Action
                      </th>
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
                            prod.quantity > 10 
                              ? 'bg-green-100 text-green-800' 
                              : prod.quantity > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
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
                            onChange={(e) =>
                              handleQuantityChange(prod.id, prod.name, e.target.value)
                            }
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
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
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Department Selection */}
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

          {/* Selected Products */}
          <div className="flex-1 overflow-y-auto">
            <SelectedProduct
              departmentItems={departmentItems}
              onIssueProducts={handleIssueProducts}
              selectedDept={selectedDept}
              departments={departments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectedProduct = ({ departmentItems, onIssueProducts, selectedDept, departments }) => {
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
          {/* Department Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-600 text-lg mr-3">🏢</div>
              <div>
                <p className="font-medium text-blue-900">Issuing to:</p>
                <p className="text-blue-700 text-sm">{selectedDepartment?.name}</p>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-3">
            {issuedItemsForDepartment.map((item, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{item.productName}</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          // onClick={() => onUpdateQuantity && onUpdateQuantity(index, Math.max(1, item.quantityIssued - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 text-gray-600"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.maxQuantity}
                          value={item.quantityIssued}
                          // onChange={(e) =>
                            // onUpdateQuantity && onUpdateQuantity(index, Math.max(1, parseInt(e.target.value) || 1))
                          // }
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          // onClick={() =>
                          //   // onUpdateQuantity && onUpdateQuantity(index, Math.min(item.maxQuantity, item.quantityIssued + 1))
                          // }
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    // onClick={() => onRemoveProduct && onRemoveProduct(index)}
                    className="ml-4 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                    title="Remove product"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Issue Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onIssueProducts}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
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