import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import '../../styles/form.scss';
import { addVendor } from '../../api/vendors';
import { vendorSchema } from '../../utils/yup/vendor-validation';
import FormInput from '../../components/common/FormInput'; // adjust path if needed

const AddVendor = ({ onClose, fetchAllVendors }) => {
  const initialValues = {
    name: '',
    email: '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const response = await addVendor(values.name, values.email);

      if (response.status === 201 || response.status === 200) {
        alert('Vendor added successfully!');
        resetForm();
        fetchAllVendors();
        onClose();
      } else {
        setErrors({ api: 'Failed to add vendor. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      setErrors({ api: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="!bg-white container">
      <h2 className="text-xl font-semibold mb-4">Add New Vendor</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={vendorSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            {errors.api && (
              <div className="text-red-600 mb-2 font-medium">{errors.api}</div>
            )}

            <FormInput
              label="Vendor Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              placeholder="Enter vendor name"
              required
            />

            <div className="mt-4">
              <FormInput
                type="email"
                label="Vendor Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="Enter vendor email"
                required
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddVendor;
