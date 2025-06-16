// src/Component/dashboard/Payment.jsx

import React, { useState, useEffect } from 'react'; // <--- THIS LINE IS FIXED
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../dashboard/Sidebar";
import './Style/Payment.scss';

const PaymentUrl = process.env.REACT_APP_API_BASE_URL;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authToken] = useState(localStorage.getItem("authToken"));
  
  const { purchaseDetails, isManualPayment } = location.state || {};
  
  const [paymentData, setPaymentData] = useState({
    amount: purchaseDetails?.totalCost || '',
    symbol: purchaseDetails?.symbol || '',
    quantity: purchaseDetails?.quantity || '',
    price: purchaseDetails?.price || '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (purchaseDetails && !isManualPayment) {
      setPaymentData(prev => ({
        ...prev,
        description: `Purchase of ${purchaseDetails.quantity} shares of ${purchaseDetails.symbol} at $${purchaseDetails.price} per share`
      }));
    } else if (isManualPayment) {
      setPaymentData(prev => ({ ...prev, description: 'Manual payment' }));
    }
  }, [purchaseDetails, isManualPayment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${PaymentUrl}/api/payment/process`, {
        ...paymentData,
        purchaseType: isManualPayment ? 'manual' : 'stock_purchase',
        purchaseDetails: purchaseDetails || null
      }, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.data.success) {
        setSuccess('Payment processed successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Payment processing failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page payment-page">
      <Sidebar />
      <div className="payment-container">
        <h2>Payment Processing</h2>
        
        <div className="payment-type-indicator">
          {isManualPayment ? (
            <div className="manual-payment-info">
              <h3>Manual Payment</h3>
              <p>Enter your payment details below</p>
            </div>
          ) : purchaseDetails ? (
            <div className="stock-purchase-info">
              <h3>Stock Purchase Payment</h3>
              <div className="purchase-summary">
                <p><strong>Symbol:</strong> {purchaseDetails.symbol}</p>
                <p><strong>Quantity:</strong> {purchaseDetails.quantity} shares</p>
                <p><strong>Price per share:</strong> ${purchaseDetails.price}</p>
                <p><strong>Total Cost:</strong> ${purchaseDetails.totalCost}</p>
              </div>
            </div>
          ) : (
            <div className="no-details-info">
              <h3>Payment</h3>
              <p>Please enter your payment details</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleInputChange}
              required
              disabled={!isManualPayment && purchaseDetails}
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
            </select>
          </div>

          {(paymentData.paymentMethod === 'credit_card' || paymentData.paymentMethod === 'debit_card') && (
            <>
              <div className="form-group">
                <label htmlFor="cardHolderName">Card Holder Name</label>
                <input
                  id="cardHolderName"
                  type="text"
                  name="cardHolderName"
                  value={paymentData.cardHolderName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    id="expiryDate"
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    maxLength="4"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;