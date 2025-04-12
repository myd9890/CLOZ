
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import PlaceOrderForm from "./components/SupplierManualOrder" ;
import SupplierList from "./components/SupplierList";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/MainDashboard";
import AddSupplier from "./components/AddSupplier";
import EditSupplier from "./components/EditSupplier";
import RegisterCustomer from "./components/RegisterCustomer";
import CustomerList from "./components/CustomerList";
import CustomerProfile from "./components/CustomerProfile";
import SingleSale from "./components/SingleSale";
import AddSaleFormWithoutCustomer from "./components/AddSaleFormWithoutCustomer";
import ReturnForm from "./components/ReturnForm";
//import SupplierLogin from './components/SupplierLogin';

import SalesList from "./components/SalesList";
import AddSaleForm from "./components/AddSaleForm";

const App = () => {
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    //  Load notifications from localStorage when app starts
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  //  Save notifications to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Fetch products from backend
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

  // Connect to Socket.IO server
  useEffect(() => {
    const socket = io("http://localhost:8070");

    // Listen for low stock notifications
    socket.on("lowStockNotification", (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id: Date.now(), message: data.message, seen: false },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Mark notification as seen
  const markNotificationAsSeen = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, seen: true } : notification
      )
    );
  };

  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/products/"
              element={
                <div className="container mt-4">
                  {/* Notification Bell */}
                  <NotificationBell
                    notifications={notifications}
                    markNotificationAsSeen={markNotificationAsSeen}
                  />
                  <ProductFilter/>
                  <ProductList products={products} fetchProducts={fetchProducts} />
                </div>
              }
            />
            <Route
              path="/products/add"
              element={<AddProductForm fetchProducts={fetchProducts} />}
            />
            <Route
              path="/products/update/:productId"
              element={<UpdateProductForm fetchProducts={fetchProducts} />}
            />
      
            <Route path="/supplier/:supplierId" element={<SupplierProfile />} />
            <Route path="/supplier/profiles" element={<SupplierList />} />
            <Route path="/supplier/add" element={<AddSupplier/>} />
            <Route path="/supplier/orders" element={<ViewAllOrders />} />
            <Route path="supplier/update/:supplerId" element={<EditSupplier />} />
            <Route path="/products/order/:productId" element={<PlaceOrderForm />} />
            {/* <Route path="/login" element={<SupplierLogin />} /> */}
           {/*  <Route path="/supplierprofile" element={<SupplierProfile />} /> */}
            <Route path="/sales" element={<SalesList />} />
            <Route path="/sale/add/new" element={<AddSaleForm/>} /> 
            <Route path="/sale/add" element={<AddSaleFormWithoutCustomer/>} />
            <Route path="/sale/details/:id" element={<SingleSale />} />
            <Route path="/registercustomer" element={<RegisterCustomer />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customerprofile/:phone" element={<CustomerProfile/>} />
            <Route path="/sale/return/:id" element={<ReturnForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
