// src/Component/AdminDashboard/AdminOverview.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Style/AdminOverview.scss';

const formatCurrency = (value, currency = 'USD') => {
  if (typeof value !== 'number') return 'N/A';
  return value.toLocaleString('en-US', { style: 'currency', currency: currency });
};

const Card = ({ title, description, children, isLoading }) => (
  <div className={`card admin-overview-card ${isLoading ? 'loading' : ''}`}>
    <h3>{title}</h3>
    {description && <p className="card-description">{description}</p>}
    <div className="card-content">{isLoading ? <p>Loading data...</p> : children}</div>
  </div>
);

const AdminOverview = () => {
  const { userData, onLogout, activatedInvestment } = useOutletContext() || {
    userData: {},
    onLogout: () => {},
    activatedInvestment: null
  };

  const isLoading = !activatedInvestment;
  const hasError = activatedInvestment?.error;
  const totalInvestment = activatedInvestment?.totalInvestment;
  const weeklyChange = activatedInvestment?.weeklyChange;
  const dailyProfit = activatedInvestment?.dailyProfit;
  const activePlanCount = activatedInvestment?.activePlanCount;
  const planGrowth = activatedInvestment?.planGrowth;

  return (
    <div className="admin-overview-content">
      <div className="admin-overview-header">
        <h2>Dashboard Overview</h2>
        <button
          onClick={onLogout}
          className="logout-button"
        >
          Log Out
        </button>
      </div>

      <div className="cards-container">
        <Card
          title="Activated Investment"
          description="The Amount of Investment Currently Activated"
          isLoading={isLoading}
        >
          {hasError ? (
            <p className="error-text">Could not load investment data.</p>
          ) : (
            <>
              <h2>{formatCurrency(totalInvestment)}</h2>
              {weeklyChange && <p>{formatCurrency(weeklyChange)} since last week</p>}
              {dailyProfit && <p>Profit today: {formatCurrency(dailyProfit)}</p>}
              {activePlanCount && (
                <>
                  <h4>Active Plans</h4>
                  <p>{activePlanCount} {planGrowth && `+${planGrowth}% ↑`}</p>
                </>
              )}
            </>
          )}
        </Card>

        <Card
          title="System Status"
          description="Current system health and performance"
          isLoading={false}
        >
          <div className="system-status">
            <p>🟢 System Online</p>
            <p>Last Updated: {new Date().toLocaleTimeString()}</p>
            {activatedInvestment?.serverUptime && <p>Uptime: {activatedInvestment.serverUptime}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;