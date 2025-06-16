// src/Component/dashboard/Withdrawal.jsx
// *** UPDATED FILE WITH API INTEGRATION ***

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Style/Withdrawal.scss';

const baseURL = process.env.REACT_APP_PAYMENT_API_BASE_URL;

const Withdrawal = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        amount: '',
        bankAccount: '',
        accountHolder: '',
        ifscCode: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);

    useEffect(() => {
        fetchUserBalance();
        fetchWithdrawalHistory();
    }, []);

    const fetchUserBalance = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${baseURL}/api/users/balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserBalance(response.data.balance || 0);
        } catch (error) {
            console.error('Error fetching balance:', error);
            toast.error('Failed to fetch account balance');
        }
    };

    const fetchWithdrawalHistory = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${baseURL}/api/withdrawals/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Handle different possible response structures
            const withdrawals = response.data.withdrawals || response.data.data || response.data || [];
            setWithdrawalHistory(Array.isArray(withdrawals) ? withdrawals : []);
        } catch (error) {
            console.error('Error fetching withdrawal history:', error);
            toast.error('Failed to fetch withdrawal history');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (parseFloat(form.amount) > userBalance) {
            toast.error('Insufficient balance for withdrawal');
            return;
        }

        if (parseFloat(form.amount) < 10) {
            toast.error('Minimum withdrawal amount is $10');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const payload = {
                amount: parseFloat(form.amount),
                bankAccount: form.bankAccount,
                accountHolder: form.accountHolder,
                ifscCode: form.ifscCode,
                reason: form.reason || 'Withdrawal request'
            };

            const response = await axios.post(`${baseURL}/api/withdrawals`, payload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success(response.data.message || 'Withdrawal request submitted successfully!');
            
            // Reset form
            setForm({
                amount: '',
                bankAccount: '',
                accountHolder: '',
                ifscCode: '',
                reason: ''
            });
            
            // Refresh data
            fetchUserBalance();
            fetchWithdrawalHistory();
            
        } catch (error) {
            console.error('Withdrawal error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Failed to submit withdrawal request';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'completed':
            case 'success':
                return '#4CAF50';
            case 'pending':
            case 'processing':
                return '#FF9800';
            case 'rejected':
            case 'failed':
            case 'cancelled':
                return '#F44336';
            default:
                return '#757575';
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="withdrawal-page-container">
            <div className="withdrawal-content-area">
                <div className="withdrawal-central-hub">
                    <h2 className="withdrawal-title">Withdrawal Request</h2>
                    
                    <div className="withdrawal-balance-display">
                        <span className="withdrawal-balance-text">Available Balance:</span>
                        <span className="withdrawal-balance-value">${userBalance.toFixed(2)}</span>
                    </div>

                    <div className="withdrawal-form-wrapper">
                        <form onSubmit={handleSubmit} className="withdrawal-form">
                            <div className="form-group">
                                <label htmlFor="amount">Withdrawal Amount (USD):</label>
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount to withdraw"
                                    min="1"
                                    max={userBalance}
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="accountHolder">Account Holder Name:</label>
                                <input
                                    type="text"
                                    name="accountHolder"
                                    id="accountHolder"
                                    value={form.accountHolder}
                                    onChange={handleChange}
                                    placeholder="Enter account holder name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bankAccount">Bank Account Number:</label>
                                <input
                                    type="text"
                                    name="bankAccount"
                                    id="bankAccount"
                                    value={form.bankAccount}
                                    onChange={handleChange}
                                    placeholder="Enter bank account number"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ifscCode">IFSC/Routing Code:</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    id="ifscCode"
                                    value={form.ifscCode}
                                    onChange={handleChange}
                                    placeholder="Enter IFSC or routing code"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Reason for Withdrawal:</label>
                                <textarea
                                    name="reason"
                                    id="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                    placeholder="Enter reason for withdrawal (optional)"
                                    rows="3"
                                />
                            </div>

                            <div className="withdrawal-action-button-container">
                                <button 
                                    type="submit" 
                                    className="withdrawal-submit-button" 
                                    disabled={loading || !form.amount || !form.bankAccount || !form.accountHolder || !form.ifscCode}
                                >
                                    {loading ? (
                                        <>
                                            <span className="withdrawal-activity-indicator"></span>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        `Request Withdrawal ${form.amount ? `$${form.amount}` : ''}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {withdrawalHistory.length > 0 && (
                        <div className="withdrawal-history-section">
                            <h3>Withdrawal History</h3>
                            <div className="withdrawal-history-list">
                                {withdrawalHistory.map((withdrawal, index) => (
                                    <div key={withdrawal.id || index} className="withdrawal-history-item">
                                        <div className="withdrawal-history-info">
                                            <span className="withdrawal-amount">
                                                ${withdrawal.amount || '0.00'}
                                            </span>
                                            <span className="withdrawal-date">
                                                {formatDate(withdrawal.createdAt || withdrawal.created_at)}
                                            </span>
                                            {withdrawal.reason && (
                                                <span className="withdrawal-reason">
                                                    {withdrawal.reason}
                                                </span>
                                            )}
                                        </div>
                                        <div 
                                            className="withdrawal-status"
                                            style={{ color: getStatusColor(withdrawal.status) }}
                                        >
                                            {withdrawal.status || 'Pending'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {withdrawalHistory.length === 0 && (
                        <div className="withdrawal-no-history">
                            <p>No withdrawal history found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Withdrawal;