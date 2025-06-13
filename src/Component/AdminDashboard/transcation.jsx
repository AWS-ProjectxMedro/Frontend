import React, { useState, useEffect, useCallback } from 'react';
import SidebarAdmin from './AdminSidebar'; // Assuming this component exists
import './Style/Transaction.scss'; // Make sure this SCSS file exists and is styled

// --- CONFIGURATION ---
// Note: You are now using a public IP. Ensure REACT_APP_API_BASE_URL is set to this in your .env

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// For user-specific transactions (Daily, Weekly, etc.)
const USER_ID_FOR_ADMIN_VIEW = 1; // This remains for the period-based user transactions
const AUTH_TOKEN_KEY = 'authToken';

const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Invalid Date";
  }
};

// Reusable Transaction Table Component - Now more flexible
const TransactionTable = ({ transactions, periodTitle, isLoading, showUserName = false }) => {
  if (isLoading) {
    return <p className="loading-message">Loading {periodTitle} transactions...</p>;
  }

  if (typeof transactions === 'string') {
    return <p className="info-message">{transactions}</p>;
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <p className="info-message">No {periodTitle.toLowerCase()} transactions found.</p>;
  }

  return (
    <div className="transaction-table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            {showUserName && <th>User Name</th>} {/* Conditionally show User Name */}
            <th>Plan Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            {!showUserName && <th>User ID</th>} {/* Show User ID if not showing User Name column */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td data-label="ID">{transaction.id}</td>
              {showUserName && <td data-label="User Name">{transaction.User?.name || 'N/A'}</td>}
              <td data-label="Plan Name">{transaction.Plan?.name || 'N/A'}</td>
              <td data-label="Amount">${transaction.amount?.toFixed(2) || '0.00'}</td>
              <td data-label="Status">
                <span className={`status-badge status-${transaction.status?.toLowerCase() || 'unknown'}`}>
                  {transaction.status || 'N/A'}
                </span>
              </td>
              <td data-label="Date">{formatDate(transaction.createdAt)}</td>
              {!showUserName && <td data-label="User ID">{transaction.userId}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminTransactionPage = () => {
  const [transactionData, setTransactionData] = useState({
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
    all: null, // New state for all transactions
  });
  const [loadingStates, setLoadingStates] = useState({
    daily: true,
    weekly: true,
    monthly: true,
    yearly: true,
    all: true, // New loading state
  });
  const [activeTab, setActiveTab] = useState('daily'); // Default tab
  const [globalError, setGlobalError] = useState(null);

  if (!baseUrl) {
    console.error("FATAL ERROR: REACT_APP_API_BASE_URL is not defined. API calls will fail. Make sure it's set in your .env file and the development server is restarted.");
  }

  // Fetch user-specific transactions by period
  const fetchUserTransactionsByPeriod = useCallback(async (period, token) => {
    if (!token) {
      // This case should ideally be caught by the useEffect token check
      setTransactionData(prev => ({ ...prev, [period]: "Authentication required." }));
      setLoadingStates(prev => ({ ...prev, [period]: false }));
      return;
    }
    if (!baseUrl) {
      setTransactionData(prev => ({ ...prev, [period]: "API configuration error." }));
      setLoadingStates(prev => ({ ...prev, [period]: false }));
      return;
    }

    setLoadingStates(prev => ({ ...prev, [period]: true }));
    setTransactionData(prev => ({ ...prev, [period]: null }));

    const apiUrl = `${baseUrl}/api/transactions/user/${USER_ID_FOR_ADMIN_VIEW}?period=${period}`;
    try {
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 401 || response.status === 403) {
        setGlobalError("Authentication failed or session expired. Please log in again.");
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setTransactionData(prev => ({ ...prev, [period]: "Access Denied. Please re-login." }));
        return;
      }
      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); } catch (e) {
        console.error(`Error parsing JSON for ${period} from ${apiUrl}. Status: ${response.status}. Response:`, responseText);
        throw new Error(`Server returned non-JSON data. Status: ${response.status}.`);
      }
      if (response.status === 404 && data.message) {
        setTransactionData(prev => ({ ...prev, [period]: data.message }));
      } else if (!response.ok) {
        throw new Error(data.message || `Failed to fetch ${period} transactions (Status: ${response.status})`);
      } else {
        setTransactionData(prev => ({ ...prev, [period]: data }));
      }
    } catch (err) {
      setTransactionData(prev => ({ ...prev, [period]: `Error loading ${period} data: ${err.message}` }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [period]: false }));
    }
  }, [baseUrl]);


  // Fetch ALL system transactions
  const fetchAllSystemTransactions = useCallback(async (token) => {
    const periodKey = 'all'; // Using 'all' as the key for this data
    if (!token) {
        setTransactionData(prev => ({ ...prev, [periodKey]: "Authentication required." }));
        setLoadingStates(prev => ({ ...prev, [periodKey]: false }));
        return;
    }
    if (!baseUrl) {
        setTransactionData(prev => ({ ...prev, [periodKey]: "API configuration error." }));
        setLoadingStates(prev => ({ ...prev, [periodKey]: false }));
        return;
    }

    setLoadingStates(prev => ({ ...prev, [periodKey]: true }));
    setTransactionData(prev => ({ ...prev, [periodKey]: null }));

    const apiUrl = `${baseUrl}/api/transactions`; // The new API endpoint
    // console.log(`Fetching ALL transactions from: ${apiUrl} with token: ${token ? 'present' : 'absent'}`);

    try {
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 401 || response.status === 403) {
        setGlobalError("Authentication failed or session expired. Please log in again.");
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setTransactionData(prev => ({ ...prev, [periodKey]: "Access Denied. Please re-login." }));
        return;
      }
      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); } catch (e) {
        console.error(`Error parsing JSON for ALL transactions from ${apiUrl}. Status: ${response.status}. Response:`, responseText);
        throw new Error(`Server returned non-JSON data. Status: ${response.status}.`);
      }

      if (!response.ok) { // For any error, including 404 if your API returns that for no transactions at all
        throw new Error(data.message || `Failed to fetch all transactions (Status: ${response.status})`);
      } else {
        // Check if data is an array and not empty, otherwise show "No transactions found"
        if (Array.isArray(data) && data.length === 0) {
            setTransactionData(prev => ({ ...prev, [periodKey]: "No transactions found in the system."}));
        } else {
            setTransactionData(prev => ({ ...prev, [periodKey]: data }));
        }
      }
    } catch (err) {
      console.error(`Error during fetch or processing for ALL transactions:`, err);
      setTransactionData(prev => ({ ...prev, [periodKey]: `Error loading all transactions: ${err.message}` }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [periodKey]: false }));
    }
  }, [baseUrl]);


  useEffect(() => {
    if (!baseUrl) {
        setGlobalError("API URL is not configured. Please contact support or check .env file.");
        // Initialize all loading states to false and set error messages
        const initialLoadingStates = { daily: false, weekly: false, monthly: false, yearly: false, all: false };
        const initialTransactionData = {};
        Object.keys(initialLoadingStates).forEach(p => {
            initialTransactionData[p] = "Configuration Error";
        });
        setLoadingStates(initialLoadingStates);
        setTransactionData(initialTransactionData);
        return;
    }

    const token = getAuthToken();
    if (!token) {
      setGlobalError("Authentication token not found. Please log in to view transactions.");
      const initialLoadingStates = { daily: false, weekly: false, monthly: false, yearly: false, all: false };
      const initialTransactionData = {};
      Object.keys(initialLoadingStates).forEach(p => {
          initialTransactionData[p] = "Authentication required.";
      });
      setLoadingStates(initialLoadingStates);
      setTransactionData(initialTransactionData);
      return;
    }

    setGlobalError(null);

    // Fetch period-based transactions
    const periods = ['daily', 'weekly', 'monthly', 'yearly'];
    periods.forEach(period => {
      fetchUserTransactionsByPeriod(period, token);
    });

    // Fetch all system transactions
    fetchAllSystemTransactions(token);

  }, [fetchUserTransactionsByPeriod, fetchAllSystemTransactions, baseUrl]); // Add fetchAllSystemTransactions and baseUrl

  const renderContent = () => {
    if (globalError) {
      return <p className="error-message global-error-message">{globalError}</p>;
    }
    
    const currentPeriodTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    const showUserNameColumn = activeTab === 'all'; // Only show User Name for "All Transactions" tab

    return (
      <TransactionTable
        transactions={transactionData[activeTab]}
        periodTitle={activeTab === 'all' ? "All System Transactions" : `${currentPeriodTitle} (User ID: ${USER_ID_FOR_ADMIN_VIEW})`}
        isLoading={loadingStates[activeTab]}
        showUserName={showUserNameColumn}
      />
    );
  };

  const TABS_CONFIG = [
    { key: 'all', label: 'All Transactions' }, // New tab
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];
  // If you want "All Transactions" to be the default, change useState for activeTab:
  // const [activeTab, setActiveTab] = useState('all'); 


  return (
    <div className="dashboard-transaction-page">
      <SidebarAdmin />
      <div className="main-content-area">
        <header className="page-header">
          <h1>Transaction History</h1>
        </header>

        <section className="transactions-section">
          <div className="tabs-navigation">
            {TABS_CONFIG.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                disabled={loadingStates[tab.key] && activeTab !== tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content-area">
            {renderContent()}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminTransactionPage;