import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiEye, FiPlus } from "react-icons/fi";
import AddItemForm from './AddItemForm';
import { createIssue } from "../../api/receipt";
import { fetchAllItems } from "../../api/receipt";
import { getAllDepartments } from '../../api/departments';
import { getUserId } from '../../utils/tokenutils';
import ItemManagementSection from './ItemManagementSection';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import issueSchema from '../../utils/yup/issue-validation'
const IssueReceipt = () => {
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({  
    issueId: `ISSUE-${Date.now().toString(36).toUpperCase()}`,
    issueDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    invoiceDate: '',
    deliveryNote: '',
    departmentId: '',
    items: []
  });

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
      console.log('initializing page ...........');
      console.log(user)
      setDepartments(depts);
      setItems(its);
      setCurrentUser(user);

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
      return await getUserId();
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  const getDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.status === 200) return response.data;
      throw new Error('Failed to fetch departments');
    } catch (e) {
      console.error("Error fetching departments:", e);
      throw e;
    }
  };

  const getItems = async () => {
    try {
      const response = await fetchAllItems();
      if (response.status === 200) return response.data;
      throw new Error('Failed to fetch items');
    } catch (e) {
      console.error("Error fetching items:", e);
      throw e;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = async () => {
  try {
    await  issueSchema.validate(formData, { abortEarly: false });
    setErrors({});
    return true;
  } catch (validationError) {
    if (validationError.inner) {
      const newErrors = {};
      validationError.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
    return false;
  }
};


  const handleAddItem = ({ updatedItem, isUpdate }) => {
    setFormData(prev => {
      let newItems;
      if (isUpdate) {
        newItems = prev.items.map(item =>
          item.itemId === updatedItem.itemId ? updatedItem : item
        );
      } else {
        newItems = [...prev.items, updatedItem];
      }
      return { ...prev, items: newItems };
    });
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
    if (!currentUser) {
      alert("User information not available");
      return;
    }

    try {
      setIsLoading(true);

      const response = await createIssue({
        issueId: formData.issueId,
        issueDate: new Date(formData.issueDate).toISOString(), 
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate?.trim() ? new Date(formData.invoiceDate).toISOString() : null,
        deliveryNote: formData.deliveryNote,
        departmentId: formData.departmentId,
        issuedByUserId: getUserId(),
        issueDetails: formData.items.map(item => ({
          itemId: item.itemId,
          quantity: parseFloat(item.quantity),
          issueRate: parseFloat(item.rate),
        }))
      });



      if (response.data) {
        alert("Issue created successfully!");
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
  const handleViewIssue= ()=>{
    navigate('/issue-list')
  }
  return (
    <div className="view-container mx-auto py-4 px-4 md:px-24 max-w-6xl">
             <button 
                               onClick={handleViewIssue} 

                  className="my-0 w-auto flex items-center text-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiEye /> View Previous
                </button>
                <br></br>
      <h1 className="text-2xl font-bold mb-6">Create Issue</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <SectionHeader title="Primary Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Issue ID"
              name="issueId"
              type="text"
              value={formData.issueId}
              onChange={handleInputChange}
              readOnly
              className="bg-gray-100"
            />

            <FormInput
              label="Issue Date *"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleInputChange}
              error={errors.issueDate}
              required
            />

            <FormInput
              label="Invoice Number"
              name="invoiceNumber"
              type="text"
              value={formData.invoiceNumber}
              onChange={handleInputChange}
              error={errors.invoiceNumber}
              maxLength={100}
            />

            <FormInput
              label="Invoice Date"
              name="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={handleInputChange}
              error={errors.invoiceDate}
            />

            <FormSelect
              label="Department *"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select Department" },
                ...departments.map(dept => ({
                  value: dept.id,
                  label: dept.name
                }))
              ]}
              error={errors.departmentId}
              required
            />

            <div className="md:col-span-3">
              <FormInput
                label="Delivery Note"
                name="deliveryNote"
                type="textarea"
                value={formData.deliveryNote}
                onChange={handleInputChange}
                error={errors.deliveryNote}
                rows={2}
                maxLength={500}
              />
            </div>
          </div>
        </div>

        <ItemManagementSection
          items={items}
          formData={formData}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          calculateTotal={calculateTotal}
          errors={errors}
          setShowForm={setShowForm}
        />

        <div className="flex flex-row justify-end gap-4 align-right">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 !bg-red-600 text-white rounded-md hover:bg-red-800 w-36"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formData.items.length === 0 || isLoading}
            className={` w-36 px-6 py-2 rounded-md ${formData.items.length === 0 ? 'bg-primary-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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