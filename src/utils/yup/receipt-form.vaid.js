import * as Yup from 'yup';

export const primaryInfoSchema = Yup.object().shape({
    entryOf: Yup.string().required('Please select an entry type'),
    receiptNo: Yup.string().required('Receipt number is required'),
    receiptDateAD: Yup.date()
        .required('Receipt date is required')
        .max(new Date(), 'Receipt date cannot be in the future'),
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

export const validatePrimaryInfo = async (setErrors, primaryInfo) => {
    try {
        await primaryInfoSchema.validate(primaryInfo, { abortEarly: false });
        setErrors(prev => ({ ...prev, primary: {} }));
        return true;
    } catch (err) {
        const newErrors = {};
        err.inner.forEach(error => {
            newErrors[error.path] = error.message;
        });
        setErrors(prev => ({ ...prev, primary: newErrors }));
        return false;
    }
};

export const validateItem = async (setErrors, newItem) => {
    try {
        await itemSchema.validate(newItem, { abortEarly: false });
        setErrors(prev => ({ ...prev, item: {} }));
        return true;
    } catch (err) {
        const newErrors = {};
        err.inner.forEach(error => {
            newErrors[error.path] = error.message;
        });
        setErrors(prev => ({ ...prev, item: newErrors }));
        return false;
    }
};