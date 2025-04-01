import React from 'react';
import { NavLink } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png";
import Sidebar from "../dashboard/Sidebar";
import "./Profile.scss"; // Updated CSS file for improved UI
import {  FaRegBell ,FaSearch } from 'react-icons/fa';
import profile from "../../assets/image/logo4.png" ;

const Profile = () => {
  return (
    <div className="dashboard-profile">
      <Sidebar />
      <main className="main-content-profile">
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <span className='bell'><FaRegBell/></span>
          <span className='bell'><FaSearch /></span>
          <button className="btn-primary">Start Now</button>
        </div>

        <section className="user-profile card">
          <h3>User Profile Setting</h3>
          <div className="profile-picture">
            <img src={profile} alt="Profile" />
            <div className="profile-btns">
              <button className="btn-secondary">Change Profile Picture</button>
              <button className="btn-danger">Delete Account</button>
            </div>
          </div>

          <form className="profile-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email Address" />
            <input type="text" placeholder="Country" />
            <input type="text" placeholder="State" />
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </section>

        <section className="preferences card">
          <h3>Preferences</h3>
          <label>
            Updated News
            <input type="checkbox" />
          </label>
          <label>
            Trending News
            <input type="checkbox" />
          </label>
          <label>
            Trading Updated Chart
            <input type="checkbox" />
          </label>
          <label>
            Trading Analysis
            <input type="checkbox" />
          </label>
        </section>

        <section className="billing-info card">
          <h3>Billing Information</h3>
          <button className="btn-primary">Manage Payment Methods</button>
        </section>
      </main>
    </div>
  );
};

export default Profile;
