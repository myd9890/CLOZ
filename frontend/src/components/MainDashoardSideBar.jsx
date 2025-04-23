import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar bg-light border-right">

      <h3 className="mb-4">ERP Dashboard</h3>
      <ul className="list-unstyled">
        <li className="mb-2">
          <NavLink to="/dashboard"className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        </li>
        <li className="mb-2">
          <NavLink to="/products/"className={({ isActive }) => isActive ? "active" : ""}>Inventory</NavLink>
        </li>
        <li className="mb-2">
          <NavLink to="/registercustomer"className={({ isActive }) => isActive ? "active" : ""}>CRM</NavLink>
        </li>
        <li className="mb-2">
          <NavLink to="/sales"className={({ isActive }) => isActive ? "active" : ""}>Sales</NavLink>
        </li>

        {/* Supplier Section with Nested NavLinks */}
        <li className="mb-2">
          <span className="text-dark fw-bold">Supplier</span>
          <ul className="list-unstyled ps-3">
            <li className="mb-1">
              <NavLink to="/supplier/orders"className={({ isActive }) => isActive ? "active" : ""}>Orders</NavLink>
            </li>
            <li className="mb-1">
              <NavLink to="/supplier/profiles"className={({ isActive }) => isActive ? "active" : ""}>Supplier Profiles</NavLink>
            </li>
          </ul>
        </li>

        <li className="mb-2">
          <NavLink to="/finance"className={({ isActive }) => isActive ? "active" : ""}>Finance</NavLink>
        </li>
        <li className="mb-2">
          <NavLink to="/hr"className={({ isActive }) => isActive ? "active" : ""}>HR</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
