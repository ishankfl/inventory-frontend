import { useState } from "react";
import { FiX } from "react-icons/fi";
import { AddNewItem } from "../../api/receipt";

const AddItemForm = ({ onClose,fetchAllItem }) => {
  const [newItem, setNewItem] = useState({ name: "", unit: "" });
  const [isAddItemNameError, setIsAddItemNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
    if (isAddItemNameError && value.trim()) setIsAddItemNameError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.unit.trim()) {
      setIsAddItemNameError(true);
      return;
    }
    setIsSubmitting(true);
    try {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
        // Simulate API call to add new item
        const response = await AddNewItem(newItem.name, newItem.unit);
        console.log("Response:", response.data);
        console.log("Response:", response.status);
      if (response.status !== 201) {
        fetchAllItem()
        console.log("Failed to add item");
      }

      console.log("Item added:", newItem);
      setNewItem({ name: "", unit: "" });
      setIsAddItemNameError(false);
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Item</h2>
            <button onClick={onClose} className="text-white-500 hover:text-white">
              <FiX size={22} />
            </button>
          </div>

          {isAddItemNameError && (
            <div className="bg-red-100 text-red-700 rounded p-3 mb-4">
              Please fill in all required fields.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={newItem.name}
                onChange={handleNewItemChange}
                disabled={isSubmitting}
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                  isAddItemNameError ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="e.g., Apple, Notebook"
              />
            </div>

            <div>
              <label htmlFor="unit" className="block font-medium mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                id="unit"
                name="unit"
                type="text"
                value={newItem.unit}
                onChange={handleNewItemChange}
                disabled={isSubmitting}
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                  isAddItemNameError ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="e.g., kg, pcs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddItemForm;
