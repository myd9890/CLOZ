const axios = require("axios");

const generatePLStatement = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end dates are required." });
    }

    const baseURL = "http://127.0.0.1:8070";

    let orders = [], expenses = [], sales = [], incomes = [];

    try {
      console.log("Fetching orders...");
      const ordersRes = await axios.get(`${baseURL}/order/allorders?start=${start}&end=${end}`);
      orders = ordersRes.data || [];
    } catch (err) {
      console.error("Orders API failed:", err.message);
    }

    try {
      console.log("Fetching expenses...");
      const expensesRes = await axios.get(`${baseURL}/expenses/?start=${start}&end=${end}`);
      expenses = expensesRes.data || [];
    } catch (err) {
      console.error("Expenses API failed:", err.message);
    }

    try {
      console.log("Fetching sales...");
      const salesRes = await axios.get(`${baseURL}/sale/?start=${start}&end=${end}`);
      sales = salesRes.data || [];
    } catch (err) {
      console.error("Sales API failed:", err.message);
    }

    try {
      console.log("Fetching incomes...");
      const incomesRes = await axios.get(`${baseURL}/income/?start=${start}&end=${end}`);
      incomes = incomesRes.data || [];
    } catch (err) {
      console.error("Income API failed:", err.message);
    }

    const totalPurchases = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.Amount || 0), 0);
    const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const otherIncome = incomes.reduce((sum, inc) => sum + (inc.Amount || 0), 0);

    const grossProfit = totalSales - totalPurchases;
    const netProfit = grossProfit + otherIncome - totalExpenses;

    res.json({
      totalPurchases,
      totalExpenses,
      totalSales,
      otherIncome,
      grossProfit,
      netProfit
    });
  } catch (error) {
    console.error("Error generating P/L statement:", error.message);
    res.status(500).json({ error: "Server error generating P/L statement." });
  }
};

module.exports = { generatePLStatement };


