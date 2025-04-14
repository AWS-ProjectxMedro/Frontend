import React from "react";
import "../assets/styles/Dashboard.scss";
import Sidebar from "../Component/dashboard/Sidebar";

function Dashboard() {
  // Mock data - replace with real data sources
  const investmentStats = [
    { label: "Total Invested", value: "₹1,000,00.00", currency: true },
    { label: "No. of Investments", value: "1,600", note: "(₹1,600 per investment)" },
    { label: "Rate of Return", value: "+4.75%", trend: "positive" }
  ];

  const myInvestments = [
    { name: "Apple Market", value: "₹500,000", roi: "0%" },
    { name: "Green Investment", value: "₹300,000", roi: "+16%" },
    { name: "T Motors Stock", value: "₹200,000", roi: "+16%" }
  ];

  return (
    <div className="dashboard-user">
      <Sidebar />

      <div className="dashboard__main">
        <main>
          <h2 className="investment-heading">Investments</h2>
          <section className="dashboard__section investments">
            {investmentStats.map((stat, index) => (
              <div key={index} className="dashboard__investment-data">
                <div>{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                {stat.note && <div className="stat-note">{stat.note}</div>}
              </div>
            ))}
          </section>

          <section className="dashboard__section charts">
            <div className="dashboard__chart">
              <h3>Yearly Total Investment</h3>
              <div className="dashboard__chart-placeholder" />
            </div>
            <div className="dashboard__chart">
              <h3>Yearly Total Revenue</h3>
              <div className="dashboard__chart-placeholder" />
            </div>
          </section>

          <h2 className="investment-heading">My Investments</h2>
          <section className="dashboard__section my-investments">
            {myInvestments.map((investment, index) => (
              <div key={index} className="dashboard__investment-item">
                <div className="investment-name">{investment.name}</div>
                <div className="investment-value">{investment.value}</div>
                <div className={`investment-roi ${investment.roi.includes('+') ? 'positive' : ''}`}>
                  ROI: {investment.roi}
                </div>
              </div>
            ))}
          </section>

          <h2 className="investment-heading">Trending Stocks</h2>
          <section className="dashboard__section-trending-stock">
            {/* Add Trending Stock Data Here */}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
