
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const FinAccount = () => {
  const [cashBookStartDate, setCashBookStartDate] = useState("");
  const [cashBookEndDate, setCashBookEndDate] = useState("");
  const [pettyCashStartDate, setPettyCashStartDate] = useState("");
  const [pettyCashEndDate, setPettyCashEndDate] = useState("");

  const [cashBookEntries, setCashBookEntries] = useState([]);
  const [pettyCashEntries, setPettyCashEntries] = useState([]);

  const [cashBookLoading, setCashBookLoading] = useState(false);
  const [pettyCashLoading, setPettyCashLoading] = useState(false);

  // Generate Cash Book Report
  const handleGenerateCashBook = async () => {
    if (!cashBookStartDate || !cashBookEndDate) {
      alert("Please select both Start and End Dates for Cash Book");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (cashBookStartDate > today || cashBookEndDate > today) {
      alert("You cannot select future dates for Cash Book!");
      return;
    }

    setCashBookLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        axios.get("http://localhost:8070/incomes/"),
        axios.get("http://localhost:8070/expenses/"),
      ]);

      const incomes = incomeRes.data.map((item) => ({
        type: "Income",
        name: item.IncomeName,
        date: new Date(item.IncomeDate),
        amount: item.Amount,
      }));

      const expenses = expenseRes.data.map((item) => ({
        type: "Expense",
        name: item.expense,
        date: new Date(item.expDate),
        amount: item.Amount,
      }));

      const combinedEntries = [...incomes, ...expenses];

      const startDate = new Date(cashBookStartDate);
      const endDate = new Date(cashBookEndDate);
      const filteredEntries = combinedEntries.filter((entry) => {
        return entry.date >= startDate && entry.date <= endDate;
      });

      filteredEntries.sort((a, b) => a.date - b.date);

      setCashBookEntries(filteredEntries);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong while generating the cash book");
    }
    setCashBookLoading(false);
  };

  // Generate Petty Cash Report
  const handleGeneratePettyCashBook = async () => {
    if (!pettyCashStartDate || !pettyCashEndDate) {
      alert("Please select both Start and End Dates for Petty Cash");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (pettyCashStartDate > today || pettyCashEndDate > today) {
      alert("You cannot select future dates for Petty Cash!");
      return;
    }

    setPettyCashLoading(true);
    try {
      const pettyCashRes = await axios.get("http://localhost:8070/pettycash/");

      const pettyCashEntriesData = pettyCashRes.data.map((item) => ({
        type: item.Type === "Credit" ? "Income" : "Expense", // Mapping Credit -> Income, Debit -> Expense
        name: item.expense,
        date: new Date(item.expDate),
        amount: item.Amount,
      }));

      const startDate = new Date(pettyCashStartDate);
      const endDate = new Date(pettyCashEndDate);
      const filteredPettyCashEntries = pettyCashEntriesData.filter((entry) => {
        return entry.date >= startDate && entry.date <= endDate;
      });

      filteredPettyCashEntries.sort((a, b) => a.date - b.date);

      setPettyCashEntries(filteredPettyCashEntries);
    } catch (error) {
      console.error("Error fetching Petty Cash data:", error);
      alert("Something went wrong while generating the petty cash book");
    }
    setPettyCashLoading(false);
  };

  return (
    <div>
      {/* Cash Book Section */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Generate Cash Book Report</h2>

        <div className="card p-4 shadow-sm mb-4">
          <h4 className="mb-3 text-center">Cash Book Report</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={cashBookStartDate}
                onChange={(e) => setCashBookStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={cashBookEndDate}
                onChange={(e) => setCashBookEndDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleGenerateCashBook}
            disabled={cashBookLoading}
          >
            {cashBookLoading ? "Generating..." : "Generate Cash Book"}
          </button>
        </div>

        {/* Cash Book Entries Table */}
        {cashBookEntries.length > 0 ? (
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3 text-center">Cash Book Entries</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Income</th>
                    <th>Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {cashBookEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date.toLocaleDateString()}</td>
                      <td>{entry.name}</td>
                      <td className="text-success">
                        {entry.type === "Income" ? `+ Rs.${entry.amount}` : ""}
                      </td>
                      <td className="text-danger">
                        {entry.type === "Expense" ? `- Rs.${entry.amount}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !cashBookLoading && (
            <div className="text-center mt-4">
              <p>No entries available for the selected dates.</p>
            </div>
          )
        )}
      </div>

      {/* Petty Cash Section */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Generate Petty Cash Report</h2>

        <div className="card p-4 shadow-sm mb-4">
          <h4 className="mb-3 text-center">Petty Cash Book Report</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="pettyCashStartDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="pettyCashStartDate"
                className="form-control"
                value={pettyCashStartDate}
                onChange={(e) => setPettyCashStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="pettyCashEndDate" className="form-label">End Date</label>
              <input
                type="date"
                id="pettyCashEndDate"
                className="form-control"
                value={pettyCashEndDate}
                onChange={(e) => setPettyCashEndDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button
            className="btn btn-secondary w-100"
            onClick={handleGeneratePettyCashBook}
            disabled={pettyCashLoading}
          >
            {pettyCashLoading ? "Generating..." : "Generate Petty Cash Book"}
          </button>
        </div>

        {/* Petty Cash Entries Table */}
        {pettyCashEntries.length > 0 ? (
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3 text-center">Petty Cash Book Entries</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Income</th>
                    <th>Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {pettyCashEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date.toLocaleDateString()}</td>
                      <td>{entry.name}</td>
                      <td className="text-success">
                        {entry.type === "Income" ? `+ Rs.${entry.amount}` : ""}
                      </td>
                      <td className="text-danger">
                        {entry.type === "Expense" ? `- Rs.${entry.amount}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !pettyCashLoading && (
            <div className="text-center mt-4">
              <p>No petty cash entries available for the selected dates.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FinAccount;
