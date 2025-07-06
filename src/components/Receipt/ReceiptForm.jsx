import { FiEye, FiPlus } from "react-icons/fi";
import { fetchAllVendors, fetchAllItems } from '../../api/receipt';
import { useEffect, useState, useRef } from 'react';
import AddItemForm from './AddItemForm';
import { createReceipt } from '../../api/receipt';
import { useNavigate } from "react-router-dom";
import AddedItems from "./AddedItems";
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
    const quantityRef = useRef(null);
    const rateRef = useRef(null);
    const [randomForReceipt, setRandomForReceipt] = useState();
    const navigate = useNavigate();

    const initialPrimaryInfo = {
        
        entryOf: 'PURCHASE',
        stockFlowTo: 'STORE',
        receiptNo: '',
        receiptDateAD: new Date().toLocaleDateString('en-GB'),
        receiptDateBS: '',
        fiscalYear: '2081-2082',
        purchaseType: 'CREDIT',
        billNo: '',
        billDateAD: new Date().toLocaleDateString('en-GB'),
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
                // Set default vendor if available
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

    const handlePrimaryChange = (e) => {
        setPrimaryInfo({ ...primaryInfo, [e.target.name]: e.target.value });
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => {
            const updatedItem = { ...prev, [name]: value };

            // If item is changed, update related fields
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

        // Reset refs
        if (quantityRef.current) quantityRef.current.value = "";
        if (rateRef.current) rateRef.current.value = "";
    };

    const handleRemoveItem = (tempId) => {
        setAddedItems(addedItems.filter(item => item.tempId !== tempId));
    };

    const handleOpenForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);

    const handleItemAdded = async () => {
        await getItems(); // Refresh items list
        handleCloseForm();
    };

    const calculateTotal = () => {
        return addedItems.reduce((sum, item) => {
            return sum + (parseFloat(item.value) || 0);
        }, 0).toFixed(2);
    };

    const handleSubmitReceipt = async (e) => {
        e.preventDefault();

        // Validate form
        if (addedItems.length === 0) {
            alert("Please add at least one item");
            return;
        }

        if (!primaryInfo.vendor) {
            alert("Please select a vendor");
            return;
        }

        // Prepare the data in the format expected by the backend
        const receiptData = {
            receiptId:randomForReceipt,
            receiptDate: new Date(primaryInfo.receiptDateAD).toISOString(),
            billNo: primaryInfo.billNo,
            vendorId: primaryInfo.vendor,
            receiptDetails: addedItems.map(item => ({
                itemId: item.itemId,
                quantity: parseFloat(item.quantity),
                rate: parseFloat(item.rate)
            }))
        };
        console.log(receiptData);

        try {
            // Show loading state
            setIsLoading(true);

            // Call the API to save the receipt
            const response = await createReceipt(receiptData);
            console.log(response.data)

            // Handle success
            if (response.data) {
                alert("Receipt saved successfully!");
                console.log("Receipt created:", response.data);

                // Reset form
                setPrimaryInfo(initialPrimaryInfo);
                setAddedItems([]);

                // Optional: Redirect or refresh receipt list
                // history.push('/receipts');
            } else {
                throw new Error("No data received from server");
            }
        } catch (error) {
            console.error("Error saving receipt:", error);

            // Show detailed error message if available
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Failed to save receipt";
            alert(`Error: ${errorMessage}`);
        } finally {
            // Hide loading state
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
    }
    const itemOptions = items.map((i) => ({
        value: i.id,
        label: i.name,
    }));

    const handleViewReceipt = () => {
        navigate('/receipt-list');
        return;
    }


    return (
        <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen">
            <div className=" mx-auto">
                <div className="flex flex-col px-24 gap-8">
                     <button onClick={handleViewReceipt} className="my-0 w-64">View Receipt</button>
                                        <h1 className="text-2xl font-bold text-gray-800">Receipts Inventory</h1>
                    {/* <SectionHeader title="Receipt Products" icon={<FiPlus size={20} />} /> */}
                    {/* <SectionHeader title="" icon={<FiEye size={20} className="ml-4 pr-1" onClick={handleViewReceipt} />} /> */}
                                       

                </div>

                {showForm && (
                    <AddItemForm
                        onClose={handleCloseForm}
                        onItemAdded={handleItemAdded}
                        fetchAllItem={fetchAllItems}
                    />
                )}

                <form onSubmit={handleAddItem}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 py-4 justify-items-center">
                        <div className="bg-white py-8 px-4 rounded-lg shadow-md w-[80%]">
                            <SectionHeader title="Primary Information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <label classnName="block text-sm font-medium text-gray-700">Entry Of</label>
                                    <select
                                        name="entryOf"
                                        value={primaryInfo.entryOf}
                                        onChange={handlePrimaryChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12"
                                    >
                                        <option value="PURCHASE">PURCHASE</option>
                                        <option value="SALE">SALE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Receipt # <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="receiptNo"
                                        value={randomForReceipt}
                                        onChange={handlePrimaryChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Receipt Date (AD)<span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="receiptDateAD"
                                        value={primaryInfo.receiptDateAD}
                                        onChange={handlePrimaryChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bill Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="billNo"
                                        value={primaryInfo.billNo}
                                        onChange={handlePrimaryChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bill Date (BS)</label>
                                    <input
                                        type="text"
                                        name="billDateBS"
                                        value={primaryInfo.billDateBS}
                                        onChange={handlePrimaryChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3"
                                        placeholder="YYYYMMDD"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vendor <span className="text-red-500">*</span></label>
                                    <select
                                        name="vendor"
                                        value={primaryInfo.vendor}
                                        onChange={handlePrimaryChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12"
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 px-4 bg-white rounded-lg shadow-md w-[80%]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                                    <select
                                        name="currency"
                                        value={newItem.currency}
                                        onChange={handleItemChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12"
                                    >
                                        <option value="NPR">NPR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Item Name <span className="text-red-500">*</span></label>
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
                                        className="absolute right-7 top-9 p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                        onClick={handleOpenForm}
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
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
                                    <label className="block text-sm font-medium text-gray-700">Rate <span className="text-red-500">*</span></label>
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
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                            </div>
                        </div>
                    </div>
                 </form> 
                 <AddedItems addedItems={addedItems} handleRemoveItem={handleRemoveItem} calculateTotal={calculateTotal}/>
* {/*<AddedItems addedItems={addedItems} handleRemoveItem={handleRemoveItem} calculateTotal={calculateTotal}  />
                {addedItems.length > 0 && (
                    <div className="!min-h-0 !min-w-0 mx-24 mt-8  shadow-lg rounded-lg overflow-x-auto flex align-center justify-center view-container">
                        <table className="">
                            <thead className="">
                                <tr>
                                    <th className="">Item Name</th>
                                    <th className="uppercase">Qty</th>
                                    <th className="uppercase">Rate</th>
                                    <th className="uppercase">Value</th>
                                    <th className="uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {addedItems.map(item => (
                                    <tr key={item.tempId} className="max-h-[20px]">
                                        <td className="p-0 ">{item.itemName || items.find(i => i.id.toString() === item.itemId)?.name}</td>
                                        <td className="p-0">{item.quantity}</td>
                                        <td className="p-0">{item.rate}</td>
                                        <td className="p-0">{item.value}</td>
                                        <td className="p-0">
                                            <button
                                                onClick={() => handleRemoveItem(item.tempId)}
                                                className="text-red-500 hover:text-red-700 bg-white hover:bg-white"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="4" className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{calculateTotal()}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )} */}

                <div className="mt-8 flex justify-end gap-4  px-24 ">
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
                        className="px-6 py-2 rounded-md text-white font-semibold"
                        onClick={handleSubmitReceipt}
                        disabled={addedItems.length === 0}
                    >
                        Save Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;