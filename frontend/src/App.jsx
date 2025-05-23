import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import ProductList from "./components/ProductList";
import AddProductForm from "./components/AddProductForm";
import UpdateProductForm from "./components/UpdateProductForm";
import NotificationBell from "./components/Productnotification";
import Sidebar from "./components/MainDashoardSideBar";
import ProductFilter from "./components/ProductFilter";
import SupplierProfile from "./components/supplierprofile";
import ViewAllOrders from "./components/SupplierOrder";
import PlaceOrderForm from "./components/SupplierManualOrder";
import SupplierList from "./components/SupplierList";
import Dashboard from "./components/MainDashboard";
import AddSupplier from "./components/AddSupplier";
import EditSupplier from "./components/EditSupplier";
import RegisterCustomer from "./components/RegisterCustomer";
import CustomerList from "./components/CustomerList";
import CustomerProfile from "./components/CustomerProfile";
import SingleSale from "./components/SingleSale";
import AddSaleFormWithoutCustomer from "./components/AddSaleFormWithoutCustomer";
import ReturnForm from "./components/ReturnForm";
import SupplierLogin from "./components/SupplierLogin";
import Email from "./Components/Email";
import SalesList from "./components/SalesList";
import AddSaleForm from "./components/AddSaleForm";
import Nav from "./components/NavComponent";
import Asset from "./components/AssetComponent";
import Liab from "./components/LiabilityComponent";
import Exp from "./components/ExpenseComponent";
import PettyCash from "./components/PettyComponent";
import Income from "./components/IncomeComponent";
import FinAccount from "./components/FinAccountComponent";
import FinanceDashboard from "./components/FinDash";
import FinDash from "./components/FinDash";
import FinanceLayout from "./components/FinanceLayout";

import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Attendance from "./components/Attendance";
import ControlPanel from "./components/ControlPanel";
import Reports from "./components/Reports";
import Salary from "./components/Salary";
import LeaveRequests from "./components/LeaveRequests";
import EmployeeProfile from "./components/EmployeeProfile";
import LeaveRequestForm from "./components/LeaveRequestForm";
import { LeaveRequestProvider } from "./context/LeaveRequestContext";
import Header from "./Header";
import Footer from "./Footer";
import Index from "./index";
import Customerogin from "./components/Customerogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import ProductListWithDiscounts from "./components/ProductListWithDiscounts";

import FinStatement from "./components/FinStatementComponent";
//import FinAccount from "./components/FinAccountComponent";

