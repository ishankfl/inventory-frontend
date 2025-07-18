import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { AddNewItem } from "../../api/receipt";
import { updateProduct, getProductById } from "../../api/item";
import { productUnits } from "../../utils/unit/unit";

import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import ToastNotification from "../common/ToggleNotification";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Item name is required."),
  unit: Yup.string().trim().required("Unit is required."),
  price: Yup.number()
    .typeError("Price must be a number.")
    .positive("Price must be greater than zero.")
    .required("Price is required."),
});

const AddEditItemForm = ({ initialData = null, onClose, onSubmitSuccess }) => {
  const [initialValues, setInitialValues] = useState({ name: "", unit: "", price: "" });
  const [toast, setToast] = useState(null);
  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode && (!initialData.name || !initialData.unit || !initialData.price)) {
        try {
          const res = await getProductById(initialData.id);
          const data = res.data;
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
      } else if (isEditMode) {
        setInitialValues({
          name: initialData.name || "",
          unit: initialData.unit || "",
          price: initialData.price != null ? initialData.price.toString() : "",
        });
      } else {
        setInitialValues({ name: "", unit: "", price: "" });
      }
    };

    loadInitialData();
  }, [initialData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const priceNumber = parseFloat(values.price);
      let response;

      if (isEditMode) {
        response = await updateProduct(initialData.id, values.name, values.unit, priceNumber);
      } else {
        response = await AddNewItem(values.name, values.unit, priceNumber);
      }

      if (response.status === 200 || response.status === 201) {
        setToast({
          type: "success",
          message: isEditMode ? "Item updated successfully." : "Item added successfully.",
          duration: 3000,
        });
        onSubmitSuccess?.();
        setTimeout(() => {
          onClose?.();
        }, 1500);
      } else {
        setToast({
          type: "error",
          message: "Failed to save item. Please try again.",
          duration: 3000,
        });
      }
    } catch (error) {
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
      {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* Proper full-screen clickable overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      ></div>

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

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-4">
                <FormInput
                  label="Item Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., Apple, Notebook"
                />

                <div className="flex gap-2 flex-row justify-between">
                  <FormSelect
                    label="Unit"
                    name="unit"
                    value={values.unit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { label: "Select unit", value: "" },
                      ...productUnits.map((u) => ({ label: u, value: u })),
                    ]}
                    error={touched.unit && errors.unit}
                    required
                    disabled={isSubmitting}
                    className="w-[150%]"
                  />

                  <FormInput
                    label="Price"
                    name="price"
                    type="text"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && errors.price}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g., 100, 50.5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:opacity-50"
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
