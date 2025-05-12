import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pettyCash, setPettyCash] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8070/assets/")
      .then(res => setAssets(res.data))
      .catch(err => console.error("Asset fetch error:", err));

    axios.get("http://localhost:8070/liabilities/")
      .then(res => setLiabilities(res.data))
      .catch(err => console.error("Liability fetch error:", err));

    axios.get("http://localhost:8070/expenses/")
      .then(res => setExpenses(res.data))
      .catch(err => console.error("Expense fetch error:", err));

    axios.get("http://localhost:8070/petty/")
      .then(res => setPettyCash(res.data))
      .catch(err => console.error("Petty Cash fetch error:", err));
  }, []);

  const totalAssets = assets.reduce((acc, asset) => acc + parseFloat(asset.assetAmount || 0), 0);
  const totalLiabilities = liabilities.reduce((acc, liab) => acc + parseFloat(liab.liabilityAmount || 0), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + parseFloat(exp.Amount || 0), 0);
  const totalPettyCash = pettyCash.reduce((acc, pc) => acc + parseFloat(pc.amount || 0), 0);

  const netWorth = totalAssets - totalLiabilities - totalExpenses + totalPettyCash;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">📊 Finance Dashboard</h1>
      <div className="row g-4 text-center">
        <div className="col-md-3">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h4>Total Assets</h4>
              <h2>Rs. {totalAssets.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white shadow">
            <div className="card-body">
              <h4>Total Liabilities</h4>
              <h2>Rs. {totalLiabilities.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h4>Total Expenses</h4>
              <h2>Rs. {totalExpenses.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h4>Petty Cash</h4>
              <h2>Rs. {totalPettyCash.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-5 text-center shadow">
        <div className="card-body">
          <h3 className="fw-bold">Net Worth: Rs. {netWorth.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
