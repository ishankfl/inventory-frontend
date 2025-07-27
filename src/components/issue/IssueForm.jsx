import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import { fetchAllItems, fetchIssueById, createIssue, updateIssue } from "../../api/receipt";
import { getAllDepartments } from '../../api/departments';
import { getUserId } from '../../utils/tokenutils';
import ItemManagementSection from './ItemManagementSection';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import issueSchema from '../../utils/yup/issue-validation';
import AddEditItemForm from '../item/AddEditItemForm';
import { Eye } from 'lucide-react';

const IssueForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize form with Formik
  const formik = useFormik({
    initialValues: {
      issueId: isEdit ? '' : `ISSUE-${Date.now().toString(36).toUpperCase()}`,
      issueDate: new Date().toISOString().split('T')[0],
      invoiceNumber: '',
      invoiceDate: '',
      deliveryNote: '',
      departmentId: '',
      items: []
    },
    validationSchema: issueSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    }
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

      setDepartments(depts);
      setItems(its.data || its);
      setCurrentUser(user);

      if (depts.length > 0 && !isEdit) {
        formik.setFieldValue('departmentId', depts[0].id);
      }

      if (isEdit) {
        const issueData = await fetchIssueById(id);
        const transformedData = {
          issueId: issueData.data.issueId,
          issueDate: issueData.data.issueDate.split('T')[0],
          invoiceNumber: issueData.data.invoiceNumber || '',
          invoiceDate: issueData.data.invoiceDate ? issueData.data.invoiceDate.split('T')[0] : '',
          deliveryNote: issueData.data.deliveryNote || '',
          departmentId: issueData.data.departmentId,
          items: issueData.data.issueDetails.map(detail => ({
            tempId: Date.now() + Math.random(),
            itemId: detail.itemId,
            itemName: detail.item.name,
            quantity: detail.quantity.toString(),
            rate: detail.issueRate.toString(),
            value: (detail.quantity * detail.issueRate).toFixed(2),
            uom: detail.item.unit,
            availableQuantity: detail.item.stock?.reduce(
              (sum, stock) => sum + (stock.currentQuantity || 0), 0
            ) || 0
          }))
        };

        // Set all form values at once
        formik.setValues(transformedData);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      alert(isEdit ? "Failed to load issue data" : "Failed to initialize form");
      if (isEdit) navigate('/issue-list');
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
      if (response.status === 200) return response;
      throw new Error('Failed to fetch items');
    } catch (e) {
      console.error("Error fetching items:", e);
      throw e;
    }
  };

  const handleAddItem = ({ updatedItem, isUpdate }) => {
    formik.setFieldValue('items',
      isUpdate
        ? formik.values.items.map(item =>
          item.itemId === updatedItem.itemId ? updatedItem : item
        )
        : [...formik.values.items, updatedItem]
    );
  };

  const handleRemoveItem = (tempId) => {
    formik.setFieldValue('items',
      formik.values.items.filter(item => item.tempId !== tempId)
    );
  };

  const handleSubmit = async (values) => {
    if (!currentUser) {
      alert("User information not available");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        issueId: values.issueId,
        issueDate: new Date(values.issueDate).toISOString(),
        invoiceNumber: values.invoiceNumber,
        invoiceDate: values.invoiceDate?.trim() ? new Date(values.invoiceDate).toISOString() : null,
        deliveryNote: values.deliveryNote,
        departmentId: values.departmentId,
        issuedByUserId: getUserId(),
        issueDetails: values.items.map(item => ({
          itemId: item.itemId,
          quantity: parseFloat(item.quantity),
          issueRate: parseFloat(item.rate),
        }))
      };

      const response = isEdit
        ? await updateIssue(id, payload)
        : await createIssue(payload);

      if (response.data) {
        alert(`Issue ${isEdit ? 'updated' : 'created'} successfully!`);
        if (!isEdit) {
          // Reset form for new entry
          formik.resetForm({
            values: {
              issueId: `ISSUE-${Date.now().toString(36).toUpperCase()}`,
              issueDate: new Date().toISOString().split('T')[0],
              invoiceNumber: '',
              invoiceDate: '',
              deliveryNote: '',
              departmentId: departments[0]?.id || '',
              items: []
            }
          });
        }
        navigate('/issue-list');
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} issue:`, error);
      alert(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} issue`);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return formik.values.items.reduce(
      (sum, item) => sum + (parseFloat(item.value) || 0),
      0
    ).toFixed(2);
  };

  const SectionHeader = ({ title }) => (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );

  const handleViewIssue = () => {
    navigate('/issue-list');
  };

  return (
    <div className="!min-w-[80vw] view-container mx-auto py-4 px-4 md:px-24 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">
            {isEdit ? 'Edit Issue' : 'Create Issue'}
          </h1>
          <p className="text-gray-600">Manage and track all inventory issues</p>
        </div>
        <button
          onClick={handleViewIssue}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
        >
          <Eye className="h-5 w-5" />
          <span>View Previous</span>
        </button>
      </div>

      {isLoading && isEdit ? (
        <div className="text-center py-8">Loading issue data...</div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <SectionHeader title="Primary Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
                label="Issue ID"
                name="issueId"
                type="text"
                value={formik.values.issueId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                className="bg-gray-100"
              />

              <FormInput
                label="Issue Date *"
                name="issueDate"
                type="date"
                value={formik.values.issueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.issueDate && formik.errors.issueDate}
                required
              />

              <FormInput
                label="Invoice Number"
                name="invoiceNumber"
                type="text"
                value={formik.values.invoiceNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
                maxLength={100}
              />

              <FormInput
                label="Invoice Date"
                name="invoiceDate"
                type="date"
                value={formik.values.invoiceDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.invoiceDate && formik.errors.invoiceDate}
              />

              <FormSelect
                label="Department *"
                name="departmentId"
                value={formik.values.departmentId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={[
                  { value: "", label: "Select Department" },
                  ...departments.map(dept => ({
                    value: dept.id,
                    label: dept.name
                  }))
                ]}
                error={formik.touched.departmentId && formik.errors.departmentId}
                required
              />

              <div className="md:col-span-3">
                <FormInput
                  label="Delivery Note"
                  name="deliveryNote"
                  type="textarea"
                  value={formik.values.deliveryNote}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.deliveryNote && formik.errors.deliveryNote}
                  rows={2}
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          <ItemManagementSection
            items={items}
            formData={formik.values}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            calculateTotal={calculateTotal}
            errors={formik.errors}
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
              disabled={formik.values.items.length === 0 || isLoading}
              className={`w-36 px-6 py-2 rounded-md ${formik.values.items.length === 0 || isLoading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
              {isLoading
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit ? 'Update Issue' : 'Create Issue')}
            </button>
          </div>
        </form>
      )}

      {showForm && (
        <div className="modal-overlay">
          <AddEditItemForm
            onClose={() => setShowForm(false)}
            onSubmitSuccess={() => {
              getItems();
              setShowForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default IssueForm;