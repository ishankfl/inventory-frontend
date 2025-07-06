import * as Yup from 'yup';
export const primaryInfoSchema = Yup.object().shape({
    entryOf: Yup.string().required('Entry type is required'),
    receiptNo: Yup.string().required('Receipt number is required'),
    receiptDateAD: Yup.date().required('Receipt date is required'),
    billNo: Yup.string().required('Bill number is required'),
    billDateAD: Yup.date().required('Bill date is required'),
    vendor: Yup.string().required('Vendor is required'),
});

export const itemSchema = Yup.object().shape({
    itemId: Yup.string().required('Item is required'),
    quantity: Yup.number()
        .required('Quantity is required')
        .positive('Quantity must be positive')
        .min(0.01, 'Quantity must be at least 0.01'),
    rate: Yup.number()
        .required('Rate is required')
        .positive('Rate must be positive')
        .min(0.01, 'Rate must be at least 0.01'),
    value: Yup.number().required(),
});