// import * as Yup from 'yup';
// import { FiEye, FiPlus } from "react-icons/fi";
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { fetchAllVendors, fetchAllItems, fetchReceiptById, updateReceipt } from '../../api/receipt';
// import AddEditItemForm from '../item/AddEditItemForm';
// import { itemSchema, validatePrimaryInfo, validateItem, primaryInfoSchema } from '../../utils/yup/receipt-form.vaid';
// import { Eye, Key } from 'lucide-react';
// import PrimaryInfoBox from './PrimaryInfo';
// import ItemInformation from './ItemInformation';
// import AddedItemsTable from './AddedItemsTable';

// const PlusIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//     </svg>
// );



// const EditReceipt = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [vendors, setVendors] = useState([]);
//     const [items, setItems] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({ primary: {}, item: {} });
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [hoveredRow, setHoveredRow] = useState(null);

//     const initialPrimaryInfo = {
//         entryOf: 'PURCHASE',
//         stockFlowTo: 'STORE',
//         receiptNo: '',
//         receiptDateAD: new Date().toISOString().split('T')[0],
//         receiptDateBS: '',
//         fiscalYear: '2081-2082',
//         purchaseType: 'CREDIT',
//         billNo: '',
//         billDateAD: new Date().toISOString().split('T')[0],
//         billDateBS: '',
//         vendor: '',
//     };

//     const initialNewItemState = {
//         currency: 'NPR',
//         itemId: '',
//         itemGroup: '',
//         uom: '',
//         isComplimentary: 'NO',
//         taxStructure: '',
//         quantity: '',
//         rate: '',
//         value: '',
//         discountPercent: '',
//         discountAmount: '0.00',
//     };

//     const [primaryInfo, setPrimaryInfo] = useState(initialPrimaryInfo);
//     const [newItem, setNewItem] = useState(initialNewItemState);
//     const [addedItems, setAddedItems] = useState([]);

//     useEffect(() => {
//         getVendors();
//         getItems();
//         loadReceiptData();
//     }, [id]);

//     const loadReceiptData = async () => {
//         try {
//             setIsLoading(true);
//             const response = await fetchReceiptById(id);
//             if (response.data) {
//                 const receipt = response.data;
//                 const receiptDate = new Date(receipt.receiptDate);
//                 const formattedDate = receiptDate.toISOString().split('T')[0];

//                 setPrimaryInfo({
//                     entryOf: 'PURCHASE',
//                     stockFlowTo: 'STORE',
//                     receiptNo: receipt.id,
//                     receiptDateAD: formattedDate,
//                     receiptDateBS: '',
//                     fiscalYear: '2081-2082',
//                     purchaseType: 'CREDIT',
//                     billNo: receipt.billNo,
//                     billDateAD: formattedDate,
//                     billDateBS: '',
//                     vendor: receipt.vendorId,
//                 });

//                 const formattedItems = receipt.receiptDetails.map(item => ({
//                     tempId: `${item.id}-${Date.now()}`,
//                     id: item.id,
//                     itemId: item.itemId,
//                     itemName: item.item?.name || 'Unknown Item',
//                     currency: 'NPR',
//                     itemGroup: '',
//                     uom: item.item?.unit || '',
//                     isComplimentary: 'NO',
//                     taxStructure: '',
//                     quantity: item.quantity.toString(),
//                     rate: item.rate.toString(),
//                     value: (item.quantity * item.rate).toFixed(2),
//                     discountPercent: '0',
//                     discountAmount: '0.00'
//                 }));

//                 setAddedItems(formattedItems);
//             }
//         } catch (e) {
//             console.error("Error loading receipt:", e);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getVendors = async () => {
//         try {
//             setIsLoading(true);
//             const response = await fetchAllVendors();
//             if (response.status === 200) {
//                 setVendors(response.data.data);
//             }
//         } catch (e) {
//             console.error("Error fetching vendors:", e);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getItems = async () => {
//         try {
//             setIsLoading(true);
//             const response = await fetchAllItems();
//             console.log('Fetch all items called', response)
//             if (response.status === 200) setItems(response.data.data);
//         } catch (e) {
//             console.error("Error fetching items:", e);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handlePrimaryChange = async (e) => {
//         const { name, value } = e.target;
//         setPrimaryInfo(prev => ({ ...prev, [name]: value }));

//         if (errors.primary[name]) {
//             try {
//                 await Yup.reach(primaryInfoSchema, name).validate(value);
//                 setErrors(prev => ({
//                     ...prev,
//                     primary: { ...prev.primary, [name]: undefined }
//                 }));
//             } catch (err) {
//                 setErrors(prev => ({
//                     ...prev,
//                     primary: { ...prev.primary, [name]: err.message }
//                 }));
//             }
//         }
//     };

