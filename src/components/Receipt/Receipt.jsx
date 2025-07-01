import { IconBase } from 'react-icons/lib';
import { FiEye, FiPlus } from "react-icons/fi";
import { fetchAllVendors, fetchAllItems } from '../../api/receipt';
import { React, useEffect, useState } from 'react';

// --- DUMMY DATA (for populating dropdowns) ---
const dummyStores = [{ id: 1, name: 'MAIN STORE' }, { id: 2, name: 'SUB STORE' }];


// --- Reusable SVG Icons ---
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

// --- Main Form Component ---
const Receipt = () => {
    const [vendors, setVendors] = useState([])
    const [items, setItems] = useState([]);
    const [openItemForm, setOpenItemForm] = useState(true);
    const [isAddItemNameError, setIsAddItemNameError] = useState(true);
    const getVendors = async () => {
        try {
            const response = await fetchAllVendors();
            console.log(response.data);
            console.log(response.status);
            if (response.status == 200) {
                setVendors(response.data);
            }

        } catch (e) {
            console.log(e);
        }
    }
    const getItems = async () => {
        try {
            const response = await fetchAllItems();
            console.log(response.data);
            console.log(response.status);
            if (response.status == 200) {
                setItems(response.data);
            }

        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => { getVendors(); getItems() }, [])
    const initialPrimaryInfo = {
        entryOf: 'PURCHASE', stockFlowTo: 'STORE', receiptNo: '',
        receiptDateAD: '23/03/2025', receiptDateBS: '', fiscalYear: '2081-2082',
        purchaseType: 'CREDIT', billNo: '101', billDateAD: '23/03/2025',
        billDateBS: '20811210', vendor: '1',
    };

    const initialNewItemState = {
        currency: 'NPR',
        itemId: '', itemGroup: '', uom: '',
        isComplimentary: 'NO', taxStructure: '', quantity: '',
        rate: '', value: '', discountPercent: '', discountAmount: '0.00',
    };

    const [primaryInfo, setPrimaryInfo] = useState(initialPrimaryInfo);
    const [newItem, setNewItem] = useState(initialNewItemState);
    const [addedItems, setAddedItems] = useState([]); // This will hold the items for the table

    // --- HANDLERS ---
    const handlePrimaryChange = (e) => {
        setPrimaryInfo({ ...primaryInfo, [e.target.name]: e.target.value });
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        let updatedItem = { ...newItem, [name]: value };

        // Auto-fill Item Group and UOM when an item is selected
        if (name === 'itemId' && value) {
            const selectedItem = items.find(item => item.id.toString() === value);
            if (selectedItem) {
                updatedItem.itemGroup = selectedItem.itemGroup;
                updatedItem.uom = selectedItem.uom;
            }
        }

        // Auto-calculate Value if rate and quantity are present
        if (['quantity', 'rate'].includes(name)) {
            const qty = name === 'quantity' ? parseFloat(value) : parseFloat(updatedItem.quantity);
            const rt = name === 'rate' ? parseFloat(value) : parseFloat(updatedItem.rate);
            if (!isNaN(qty) && !isNaN(rt)) {
                updatedItem.value = (qty * rt).toFixed(2);
            }
        }

        setNewItem(updatedItem);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.itemId || !newItem.quantity || !newItem.rate) {
            alert("Please fill Item Name, Quantity, and Rate.");
            return;
        }
        setAddedItems([...addedItems, { ...newItem, tempId: Date.now() }]);
        setNewItem(initialNewItemState);
    };

    const handleRemoveItem = (tempId) => {
        setAddedItems(addedItems.filter(item => item.tempId !== tempId));
    };

    // --- Reusable Form Field Component ---
    const FormField = ({ label, name, value, onChange, type = 'text', children, required = false, ...props }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'select' ? (
                <select id={name} name={name} value={value} onChange={onChange} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm h-12">
                    {children}
                </select>
            ) : (
                <input type={type} id={name} name={name} value={value} onChange={onChange} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm h-12 px-3" />
            )}
        </div>
    );

    const SectionHeader = ({ title, icon }) => (
        <div className="flex items-start gap-4 mb-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <span className="text-blue-600 bg-blue-100 rounded-full p-1">{icon}</span>
        </div>
    );

    return (
        <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">

            <div className="max-w-screen-xl mx-auto">
                <div className="header flex gap-12">

                    <SectionHeader title="Receipt Products " icon={<FiPlus size={20} />} />
                    <SectionHeader title="" icon={<FiEye size={20} className='ml-[15px] pr-[5px]' />} />

                </div>


                <form onSubmit={handleAddItem}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                        <div className="bg-gray-200 p-6 rounded-lg shadow-md ">
                            <SectionHeader title="Primary Information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <FormField label="Entry Of" name="entryOf" type="select" value={primaryInfo.entryOf} onChange={handlePrimaryChange} required> <option>PURCHASE</option> </FormField>

                                <FormField label="Receipt #" name="receiptNo" value={primaryInfo.receiptNo} onChange={handlePrimaryChange} />
                                <FormField label="Receipt Date (AD)" name="receiptDateAD" value={primaryInfo.receiptDateAD} onChange={handlePrimaryChange} required />
                                <FormField label="Bill Number" name="billNo" value={primaryInfo.billNo} onChange={handlePrimaryChange} required />
                                <FormField label="Bill Date (BS)" name="billDateBS" value={primaryInfo.billDateBS} onChange={handlePrimaryChange} required />
                                <FormField label="Vendor" name="vendor" type="select" value={primaryInfo.vendor} onChange={handlePrimaryChange} required> {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)} </FormField>

                            </div>
                        </div>

                        <div className="bg-gray-200 p-6 rounded-lg shadow-md">

                            {/* <SectionHeader title="Add New Items" icon={<PlusIcon />} /> */}
                            {true && (
                                <div className="bg-white p-4 rounded-lg shadow-md absolute top-48 right-48 max-w-xs mx-auto flex flex-col z-[100000]">
                                    <div className="flex flex-col items-center gap-2 w-[100%] bg-primary p-2 rounded-lg">
                                        <label className="block text-sm font-semibold text-gray-700 py-1 bg-primary text-white">
                                            Add Item <span className="text-red-500">*</span>
                                        </label>

                                        {isAddItemNameError && (
                                            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md z-50 px-3 py-2 shadow">
                                                <p className="text-xs font-medium">
                                                    All fields <span className="text-red-500">*</span> are mandatory.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <form className="mt-4 grid grid-cols-1 gap-0">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Item Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newItem.name}
                                                onChange={handleNewItemChange}
                                                required
                                                className="w-full border border-gray-300 rounded-md px-2  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                                                placeholder="Enter item name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Unit <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={newItem.unit}
                                                onChange={handleNewItemChange}
                                                required
                                                className="w-full border border-gray-300 rounded-md px-2  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                                                placeholder="e.g., kg, pcs"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="inline-flex items-center bg-primary text-white font-semibold rounded-md px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm"
                                            >
                                                Add Item
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <FormField label="Currency" name="currency" value={newItem.currency} onChange={handleNewItemChange} required readOnly className="bg-gray-100" />

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">Item Name <span className="text-red-500">*</span></label>
                                    <select name="itemId" value={newItem.itemId} onChange={handleNewItemChange} className="mt-1 block w-full rounded-md border-green-500 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm h-12 ring-2 ring-green-200 pr-10">
                                        <option value="">Choose Item</option>
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                    <button type="button" className="absolute right-7 top-9 p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><PlusIcon /></button>


                                </div>
                                <FormField label="Quantity" name="quantity" type="number" value={newItem.quantity} onChange={handleNewItemChange} required />
                                <FormField label="Rate" name="rate" type="number" placeholder="Enter Rate" value={newItem.rate} onChange={handleNewItemChange} required />

                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button type="button" className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">Clear</button>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {addedItems.length > 0 && (
                    <div className="mt-8 bg-white shadow-lg rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {addedItems.map(item => (
                                    <tr key={item.tempId}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{items.find(i => i.id.toString() === item.itemId)?.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.rate}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <button onClick={() => handleRemoveItem(item.tempId)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Final Form Submission Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                    <button className="px-6 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700">Cancel</button>
                    <button className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700">Save Receipt</button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;