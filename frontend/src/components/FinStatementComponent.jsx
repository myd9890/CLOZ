import React, { useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const FinStatement = () => {
  const [plStartDate, setPlStartDate] = useState('');
  const [plEndDate, setPlEndDate] = useState('');
  const [bsStartDate, setBsStartDate] = useState('');
  const [bsEndDate, setBsEndDate] = useState('');
  const [plResult, setPlResult] = useState(null);
  const [bsResult, setBsResult] = useState(null);

  const toastRef = useRef(null);
  const showToast = (message) => {
    if (toastRef.current) {
      toastRef.current.querySelector('.toast-body').textContent = message;
      const toast = new window.bootstrap.Toast(toastRef.current);
      toast.show();
    }
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    return selectedDate > today;
  };

  const handleGeneratePL = async () => {
    try {
      if (!plStartDate || !plEndDate) {
        showToast('Please select both start and end dates.');
        return;
      }

      if (isFutureDate(plStartDate) || isFutureDate(plEndDate)) {
        showToast('Future dates are not allowed for Profit and Loss Statement.');
        return;
      }

      const res = await axios.get(`http://localhost:8070/plstatement?start=${plStartDate}&end=${plEndDate}`);
      setPlResult(res.data);

      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Income Statement', 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`For the Period: ${plStartDate} to ${plEndDate}`, 105, 28, null, null, 'center');

      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      let y = 42;

      doc.setFont('helvetica', 'bold');
      doc.text('Revenue', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Sales`, 30, y);
      doc.text(`Rs.${res.data.totalSales.toFixed(2)}`, 160, y, null, null, 'right');
      y += 7;
      doc.text(`Other Income`, 30, y);
      doc.text(`Rs.${res.data.otherIncome.toFixed(2)}`, 160, y, null, null, 'right');
      y += 7;

      doc.setFont('helvetica', 'bold');
      doc.text(`Total Revenue`, 30, y);
      const totalRevenue = res.data.totalSales + res.data.otherIncome;
      doc.text(`Rs.${totalRevenue.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text('Cost of Goods Sold', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Purchases`, 30, y);
      doc.text(`Rs.${res.data.totalPurchases.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text(`Gross Profit`, 30, y);
      doc.text(`Rs.${res.data.grossProfit.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text('Operating Expenses', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Expenses`, 30, y);
      doc.text(`Rs.${res.data.totalExpenses.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setLineWidth(0.3);
      doc.line(30, y, 190, y);
      y += 7;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Net Profit`, 30, y);
      doc.text(`Rs.${res.data.netProfit.toFixed(2)}`, 160, y, null, null, 'right');

      doc.save(`Income_Statement_${plStartDate}_to_${plEndDate}.pdf`);
    } catch (error) {
      console.error('Error generating P/L statement:', error);
      showToast('Failed to generate P/L statement. Check console for more info.');
    }
  };

  const handleGenerateBS = async () => {
    try {
      if (!bsStartDate || !bsEndDate) {
        showToast('Please select both start and end dates for the balance sheet.');
        return;
      }

      if (isFutureDate(bsStartDate) || isFutureDate(bsEndDate)) {
        showToast('Future dates are not allowed for Balance Sheet.');
        return;
      }

      const res = await axios.get(`http://localhost:8070/api/balance-sheet/generate-balance-sheet?start=${bsStartDate}&end=${bsEndDate}`);
      setBsResult(res.data);

      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Balance Sheet', 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`As of: ${bsStartDate} to ${bsEndDate}`, 105, 28, null, null, 'center');

      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      let y = 42;

      doc.setFont('helvetica', 'bold');
      doc.text('Assets', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Current Assets`, 30, y);
      doc.text(`Rs.${res.data.currentAssets.toFixed(2)}`, 160, y, null, null, 'right');
      y += 7;
      doc.text(`Non-current Assets`, 30, y);
      doc.text(`Rs.${res.data.nonCurrentAssets.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text(`Total Assets`, 30, y);
      doc.text(`Rs.${res.data.totalAssets.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text('Liabilities', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Current Liabilities`, 30, y);
      doc.text(`Rs.${res.data.currentLiabilities.toFixed(2)}`, 160, y, null, null, 'right');
      y += 7;
      doc.text(`Non-current Liabilities`, 30, y);
      doc.text(`Rs.${res.data.nonCurrentLiabilities.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text(`Total Liabilities`, 30, y);
      doc.text(`Rs.${res.data.totalLiabilities.toFixed(2)}`, 160, y, null, null, 'right');
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text('Equity', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Equity`, 30, y);
      doc.text(`Rs.${res.data.equity.toFixed(2)}`, 160, y, null, null, 'right');

      doc.save(`Balance_Sheet_${bsStartDate}_to_${bsEndDate}.pdf`);
    } catch (error) {
      console.error('Error generating Balance Sheet:', error);
      showToast('Failed to generate Balance Sheet. Check console for more info.');
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Financial Statements</h1>


      <div
        ref={toastRef}
        className="toast align-items-center text-white bg-danger border-0 position-fixed top-0 end-0 m-3"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 9999 }}
      >
        <div className="d-flex">
          <div className="toast-body"></div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>

      <div className="mb-4">
        <h5>Profit and Loss Statement</h5>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <input
            type="date"
            className="form-control"
            value={plStartDate}
            onChange={(e) => setPlStartDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={plEndDate}
            onChange={(e) => setPlEndDate(e.target.value)}
          />
        </div>
        <button onClick={handleGeneratePL} className="btn btn-primary">
          Generate P/L Statement
        </button>

        {plResult && (
          <div className="mt-3 text-start">
            <h6>Results:</h6>
            <p>Total Sales: Rs.{plResult.totalSales.toFixed(2)}</p>
            <p>Other Income: Rs.{plResult.otherIncome.toFixed(2)}</p>
            <p>Total Purchases: Rs.{plResult.totalPurchases.toFixed(2)}</p>
            <p>Total Expenses: Rs.{plResult.totalExpenses.toFixed(2)}</p>
            <p>Gross Profit: Rs.{plResult.grossProfit.toFixed(2)}</p>
            <h5>Net Profit: Rs.{plResult.netProfit.toFixed(2)}</h5>
          </div>
        )}
      </div>

      <div>
        <h5>Balance Sheet</h5>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <input
            type="date"
            className="form-control"
            value={bsStartDate}
            onChange={(e) => setBsStartDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={bsEndDate}
            onChange={(e) => setBsEndDate(e.target.value)}
          />
        </div>
        <button onClick={handleGenerateBS} className="btn btn-success">
          Generate Balance Sheet
        </button>

        {bsResult && (
          <div className="mt-3 text-start">
            <h6>Balance Sheet:</h6>
            <p>Current Assets: Rs.{bsResult.currentAssets.toFixed(2)}</p>
            <p>Non-current Assets: Rs.{bsResult.nonCurrentAssets.toFixed(2)}</p>
            <p>Total Assets: Rs.{bsResult.totalAssets.toFixed(2)}</p>
            <p>Current Liabilities: Rs.{bsResult.currentLiabilities.toFixed(2)}</p>
            <p>Non-current Liabilities: Rs.{bsResult.nonCurrentLiabilities.toFixed(2)}</p>
            <p>Total Liabilities: Rs.{bsResult.totalLiabilities.toFixed(2)}</p>
            <h5>Equity: Rs.{bsResult.equity.toFixed(2)}</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinStatement;
