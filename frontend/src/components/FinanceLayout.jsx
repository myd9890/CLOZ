import React from "react";
import Nav from "./NavComponent"; // Adjust path if needed
import { Outlet } from "react-router-dom";

const FinanceLayout = () => {
  return (
    <div>
      <Nav />
      <div className="finance-content">
        <Outlet /> {/* This renders the child route */}
      </div>
    </div>
  );
};

export default FinanceLayout;