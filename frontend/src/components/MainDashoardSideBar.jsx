import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-light border-right" style={{ width: '250px', minHeight: '100vh', padding: '20px' }}>
      <h3 className="mb-4">ERP Dashboard</h3>
      <ul className="list-unstyled">
        <li className="mb-2">
          <Link to="/dashboard" className="text-decoration-none text-dark">Dashboard</Link>
        </li>
        <li className="mb-2">
          <Link to="/products/" className="text-decoration-none text-dark">Inventory</Link>
        </li>
        <li className="mb-2">
          <Link to="/registercustomer" className="text-decoration-none text-dark">CRM</Link>
        </li>
        <li className="mb-2">
          <Link to="/sales" className="text-decoration-none text-dark">Sales</Link>
        </li>

        {/* Supplier Section with Nested Links */}
        <li className="mb-2">
          <span className="text-dark fw-bold">Supplier</span>
          <ul className="list-unstyled ps-3">
            <li className="mb-1">
              <Link to="/supplier/orders" className="text-decoration-none text-dark">Orders</Link>
            </li>
            <li className="mb-1">
              <Link to="/supplier/profiles" className="text-decoration-none text-dark">Supplier Profiles</Link>
            </li>
          </ul>
        </li>

        <li className="mb-2">
          <Link to="/finance" className="text-decoration-none text-dark">Finance</Link>
        </li>
        <li className="mb-2">
          <Link to="/hr" className="text-decoration-none text-dark">HR</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