const App = () => {
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error.message);
      sessionStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8070");
    socket.on("lowStockNotification", (data) => {
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message: data.message, seen: false },
      ]);
    });
    return () => socket.disconnect();
  }, []);

  const markNotificationAsSeen = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
    );
  };

  const isLoggedIn = !!user?.token;

  const handleLogin = (userData) => {
    try {
      sessionStorage.setItem("user", JSON.stringify(userData));
      console.log(
        "Stored User in sessionStorage:",
        sessionStorage.getItem("user")
      );
      setUser(userData);
    } catch (error) {
      console.error("Error saving user to sessionStorage:", error.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      setUser(null);
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error.message);
      sessionStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes without header */}
          <Route path="/supplier/login" element={<SupplierLogin />} />
          <Route path="/supplier/:supplierId" element={<SupplierProfile />} />
          <Route
            path="*"
            element={
              <>
                <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                  />
                  <Route
                    path="/supplier/:supplierId"
                    element={<SupplierProfile />}
                  />
                  <Route path="/supplier/login" element={<SupplierLogin />} />

                  {/* Protected Routes */}

                  <Route
                    path="/change-password"
                    element={
                      isLoggedIn ? <ChangePassword /> : <Navigate to="/login" />
                    }
                  />

                  <Route
                    path="/InventoryDashboard/*"
                    element={
                      <AccessControl requiredDept="Inventory">
                        <InventoryDashboard user={user} />
                      </AccessControl>
                    }
                  />

                  <Route
                    path="/FinanceDashboard/*"
                    element={
                      <AccessControl requiredDept="Finance">
                        <FinanceDashboard user={user} />
                      </AccessControl>
                    }
                  />

                  <Route
                    path="/SalesDashboard/*"
                    element={
                      <AccessControl requiredDept="Sales">
                        <SalesDashboard user={user} />
                      </AccessControl>
                    }
                  />

                  <Route
                    path="/CustomerDashboard/*"
                    element={
                      <AccessControl requiredDept="CRM">
                        <CustomerDashboard user={user} />
                      </AccessControl>
                    }
                  />

                  <Route
                    path="/HRdashboard/*"
                    element={
                      <AccessControl requiredDept="HR">
                        <HRDashboard user={user} />
                      </AccessControl>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      isLoggedIn ? (
                        <EmployeeProfile />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/change-password"
                    element={
                      isLoggedIn ? <ChangePassword /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/InventoryDashboard/*"
                    element={
                      <AccessControl requiredDept="Inventory">
                        <InventoryDashboard />
                      </AccessControl>
                    }
                  />
                  <Route
                    path="/FinanceDashboard/*"
                    element={
                      <AccessControl requiredDept="Finance">
                        <FinanceDashboard />
                      </AccessControl>
                    }
                  />
                  <Route
                    path="/SalesDashboard/*"
                    element={
                      <AccessControl requiredDept="Sales">
                        <SalesDashboard />
                      </AccessControl>
                    }
                  />
                  <Route
                    path="/CustomerDashboard/*"
                    element={
                      <AccessControl requiredDept="CRM">
                        <CustomerDashboard />
                      </AccessControl>
                    }
                  />
                  <Route
                    path="/HRdashboard/*"
                    element={
                      <AccessControl requiredDept="HR">
                        <HRDashboard user={user} />
                      </AccessControl>
                    }
                  />
                  <Route
                    path="/EmployeeProfile"
                    element={<EmployeeProfile />}
                  />
                  <Route
                    path="/leave-requests"
                    element={<LeaveRequests user={user} />}
                  />
                  <Route
                    path="/apply-request"
                    element={<LeaveRequestForm user={user} />}
                  />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );

  function AccessControl({ children, requiredRole, requiredDept }) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      console.log("Access denied: User not logged in.");
      return <Navigate to="/login" />;
    }

    // Role check (if needed)
    if (requiredRole && user.role !== requiredRole) {
      console.log(`Access denied: Role must be '${requiredRole}'`);
      return <div>Access Denied: Insufficient role permissions.</div>;
    }

    // Department check (if needed)
    if (requiredDept && user.department !== requiredDept) {
      console.log(`Access denied: Department must be '${requiredDept}'`);
      return <div>Access Denied: Insufficient department permissions.</div>;
    }

    // All checks passed
    return children;
  }

  function InventoryDashboard({ user }) {
    return (
      <div className="dashboard-container">
        <nav className="sidebar">
          <h2>Inventory</h2>
          <ul>
            <li>
              <Link to="/InventoryDashboard/products">Inventory</Link>
            </li>
            <li>
              <Link to="/InventoryDashboard/supplier/orders">Orders</Link>
            </li>
            <li>
              <Link to="/InventoryDashboard/supplier/profiles">
                Supplier Profiles
              </Link>
            </li>
          </ul>
        </nav>

        <div className="dashboard-content">
          
          <p>Hi {user?.name}</p>
          <Routes>
            <Route
              path="products"
              element={
                <div className="products-page">
                  <NotificationBell
                    notifications={notifications}
                    markNotificationAsSeen={markNotificationAsSeen}
                    style={{ marginLeft: "20px" }}
                  />
                  <ProductList
                    products={products}
                    fetchProducts={fetchProducts}
                  />
                </div>
              }
            />
            <Route
              path="products/add"
              element={<AddProductForm fetchProducts={fetchProducts} />}
            />
            <Route
              path="products/update/:productId"
              element={<UpdateProductForm fetchProducts={fetchProducts} />}
            />
            <Route path="supplier/profiles" element={<SupplierList />} />
            <Route path="supplier/add" element={<AddSupplier />} />
            <Route path="supplier/orders" element={<ViewAllOrders />} />
            <Route path="supplier/update/:id" element={<EditSupplier />} />

            <Route
              path="products/order/:productId"
              element={<PlaceOrderForm />}
            />
          </Routes>
        </div>
      </div>
    );
  }

  function FinanceDashboard({ user }) {
    return (
      <div className="dashboard-container">
        
        <nav className="sidebar">
          <h2>Finance</h2>
          <ul>
            <li><Link to="/FinanceDashboard/">Dashboard</Link></li>
            <li><Link to="/FinanceDashboard/assets">Assets</Link></li>
            <li><Link to="/FinanceDashboard/liabilities">Liabilities</Link></li>
            <li><Link to="/FinanceDashboard/expenses">Expenses</Link></li>
            <li><Link to="/FinanceDashboard/incomes">Incomes</Link></li>
            <li><Link to="/FinanceDashboard/pettycash">Petty Cash</Link></li>
            <li><Link to="/FinanceDashboard/finstatement">Financial statements</Link></li>
            <li><Link to="/FinanceDashboard/account">Financial Accounts</Link></li>


          </ul>
        </nav>

        <div className="dashboard-content">
          <h1>Finance Dashboard</h1>

          <Routes>
            <Route path="" element={<FinDash />} />
            <Route path="assets" element={<Asset />} />
            <Route path="liabilities" element={<Liab />} />
            <Route path="expenses" element={<Exp />} />
            <Route path="incomes" element={<Income />} />
            <Route path="pettycash" element={<PettyCash />} />
            <Route path="finstatement" element={<FinStatement />} />
            <Route path="account" element={<FinAccount />} />
          </Routes>
        </div>
      </div>
    );
  }


  function SalesDashboard({ user }) {
    return (
      <div className="dashboard-container">
        <nav className="sidebar">
          <h2>Sales</h2>
          <ul>
            <li>
              <Link to="/SalesDashboard/sales">Sales</Link>
            </li>
            <li>
              <Link to="/SalesDashboard/discount">Discount</Link>
            </li>
          </ul>
        </nav>

        <div className="dashboard-content">
          <h1>Sales Dashboard</h1>
          <p>Hi {user?.name}</p>
          <Routes>
            <Route path="sales" element={<SalesList />} />
            <Route path="sale/return/:id" element={<ReturnForm />} />
            <Route path="sale/details/:id" element={<SingleSale />} />
            <Route path="discount" element={<ProductListWithDiscounts />} />
          </Routes>
        </div>
      </div>
    );
  }

  function CustomerDashboard({ user }) {
    return (
      <div className="dashboard-container">
        <nav className="sidebar">
          <h2>Customer</h2>
          <ul>
            <li>
              <Link to="/CustomerDashboard/registercustomer">
                Register Customer
              </Link>
            </li>
            <li>
              <Link to="/CustomerDashboard/logincustomer">Login Customer</Link>
            </li>
            <li>
              <Link to="/CustomerDashboard/customers">Customers</Link>
            </li>
            <li>
              <Link to="/CustomerDashboard/Email">Emails</Link>
            </li>
            <li>
              <Link to="/CustomerDashboard/sale/add">Add Sale</Link>
            </li>
          </ul>
        </nav>

        <div className="dashboard-content">
          <p>Hi {user?.name}</p>
          <Routes>
            <Route path="registercustomer" element={<RegisterCustomer />} />
            <Route path="customers" element={<CustomerList />} />
            <Route
              path="customerprofile/:phone"
              element={<CustomerProfile />}
            />
            <Route path="sale/add/new" element={<AddSaleForm />} />
            <Route path="sale/add" element={<AddSaleFormWithoutCustomer />} />
            <Route path="Email" element={<Email />} />
            <Route path="logincustomer" element={<Customerogin />} />
          </Routes>
        </div>
      </div>
    );
  }
  ReactDOM.render(
    <LeaveRequestProvider>
      <App />
    </LeaveRequestProvider>,
    document.getElementById("root")
  );

  function HRDashboard({ user }) {
    return (
      <div className="dashboard-container">
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="/HRdashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/HRdashboard/reports">Reports</Link>
            </li>
            <li>
              <Link to="/HRdashboard/salary">Salary</Link>
            </li>
          </ul>
        </nav>
        <div className="dashboard-content">
          <h1>HR Dashboard</h1>
          <p>Hi {user?.name}</p>
          <Routes>
            <Route path="list" element={<EmployeeList />} />
            <Route path="add" element={<AddEmployee />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="edit/:id" element={<EditEmployee />} />
            <Route path="/" element={<ControlPanel />} />
            <Route path="reports" element={<Reports />} />
            <Route path="salary" element={<Salary />} />
          </Routes>
        </div>
      </div>
    );
  }
};

export default App;