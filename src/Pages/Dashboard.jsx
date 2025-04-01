import React from "react";
import "../assets/styles/Dashboard.scss";
import logo3 from "../assets/image/logo3.png";
import { NavLink } from "react-router-dom";
import Sidebar from "../Component/dashboard/Sidebar";

function Dashboard() {
  return (
    <div className="dashboard-user">
      <Sidebar />

      <div className="dashboard__main">
        <main>
          <h2 className="investment-heading">Investments</h2>
          <section className="dashboard__section investments">
            <div className="dashboard__investment-data">
              <div>Total Invested: <br /> ₹1,000,00.00</div>
            </div>
            <div className="dashboard__investment-data">
              <div>No. of Investments: <br /> ₹1,600</div>
            </div>
            <div className="dashboard__investment-data">
              <div>Rate of Return: <br /> +4.75%</div>
            </div>
          </section>

          <section className="dashboard__section charts">
            <div className="dashboard__chart">
              <h3 className="investment-heading">Yearly Total Investment</h3>
              <div className="dashboard__chart-placeholder" />
            </div>
            <div className="dashboard__chart">
              <h3 className="investment-heading">Yearly Total Revenue</h3>
              <div className="dashboard__chart-placeholder" />
            </div>
          </section>

          <h2 className="investment-heading">My Investment</h2>
          <section className="dashboard__section my-investments">
            <div className="dashboard__investment-item">
              <div>Apple Market</div>
              <div>Investment Value</div>
              <div>Discount: 0% Rol</div>
            </div>
            <div className="dashboard__investment-item">
              <div>Green Investment</div>
              <div>Investment Value</div>
              <div>Discount: +16% Rol</div>
            </div>
            <div className="dashboard__investment-item">
              <div>T Motors Stock</div>
              <div>Investment Value</div>
              <div>Discount: +16% Rol</div>
            </div>
          </section>

          <h2 className="investment-heading">Trending Stock</h2>
          <section className="dashboard__section-trending-stock">
            {/* Add Trending Stock Data Here */}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
