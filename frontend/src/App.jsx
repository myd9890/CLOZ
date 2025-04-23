
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from './components/NavComponent';
//import Dashboard from "./components/Dashboard";
import Asset from './components/AssetComponent';
//import AddAsset from './components/AddAsset';
//import FetchAssets from './components/FetchAssets';
//import DeleteAsset from './components/DeleteAsset';
import Exp from './components/ExpenseComponent';
import Liab from './components/LiabilityComponent'; 
import PettyCash from './components/PettyComponent';
import Income from './components/IncomeComponent'

function App() {

  return (
    <Router>
      <div>
      <Nav />
      
      <div>
      <Routes>
        
    <Route path="/assets" element={<Asset />} />
    <Route path="/liabilities" element={<Liab />} />
    <Route path="/expenses" element={<Exp />} />
    <Route path="/pettycash" element={<PettyCash />} />
    <Route path="/incomes" element={<Income />} />
    
    

  

    
    </Routes>
    </div>
    </div>
    </Router>

    
  );
}

export default App;
