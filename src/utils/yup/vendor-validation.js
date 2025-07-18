import * as Yup from 'yup';

export const vendorSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vendor name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
    
  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),
});
