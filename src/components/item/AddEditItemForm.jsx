import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { addCategory, updateCategory } from "../../api/category";
// import { useUserStore } from "../../store/useUserStore";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import ToastNotification from "../common/ToggleNotification";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required."),
  description: Yup.string(),
});

const AddEditCategoryForm = ({ initialData = null, onClose, onSubmitSuccess }) => {
  const [initialValues, setInitialValues] = useState({ name: "", description: "" });
  const [toast, setToast] = useState(null);
  // const userId = useUserStore((state) => state.userId);
  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setInitialValues({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let response;
      if (isEditMode) {
        response = await updateCategory(initialData.id, values.name, values.description);
      } else {
        response = await addCategory(values.name, values.description);
      }

      if (response.status === 200 || response.status === 201) {
        setToast({
          type: "success",
          message: isEditMode ? "Category updated successfully." : "Category added successfully.",
          duration: 3000,
        });
        onSubmitSuccess?.();
        setTimeout(() => {
          onClose?.();
        }, 1500);
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

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose}></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
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
            validationSchema={validationSchema}
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
                  placeholder="e.g., Electronics, Groceries"
                />

                <FormTextarea
                  label="Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && errors.description}
                  disabled={isSubmitting}
                  placeholder="Optional category description"
                />

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