//     const handleItemChange = async (e) => {
//         const { name, value } = e.target;
//         setNewItem(prev => {
//             const updatedItem = { ...prev, [name]: value };

//             if (name === 'itemId') {
//                 const selected = items.find(i => i.id.toString() === value);
//                 if (selected) {
//                     updatedItem.itemGroup = selected.itemGroup || '';
//                     updatedItem.uom = selected.uom || '';
//                     updatedItem.rate = selected.price || '';
//                     setSelectedItem(selected);
//                 } else {
//                     setSelectedItem(null);
//                 }
//             }

//             return updatedItem;
//         });

//         if (errors.item[name]) {
//             try {
//                 await Yup.reach(itemSchema, name).validate(value);
//                 setErrors(prev => ({
//                     ...prev,
//                     item: { ...prev.item, [name]: undefined }
//                 }));
//             } catch (err) {
//                 setErrors(prev => ({
//                     ...prev,
//                     item: { ...prev.item, [name]: err.message }
//                 }));
//             }
//         }
//     };

//     const handleQuantityOrRateChange = async (e) => {
//         const { name, value } = e.target;
//         setNewItem(prev => {
//             const updated = { ...prev, [name]: value };

//             if (name === 'quantity' || name === 'rate') {
//                 const qty = parseFloat(updated.quantity) || 0;
//                 const rate = parseFloat(updated.rate) || 0;
//                 updated.value = (qty * rate).toFixed(2);
//             }

//             return updated;
//         });

//         if (errors.item[name]) {
//             try {
//                 await Yup.reach(itemSchema, name).validate(value);
//                 setErrors(prev => ({
//                     ...prev,
//                     item: { ...prev.item, [name]: undefined }
//                 }));
//             } catch (err) {
//                 setErrors(prev => ({
//                     ...prev,
//                     item: { ...prev.item, [name]: err.message }
//                 }));
//             }
//         }
//     };

//     const handleAddItem = async (e) => {
//         e.preventDefault();

//         const isItemValid = await validateItem(setErrors, newItem);
//         if (!isItemValid) return;

//         const selected = items.find(i => i.id.toString() === newItem.itemId);
//         if (!selected) {
//             alert("Selected item not found");
//             return;
//         }

//         const itemToAdd = {
//             ...newItem,
//             tempId: Date.now(),
//             itemName: selected.name,
//             value: newItem.value
//         };

//         const existingItemIndex = addedItems.findIndex(item => item.itemId === newItem.itemId);

//         if (existingItemIndex >= 0) {
//             const updatedItems = [...addedItems];
//             updatedItems[existingItemIndex] = itemToAdd;
//             setAddedItems(updatedItems);
//         } else {
//             setAddedItems([...addedItems, itemToAdd]);
//         }

//         setNewItem(initialNewItemState);
//         setSelectedItem(null);
//     };

//     const handleRemoveItem = (tempId) => {
//         setAddedItems(prev => prev.filter(item => item.tempId !== tempId));
//     };

//     const handleOpenForm = () => setShowForm(true);
//     const handleCloseForm = () => setShowForm(false);

//     const handleItemAdded = async () => {
//         await getItems();
//         handleCloseForm();
//     };

//     const calculateTotal = () => {
//         return addedItems.reduce((sum, item) => {
//             return sum + (parseFloat(item.value) || 0);
//         }, 0).toFixed(2);
//     };

//     const handleSubmitReceipt = async (e) => {
//         e.preventDefault();

//         const isPrimaryValid = await validatePrimaryInfo(setErrors, primaryInfo);
//         if (!isPrimaryValid) return;

//         if (addedItems.length === 0) {
//             alert("Please add at least one item");
//             return;
//         }

//         const receiptData = {
//             id: id,
//             receiptDate: primaryInfo.receiptDateAD,
//             billNo: primaryInfo.billNo,
//             vendorId: primaryInfo.vendor,
//             receiptDetails: addedItems.map(item => ({
//                 id: item.id || undefined,
//                 itemId: item.itemId,
//                 quantity: parseFloat(item.quantity),
//                 rate: parseFloat(item.rate)
//             }))
//         };

//         try {
//             setIsLoading(true);
//             const response = await updateReceipt(receiptData.id, receiptData);

//             if (response.data) {
//                 alert("Receipt updated successfully!");
//                 navigate('/receipt-list');
//             }
//         } catch (error) {
//             console.error("Error updating receipt:", error);
//             alert(`Error: ${error.response?.data?.message || error.message || "Failed to update receipt"}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleViewReceipt = () => {
//         navigate('/receipt-list');
//     };

