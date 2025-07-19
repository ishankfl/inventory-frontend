import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { addCategory, getCategoryById, updateCategory } from "../../api/category";
import FormInput from "../common/FormInput";
import ToastNotification from "../common/ToggleNotification";

const categorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required."),
  description: Yup.string().trim(),
});

const AddEditCategoryForm = ({ initialData = null, catId = null, onClose, onSubmitSuccess }) => {
  const [initialValues, setInitialValues] = useState({ name: "", description: "" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(catId || initialData?.id);

  // Load category data if in edit mode
  useEffect(() => {
    const loadCategoryData = async () => {
      if (catId) {
        setLoading(true);
        try {
          const res = await getCategoryById(catId);
          setInitialValues({
            name: res.data.name || "",
            description: res.data.description || "",
          });
        } catch (error) {
          setToast({
            type: "error",
            message: "Failed to load category details.",
            duration: 3000,
          });
        } finally {
          setLoading(false);
        }
      } else if (initialData) {
        setInitialValues({
          name: initialData.name || "",
          description: initialData.description || "",
        });
      }
    };

    loadCategoryData();
  }, [catId, initialData]);

  // Auto-dismiss toast after duration
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const categoryId = catId || initialData?.id;

      const response = isEditMode
        ? await updateCategory(categoryId, values.name, values.description)
        : await addCategory(values.name, values.description);

      if (response.status === 200 || response.status === 201) {
        setToast({
          type: "success",
          message: isEditMode ? "Category updated successfully." : "Category added successfully.",
          duration: 3000,
        });
        // onSubmitSuccess?.();
        setTimeout(() => onClose?.(), 1500);
      } else {
        setToast({
          type: "error",
          message: "Failed to save category. Please try again.",
          duration: 3000,
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Unexpected error occurred.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-4">Loading category data...</p>;

  return (
    <>
 
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose}></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
             {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditMode ? "Edit Category" : "Add New Category"}
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
            validationSchema={categorySchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-4">
                <FormInput
                  label="Category Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., Electronics, Stationery"
                />

                <FormInput
                  label="Category Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && errors.description}
                  disabled={isSubmitting}
                  placeholder="e.g., Items used in office or home"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Adding..."
                    : isEditMode
                      ? "Save Changes"
                      : "Add Category"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddEditCategoryForm;