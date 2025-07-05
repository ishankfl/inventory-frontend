import { FiPlus } from "react-icons/fi";
import { useEffect, useState, useRef } from 'react';
import AddItemForm from './AddItemForm';
import { createIssue, createIssueReceipt } from '../../api/receipt';
import { useNavigate } from "react-router-dom";
import AddedItems from "./AddedItems";
import { fetchAllItems } from "../../api/receipt";
import { getAllDepartments } from '../../api/departments'
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const IssueReceipt = () => {
    const [departments, setDepartments] = useState([]);
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const quantityRef = useRef(null);
    const rateRef = useRef(null);
    const [randomForReceipt, setRandomForReceipt] = useState();
    const navigate = useNavigate();
    const [totalQty, setTotalQty] = useState(0)
    const initialPrimaryInfo = {
        entryOf: 'SALE',
        stockFlowFrom: 'STORE',
        issueNo: '',
        issueDateAD: new Date().toLocaleDateString('en-GB'),
        issueDateBS: '',
        fiscalYear: '2081-2082',
        saleType: 'CREDIT',
        invoiceNo: '',
        invoiceDateAD: new Date().toLocaleDateString('en-GB'),
        invoiceDateBS: '',
        department: '',
        deliveryNote: '',
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
        getDepartments();
        getItems();
        generateRandom();
    }, []);

    const getDepartments = async () => {
        try {
            setIsLoading(true);
            const response = await getAllDepartments();
            if (response.status === 200) {
                setDepartments(response.data);
                if (response.data.length > 0) {
                    setPrimaryInfo(prev => ({
                        ...prev,
                        department: response.data[0].id.toString()
                    }));
                }
            }
        } catch (e) {
            console.error("Error fetching departments:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const getItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAllItems();
            console.log(response.data)
            if (response.status === 200) setItems(response.data);
        } catch (e) {
            console.error("Error fetching items:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrimaryChange = (e) => {
        setPrimaryInfo({ ...primaryInfo, [e.target.name]: e.target.value });
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => {
            const updatedItem = { ...prev, [name]: value };
            console.log(updatedItem)
            var total = 0;
            const item = (items.filter(item => item.id == updatedItem.itemId))
            console.log('selected item', item)
            console.log('item stock ',item);
            console.log("Total ", total)

            if (name === 'itemId') {
                const selectedItem = items.find(i => i.id.toString() === value);
                if (selectedItem) {
                    updatedItem.itemGroup = selectedItem.itemGroup || '';
                    updatedItem.uom = selectedItem.uom || '';
                    updatedItem.taxStructure = selectedItem.taxStructure || '';
                }
            }

            return updatedItem;
        });
    };

    const handleQuantityOrRateChange = () => {
        const qty = parseFloat(quantityRef.current?.value) || 0;
        const rate = parseFloat(rateRef.current?.value) || 0;

        setNewItem(prev => ({
            ...prev,
            quantity: quantityRef.current?.value || '',
            rate: rateRef.current?.value || '',
            value: (qty * rate).toFixed(2),
        }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();

        const qty = parseFloat(newItem.quantity);
        const rate = parseFloat(newItem.rate);

        if (!newItem.itemId) {
            alert("Please select an item");
            return;
        }

        if (isNaN(qty)) {
            alert("Please enter a valid quantity");
            return;
        }

        if (isNaN(rate)) {
            alert("Please enter a valid rate");
            return;
        }

        const selectedItem = items.find(i => i.id.toString() === newItem.itemId);
        if (!selectedItem) {
            alert("Selected item not found");
            return;
        }

        const itemToAdd = {
            ...newItem,
            tempId: Date.now(),
            itemName: selectedItem.name,
            value: (qty * rate).toFixed(2)
        };

        setAddedItems([...addedItems, itemToAdd]);
        setNewItem(initialNewItemState);

        if (quantityRef.current) quantityRef.current.value = "";
        if (rateRef.current) rateRef.current.value = "";
    };

    const handleRemoveItem = (tempId) => {
        setAddedItems(addedItems.filter(item => item.tempId !== tempId));
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

        if (addedItems.length === 0) {
            alert("Please add at least one item");
            return;
        }

        if (!primaryInfo.department) {
            alert("Please select a department");
            return;
        }

        const issueData = {
            issueDate: new Date(primaryInfo.issueDateAD).toISOString(),
            invoiceNumber: primaryInfo.invoiceNo,
            departmentId: primaryInfo.department,
            deliveryNote: primaryInfo.deliveryNote,
            issueDetails: addedItems.map(item => ({
                itemId: item.itemId,
                quantity: parseFloat(item.quantity),
                rate: parseFloat(item.rate)
            }))
        };

        try {
            setIsLoading(true);
            const response = await createIssue(issueData);
            console.log(response.status)
            if (response.data) {
                alert("Issue receipt saved successfully!");
                setPrimaryInfo(initialPrimaryInfo);
                setAddedItems([]);
            } else {
                throw new Error("No data received from server");
            }
        } catch (error) {
            console.error("Error saving issue receipt:", error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Failed to save issue receipt";
            alert(`Error: ${errorMessage}`);
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
        let result = '#ISSUE_';

        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setRandomForReceipt(result);
    }
    const setQuantity = (selectedItem) => {

    }

    return (
        <div className="!px-24 main-box-container">
            <h1 className="text-2xl font-bold mb-4">Issue Receipt</h1>

            <div className=" flex flex-col gap-24">
                {/* Primary Details Section */}
                <div className="primary-details bg-white p-6 rounded-lg shadow-md">
                    <SectionHeader title="Primary Information" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Entry Of</label>
                            <select
                                name="entryOf"
                                value={primaryInfo.entryOf}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12"
                            >
                                <option value="SALE">SALE</option>
                                <option value="PURCHASE">PURCHASE</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Issue #</label>
                            <input
                                type="text"
                                name="issueNo"
                                value={randomForReceipt}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Issue Date (AD)</label>
                            <input
                                type="date"
                                name="issueDateAD"
                                value={primaryInfo.issueDateAD}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                            <input
                                type="text"
                                name="invoiceNo"
                                value={primaryInfo.invoiceNo}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Invoice Date (AD)</label>
                            <input
                                type="date"
                                name="invoiceDateAD"
                                value={primaryInfo.invoiceDateAD}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <select
                                name="department"
                                value={primaryInfo.department}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12"
                            >
                                <option value="">Select Department</option>
                                {departments.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Delivery Note</label>
                            <textarea
                                name="deliveryNote"
                                value={primaryInfo.deliveryNote}
                                onChange={handlePrimaryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-20 px-3 py-2"
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                {/* Inner Container */}
                <div className="inner-container flex flex-row gap-24">
                    {/* Item Details Form */}
                    <div className="itemdetails-form bg-white p-6 rounded-lg shadow-md flex-1">
                        <SectionHeader title="Add Items" />
                        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                <select
                                    name="itemId"
                                    value={newItem.itemId}
                                    onChange={handleItemChange}
                                    className="mt-1 block w-full rounded-md border-green-500 shadow-sm h-12 ring-2 ring-green-200 pr-10"
                                    required
                                >
                                    <option value="">Choose Item</option>
                                    {items.map(i => (
                                        <option key={i.id} value={i.id}>
                                            {i.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                    onClick={handleOpenForm}
                                >
                                    <PlusIcon />
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
                                <input
                                    name="quantity"
                                    ref={quantityRef}
                                    type="number"
                                    placeholder="Quantity"
                                    onChange={handleQuantityOrRateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    name="quantity"
                                    ref={quantityRef}
                                    type="number"
                                    placeholder="Quantity"
                                    onChange={handleQuantityOrRateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rate</label>
                                <input
                                    name="rate"
                                    ref={rateRef}
                                    type="number"
                                    placeholder="Rate"
                                    onChange={handleQuantityOrRateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Value</label>
                                <input
                                    type="text"
                                    value={newItem.value}
                                    readOnly
                                    className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm h-12 px-3"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
                                    onClick={() => setNewItem(initialNewItemState)}
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
                        </form>
                    </div>

                    {/* Selected Items Display */}
                    <div className="selected-itemsdisplay bg-white p-6 rounded-lg shadow-md flex-1">
                        <SectionHeader title="Selected Items" />
                        <AddedItems
                            addedItems={addedItems}
                            handleRemoveItem={handleRemoveItem}
                            calculateTotal={calculateTotal}
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
                    onClick={() => {
                        setPrimaryInfo(initialPrimaryInfo);
                        setAddedItems([]);
                    }}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
                    onClick={handleSubmitReceipt}
                    disabled={addedItems.length === 0}
                >
                    Issue Receipt
                </button>
            </div>

            {/* Add Item Modal */}
            {showForm && (
                <AddItemForm
                    onClose={handleCloseForm}
                    onItemAdded={handleItemAdded}
                />
            )}
        </div>
    );
};

export default IssueReceipt;