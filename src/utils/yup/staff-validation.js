import * as Yup from 'yup';
export const staffSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    role: Yup.string().required('Role is required').oneOf(['0', '1'], 'Invalid role selected'),
});