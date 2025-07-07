import * as Yup from 'yup';

export const categorySchema = Yup.object().shape({
  categoryName: Yup.string()
    .required('Category Name is required')
    .min(2, 'Category Name must be at least 2 characters'),
  categoryDescription: Yup.string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters'),
});