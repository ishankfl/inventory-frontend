import Login from "./components/auth/Login"
import {Route, Routes} from 'react-router-dom';
import AddProduct from "./components/products/AddProduct";
import AddCategory from "./components/category/AddCategory";
import AddStaff from "./components/auth/AddStaff";
import ViewCategory from "./components/category/ViewCategory";
import ViewProducts from "./components/products/ViewProducts";
import EditCategory from "./components/category/EditCategory";
import EditProduct from "./components/products/EditProduct";
import ViewAllUsers from "./components/auth/ViewAllUsers";
import ViewAllDepartments from "./components/departments/ViewDepartments";
import IssuePage from "./components/issue/IssuePage";
import ViewIssue from "./components/issue/ViewIssue";
import LineChart from "./components/dashboard/LineChart";
import Dashboard from "./components/dashboard/Dashboard";

const CustomRouter = () => {
  return (
    
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/add-product" element={<AddProduct/>}/>
      <Route path="/product" element={<ViewProducts/>}/>
      <Route path="/add-category" element={<AddCategory/>}/>
      <Route path="/add-user" element={<AddStaff/>}/>
      <Route path="/users" element={<ViewAllUsers/>}/>
      <Route path="/category" element={<ViewCategory/>}/>
      <Route path="/edit-category/:id" element={<EditCategory />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/departments/:id" element={<EditProduct />} />
      <Route path="/departments" element={<ViewAllDepartments />} />
      <Route path="/issue" element={<IssuePage />} />
      <Route path="/view-issues" element={<ViewIssue />} />
      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}

export default CustomRouter;