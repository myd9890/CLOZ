import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css'; // Import App.css instead of index.css

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
