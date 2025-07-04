import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProducts, getAllProducts } from '../../api/product';
import '../../styles/view.scss';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import { Fa500Px, FaBed, FaSearch, FaUser } from 'react-icons/fa';
import SearchBox from '../common/SearchBox';
import { Label } from 'recharts';
const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isAddModelOpened, setIsAddModelOpened] = useState(false);
  const [isEditModelOpened, setIsEditModelOpened] = useState(false);
  const [productId, setProductId] = useState('');
  const [originalProducts, setOriginalProducts] = useState([]);


  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      console.log(res.data)
      setProducts(res.data);
      setOriginalProducts(res.data); // store the original list

    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to load products");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProducts(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err.message);
      setError("Failed to delete product");
    }
  };

  const handleEdit = (id) => {
    setProductId(id);
    setIsEditModelOpened(true);
    // navigate(`/edit-product/${id}`);
  };

  const handleAddNewProduct = () => {
    setIsAddModelOpened(true);
  };

  const closeModal = () => {
    setIsAddModelOpened(false);
    setIsEditModelOpened(false);
  };
  // const handleSearchFilter=(details)=>{
  //   if (details==='' || details == null){
  //     setProducts(products);
  //     return;
  //   }
  //   const filteredProduct = products.filter(item => item.name===details);
  //   console.log(filteredProduct)
  //   setProducts(filteredProduct)

  // }
  // const handleSearchFilter = (details) => {
  //   console.log(details);

  //   if (!details) {
  //     if (!details) {
  //       // If input is empty, reset to original full list
  //       setProducts(products);
  //       return;
  //     }
  //   };
  //   let filteredProduct = products;

  //   filteredProduct = filteredProduct.filter(item =>
  //     item.name.toLowerCase().startsWith(details.toLowerCase()) ||
  //     item.description.toLowerCase().startsWith(details.toLowerCase())
  //   );

  //   console.log(filteredProduct);
  //   setProducts(filteredProduct);
  // };

  const handleSearchFilter = (details) => {
    if (!details) {
      setProducts(originalProducts);
      return;
    }

    const filteredProduct = originalProducts.filter(item =>
      item.name.toLowerCase().startsWith(details.toLowerCase()) ||
      item.description.toLowerCase().startsWith(details.toLowerCase())
    );
    console.log(filteredProduct)
    setProducts(filteredProduct);
  };


  return (
    <div className="main-container-box relative">
      <button className="nav-item" onClick={handleAddNewProduct}>+ Add New Product</button>

      <div
        className={`view-container overflow-x-auto transition-all duration-300 ${(isAddModelOpened || isEditModelOpened) ? "blur-sm pointer-events-none select-none" : ""
          }`}
      >
        <div className='flex  justify-between '>
          <h2>Product List</h2>
          <SearchBox handleSearchFilter={handleSearchFilter} label={'Product'}/>
          {/* <input type="text" className='w-[20%]' prefix="hidlkfsdlkfjsdlfkjsdlfkjsdflkj" />
          <div className="flex items-center justify-center border border-gray-300 rounded px-2 w-[20%]">
            <FaSearch className="text-gray-500 mr-2 " />
            <input
              type="text"
              className="flex-1 !outline-none !border-none m-0 p-0"
              placeholder="Enter product name"
              onChange={(e) => {
                handleSearchFilter(e.target.value)
              }}
            />
          </div> */}


        </div>        {error && <p className="error-msg">{error}</p>}
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0" className="min-w-full divide-y divide-gray-20">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.description || '-'}</td>
                  <td>{p.quantity}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.category?.name || 'N/A'}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleEdit(p.id)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(isAddModelOpened || isEditModelOpened) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isAddModelOpened && <AddProduct onClose={closeModal} />}
            {isEditModelOpened && <EditProduct onClose={closeModal} productId={productId} />}
          </div>
        </div>
      )}


    </div>
  );
};

export default ViewProducts;
