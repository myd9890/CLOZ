import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="index-page">
            <h1>Welcome to CLOZ</h1>
            <button onClick={handleLoginClick}>Login</button>
        </div>
    );
}

export default Index;