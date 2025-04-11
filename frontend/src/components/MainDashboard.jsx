import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1 className="mb-4">ERP Dashboard</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Inventory Management</h5>
              <p className="card-text">Manage your inventory efficiently.</p>
              <Link to="/products/" className="btn btn-primary">Go to Inventory</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">CRM</h5>
              <p className="card-text">Manage customer relationships.</p>
              <Link to="/crm" className="btn btn-primary">Go to CRM</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Sales</h5>
              <p className="card-text">Manage sales and orders.</p>
              <Link to="/sales" className="btn btn-primary">Go to Sales</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Supplier</h5>
              <p className="card-text">Manage supplier details.</p>
              <Link to="/supplier" className="btn btn-primary">Go to Supplier</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Finance</h5>
              <p className="card-text">Manage financial data.</p>
              <Link to="/finance" className="btn btn-primary">Go to Finance</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">HR</h5>
              <p className="card-text">Manage human resources.</p>
              <Link to="/hr" className="btn btn-primary">Go to HR</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;