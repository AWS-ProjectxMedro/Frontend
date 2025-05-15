import React from "react";
import "../assets/styles/Dashboard.scss";
import SidebarAdmin from "../Component/AdminDashboard/AdminSidebar";
import "../assets/styles/AdminDashboard.scss";

const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <SidebarAdmin />

      <div className="main-content">
        <header className="header">
          <h1>Investment Insight</h1>
          <p className="sub-header">Here is an insight of what’s going on</p>
        </header>

        <div className="cards-container">
          <Card title="Activated Investment" description="The Amount of Investment Currently Activated">
            <h2>$20,500.00 USD</h2>
            <p>$800.00 since last week</p>
            <p>Profit today: $380.00 USD</p>
            <h4>Active Plan</h4>
            <p>4 +0.47% ↑</p>
          </Card>

          <Card title="Active Investment Plan" description="This investment plan is currently active">
            <div className="progress-circle">
              <span>Mercury</span>
              <div className="circle">
                <div className="fill" style={{ width: "100%" }}></div>
              </div>
              <p>4 – 100%</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, description, children }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{description}</p>
    {children}
  </div>
);

export default AdminDashboard;
