import React from "react";
import "../css/Nav.css"; // Import external CSS

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">CLOZ - Finance Dashboard</a>
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
              <a className="nav-link" href="finance/assets">Assets</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="liabilities">Liabilities</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="expenses">Expenses</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="incomes">Incomes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="pettycash">Petty Cash</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
