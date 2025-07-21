import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import { addVendor, getVendorById, updateVendor } from "../../api/vendors";
import FormInput from "../common/FormInput";
import ToastNotification from "../common/ToggleNotification";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Vendor name is required."),
  email: Yup.string().trim().email("Invalid email format").required("Vendor email is required."),
});

const AddEditVendorForm = ({ id = null, onClose, fetchAllVendors }) => {
  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState({ name: "", email: "" });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadVendor = async () => {
      if (isEditMode) {
        try {
          const response = await getVendorById(id);
          if (response.status === 200) {
            const { name, email } = response.data;
            setInitialValues({ name, email });
          } else {
            setToast({
              type: "error",
              message: "Failed to load vendor.",
              duration: 3000,
            });
          }
        } catch (error) {
          setToast({
            type: "error",
            message: "An error occurred while fetching vendor.",
            duration: 3000,
          });
        }
      }
    };

    loadVendor();
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let response;
      if (isEditMode) {
        response = await updateVendor(id, values.name, values.email);
      } else {
        response = await addVendor(values.name, values.email);
      }

      if (response.status === 200 || response.status === 201) {
        setToast({
          type: "success",
          message: isEditMode ? "Vendor updated successfully." : "Vendor added successfully.",
          duration: 3000,
        });
        fetchAllVendors?.();
        resetForm();
        setTimeout(() => onClose?.(), 1500);
      } else {
        setToast({
          type: "error",
          message: "Failed to save vendor. Please try again.",
          duration: 3000,
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Unexpected error occurred. Please try again.",
        duration: 3000,
      });
      console.error("Vendor submit error:", error);
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
          {isEditMode ? "Edit Vendor" : "Add Vendor"}
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
                label="Vendor Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter vendor name"
                error={touched.name && errors.name}
                required
              />

              <FormInput
                label="Vendor Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter vendor email"
                error={touched.email && errors.email}
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
                    : "Add Vendor"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEditVendorForm;
