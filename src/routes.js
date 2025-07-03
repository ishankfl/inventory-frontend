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
import EditDepartment from "./components/departments/EditDepartment";
import AddDepartment from "./components/departments/AddDepartment";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from './utils/tokenutils';
import { useState,useEffect } from "react";
import Receipt from "./components/Receipt/ReceiptForm";
import ReceiptDetails from "./components/Receipt/ReceiptDetails";
import ReceiptList from "./components/Receipt/ReceiptsList";
import EditReceipt from "./components/Receipt/EditReceipt";
const CustomRouter = (c) => {
const navigate = useNavigate();
  const [userLoggedinStatus,setUserLoggedinStatus]= useState(false);
   function getUserLoggedInStatus(){
    const userLoggedInStatus =  isLoggedIn();
    if (!userLoggedInStatus){
    navigate('/login')
    return;
    }
    setUserLoggedinStatus(userLoggedInStatus);
  }
  useEffect(()=>{
    getUserLoggedInStatus();
  });

  return (
    
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/add-product" element={<AddProduct/>}/>
      <Route path="/view-products" element={<ViewProducts/>}/>
      <Route path="/add-category" element={<AddCategory/>}/>
      <Route path="/add-user" element={<AddStaff/>}/>
      <Route path="/view-users" element={<ViewAllUsers/>}/>
      <Route path="/view-category" element={<ViewCategory/>}/>
      <Route path="/edit-category/:id" element={<EditCategory />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/departments/:id" element={<EditProduct />} />
      <Route path="/view-departments" element={<ViewAllDepartments />} />
      <Route path="/edit-department/:id" element={<EditDepartment />} />
      <Route path="/add-department" element={<AddDepartment />} />
      <Route path="/issue-products" element={<IssuePage />} />
      <Route path="/view-issues" element={<ViewIssue />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/receipt" element={<Receipt />} />
      <Route path="/receipt-details/:id" element={<ReceiptDetails />} />
      <Route path="/receipt/edit/:id" element={<EditReceipt />} />
      <Route path="/receipt-list" element={<ReceiptList />} />

    </Routes>
  );
}

export default CustomRouter;