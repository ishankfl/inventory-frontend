import { useState } from "react";
import { FiX } from "react-icons/fi";
import { AddNewItem } from "../../api/receipt";
import * as Yup from "yup";
import { productUnits } from "../../utils/unit/unit";

import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";

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
      if (response.status === 201) {
        fetchAllItem();
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
            <button onClick={onClose} className=" bg-red-500  text-white-500 hover:text-white-800 hover:bg-red-800">
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
              value={newItem.name}
              onChange={handleNewItemChange}
              error={errorMessage && !newItem.name ? "Item name is required." : ""}
              required
              disabled={isSubmitting}
              placeholder="e.g., Apple, Notebook"
            />

            <div className="flex gap-1 flex-row justify-between ">
              {/* <div className="w-100% !bg-red-590"> */}

              <FormSelect
                label="Unit"
                name="unit"
                value={newItem.unit}
                onChange={handleNewItemChange}
                options={[{ label: "Select unit", value: "" }, ...productUnits.map((u) => ({ label: u, value: u }))]}
                error={errorMessage && !newItem.unit ? "Unit is required." : ""}
                required
                disabled={isSubmitting}
                className="w-[150%]"
              // className="w-1/2"
              />
            

              <FormInput
                label="Price"
                name="price"
                type="text"
                value={newItem.price}
                onChange={handleNewItemChange}
                error={errorMessage && !newItem.price ? "Price is required." : ""}
                required
                disabled={isSubmitting}
                placeholder="e.g., 100, 50.5"
              // className="w-1/2"
              />
              {/* </div> */}
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
