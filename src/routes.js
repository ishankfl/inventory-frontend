import Login from "./components/auth/Login"
import {Route, Routes} from 'react-router-dom';
import AddProduct from "./components/products/AddProduct";
import AddCategory from "./components/category/AddCategory";
import AddStaff from "./components/auth/AddStaff";
import ViewCategory from "./components/category/ViewCategory";

const CustomRouter = () => {
  return (
    
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/add-product" element={<AddProduct/>}/>
      <Route path="/add-category" element={<AddCategory/>}/>
      <Route path="/add-staff" element={<AddStaff/>}/>
      <Route path="/category" element={<ViewCategory/>}/>
    </Routes>
  );
}

export default CustomRouter;