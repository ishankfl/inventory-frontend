import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { isLoggedIn } from './utils/tokenutils';
import AddCategory from "./components/category/AddCategory";
import EditCategory from "./components/category/EditCategory";
import ViewCategory from "./components/category/ViewCategory";
import Dashboard from "./components/dashboard/Dashboard";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";
import ViewAllDepartments from "./components/departments/ViewDepartments";
import ViewItem from "./components/item/ViewItem";
import EditReceipt from "./components/Receipt/EditReceipt";
import Receipt from "./components/Receipt/ReceiptForm";
import ReceiptDetails from "./components/Receipt/ReceiptDetails";
import ReceiptList from "./components/Receipt/ReceiptsList";
import AddStaff from "./components/auth/AddStaff";
import Login from "./components/auth/Login";
import ViewAllUsers from "./components/auth/ViewAllUsers";
import ViewIssue from "./components/issue/ViewIssue";

import { UserProvider } from "./context/UserContext";
import IssueReceipt from "./components/issue/IssueForm";
import IssuesList from "./components/issue/IssueList";
import EditIssue from "./components/issue/EditIssue";
import { DashboardProvider } from "./context/DashboardContext";
import { ItemProvider } from "./context/ItemContext";
import { CategoryProvider } from "./context/CategoryContext";
import ViewAllVendors from "./components/vendors/ViewVendors";


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
        {/* <Route path="/add-product" element={<AddItem />} /> */}
        <Route
          path="/view-products"
          element={
            <ItemProvider>
              <ViewItem />
            </ItemProvider>
          }
        />
        {/* <Route path="/edit-product/:id" element={<EditItem />} /> */}

        <Route path="/add-category" element={<AddCategory />} />
        {/* <Route path="/view-category" element={<ViewCategory />} /> */}
        <Route
          path="/view-category"
          element={
            <CategoryProvider>
              <ViewCategory />
            </CategoryProvider>
          }
        />
        <Route path="/edit-category/:id" element={<EditCategory />} />

        <Route path="/add-user" element={<AddStaff />} />
        <Route path="/view-users" element={<ViewAllUsers />} />

        <Route path="/view-departments" element={<ViewAllDepartments />} />
        <Route path="/edit-department/:id" element={<EditDepartment />} />
        <Route path="/add-department" element={<AddDepartment />} />

        <Route path="/view-issues" element={<ViewIssue />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/receipt-details/:id" element={<ReceiptDetails />} />
        <Route path="/receipt/edit/:id" element={<EditReceipt />} />
        <Route path="/receipt-list" element={<ReceiptList />} />

        <Route path="/add-issue" element={<IssueReceipt />} />
        <Route path="/issue-list" element={<IssuesList />} />
        <Route path="/edit-issue/:id" element={<EditIssue />} />

        {/* vendor */}
        <Route path="/view-vendor/" element={<ViewAllVendors />} />

        <Route
          path="/"
          element={
            <DashboardProvider>
              <Dashboard />
            </DashboardProvider>
          }
        />
      </Routes>
      {/* </DashboardProvider> */}
    </UserProvider>

  );
};

export default CustomRouter;
