/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const FinDash = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalLiabilities, setTotalLiabilities] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetResponse, liabilityResponse, expenseResponse, incomeResponse] = await Promise.all([
                    axios.get('http://localhost:8070/assets'),
                    axios.get('http://localhost:8070/liabilities'),
                    axios.get('http://localhost:8070/expenses'),
                    axios.get('http://localhost:8070/incomes')
                ]);

                const assets = assetResponse.data;
                const liabilities = liabilityResponse.data;
                const expenses = expenseResponse.data;
                const incomes = incomeResponse.data;

                setTotalAssets(Array.isArray(assets) ? assets.reduce((acc, item) => acc + (item.assetValue || 0), 0) : 0);
                setTotalLiabilities(Array.isArray(liabilities) ? liabilities.reduce((acc, item) => acc + (item.liabilityAmount || 0), 0) : 0);
                setTotalExpenses(Array.isArray(expenses) ? expenses.reduce((acc, item) => acc + (item.Amount || 0), 0) : 0);
                setTotalIncome(Array.isArray(incomes) ? incomes.reduce((acc, item) => acc + (item.Amount || 0), 0) : 0);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to load data from server.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const netWorth = totalAssets - totalLiabilities;
    const profit = totalIncome - totalExpenses;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    const total = totalAssets + totalLiabilities + totalIncome + totalExpenses;

    const barData = {
        labels: ['Assets', 'Liabilities', 'Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount (USD)',
                data: [totalAssets, totalLiabilities, totalIncome, totalExpenses],
                backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Assets', 'Liabilities', 'Income', 'Expenses'],
        datasets: [
            {
                label: 'Financial Distribution',
                data: [totalAssets, totalLiabilities, totalIncome, totalExpenses],
                backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container my-5" style={{ maxWidth: '1600px' }}>


            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                {[
                    { label: "Total Assets", value: totalAssets, color: "primary" },
                    { label: "Total Liabilities", value: totalLiabilities, color: "warning" },
                    { label: "Total Income", value: totalIncome, color: "success" },
                    { label: "Total Expenses", value: totalExpenses, color: "danger" }
                ].map((item, idx) => (
                    <div className="col" key={idx}>
                        <div className={`card shadow-lg border-0 text-white bg-${item.color} h-100`}>
                            <div className="card-body d-flex flex-column justify-content-center text-center">
                                <h5 className="card-title fw-semibold mb-3">{item.label}</h5>
                                <p className="card-text display-6">Rs. {item.value.toLocaleString()} </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title fw-semibold text-primary mb-3">Net Worth</h5>
                            <p className="display-5 fw-bold">Rs.{netWorth.toLocaleString()} </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title fw-semibold text-success mb-3">Profit / Loss</h5>
                            <p className={`display-5 fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                               Rs. {profit.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="card shadow-lg border-0 p-4 mb-5">
                <h5 className="mb-4 text-center fw-bold">📈 Finance Distribution</h5>
                {[
                    { label: "Assets", value: totalAssets, color: "primary" },
                    { label: "Liabilities", value: totalLiabilities, color: "warning" },
                    { label: "Income", value: totalIncome, color: "success" },
                    { label: "Expenses", value: totalExpenses, color: "danger" }
                ].map((item, idx) => (
                    <div key={idx} className="mb-4">
                        <label className="form-label fw-semibold">{item.label}</label>
                        <div className="progress" style={{ height: '20px' }}>
                            <div
                                className={`progress-bar bg-${item.color}`}
                                role="progressbar"
                                style={{ width: `${(item.value / total) * 100}%` }}
                                aria-valuenow={item.value}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {((item.value / total) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 p-4 h-100">
                        <h5 className="text-center mb-4 fw-bold">📊 Finance Overview (Bar Chart)</h5>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 p-4 h-100">
                        <h5 className="text-center mb-4 fw-bold">🧩 Finance Distribution (Pie Chart)</h5>
                        <Pie data={pieData} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinDash;

*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const FinDash = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalLiabilities, setTotalLiabilities] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetResponse, liabilityResponse, expenseResponse, incomeResponse] = await Promise.all([
                    axios.get('http://localhost:8070/assets'),
                    axios.get('http://localhost:8070/liabilities'),
                    axios.get('http://localhost:8070/expenses'),
                    axios.get('http://localhost:8070/incomes')
                ]);

                const assets = assetResponse.data;
                const liabilities = liabilityResponse.data;
                const expenses = expenseResponse.data;
                const incomes = incomeResponse.data;

                setTotalAssets(Array.isArray(assets) ? assets.reduce((acc, item) => acc + (item.assetValue || 0), 0) : 0);
                setTotalLiabilities(Array.isArray(liabilities) ? liabilities.reduce((acc, item) => acc + (item.liabilityAmount || 0), 0) : 0);
                setTotalExpenses(Array.isArray(expenses) ? expenses.reduce((acc, item) => acc + (item.Amount || 0), 0) : 0);
                setTotalIncome(Array.isArray(incomes) ? incomes.reduce((acc, item) => acc + (item.Amount || 0), 0) : 0);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to load data from server.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const netWorth = totalAssets - totalLiabilities;
    const profit = totalIncome - totalExpenses;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    const total = totalAssets + totalLiabilities + totalIncome + totalExpenses;

    const barData = {
        labels: ['Assets', 'Liabilities', 'Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount (USD)',
                data: [totalAssets, totalLiabilities, totalIncome, totalExpenses],
                backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Assets', 'Liabilities', 'Income', 'Expenses'],
        datasets: [
            {
                label: 'Financial Distribution',
                data: [totalAssets, totalLiabilities, totalIncome, totalExpenses],
                backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container my-5" style={{ maxWidth: '1600px' }}>

            {/* Summary Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                {[
                    { label: "Total Assets", value: totalAssets, color: "primary" },
                    { label: "Total Liabilities", value: totalLiabilities, color: "warning" },
                    { label: "Total Income", value: totalIncome, color: "success" },
                    { label: "Total Expenses", value: totalExpenses, color: "danger" }
                ].map((item, idx) => (
                    <div className="col" key={idx}>
                        <div className={`card shadow-lg border-0 text-white bg-${item.color} h-100`}>
                            <div className="card-body d-flex flex-column justify-content-center text-center">
                                <h6 className="card-title fw-semibold mb-2" style={{ fontSize: '1rem' }}>{item.label}</h6>
                                <p className="card-text" style={{ fontSize: '1.5rem' }}>Rs. {item.value.toLocaleString()} </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Net Worth and Profit/Loss */}
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                            <h6 className="card-title fw-semibold text-primary mb-2" style={{ fontSize: '1rem' }}>Total Equity</h6>
                            <p className="fw-bold" style={{ fontSize: '2rem' }}>Rs. {netWorth.toLocaleString()} </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                            <h6 className="card-title fw-semibold text-success mb-2" style={{ fontSize: '1rem' }}>Profit / Loss</h6>
                            <p className={`fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '2rem' }}>
                                Rs. {profit.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Finance Distribution Progress Bars */}
            <div className="card shadow-lg border-0 p-4 mb-5">
                <h6 className="mb-4 text-center fw-bold" style={{ fontSize: '1.1rem' }}>📈 Finance Distribution</h6>
                {[
                    { label: "Assets", value: totalAssets, color: "primary" },
                    { label: "Liabilities", value: totalLiabilities, color: "warning" },
                    { label: "Income", value: totalIncome, color: "success" },
                    { label: "Expenses", value: totalExpenses, color: "danger" }
                ].map((item, idx) => (
                    <div key={idx} className="mb-4">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>{item.label}</label>
                        <div className="progress" style={{ height: '18px' }}>
                            <div
                                className={`progress-bar bg-${item.color}`}
                                role="progressbar"
                                style={{ width: `${(item.value / total) * 100}%` }}
                                aria-valuenow={item.value}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {((item.value / total) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 p-4 h-100">
                        <h6 className="text-center mb-4 fw-bold" style={{ fontSize: '1.1rem' }}>📊 Finance Overview (Bar Chart)</h6>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 p-4 h-100">
                        <h6 className="text-center mb-4 fw-bold" style={{ fontSize: '1.1rem' }}>🧩 Finance Distribution (Pie Chart)</h6>
                        <Pie data={pieData} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinDash;