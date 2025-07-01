import { useState, useEffect } from "react";
const AddItemForm = () => {
    //       const [newItem, setNewItem] = useState({ name: '', unit: '' });
    //   const [isAddItemNameError, setIsAddItemNameError] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //   const handleNewItemChange = (e) => {
    //     const { name, value } = e.target;
    //     setNewItem(prev => ({ ...prev, [name]: value }));

    //     // Clear error when user starts typing
    //     if (isAddItemNameError && value.trim()) {
    //       setIsAddItemNameError(false);
    //     }
    //   };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!newItem.name.trim() || !newItem.unit.trim()) {
            setIsAddItemNameError(true);
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset form on success
            setNewItem({ name: '', unit: '' });
            setIsAddItemNameError(false);
            console.log('Item added:', newItem);

            // Optional: Close form after successful submission
            // setShowForm(false);

        } catch (error) {
            console.error('Error adding item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setNewItem({ name: '', unit: '' });
        setIsAddItemNameError(false);
    };
    const handleOpenForm = () => {
        setShowForm(true);
        setNewItem({ name: '', unit: '' });
        setIsAddItemNameError(false);
    };

    return <>
        <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={handleClose}
            aria-hidden="true"
        />

        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Add New Item
                        </h2>
                    </div>

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                        aria-label="Close form"
                    >
                        <FiCrosshair size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {isAddItemNameError && (
                    <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-sm font-medium text-red-800">
                                All fields marked with <span className="text-red-600">*</span> are required.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="p-6 space-y-5" onKeyDown={handleKeyDown}>
                    {/* Item Name Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="itemName"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Item Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="itemName"
                            type="text"
                            name="name"
                            value={newItem.name}
                            onChange={handleNewItemChange}
                            disabled={isSubmitting}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isAddItemNameError
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="Enter item name (e.g., Apple, Notebook)"
                            autoFocus
                        />
                    </div>

                    {/* Unit Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="itemUnit"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Unit <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="itemUnit"
                            type="text"
                            name="unit"
                            value={newItem.unit}
                            onChange={handleNewItemChange}
                            disabled={isSubmitting}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isAddItemNameError
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="e.g., kg, pcs, liters, boxes"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    {/* <Plus size={16} /> */}
                                    Add Item
                                </>
                            )}
                        </button>
                    </div>


                </div>
            </div>
        </div>
    </>
}
export default AddItemForm;