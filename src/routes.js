import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { isLoggedIn } from './utils/tokenutils';
// import AddCategory from "./components/category/AddCategory";
// import EditCategory from "./components/category/EditCategory";

import ViewCategory from "./components/category/ViewCategory";
import Dashboard from "./components/dashboard/Dashboard";
import ViewAllDepartments from "./components/departments/ViewDepartments";
import ViewItem from "./components/item/ViewItem";
import ReceiptDetails from "./components/Receipt/ReceiptDetails";
import ReceiptList from "./components/Receipt/ReceiptsList";
import AddStaff from "./components/auth/AddStaff";
import Login from "./components/auth/Login";
import ViewAllUsers from "./components/auth/ViewAllUsers";
import ViewIssue from "./components/issue/ViewIssue";

import { UserProvider } from "./context/UserContext";
import IssuesList from "./components/issue/IssueList";
import { DashboardProvider } from "./context/DashboardContext";
import { ItemProvider } from "./context/ItemContext";
import { CategoryProvider } from "./context/CategoryContext";
import ViewAllVendors from "./components/vendors/ViewVendors";
import ReceiptForm from "./components/Receipt/ReceiptForm";
import IssueForm from "./components/issue/IssueForm";
import { VendorProvider } from "./context/VendorContext";
import { DepartmentProvider } from "./context/DepartmentContext";


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

        <Route
          path="/view-category"
          element={
            <CategoryProvider>
              <ViewCategory />
            </CategoryProvider>
          }
        />

        <Route path="/add-user" element={<AddStaff />} />
        <Route path="/view-users" element={<ViewAllUsers />} />

        {/* <Route path="/vendors" element={<ViewAllVendors />} /> */}
        <Route
          path="/vendors"
          element={
            <VendorProvider>
              <ViewAllVendors />
            </VendorProvider>
          }
        />
        {/* <Route path="/vendors/edit/:id" element={<EditVendor />} /> */}

        <Route path="/view-departments" element={<DepartmentProvider>
          <ViewAllDepartments /> </DepartmentProvider>} />
        {/* <Route path="/edit-department/:id" element={<EditDepartment />} /> */}
        {/* <Route path="/add-department" element={<AddDepartment />} /> */}

        <Route path="/view-issues" element={<ViewIssue />} />

        <Route path="/receipt" element={<ReceiptForm isEdit={false} />} />
        <Route path="/receipt/edit/:id" element={<ReceiptForm isEdit={true} />} />
        <Route path="/receipts" element={<ReceiptList />} />

        <Route path="/receipt-details/:id" element={<ReceiptDetails />} />
        {/* <Route path="/receipt/edit/:id" element={<EditReceipt />} /> */}

        <Route path="/add-issue" element={<IssueForm />} />
        <Route path="/issue-list" element={<IssuesList />} />
        <Route path="/edit-issue/:id" element={<IssueForm isEdit={true} />} />

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