//     const handleRowClick = (item) => {
//         setNewItem({
//             ...initialNewItemState,
//             itemId: item.itemId,
//             itemGroup: item.itemGroup,
//             uom: item.uom,
//             quantity: item.quantity,
//             rate: item.rate,
//             value: item.value,
//             currency: item.currency,
//             isComplimentary: item.isComplimentary,
//             taxStructure: item.taxStructure,
//             discountPercent: item.discountPercent,
//             discountAmount: item.discountAmount
//         });
//     };

//     if (isLoading) {
//         return (
//             <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="sr-only">Loading...</span>
//                     </div>
//                     <p>Loading receipt data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen">
//             <div className="mx-auto">
//                 <div className="flex flex-col px-24 gap-8">
//                     <div className="flex items-center justify-between mb-6">
//                         <div>
//                             <h1 className="text-3xl font-bold text-text mb-2">Edit Receipt</h1>
//                             <p className="text-gray-600">Manage and track all inventory issues</p>
//                         </div>
//                         <button
//                             onClick={handleViewReceipt}
//                             className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
//                         >
//                             <Eye className="h-5 w-5" />
//                             <span>View Previous</span>
//                         </button>
//                     </div>
//                 </div>


//                 {/* {showForm && (
//                     <AddItemForm
//                         onClose={handleCloseForm}
//                         onItemAdded={handleItemAdded}
//                         fetchAllItem={getItems}
//                     />
//                 )} */}
//                 {showForm && (
//                     <div className="modal-overlay">
//                         <AddEditItemForm
//                             onClose={() => setShowForm(false)}
//                             onSubmitSuccess={() => {
//                                 getItems();
//                                 setShowForm(false);
//                             }}
//                         />
//                     </div>
//                 )}


//                 <form onSubmit={handleAddItem}>
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 py-4 justify-items-center">
//                         <div className="bg-white py-8 px-4 rounded-lg shadow-md w-[80%]">
//                             {/* here primary box */}
//                             <PrimaryInfoBox errors={errors} handlePrimaryChange={handlePrimaryChange}
//                                 key={Key}
//                                 primaryInfo={primaryInfo}
//                                 vendors={vendors}

//                             />
//                         </div>

//                         <div className="py-8 px-4 bg-white rounded-lg shadow-md w-[80%]">
//                             {/* item info box here */}
//                             <ItemInformation
//                                 items={items} // array of available items
//                                 newItem={newItem} // current item being added
//                                 errors={errors} // validation errors
//                                 handleItemChange={handleItemChange} // handler for item select/input change
//                                 handleQuantityOrRateChange={handleQuantityOrRateChange} // updates value based on quantity * rate
//                                 handleOpenForm={handleOpenForm} // triggers item form modal/pop-up
//                                 setNewItem={setNewItem} // resets new item fields
//                                 setSelectedItem={setSelectedItem} // clears selected item if needed
//                                 initialNewItemState={initialNewItemState} // default state to reset item form
//                                 setErrors={setErrors} // used to reset validation errors
//                             />

//                         </div>
//                     </div>


//                     {/* Action Buttons */}
//                     {/* <div className="flex flex-row justify-end px-[5%] gap-12 ">
//                         <button
//                             type="button"
//                             className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 min-w-[20%]"
//                             onClick={() => {
//                                 setNewItem(initialNewItemState);
//                                 setSelectedItem(null);
//                                 setErrors(prev => ({ ...prev, item: {} }));
//                             }}
//                         >
//                             Clear
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700  min-w-[20%]"
//                         >
//                             Add Item
//                         </button> */}
//                     {/* </div> */}
//                 </form>

//                 <div className="px-16">

//                     <AddedItemsTable
//                         addedItems={addedItems}
//                         hoveredRow={hoveredRow}
//                         setHoveredRow={setHoveredRow}
//                         handleRowClick={handleRowClick}
//                         handleRemoveItem={handleRemoveItem}
//                         calculateTotal={calculateTotal}
//                     />
//                 </div>

//                 <div className="mt-8 flex justify-end gap-4 px-24">
//                     <button
//                         type="button"
//                         className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
//                         onClick={() => {
//                             if (window.confirm('Are you sure you want to discard changes?')) {
//                                 navigate('/receipt-list');
//                             }
//                         }}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="button"
//                         className={`px-6 py-2 rounded-md text-white font-semibold ${addedItems.length === 0 || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-700'
//                             }`}
//                         onClick={handleSubmitReceipt}
//                         disabled={addedItems.length === 0 || isLoading}
//                     >
//                         {isLoading ? 'Updating...' : 'Update Receipt'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditReceipt;