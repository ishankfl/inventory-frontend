import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { AddNewItem, updateProduct, getProductById } from "../../api/item";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import ToastNotification from "../common/ToggleNotification";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Item name is required."),

  unit: Yup.string()
    .required("Unit is required."),

  price: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : Number(originalValue)
    )
    .typeError("Price must be a number.")
    .positive("Price must be positive.")
    .required("Price is required.")
});

const AddEditItemForm = ({ initialData = null, onClose, onSubmitSuccess }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    unit: "",
    price: "",
  });

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
            price: data.price != null ? String(data.price) : "",
          });
        } catch (error) {
          setToast({
            type: "error",
            message: error.response?.status === 404
              ? "Product not found."
              : "Failed to load product details.",
            duration: 4000,
          });
        }
      } else {
        setInitialValues({
          name: "",
          unit: "",
          price: "",
        });
      }
    };
    loadData();
  }, [initialData, isEditMode]);

  const handleSubmit = async (values, { setSubmitting, setTouched }) => {
    try {
      console.log("values", values)
      const priceNumber = parseFloat(values.price);
      if (isNaN(priceNumber)) {
        throw new Error("Invalid price value");
      }

      const payload = { ...values, price: priceNumber };
      let response;

      if (isEditMode) {
        response = await updateProduct(initialData.id, payload);
      } else {
        console.log("Adding")
        response = await AddNewItem(payload);
        console.log(response.data);
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
          message: response.data?.message || "Failed to save item. Please try again.",
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
    <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-center">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-white-600 bg-red-500 hover:text-white-900 hover:bg-red-700 rounded-full p-1"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {toast && (
          <ToastNotification
            key={Date.now()}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-4 mt-4">
              <FormInput
                label="Item Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="e.g., Apple, Notebook"
                disabled={isSubmitting}
                error={touched.name && errors.name}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <FormSelect
                    label="Unit"
                    name="unit"
                    value={values.unit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={productUnits}
                    required
                    disabled={isSubmitting}
                    error={touched.unit && errors.unit}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <FormInput
                    label="Price"
                    name="price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="e.g., 100, 50.5"
                    disabled={isSubmitting}
                    error={touched.price && errors.price}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full disabled:opacity-50"
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
  );
};

const productUnits = [
  { value: "mg", label: "mg (Milligram)" },
  { value: "cg", label: "cg (Centigram)" },
  { value: "dg", label: "dg (Decigram)" },
  { value: "g", label: "g (Gram)" },
  { value: "dag", label: "dag (Dekagram)" },
  { value: "hg", label: "hg (Hectogram)" },
  { value: "kg", label: "kg (Kilogram)" },
  { value: "q", label: "q (Quintal)" },
  { value: "MT", label: "MT (Metric Ton)" },
  { value: "T", label: "T (Metric Ton)" },
  { value: "lb", label: "lb (Pound)" },
  { value: "oz", label: "oz (Ounce)" },
  { value: "piece", label: "piece (Single item)" },
  { value: "pc", label: "pc (Piece)" },
  { value: "unit", label: "unit (General unit)" },
  { value: "pkt", label: "pkt (Packet)" },
  { value: "box", label: "box (Box)" },
  { value: "bag", label: "bag (Bag)" },
  { value: "btl", label: "btl (Bottle)" },
  { value: "ml", label: "ml (Milliliter)" },
  { value: "l", label: "l (Liter)" },
  { value: "L", label: "L (Liter)" },
];

export default AddEditItemForm;
export { productUnits };