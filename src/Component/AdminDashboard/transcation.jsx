import React from 'react';
import SidebarAdmin from './AdminSidebar';
import './Transaction.scss';

const Transaction = () => {
  const transactions = [
    { statement: "Mxnde73b", details: "Profit Earned", account: "UD00023", type: "Profit", amount: "+10 USD" },
    { statement: "Mxnde73b", details: "Profit Earned", account: "UD00023", type: "Profit", amount: "+10 USD" },
    { statement: "Mxnde73b", details: "Profit Earned", account: "UD00023", type: "Profit", amount: "+10 USD" },
    { statement: "Mxnde73b", details: "Profit Earned", account: "UD00023", type: "Profit", amount: "+10 USD" },
    { statement: "Mxnde73b", details: "Profit Earned", account: "UD00023", type: "Profit", amount: "+10 USD" },
  ];

  return (
    <div className="dashboard-transaction">
      <SidebarAdmin />

      <div className="main-content">
        <header>
          <h1>Invested Transactions</h1>
          <div className="fan-fact">Fun Fact! You have 20 active investments.</div>
          <p>Total 160 Transactions</p>
          <button className="withdraw-button">Withdrawal Request</button>
        </header>

        <section className="transactions">
          <h2>History</h2>
          <table>
            <thead>
              <tr>
                <th>Statement</th>
                <th>Details</th>
                <th>Account</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.statement}</td>
                  <td>{transaction.details}</td>
                  <td>{transaction.account}</td>
                  <td className="profit">{transaction.type}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Transaction;
