import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import AddItemForm from './AddItemForm';
import { createIssue } from "../../api/receipt";
import { fetchAllItems } from "../../api/receipt";
import { getAllDepartments } from '../../api/departments';
import { getUserId } from '../../utils/tokenutils';
import ItemManagementSection from './ItemManagementSection';

const IssueReceipt = () => {
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    issueId: `ISSUE-${Date.now().toString(36).toUpperCase()}`,
    issueDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    invoiceDate: '',
    deliveryNote: '',
    departmentId: '',
    items: []
  });

  // Refs
  const quantityRef = useRef(null);
  const rateRef = useRef(null);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      setIsLoading(true);
      const [depts, its, user] = await Promise.all([
        getDepartments(),
        getItems(),
        getCurrentUserData()
      ]);
      
      // Set initial department if available
      if (depts.length > 0) {
        setFormData(prev => ({
          ...prev,
          departmentId: depts[0].id
        }));
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUserData = async () => {
    try {
      const user = await getUserId();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const getDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (e) {
      console.error("Error fetching departments:", e);
    }
  };

  const getItems = async () => {
    try {
      const response = await fetchAllItems();
      if (response.status === 200) {
        setItems(response.data);
      }
    } catch (e) {
      console.error("Error fetching items:", e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    
    // Conditional validation
    if (formData.invoiceNumber && !formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required when invoice number is provided';
    }
    
    // Items validation
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.itemId) newErrors[`items[${index}].itemId`] = 'Item is required';
        if (!item.quantity || item.quantity <= 0) newErrors[`items[${index}].quantity`] = 'Valid quantity is required';
        if (!item.rate || item.rate < 0) newErrors[`items[${index}].rate`] = 'Valid rate is required';
        if (item.quantity > item.availableQuantity) {
          newErrors[`items[${index}].quantity`] = 'Quantity exceeds available stock';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = (itemToAdd) => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, itemToAdd]
    }));
    resetItemForm();
  };

  const resetItemForm = () => {
    if (quantityRef.current) quantityRef.current.value = "";
    if (rateRef.current) rateRef.current.value = "";
  };

  const handleRemoveItem = (tempId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.tempId !== tempId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!currentUser?.id) {
      alert("User information not available");
      return;
    }
    
    const issueData = {
      issueId: formData.issueId,
      issueDate: formData.issueDate,
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      deliveryNote: formData.deliveryNote,
      departmentId: formData.departmentId,
      issuedByUserId: currentUser.id,
      issueDetails: formData.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        rate: item.rate
      }))
    };
    
    try {
      setIsLoading(true);
      const response = await createIssue(issueData);
      
      if (response.data) {
        alert("Issue created successfully!");
        // Reset form
        setFormData({
          issueId: `ISSUE-${Date.now().toString(36).toUpperCase()}`,
          issueDate: new Date().toISOString().split('T')[0],
          invoiceNumber: '',
          invoiceDate: '',
          deliveryNote: '',
          departmentId: departments[0]?.id || '',
          items: []
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      alert(error.response?.data?.message || "Failed to create issue");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + (parseFloat(item.value) || 0), 
      0
    ).toFixed(2);
  };

  const SectionHeader = ({ title }) => (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );

  return (
    <div className="view-container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Create Issue</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <SectionHeader title="Primary Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue ID</label>
              <input
                type="text"
                name="issueId"
                value={formData.issueId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.issueDate ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.issueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={100}
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.invoiceDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.invoiceDate && (
                <p className="text-red-500 text-xs mt-1">{errors.invoiceDate}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.departmentId ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>
              )}
            </div>
            
            <div className="form-group md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Note</label>
              <textarea
                name="deliveryNote"
                value={formData.deliveryNote}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.deliveryNote ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="2"
                maxLength={500}
              />
              {errors.deliveryNote && (
                <p className="text-red-500 text-xs mt-1">{errors.deliveryNote}</p>
              )}
            </div>
          </div>
        </div>
        
        <ItemManagementSection 
          items={items} 
          formData={formData}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          quantityRef={quantityRef}
          rateRef={rateRef}
          calculateTotal={calculateTotal}
          errors={errors}
          setShowForm={setShowForm}
        />
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formData.items.length === 0 || isLoading}
            className={`px-6 py-2 rounded-md ${
              formData.items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isLoading ? 'Processing...' : 'Create Issue'}
          </button>
        </div>
      </form>
      
      {showForm && (
        <AddItemForm
          onClose={() => setShowForm(false)}
          onItemAdded={() => {
            getItems();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};


export default IssueReceipt;