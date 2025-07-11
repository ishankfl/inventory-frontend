import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { isLoggedIn } from './utils/tokenutils';

import Login from "./components/auth/Login";
import ViewAllUsers from "./components/auth/ViewAllUsers";
import AddStaff from "./components/auth/AddStaff";
import AddCategory from "./components/category/AddCategory";
import ViewCategory from "./components/category/ViewCategory";
import EditCategory from "./components/category/EditCategory";
import AddItem from "./components/item/AddItem";
import ViewItem from "./components/item/ViewItem";
import EditItem from "./components/item/EditItem";
import ViewAllDepartments from "./components/departments/ViewDepartments";
import EditDepartment from "./components/departments/EditDepartment";
import AddDepartment from "./components/departments/AddDepartment";
import IssuePage from "./components/issue/IssuePage";
import ViewIssue from "./components/issue/ViewIssue";
import LineChart from "./components/dashboard/LineChart";
import Dashboard from "./components/dashboard/Dashboard";
import Receipt from "./components/Receipt/ReceiptForm";
import ReceiptDetails from "./components/Receipt/ReceiptDetails";
import ReceiptList from "./components/Receipt/ReceiptsList";
import EditReceipt from "./components/Receipt/EditReceipt";
import IssueReceipt from "./components/Receipt/IssueForm";
import IssuesList from "./components/Receipt/IssueList";
import EditIssue from "./components/Receipt/EditIssue";

const CustomRouter = () => {
  const navigate = useNavigate();
  const [userLoggedinStatus, setUserLoggedinStatus] = useState(false);

  useEffect(() => {
    const status = isLoggedIn();
    setUserLoggedinStatus(status);
    if (!status) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/add-product" element={<AddItem />} />
      <Route path="/view-products" element={<ViewItem />} />
      <Route path="/edit-product/:id" element={<EditItem />} />

      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/view-category" element={<ViewCategory />} />
      <Route path="/edit-category/:id" element={<EditCategory />} />

      <Route path="/add-user" element={<AddStaff />} />
      <Route path="/view-users" element={<ViewAllUsers />} />

      <Route path="/view-departments" element={<ViewAllDepartments />} />
      <Route path="/edit-department/:id" element={<EditDepartment />} />
      <Route path="/add-department" element={<AddDepartment />} />

      <Route path="/issue-item" element={<IssuePage />} />
      <Route path="/view-issues" element={<ViewIssue />} />

      <Route path="/receipt" element={<Receipt />} />
      <Route path="/receipt-details/:id" element={<ReceiptDetails />} />
      <Route path="/receipt/edit/:id" element={<EditReceipt />} />
      <Route path="/receipt-list" element={<ReceiptList />} />

      <Route path="/issue-receipt" element={<IssueReceipt />} />
      <Route path="/issue-list" element={<IssuesList />} />
      <Route path="/edit-issue/:id" element={<EditIssue />} />

      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default CustomRouter;
