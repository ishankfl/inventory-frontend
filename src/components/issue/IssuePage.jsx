import React, { useEffect, useState } from "react";
import { getAllDepartments } from "../../api/departments";
import { getAllProducts } from "../../api/product";
import "../../styles/view.scss";
import "../../styles/form.scss";
import "../../styles/issue.scss";
import { issueProducts } from "../../api/issue";

const IssuePage = () => {
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const [departmentItems, setDepartmentItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchProducts();
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

  const handleQuantityChange = (productId, productName, quantity) => {
    const newQuantities = { ...productQuantities };
    newQuantities[productId] = { productName, quantity: parseInt(quantity || 0) };
    setProductQuantities(newQuantities);
  };

  const handleAddProduct = async (productId) => {
    if (!selectedDept || !productQuantities[productId]) return;

    const product = products.find(p => p.id === productId);
    const department = departments.find(d => d.id === selectedDept);
    
//     export const issueProducts = (data) => {
//   return axios.post(`${server}/api/issues`, data);
// };
// if (quantity< )
const newItem = {
  productId,
  productName: product.name,
  quantity: productQuantities[productId].quantity,
  departmentId: selectedDept,
  departmentName: department ? department.name : "Unknown",
  maxQuantity: product.quantity // Store max available quantity for validation
};
  // var response = await issueProducts(newItem);
  // console.log(response.data)

    setDepartmentItems([...departmentItems, newItem]);
    setProductQuantities({});
  };

  const handleRemoveProduct = (index) => {
    const newItems = departmentItems.filter((_, i) => i !== index);
    setDepartmentItems(newItems);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    const updatedItems = [...departmentItems];
    const item = updatedItems[index];
    
    // Validate the new quantity doesn't exceed max available
    newQuantity = parseInt(newQuantity || 0);
    if (newQuantity > item.maxQuantity) {
      newQuantity = item.maxQuantity;
    } else if (newQuantity < 1) {
      newQuantity = 1;
    }

    updatedItems[index] = {
      ...item,
      quantity: newQuantity
    };
    
    setDepartmentItems(updatedItems);
  };

  const handleIssueProducts = async () => {
    const issuedById = "358ed300-f494-4a7c-8c63-238a8c2e34d3"; // Replace with actual logged-in user's ID

    try {
      // Group items by department
      const itemsByDepartment = {};
      departmentItems.forEach(item => {
        if (!itemsByDepartment[item.departmentId]) {
          itemsByDepartment[item.departmentId] = [];
        }
        itemsByDepartment[item.departmentId].push(item);
      });

      // Issue products for each department
      for (const deptId in itemsByDepartment) {
        const payload = {
          departmentId: deptId,
          issuedById,
          items: itemsByDepartment[deptId].map(item => ({
            productId: item.productId,
            quantityIssued: item.quantity,
          })),
        };
        await issueProducts(payload);
      }

      alert("Products issued successfully!");
      setDepartmentItems([]);
    } catch (err) {
      console.error("Failed to issue products", err);
      alert("An error occurred while issuing products.");
    }
  };

  return (
    <div className="main-container-box" style={{display:"flex"}}>
      <div style={{ flex: 3, paddingRight: "20px" }} className="view-container">
        <h2>Issue Products</h2>
        {error && <p className="error-msg">{error}</p>}

        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Available Qty</th>
              <th>Enter Qty</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>{prod.description || "-"}</td>
                <td>{prod.quantity}</td>
                <td>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max={prod.quantity}
                      value={productQuantities[prod.id]?.quantity || ""}
                      onChange={(e) =>
                        handleQuantityChange(prod.id, prod.name, e.target.value)
                      }
                    />
                  </div>
                </td>
                <td>
                  <button
                    disabled={
                      !selectedDept ||
                      !productQuantities[prod.id]?.quantity ||
                      productQuantities[prod.id]?.quantity <= 0 || prod.quantity<productQuantities[prod.id]?.quantity
                    }
                    onClick={() => handleAddProduct(prod.id)}
                  >
                    Add to Department
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
        <h3 htmlFor="department">Select Department: </h3>
        <select
          id="department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        
      <div className="selected-products-container">
  <h3 className="selected-products-title">Selected Products</h3>
  <div style={{ marginBottom: "20px" }}>
    {departmentItems.length === 0 ? (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <p className="empty-state-text">No products selected yet</p>
      </div>
    ) : (
      <>
        <ul className="product-cards-list">
          {departmentItems.map((item, index) => (
            <li key={index} className="product-card">
              <div className="product-card-content">
                <div className="product-info">
                  <div className="quantity-controls" style={{display:'flex'}}>
                  <h4 className="product-name">{item.productName}</h4>
                    <span className="product-name">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(index, e.target.value)}
                      className="quantity-input"
                    />
                <button 
                  onClick={() => handleRemoveProduct(index)}
                  className="remove-button"
                  title="Remove product"
                >
                  ×
                </button>
                  </div>
                  <span className="department-info">
                    📍Issuing Department {item.departmentName}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleIssueProducts} className="issue-all-button">
          🚀 Issue All Products
        </button>
      </>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default IssuePage;