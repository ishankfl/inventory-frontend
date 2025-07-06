import * as Yup from 'yup';
import { FiEye, FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllVendors, fetchAllItems, fetchReceiptById, updateReceipt } from '../../api/receipt';
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

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const EditReceipt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ primary: {}, item: {} });
    const [selectedItem, setSelectedItem] = useState(null);

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
        loadReceiptData();
    }, [id]);

    const loadReceiptData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchReceiptById(id);
            if (response.data) {
                const receipt = response.data;
                const receiptDate = new Date(receipt.receiptDate);
                const formattedDate = receiptDate.toISOString().split('T')[0];

                setPrimaryInfo({
                    entryOf: 'PURCHASE',
                    stockFlowTo: 'STORE',
                    receiptNo: receipt.id,
                    receiptDateAD: formattedDate,
                    receiptDateBS: '',
                    fiscalYear: '2081-2082',
                    purchaseType: 'CREDIT',
                    billNo: receipt.billNo,
                    billDateAD: formattedDate,
                    billDateBS: '',
                    vendor: receipt.vendorId,
                });

                const formattedItems = receipt.receiptDetails.map(item => ({
                    tempId: `${item.id}-${Date.now()}`,
                    id: item.id,
                    itemId: item.itemId,
                    itemName: item.item?.name || 'Unknown Item',
                    currency: 'NPR',
                    itemGroup: '',
                    uom: item.item?.unit || '',
                    isComplimentary: 'NO',
                    taxStructure: '',
                    quantity: item.quantity.toString(),
                    rate: item.rate.toString(),
                    value: (item.quantity * item.rate).toFixed(2),
                    discountPercent: '0',
                    discountAmount: '0.00'
                }));

                setAddedItems(formattedItems);
            }
        } catch (e) {
            console.error("Error loading receipt:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const getVendors = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAllVendors();
            if (response.status === 200) {
                setVendors(response.data);
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
            id: id,
            receiptDate: primaryInfo.receiptDateAD,
            billNo: primaryInfo.billNo,
            vendorId: primaryInfo.vendor,
            receiptDetails: addedItems.map(item => ({
                id: item.id || undefined,
                itemId: item.itemId,
                quantity: parseFloat(item.quantity),
                rate: parseFloat(item.rate)
            }))
        };

        try {
            setIsLoading(true);
            const response = await updateReceipt(receiptData.id, receiptData);

            if (response.data) {
                alert("Receipt updated successfully!");
                navigate('/receipt-list');
            }
        } catch (error) {
            console.error("Error updating receipt:", error);
            alert(`Error: ${error.response?.data?.message || error.message || "Failed to update receipt"}`);
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

    const handleViewReceipt = () => {
        navigate('/receipt-list');
    };

    if (isLoading) {
        return (
            <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p>Loading receipt data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen">
            <div className="mx-auto">
                <div className="flex flex-col px-24 gap-8">
                    <button
                        onClick={handleViewReceipt}
                        className="my-0 w-64 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <FiEye /> Back to Receipts
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Receipt</h1>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Entry Of</label>
                                    <select
                                        name="entryOf"
                                        value={primaryInfo.entryOf}
                                        onChange={handlePrimaryChange}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.entryOf ? 'border-red-500' : ''
                                            }`}
                                    >
                                        <option value="PURCHASE">PURCHASE</option>
                                        <option value="SALE">SALE</option>
                                    </select>
                                    {errors.primary.entryOf && (
                                        <p className="mt-1 text-sm text-red-600">{errors.primary.entryOf}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Receipt #</label>
                                    <input
                                        type="text"
                                        name="receiptNo"
                                        value={primaryInfo.receiptNo}
                                        onChange={handlePrimaryChange}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 bg-gray-100 ${errors.primary.receiptNo ? 'border-red-500' : ''
                                            }`}
                                        readOnly
                                    />
                                    {errors.primary.receiptNo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.primary.receiptNo}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Receipt Date (AD)<span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="receiptDateAD"
                                        value={primaryInfo.receiptDateAD}
                                        onChange={handlePrimaryChange}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.receiptDateAD ? 'border-red-500' : ''
                                            }`}
                                        required
                                    />
                                    {errors.primary.receiptDateAD && (
                                        <p className="mt-1 text-sm text-red-600">{errors.primary.receiptDateAD}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bill Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="billNo"
                                        value={primaryInfo.billNo}
                                        onChange={handlePrimaryChange}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.billNo ? 'border-red-500' : ''
                                            }`}
                                        required
                                    />
                                    {errors.primary.billNo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.primary.billNo}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bill Date (AD)</label>
                                    <input
                                        type="date"
                                        name="billDateAD"
                                        value={primaryInfo.billDateAD}
                                        onChange={handlePrimaryChange}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.billDateAD ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.primary.billDateAD && (
                                        <p className="mt-1 text-sm text-red-600">{errors.primary.billDateAD}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vendor <span className="text-red-500">*</span></label>
                                    <select
                                        name="vendor"
                                        value={primaryInfo.vendor}
                                        onChange={handlePrimaryChange}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.vendor ? 'border-red-500' : ''
                                            }`}
                                        required
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                    {errors.primary.vendor && (
                                        <p className="mt-1 text-sm text-red-600">{errors.primary.vendor}</p>
                                    )}
                                </div>
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
                                        { value: "EUR", label: "EUR" },
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
                                        className={`border-green-500 ring-2 ring-green-200 pr-10 ${errors.item.itemId ? 'border-red-500 ring-red-200' : ''}`}
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
                                    className=""
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
                            if (window.confirm('Are you sure you want to discard changes?')) {
                                navigate('/receipt-list');
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`px-6 py-2 rounded-md text-white font-semibold ${addedItems.length === 0 || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        onClick={handleSubmitReceipt}
                        disabled={addedItems.length === 0 || isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Receipt'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditReceipt;