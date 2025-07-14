import { useState } from "react";
import { FiX } from "react-icons/fi";
import { AddNewItem } from "../../api/receipt";
import * as Yup from "yup";

const AddItemForm = ({ onClose, fetchAllItem }) => {
  const [newItem, setNewItem] = useState({ name: "", unit: "", price: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Item name is required."),
    unit: Yup.string().trim().required("Unit is required."),
    price: Yup.number()
      .typeError("Price must be a number.")
      .positive("Price must be greater than zero.")
      .required("Price is required."),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await validationSchema.validate(newItem, { abortEarly: false });

      setIsSubmitting(true);

      const priceNumber = parseFloat(newItem.price);

      const response = await AddNewItem(newItem.name, newItem.unit, priceNumber);
      console.log("Response:", response);

      if (response.status === 201) {
        fetchAllItem();
        console.log("Item added:", newItem);
        setNewItem({ name: "", unit: "", price: "" });
        onClose();
      } else {
        setErrorMessage("Failed to add item. Please try again.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        setErrorMessage(error.errors.join(" "));
      } else {
        console.error("Error adding item:", error);
        setErrorMessage(
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Unexpected error occurred."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed !text-white inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Item</h2>
            <button onClick={onClose} className="text-white-500 hover:text-white-800">
              <FiX size={22} />
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 rounded p-3 mb-4">
              {errorMessage}
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
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${errorMessage && !newItem.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                placeholder="e.g., Apple, Notebook"
              />
            </div>
            <div className="flex flex-row gap-12">


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
                  className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${errorMessage && !newItem.unit ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="e.g., kg, pcs"
                />
              </div>

              <div>
                <label htmlFor="price" className="block font-medium mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={newItem.price}
                  onChange={handleNewItemChange}
                  disabled={isSubmitting}
                  className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${errorMessage && !newItem.price ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="e.g., 100, 50.5"
                />
              </div>
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
