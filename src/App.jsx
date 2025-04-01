import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard"; 
import About from "./Pages/About";
import Support from "./Pages/Support";
import Invest from "./Pages/Invest";
import Learn from "./Pages/Learn"; 
import SwpCalculator from "./Pages/SwpCalculator";
import Services from "./Pages/Services";
import Blog from "./Pages/Blog";
import Short60 from "./Component/learn/Short60";
import Book from "./Component/learn/Book";
import Account from "./Component/dashboard/Account";
import MarketGuides from "./Component/dashboard/MarketGuides";
import Profile from "./Component/dashboard/Profile";
import InvestmentTools from "./Component/dashboard/InvestmentTools";
import Sidebar from "./Component/dashboard/Sidebar";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <HelmetProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/swp-calculator" element={<SwpCalculator />} /> 
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/short60" element={<Short60/>}/>
            <Route path="/book" element={<Book />}/>
            <Route path="/account" element={<Account />} />
            <Route path="/marketguides" element={<MarketGuides />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/investmenttools" element={<InvestmentTools />} />
            <Route path="/sidebar"  element={<Sidebar setIsAuthenticated={setIsAuthenticated} />}  />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
