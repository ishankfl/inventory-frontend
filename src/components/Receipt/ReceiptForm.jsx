import * as Yup from 'yup';
import { FiEye, FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchAllVendors, fetchAllItems, createReceipt } from '../../api/receipt';
import AddItemForm from './AddItemForm';
import AddedItems from './AddedItems';
import { itemSchema, validatePrimaryInfo, validateItem, primaryInfoSchema } from '../../utils/yup/receipt-form.vaid';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const Receipt = () => {
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [randomForReceipt, setRandomForReceipt] = useState('');
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({ primary: {}, item: {} });

  const initialPrimaryInfo = {
    entryOf: 'PURCHASE',
    stockFlowTo: 'STORE',
    receiptNo: '',
    receiptDateAD: new Date().toISOString().split('T')[0],
    receiptDateBS: '',
    fiscalYear: '2081-2082',
    purchaseType: 'CREDIT',
    billNo: '',
    billDateAD: new Date().toISOString().split('T')[0],
    billDateBS: '',
    vendor: '',
  };

  const initialNewItemState = {
    currency: 'NPR',
    itemId: '',
    itemGroup: '',
    uom: '',
    isComplimentary: 'NO',
    taxStructure: '',
    quantity: '',
    rate: '',
    value: '',
    discountPercent: '',
    discountAmount: '0.00',
  };

  const [primaryInfo, setPrimaryInfo] = useState(initialPrimaryInfo);
  const [newItem, setNewItem] = useState(initialNewItemState);
  const [addedItems, setAddedItems] = useState([]);

  useEffect(() => {
    getVendors();
    getItems();
    generateRandom();
  }, []);

  const getVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllVendors();
      if (response.status === 200) {
        setVendors(response.data);
        if (response.data.length > 0) {
          setPrimaryInfo(prev => ({
            ...prev,
            vendor: response.data[0].id.toString()
          }));
        }
      }
    } catch (e) {
      console.error("Error fetching vendors:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllItems();
      if (response.status === 200) setItems(response.data);
    } catch (e) {
      console.error("Error fetching items:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrimaryChange = async (e) => {
    const { name, value } = e.target;
    setPrimaryInfo(prev => ({ ...prev, [name]: value }));
    
    if (errors.primary[name]) {
      try {
        await Yup.reach(primaryInfoSchema, name).validate(value);
        setErrors(prev => ({
          ...prev,
          primary: { ...prev.primary, [name]: undefined }
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          primary: { ...prev.primary, [name]: err.message }
        }));
      }
    }
  };

  const handleItemChange = async (e) => {
    const { name, value } = e.target;
    setNewItem(prev => {
      const updatedItem = { ...prev, [name]: value };

      if (name === 'itemId') {
        const selected = items.find(i => i.id.toString() === value);
        if (selected) {
          updatedItem.itemGroup = selected.itemGroup || '';
          updatedItem.uom = selected.uom || '';
          updatedItem.rate = selected.price || '';
          setSelectedItem(selected);
        } else {
          setSelectedItem(null);
        }
      }

      return updatedItem;
    });

    if (errors.item[name]) {
      try {
        await Yup.reach(itemSchema, name).validate(value);
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: undefined }
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: err.message }
        }));
      }
    }
  };

  const handleQuantityOrRateChange = async (e) => {
    const { name, value } = e.target;
    setNewItem(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'quantity' || name === 'rate') {
        const qty = parseFloat(updated.quantity) || 0;
        const rate = parseFloat(updated.rate) || 0;
        updated.value = (qty * rate).toFixed(2);
      }
      
      return updated;
    });

    if (errors.item[name]) {
      try {
        await Yup.reach(itemSchema, name).validate(value);
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: undefined }
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: err.message }
        }));
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    const isItemValid = await validateItem(setErrors, newItem);
    if (!isItemValid) return;

    const selected = items.find(i => i.id.toString() === newItem.itemId);
    if (!selected) {
      alert("Selected item not found");
      return;
    }

    const itemToAdd = {
      ...newItem,
      tempId: Date.now(), 
      itemName: selected.name,
      value: newItem.value
    };

    const existingItemIndex = addedItems.findIndex(item => item.itemId === newItem.itemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...addedItems];
      updatedItems[existingItemIndex] = itemToAdd;
      setAddedItems(updatedItems);
    } else {
      setAddedItems([...addedItems, itemToAdd]);
    }

    setNewItem(initialNewItemState);
    setSelectedItem(null);
  };

  const handleRemoveItem = (tempId) => {
    setAddedItems(prev => prev.filter(item => item.tempId !== tempId));
  };

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleItemAdded = async () => {
    await getItems();
    handleCloseForm();
  };

  const calculateTotal = () => {
    return addedItems.reduce((sum, item) => {
      return sum + (parseFloat(item.value) || 0);
    }, 0).toFixed(2);
  };

  const handleSubmitReceipt = async (e) => {
    e.preventDefault();
    
    const isPrimaryValid = await validatePrimaryInfo(setErrors, primaryInfo);
    if (!isPrimaryValid) return;

    if (addedItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const receiptData = {
      receiptId: randomForReceipt,
      receiptDate: primaryInfo.receiptDateAD,
      billNo: primaryInfo.billNo,
      vendorId: primaryInfo.vendor,
      receiptDetails: addedItems.map(item => ({
        itemId: item.itemId,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate)
      }))
    };

    try {
      setIsLoading(true);
      const response = await createReceipt(receiptData);
      
      if (response.data) {
        alert("Receipt saved successfully!");
        setPrimaryInfo(initialPrimaryInfo);
        setAddedItems([]);
        generateRandom();
      }
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert(`Error: ${error.response?.data?.message || error.message || "Failed to save receipt"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const SectionHeader = ({ title, icon }) => (
    <div className="flex items-start gap-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      {icon && <span className="text-blue-600 bg-blue-100 rounded-full p-1">{icon}</span>}
    </div>
  );

  const generateRandom = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '#__';

    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomForReceipt(result);
  };

  const handleViewReceipt = () => {
    navigate('/receipt-list');
  };

  return (
    <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen">
      <div className="mx-auto">
        <div className="flex flex-col px-24 gap-8">
          <button 
            onClick={handleViewReceipt} 
            className="my-0 w-64 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiEye /> View Receipt
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Receipts Inventory</h1>
        </div>

        {showForm && (
          <AddItemForm
            onClose={handleCloseForm}
            onItemAdded={handleItemAdded}
            fetchAllItem={getItems}
          />  
        )}

        <form onSubmit={handleAddItem}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 py-4 justify-items-center">
            <div className="bg-white py-8 px-4 rounded-lg shadow-md w-[80%]">
              <SectionHeader title="Primary Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormSelect
                  label="Entry Of"
                  name="entryOf"
                  value={primaryInfo.entryOf}
                  onChange={handlePrimaryChange}
                  options={[
                    { value: "PURCHASE", label: "PURCHASE" },
                    { value: "SALE", label: "SALE" }
                  ]}
                  error={errors.primary.entryOf}
                />
                <FormInput
                  label="Receipt #"
                  name="receiptNo"
                  type="text"
                  value={randomForReceipt}
                  onChange={handlePrimaryChange}
                  error={errors.primary.receiptNo}
                  readOnly
                />
                <FormInput
                  label="Receipt Date (AD)"
                  name="receiptDateAD"
                  type="date"
                  value={primaryInfo.receiptDateAD}
                  onChange={handlePrimaryChange}
                  error={errors.primary.receiptDateAD}
                  required
                />
                <FormInput
                  label="Bill Number"
                  name="billNo"
                  type="text"
                  value={primaryInfo.billNo}
                  onChange={handlePrimaryChange}
                  error={errors.primary.billNo}
                  required
                />
                <FormInput
                  label="Bill Date (AD)"
                  name="billDateAD"
                  type="date"
                  value={primaryInfo.billDateAD}
                  onChange={handlePrimaryChange}
                  error={errors.primary.billDateAD}
                />
                <FormSelect
                  label="Vendor"
                  name="vendor"
                  value={primaryInfo.vendor}
                  onChange={handlePrimaryChange}
                  options={[
                    { value: "", label: "Select Vendor" },
                    ...vendors.map(v => ({ value: v.id, label: v.name }))
                  ]}
                  error={errors.primary.vendor}
                  required
                />
              </div>
            </div>

            <div className="py-8 px-4 bg-white rounded-lg shadow-md w-[80%]">
              <SectionHeader title="Item Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormSelect
                  label="Currency"
                  name="currency"
                  value={newItem.currency}
                  onChange={handleItemChange}
                  options={[
                    { value: "NPR", label: "NPR" },
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" }
                  ]}
                />
                <div className="relative">
                  <FormSelect
                    label="Item Name"
                    name="itemId"
                    value={newItem.itemId}
                    onChange={handleItemChange}
                    options={[
                      { value: "", label: "Choose Item" },
                      ...items.map(i => ({ value: i.id, label: i.name }))
                    ]}
                    error={errors.item.itemId}
                    required
                    className={`border-green-500 ring-2 ring-green-200 pr-10 ${
                      errors.item.itemId ? 'border-red-500 ring-red-200' : ''
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-9 p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                    onClick={handleOpenForm}
                  >
                    <PlusIcon />
                  </button>
                </div>
                <FormInput
                  label="Quantity"
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={handleQuantityOrRateChange}
                  error={errors.item.quantity}
                  required
                  min="0.01"
                  step="0.01"
                />
                <FormInput
                  label="Rate"
                  name="rate"
                  type="number"
                  placeholder="Rate"
                  value={newItem.rate}
                  onChange={handleQuantityOrRateChange}
                  error={errors.item.rate}
                  required
                  min="0.01"
                  step="0.01"
                />
                <FormInput
                  label="Value"
                  name="value"
                  type="text"
                  value={newItem.value}
                  readOnly
                  className="bg-gray-100"
                />
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
                    onClick={() => {
                      setNewItem(initialNewItemState);
                      setSelectedItem(null);
                      setErrors(prev => ({ ...prev, item: {} }));
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <AddedItems 
          addedItems={addedItems} 
          handleRemoveItem={handleRemoveItem} 
          calculateTotal={calculateTotal}
        />

        <div className="mt-8 flex justify-end gap-4 px-24">
          <button
            type="button"
            className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={() => {
              setPrimaryInfo(initialPrimaryInfo);
              setAddedItems([]);
              setErrors({ primary: {}, item: {} });
              generateRandom();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              addedItems.length === 0 || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={handleSubmitReceipt}
            disabled={addedItems.length === 0 || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;