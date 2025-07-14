import React, { useState } from 'react';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { staffSchema } from '../../utils/yup/staff-validation';
import { addStaff } from '../../api/user';
import ToastNotification from '../common/ToggleNotification';
import FormInput from '../common/FormInput'; // Adjust path if needed

const AddStaff = ({ closeModal }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

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

      <div className="!bg-white container p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>

        <Formik
          initialValues={{ name: '', email: '', password: '', role: '' }}
          validationSchema={staffSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const response = await addStaff(values.name, values.email, values.password, values.role);

              if (response.status === 201) {
                setToast({
                  type: 'success',
                  message: 'Staff added successfully!',
                  duration: 4000,
                });
                setTimeout(() => {
                  navigate('/view-users');
                }, 3000);
              } else {
                setToast({
                  type: 'error',
                  message: 'Something went wrong. Please try again.',
                  duration: 3000,
                });
              }
            } catch (err) {
              if (err.name === 'ValidationError') {
                const fieldErrors = {};
                err.inner.forEach((e) => {
                  fieldErrors[e.path] = e.message;
                });
                setErrors(fieldErrors);
              } else if (err.response?.status === 400) {
                setToast({
                  type: 'error',
                  message: 'Invalid data provided. Please check your input.',
                  duration: 4000,
                });
              } else {
                setToast({
                  type: 'error',
                  message: 'Unexpected error occurred. Please try again.',
                  duration: 4000,
                });
                console.error(err);
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">

              <FormInput
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter name"
                required
                error={touched.name && errors.name ? errors.name : ''}
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter email"
                required
                error={touched.email && errors.email ? errors.email : ''}
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                required
                error={touched.password && errors.password ? errors.password : ''}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${
                    touched.role && errors.role ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="0">Admin</option>
                  <option value="1">Staff</option>
                </select>
                {touched.role && errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role}</p>
                )}
              </div>

              <div className="flex justify-start gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddStaff;
