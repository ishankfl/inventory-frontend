import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string(),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  categoryId: Yup.string().required('Category selection is required'),
});
