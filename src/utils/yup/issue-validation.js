import * as Yup from 'yup';

const issueSchema = Yup.object().shape({
  issueId: Yup.string().required("Issue ID is required"),
  issueDate: Yup.date()
    .required("Issue date is required")
    .typeError("Issue date must be a valid date"),
  invoiceNumber: Yup.string().max(100, "Invoice number too long"),
  invoiceDate: Yup.date()
    .nullable()
    .when('invoiceNumber', (invoiceNumber, schema) => 
      invoiceNumber ? schema.required("Invoice date is required when invoice number is provided") : schema
    )
    .typeError("Invoice date must be a valid date"),
  deliveryNote: Yup.string().max(500, "Delivery note too long"),
  departmentId: Yup.string().required("Department is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        itemId: Yup.string().required("Item is required"),
        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .positive("Quantity must be greater than 0")
          .required("Quantity is required"),
        rate: Yup.number()
          .typeError("Rate must be a number")
          .min(0, "Rate must be positive")
          .required("Rate is required"),
      })
    )
    .min(1, "At least one item is required"),
});
export default issueSchema;