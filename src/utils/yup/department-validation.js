import * as Yup from 'yup';

export const departmentSchema = Yup.object().shape({
  name: Yup.string().required('Department name is required'),
  description: Yup.string().required('Department description is required'),
});
