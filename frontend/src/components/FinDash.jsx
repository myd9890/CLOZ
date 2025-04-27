import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalLiabilities, setTotalLiabilities] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total assets, liabilities, and expenses from your backend API
                const assetResponse = await axios.get('/api/assets');
                const liabilityResponse = await axios.get('/api/liabilities');
                const expenseResponse = await axios.get('/api/expenses');
                
                setTotalAssets(assetResponse.data.total);
                setTotalLiabilities(liabilityResponse.data.total);
                setTotalExpenses(expenseResponse.data.total);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <h2 className="my-4">Finance Dashboard</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-header">Total Assets</div>
                        <div className="card-body">
                            <h5 className="card-title">{totalAssets}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3">
                        <div className="card-header">Total Liabilities</div>
                        <div className="card-body">
                            <h5 className="card-title">{totalLiabilities}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-header">Total Expenses</div>
                        <div className="card-body">
                            <h5 className="card-title">{totalExpenses}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
