import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import { addDepartment, getDepartmentById, updateDepartment } from "../../api/departments";
import ToastNotification from "../common/ToggleNotification";
import FormInput from "../common/FormInput";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Department name is required."),
  description: Yup.string().trim().required("Description is required."),
});

const AddEditDepartmentForm = ({ id, onClose, fetchAllDepartments }) => {
  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState({ name: "", description: "" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          const res = await getDepartmentById(id);
          if (res.status === 200) {
            const { name, description } = res.data;
            setInitialValues({ name, description });
          } else {
            setToast({ type: "error", message: "Failed to load department.", duration: 3000 });
          }
        } catch (error) {
          setToast({ type: "error", message: "Error fetching department.", duration: 3000 });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDepartment();
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let response;
      if (isEditMode) {
        response = await updateDepartment(id, values.name, values.description);
      } else {
        response = await addDepartment(values.name, values.description);
      }

      if (response.status === 200 || response.status === 201) {
        setToast({
          type: "success",
          message: isEditMode ? "Department updated successfully." : "Department added successfully.",
          duration: 3000,
        });
        fetchAllDepartments?.();
        resetForm();
        setTimeout(() => onClose?.(), 1500);
      } else {
        setToast({
          type: "error",
          message: "Failed to save department.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: "Unexpected error occurred.",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditMode) return <p>Loading department data...</p>;

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
            className="text-white-600 bg-red-500 hover:bg-red-700 rounded-full p-1"
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

        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Edit Department" : "Add Department"}
        </h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-4">
              <FormInput
                label="Department Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter department name"
                error={touched.name && errors.name}
                required
              />

              <FormInput
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter department description"
                error={touched.description && errors.description}
                required
              />

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
                    : "Add Department"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEditDepartmentForm;
