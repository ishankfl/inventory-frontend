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
  const [initialValues, setInitialValues] = useState({
    name: "",
    unit: "",
    price: "",
  });

  const [isLoading, setIsLoading] = useState(false);
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
      let response;

      if (isEditMode) {
        response = await updateProduct(initialData.id, {
          name: values.name.trim(),
          unit: values.unit,
          price: priceNumber,
        });
      } else {
        response = await AddNewItem({
          name: values.name.trim(),
          unit: values.unit,
          price: priceNumber,
        });
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
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal Container */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              <FiX />
            </button>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <FormInput
                  label="Item Name"
                  name="name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., Apple, Notebook"
                />

                <div className="flex gap-2 flex-row justify-between">
                  <FormSelect
                    label="Unit"
                    name="unit"
                    options={productUnits}
                    error={touched.unit && errors.unit}
                    required
                    disabled={isSubmitting}
                    className="w-[150%]"
                  />

                  <FormInput
                    label="Price"
                    name="price"
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g., 100, 50.5"
                    className="w-1/2"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full"
                  disabled={isSubmitting}
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
