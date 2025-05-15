import React from 'react';
import SidebarAdmin from './AdminSidebar';
import './Withdrawal.scss'; // Optional: Create this SCSS file for styling

const Withdrawal = () => {
  const requests = [
    { id: 760, user: 'Mycred', cost: '1 USD', amount: '100 USD', pointType: 'Diamond', status: 'Pending', date: '3/3/2025' },
    { id: 720, user: 'Mycred', cost: '1 USD', amount: '100 USD', pointType: 'Diamond', status: 'Cancelled', date: '3/3/2025' },
    { id: 563, user: 'Mycred', cost: '1 USD', amount: '100 USD', pointType: 'Diamond', status: 'Approved', date: '3/3/2025' },
  ];

  return (
    <div className="dashboard-withdrawal">
      <SidebarAdmin />

      <div className="withdrawal-content">
        <header>
          <h1>Withdrawal Requests</h1>
        </header>

        <table className="withdrawal-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>ID</th>
              <th>User</th>
              <th>Cost</th>
              <th>Amount</th>
              <th>Point Type</th>
              <th>Method</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td><input type="checkbox" /></td>
                <td>{request.id}</td>
                <td>{request.user}</td>
                <td>{request.cost}</td>
                <td>{request.amount}</td>
                <td>{request.pointType}</td>
                <td>Bank Transfer</td>
                <td>{request.pointType}</td>
                <td className={`status ${request.status.toLowerCase()}`}>{request.status}</td>
                <td>{request.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="actions">
          <select>
            <option>Bulk Actions</option>
            <option>Approve</option>
            <option>Cancel</option>
            <option>Delete</option>
          </select>
          <button>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
