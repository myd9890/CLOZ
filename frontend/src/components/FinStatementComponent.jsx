import React, { useState } from 'react';

const FinStatement = () => {
  const [plStartDate, setPlStartDate] = useState('');
  const [plEndDate, setPlEndDate] = useState('');
  const [bsStartDate, setBsStartDate] = useState('');
  const [bsEndDate, setBsEndDate] = useState('');

  const handleGeneratePL = () => {
    console.log(`Generating Profit and Loss Statement from ${plStartDate} to ${plEndDate}...`);
    // Add logic to generate P/L statement
  };

  const handleGenerateBalanceSheet = async () => {
    console.log(`Generating Balance Sheet from ${bsStartDate} to ${bsEndDate}...`);
    try {
      const response = await fetch('http://localhost:8070/generateBalanceSheet', {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'balance_sheet.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to generate Balance Sheet');
      }
    } catch (error) {
      console.error('Error generating Balance Sheet:', error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Financial Statements</h1>
      
      {/* Profit and Loss Section */}
      <div className="mb-4">
        <h5>Profit and Loss Statement</h5>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <input
            type="date"
            className="form-control"
            value={plStartDate}
            onChange={(e) => setPlStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="form-control"
            value={plEndDate}
            onChange={(e) => setPlEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <button
          onClick={handleGeneratePL}
          className="btn btn-primary"
        >
          Generate P/L Statement
        </button>
      </div>

      {/* Balance Sheet Section */}
      <div>
        <h5>Balance Sheet</h5>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <input
            type="date"
            className="form-control"
            value={bsStartDate}
            onChange={(e) => setBsStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="form-control"
            value={bsEndDate}
            onChange={(e) => setBsEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <button
          onClick={handleGenerateBalanceSheet}
          className="btn btn-success"
        >
          Generate Balance Sheet
        </button>
      </div>
    </div>
  );
};

export default FinStatement;