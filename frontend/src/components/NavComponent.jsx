import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Nav.css"; // Import external CSS
import axios from "axios"; // Using axios for HTTP requests

function Nav() {
  // State variables to hold dynamic values
  const [totalAssets, setTotalAssets] = useState(0);
  const [assetBreakdown, setAssetBreakdown] = useState({});
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Get the current location
  const location = useLocation();

  // Fetch assets and summarize data
  useEffect(() => {
    // Fetch assets from backend API
    const fetchAssets = async () => {
      try {
        const response = await axios.get("/assets"); // Fetching asset data from backend
        const assets = response.data; // Assuming the response is an array of asset objects

        // Calculate total assets
        const totalAssetValue = assets.reduce((sum, asset) => sum + asset.assetValue, 0);

        // Create a breakdown of asset types (e.g., Buildings, Equipment, etc.)
        const breakdown = assets.reduce((acc, asset) => {
          const type = asset.assetType || "Other"; // Default to 'Other' if no type is provided
          acc[type] = acc[type] ? acc[type] + asset.assetValue : asset.assetValue;
          return acc;
        }, {});

        // Set the total asset value and breakdown
        setTotalAssets(totalAssetValue);
        setAssetBreakdown(breakdown);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []); // Empty dependency array to run the effect only once

  // Conditional rendering for content
  const isDashboard = location.pathname === "/finance";

  return (
    <>

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
                <Link className="nav-link" to="/finance/dashboard">Dashboard</Link>
              </li>
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
                <Link className="nav-link" to="/finance/finstatement">Financial Statements</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/finance/accounts">Financial Accounts</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
