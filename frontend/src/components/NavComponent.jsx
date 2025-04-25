import React from "react";
import { Link } from "react-router-dom";
import "../css/Nav.css"; // Import external CSS

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/finance">CLOZ - Finance Dashboard</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/finance/assets">Assets</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finance/liabilities">Liabilities</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finance/expenses">Expenses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finance/pettycash">Petty Cash</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finance/incomes">Incomes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finance/statements">Financial Statements</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finance/accounts">Financial Accounts</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
