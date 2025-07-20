import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { AddNewItem, updateProduct, getProductById } from "../../api/item";
import { productUnits } from "../../utils/unit/unit";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import ToastNotification from "../common/ToggleNotification";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Item name is required."),
  unit: Yup.string().required("Unit is required."),
  price: Yup.number().typeError("Price must be a number").required("Price is required."),
});

const AddEditItemForm = ({ initialData = null, onClose, onSubmitSuccess }) => {
  const [initialValues, setInitialValues] = useState({ name: "", unit: "", price: "" });
  const [toast, setToast] = useState(null);
  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    const loadData = async () => {
      if (isEditMode && initialData?.id) {
        try {
          const { data } = await getProductById(initialData.id);
          setInitialValues({
            name: data.name || "",
            unit: data.unit || "",
            price: data.price != null ? data.price.toString() : "",
          });
        } catch {
          setToast({
            type: "error",
            message: "Failed to load product details.",
            duration: 4000,
          });
        }
      }
    };
    loadData();
  }, [initialData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const priceNumber = parseFloat(values.price);
      const payload = { ...values, price: priceNumber };
      let response;

      if (isEditMode) {
        response = await updateProduct(initialData.id, payload);
      } else {
        response = await AddNewItem(payload);
      }

      if (response.status === 200 || response.status === 201) {
        setToast({
          type: "success",
          message: isEditMode ? "Item updated successfully." : "Item added successfully.",
          duration: 3000,
        });
        onSubmitSuccess?.();
        setTimeout(() => onClose?.(), 1500);
      } else {
        setToast({
          type: "error",
          message: "Failed to save item. Please try again.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving item:", error);
      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Unexpected error occurred.",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Background Overlay with click to close */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-center">
        {/* Transparent clickable layer to close on outside click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal */}
        <div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-50"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-white-600 bg-red-500  hover:text-white-900 hover:bg-red-700 ">
              <FiX size={20} />
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <ToastNotification
              key={Date.now()}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={() => setToast(null)}
            />
          )}

          {/* Form */}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4 mt-4">
                <FormInput
                  label="Item Name"
                  name="name"
                  required
                  placeholder="e.g., Apple, Notebook"
                  disabled={isSubmitting}
                  error={touched.name && errors.name}
                />

                <div className="flex gap-4">
                  <FormSelect
                    label="Unit"
                    name="unit"
                    options={productUnits}
                    required
                    disabled={isSubmitting}
                    error={touched.unit && errors.unit}
                    className=""
                  />
                  <FormInput
                    label="Price"
                    name="price"
                    required
                    placeholder="e.g., 100, 50.5"
                    disabled={isSubmitting}
                    error={touched.price && errors.price}
                    className="w-1/2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Adding..."
                    : isEditMode
                    ? "Save Changes"
                    : "Add Item"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddEditItemForm;
