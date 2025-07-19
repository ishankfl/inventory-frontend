// import React, { useEffect, useState } from 'react';
// import { addProduct } from '../../api/item';
// import { getAllCategories } from '../../api/category';
// import { getUserId } from '../../utils/tokenutils';
// import { productSchema } from '../../utils/yup/product-validation';
// import { productUnits } from '../../utils/unit/unit';

// import FormInput from '../common/FormInput';
// import FormSelect from '../common/FormSelect';

// import '../../styles/form.scss';

// const AddProduct = ({ onClose }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [price, setPrice] = useState('');
//   const [unit, setUnit] = useState('');
//   const [categoryId, setCategoryId] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         setCategories(res.data);
//       } catch (err) {
//         console.error('Failed to load categories:', err.message);
//         setErrors({ api: 'Failed to load categories. Please try again.' });
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     const formData = { name, description, quantity, price, categoryId, unit };

//     try {
//       await productSchema.validate(formData, { abortEarly: false });

//       setIsSubmitting(true);

//       const response = await addProduct(
//         name,
//         description,
//         parseInt(quantity, 10),
//         parseFloat(price),
//         categoryId,
//         getUserId(),
//         unit
//       );

//       if (response.status === 200 || response.status === 201) {
//         alert('Product added successfully!');
//         setName('');
//         setDescription('');
//         setQuantity('');
//         setPrice('');
//         setUnit('');
//         setCategoryId('');
//         onClose?.();
//       } else {
//         setErrors({ api: 'Failed to add product. Please try again.' });
//       }
//     } catch (err) {
//       if (err.name === 'ValidationError') {
//         const newErrors = {};
//         err.inner.forEach((error) => {
//           newErrors[error.path] = error.message;
//         });
//         setErrors(newErrors);
//       } else {
//         console.error('Error adding product:', err);
//         setErrors({ api: 'An unexpected error occurred. Please try again.' });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="!bg-white container">
//       <h2>Add Product</h2>
//       <form onSubmit={handleSubmit}>
//         {errors.api && (
//           <label className="error-msg" style={{ color: 'red', marginBottom: '1rem', display: 'block' }}>
//             {errors.api}
//           </label>
//         )}

//         <FormInput
//           label="Name"
//           name="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           error={errors.name}
//           required
//           placeholder="Enter product name"
//         />

//         <FormInput
//           label="Description"
//           name="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           error={errors.description}
//           type="text"
//           placeholder="Enter product description (optional)"
//         />

//         <FormInput
//           label="Quantity"
//           name="quantity"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           error={errors.quantity}
//           type="number"
//           required
//           placeholder="Enter quantity"
//         />

//         <FormInput
//           label="Price"
//           name="price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           error={errors.price}
//           type="number"
//           required
//           placeholder="Enter price"
//         />

//         <FormSelect
//           label="Unit"
//           name="unit"
//           value={unit}
//           onChange={(e) => setUnit(e.target.value)}
//           options={[
//             { label: 'Select Unit', value: '' },
//             ...productUnits.map((u) => ({ label: u, value: u }))
//           ]}
//           error={errors.unit}
//           required
//         />


//         <FormSelect
//           label="Category"
//           name="categoryId"
//           value={categoryId}
//           onChange={(e) => setCategoryId(e.target.value)}
//           options={[
//             { label: 'Select Category', value: '' },
//             ...categories.map((cat) => ({ label: cat.name, value: cat.id }))
//           ]}
//           error={errors.categoryId}
//           required
//         />

//         <div className="mt-4 flex gap-4">
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Adding...' : 'Add Product'}
//           </button>
//           {onClose && (
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="!bg-red-600 hover:!bg-red-700 text-white"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
