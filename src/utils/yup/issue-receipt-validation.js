import * as Yup from 'yup';
const issueSchema = Yup.object().shape({
  issueDate: Yup.date().required('Issue date is required'),
  departmentId: Yup.string().required('Department is required'),
  invoiceNumber: Yup.string().max(100, 'Invoice number too long'),
  invoiceDate: Yup.date().when('invoiceNumber', {
    is: (val) => val && val.length > 0,
    then: Yup.date().required('Invoice date is required when invoice number is provided')
  }),
  deliveryNote: Yup.string().max(500, 'Delivery note too long'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        itemId: Yup.string().required('Item is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .test(
            'available-quantity',
            'Quantity exceeds available stock',
            function(value) {
              const item = this.parent;
              return value <= item.availableQuantity;
            }
          ),
        rate: Yup.number()
          .required('Rate is required')
          .min(0, 'Rate cannot be negative')
      })
    )
    .min(1, 'At least one item is required')
});

export default issueSchema;
