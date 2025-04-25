import React, { useState } from 'react';
import axios from 'axios';

const FinStatement = () => {
  const [plStartDate, setPlStartDate] = useState('');
  const [plEndDate, setPlEndDate] = useState('');
  const [bsStartDate, setBsStartDate] = useState('');
  const [bsEndDate, setBsEndDate] = useState('');
  const [plResult, setPlResult] = useState(null);

  const handleGeneratePL = async () => {
    try {
      const [purchasesRes, expensesRes, salesRes, incomeRes, productsRes] = await Promise.all([
        axios.get('http://localhost:8070/order/allorders'),
        axios.get('http://localhost:8070/expenses/'),
        axios.get('http://localhost:8070/sale/'),
        axios.get('http://localhost:8070/incomes/'),
        axios.get('http://localhost:8070/products/')
      ]);

      const inRange = (dateStr) => {
        const date = new Date(dateStr);
        return new Date(plStartDate) <= date && date <= new Date(plEndDate);
      };

      const totalPurchases = purchasesRes.data
        .filter(order => inRange(order.createdAt))
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      const totalExpenses = expensesRes.data
        .filter(exp => inRange(exp.expDate))
        .reduce((sum, exp) => sum + (exp.Amount || 0), 0);

      const totalSales = salesRes.data
        .filter(sale => inRange(sale.createdAt))
        .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

      const totalOtherIncome = incomeRes.data
        .filter(inc => inRange(inc.Date))
        .reduce((sum, inc) => sum + (inc.Amount || 0), 0);

      // Opening and closing stock calculation
      const products = productsRes.data;

      const getStockValue = (targetDate) => {
        const date = new Date(targetDate);
        return products
          .filter(p => new Date(p.updatedAt || p.createdAt) <= date) // fallback if no updatedAt
          .reduce((sum, p) => sum + (p.quantityInStock * p.supplierUnitPrice || 0), 0);
      };

      const openingStock = getStockValue(plStartDate);
      const closingStock = getStockValue(plEndDate);

      const netProfit = (totalSales + totalOtherIncome + closingStock) - (totalPurchases + totalExpenses + openingStock);

      setPlResult({
        totalSales,
        totalOtherIncome,
        totalPurchases,
        totalExpenses,
        openingStock,
        closingStock,
        netProfit,
      });

    } catch (error) {
      console.error("Error generating P/L statement:", error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Financial Statements</h1>

      {/* Profit and Loss Section */}
      <div className="mb-4">
        <h5>Profit and Loss Statement</h5>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <input type="date" className="form-control" value={plStartDate} onChange={(e) => setPlStartDate(e.target.value)} />
          <input type="date" className="form-control" value={plEndDate} onChange={(e) => setPlEndDate(e.target.value)} />
        </div>
        <button onClick={handleGeneratePL} className="btn btn-primary">
          Generate P/L Statement
        </button>

        {plResult && (
          <div className="mt-3 text-start">
            <h6>Results:</h6>
            <p>Sales Income: ${plResult.totalSales.toFixed(2)}</p>
            <p>Other Income: ${plResult.totalOtherIncome.toFixed(2)}</p>
            <p>Purchases: ${plResult.totalPurchases.toFixed(2)}</p>
            <p>Expenses: ${plResult.totalExpenses.toFixed(2)}</p>
            <p>Opening Stock: ${plResult.openingStock.toFixed(2)}</p>
            <p>Closing Stock: ${plResult.closingStock.toFixed(2)}</p>
            <h5>Net Profit: ${plResult.netProfit.toFixed(2)}</h5>
          </div>
        )}
      </div>

      {/* Balance Sheet Section */}
      <div>
        <h5>Balance Sheet</h5>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <input type="date" className="form-control" value={bsStartDate} onChange={(e) => setBsStartDate(e.target.value)} />
          <input type="date" className="form-control" value={bsEndDate} onChange={(e) => setBsEndDate(e.target.value)} />
        </div>
        <button onClick={() => console.log(`Generating Balance Sheet from ${bsStartDate} to ${bsEndDate}`)} className="btn btn-success">
          Generate Balance Sheet
        </button>
      </div>
    </div>
  );
};

export default FinStatement;
