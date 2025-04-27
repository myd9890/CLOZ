import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FinAccount = () => {
  const [cashBookStartDate, setCashBookStartDate] = useState("");
  const [cashBookEndDate, setCashBookEndDate] = useState("");
  const [pettyCashStartDate, setPettyCashStartDate] = useState("");
  const [pettyCashEndDate, setPettyCashEndDate] = useState("");

  const handleGenerateCashBook = () => {
    alert(`Generating Cash Book from ${cashBookStartDate} to ${cashBookEndDate}`);
  };

  const handleGeneratePettyCashBook = () => {
    alert(`Generating Petty Cash Book from ${pettyCashStartDate} to ${pettyCashEndDate}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Financial Account Management</h2>
      <div className="card p-4 shadow-sm">
        <div className="row">
          {/* Cash Book Section */}
          <div className="col-md-6 border-end">
            <h4 className="text-center mb-3">Cash Book</h4>
            <div className="mb-3">
              <label htmlFor="cashBookStartDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="cashBookStartDate"
                className="form-control"
                value={cashBookStartDate}
                onChange={(e) => setCashBookStartDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cashBookEndDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                id="cashBookEndDate"
                className="form-control"
                value={cashBookEndDate}
                onChange={(e) => setCashBookEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleGenerateCashBook}
              disabled={!cashBookStartDate || !cashBookEndDate}
            >
              Generate Cash Book
            </button>
          </div>

          {/* Petty Cash Book Section */}
          <div className="col-md-6">
            <h4 className="text-center mb-3">Petty Cash Book</h4>
            <div className="mb-3">
              <label htmlFor="pettyCashStartDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="pettyCashStartDate"
                className="form-control"
                value={pettyCashStartDate}
                onChange={(e) => setPettyCashStartDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="pettyCashEndDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                id="pettyCashEndDate"
                className="form-control"
                value={pettyCashEndDate}
                onChange={(e) => setPettyCashEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary w-100"
              onClick={handleGeneratePettyCashBook}
              disabled={!pettyCashStartDate || !pettyCashEndDate}
            >
              Generate Petty Cash Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinAccount;