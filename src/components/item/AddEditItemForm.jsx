import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import * as Yup from "yup";
import { AddNewItem } from "../../api/receipt";
import { updateProduct, getProductById } from "../../api/item"; // Make sure these exist
import { productUnits } from "../../utils/unit/unit";

import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Item name is required."),
  unit: Yup.string().trim().required("Unit is required."),
  price: Yup.number()
    .typeError("Price must be a number.")
    .positive("Price must be greater than zero.")
    .required("Price is required."),
});

const AddEditItemForm = ({ initialData = null, onClose, onSubmitSuccess }) => {
  const [item, setItem] = useState({ name: "", unit: "", price: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load initialData for edit mode if available
  useEffect(() => {
    if (initialData) {
      if (initialData.id && (!initialData.name || !initialData.unit || !initialData.price)) {
        // If only id is passed, fetch full product details
        getProductById(initialData.id)
          .then((res) => {
            const data = res.data;
            setItem({
              name: data.name || "",
              unit: data.unit || "",
              price: data.price != null ? data.price.toString() : "",
            });
          })
          .catch(() => {
            setErrorMessage("Failed to load product details.");
          });
      } else {
        // If full data provided
        setItem({
          name: initialData.name || "",
          unit: initialData.unit || "",
          price: initialData.price != null ? initialData.price.toString() : "",
        });
      }
    } else {
      setItem({ name: "", unit: "", price: "" });
    }
    setErrorMessage("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await validationSchema.validate(item, { abortEarly: false });

      setIsSubmitting(true);

      const priceNumber = parseFloat(item.price);
      let response;

      if (initialData && initialData.id) {
        // Edit mode: update product
        response = await updateProduct(initialData.id, item.name, item.unit, priceNumber);
      } else {
        // Add mode: add new item
        response = await AddNewItem(item.name, item.unit, priceNumber);
      }

      if (response.status === 200 || response.status === 201) {
        onSubmitSuccess?.();
        onClose?.();
      } else {
        setErrorMessage("Failed to save item. Please try again.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        setErrorMessage(error.errors.join(" "));
      } else {
        console.error("Error saving item:", error);
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

  const isEditMode = Boolean(initialData && initialData.id);

  return (
    <>
      <div className="fixed !text-white inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h2>
            <button
              onClick={onClose}
              className="bg-red-500 text-white hover:bg-red-700 rounded px-2 py-1"
              aria-label="Close modal"
            >
              <FiX size={22} />
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 rounded p-3 mb-4">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Item Name"
              name="name"
              value={item.name}
              onChange={handleChange}
              error={errorMessage && !item.name ? "Item name is required." : ""}
              required
              disabled={isSubmitting}
              placeholder="e.g., Apple, Notebook"
            />

            <div className="flex gap-4">
              <FormSelect
                label="Unit"
                name="unit"
                value={item.unit}
                onChange={handleChange}
                options={[{ label: "Select unit", value: "" }, ...productUnits.map((u) => ({ label: u, value: u }))]}
                error={errorMessage && !item.unit ? "Unit is required." : ""}
                required
                disabled={isSubmitting}
                className="w-1/2"
              />

              <FormInput
                label="Price"
                name="price"
                type="text"
                value={item.price}
                onChange={handleChange}
                error={errorMessage && !item.price ? "Price is required." : ""}
                required
                disabled={isSubmitting}
                placeholder="e.g., 100, 50.5"
                className="w-1/2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : isEditMode ? "Save Changes" : "Add Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEditItemForm;
