import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png";
import '../..Component/../dashboard/Account.scss';
import Sidebar from "../dashboard/Sidebar";


const Account = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSignOut = () => {
    // Implement authentication state management
  };

  return (
    <div className="dashboard-account">
      <Sidebar />

      <div className="settings-content">
        <h1 className='setting'>Settings</h1>
       
        <div className="account-header">
          <form>
          <button className="change-account-button">Change account</button>
          <span>Sumit</span>
          <img src="account-pic-url" alt="account" className="account-pic" />
          <label>Update display Name:</label>
          <input type="text" placeholder="New Name" />

          <label>Work Email Address:</label>
          <input type="email" placeholder="abhishek679713@gmail.com" />

          <label>Contact Number:</label>
          <input type="text" placeholder="0123-810383847" />
          
          <label>Birthdate:</label>
          <input type="text" placeholder="mm/dd/year" />

          <label>Country of Origin:</label>
          <input type="text" placeholder="India" />

          <label>Language Spoken:</label>
          <input type="text" placeholder="Hindi, English" />

          <label>Current Address:</label>
          <input type="text" placeholder="Jaipur" />

        </form>

        <div className='document-identification'>
        <div className="documents">
          <h2 className='Heading-account'>Documents</h2>
          <div className="document-item">Investment Portfolio<button className='account-dashboard' >View</button></div>
          <div className="document-item">Market Analysis<button className='account-dashboard'>View</button></div>
          <div className="document-item">Financial Reports<button className='account-dashboard'>View</button></div>
          <div className="document-item">Legal Agreements<button className='account-dashboard'>View</button></div>
        </div>

        <div className="identification">
          <h2 className='Heading-account'>Identification</h2>
          <div className="identification-item">Driver’s Licence <button className='account-dashboard'>Edit</button></div>
          <div className="identification-item">Residential Proof <button className='account-dashboard'>Edit</button></div>
          <div className="identification-item">Passport Copy <button className='account-dashboard'>Edit</button></div>
        </div>
        </div>
        </div>  
      </div>
    </div>
  );
};

export default Account;