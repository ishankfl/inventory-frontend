import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { isLoggedIn } from './utils/tokenutils';
import AddCategory from "./components/category/AddCategory";
import EditCategory from "./components/category/EditCategory";
import ViewCategory from "./components/category/ViewCategory";

import Dashboard from "./components/dashboard/Dashboard";
import LineChart from "./components/dashboard/LineChart";

import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";
import ViewAllDepartments from "./components/departments/ViewDepartments";

import AddItem from "./components/item/AddItem";
import EditItem from "./components/item/EditItem";
import ViewItem from "./components/item/ViewItem";

// import EditIssue from "./components/Receipt/EditIssue";
import EditReceipt from "./components/Receipt/EditReceipt";
// import IssueReceipt from "./components/Receipt/IssueForm";
// import IssuesList from "./components/Receipt/IssueList";
import Receipt from "./components/Receipt/ReceiptForm";
import ReceiptDetails from "./components/Receipt/ReceiptDetails";
import ReceiptList from "./components/Receipt/ReceiptsList";

import AddStaff from "./components/auth/AddStaff";
import Login from "./components/auth/Login";
import ViewAllUsers from "./components/auth/ViewAllUsers";

import IssuePage from "./components/issue/IssuePage";
import ViewIssue from "./components/issue/ViewIssue";

import { UserProvider } from "./context/UserContext";
import IssueReceipt from "./components/issue/IssueForm";
import IssuesList from "./components/issue/IssueList";
import EditIssue from "./components/issue/EditIssue";


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
    <UserProvider>
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

        {/* <Route path="/add-issue" element={<IssuePage />} /> */}
        <Route path="/view-issues" element={<ViewIssue />} />

        <Route path="/receipt" element={<Receipt />} />
        <Route path="/receipt-details/:id" element={<ReceiptDetails />} />
        <Route path="/receipt/edit/:id" element={<EditReceipt />} />
        <Route path="/receipt-list" element={<ReceiptList />} />

        <Route path="/add-issue" element={<IssueReceipt />} />
        <Route path="/issue-list" element={<IssuesList />} />
        <Route path="/edit-issue/:id" element={<EditIssue />} />

        <Route path="/" element={<Dashboard />} />
      </Routes>
    </UserProvider>
  );
};

export default CustomRouter;
