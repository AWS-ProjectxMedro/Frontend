import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../dashboard/Sidebar";
import './Style/Payment.scss';

const PaymentUrl = process.env.REACT_APP_API_BASE_URL;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authToken] = useState(localStorage.getItem("authToken"));
  
  // Get data from navigation state
  const { purchaseDetails, isManualPayment } = location.state || {};
  
  // State for payment form
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
    // Set initial description based on payment type
    if (purchaseDetails && !isManualPayment) {
      setPaymentData(prev => ({
        ...prev,
        description: `Purchase of ${purchaseDetails.quantity} shares of ${purchaseDetails.symbol} at $${purchaseDetails.price} per share`
      }));
    } else if (isManualPayment) {
      setPaymentData(prev => ({
        ...prev,
        description: 'Manual payment'
      }));
    }
  }, [purchaseDetails, isManualPayment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
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
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('Payment processed successfully!');
        // Redirect after successful payment
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page payment-page">
      <Sidebar />
      <div className="payment-container">
        <h2>Payment Processing</h2>
        
        {/* Payment Type Indicator */}
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

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              disabled={!isManualPayment && purchaseDetails}
            />
          </div>

          {isManualPayment && (
            <>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={paymentData.description}
                  onChange={handleInputChange}
                  placeholder="Enter payment description"
                  rows="3"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {(paymentData.paymentMethod === 'credit_card' || paymentData.paymentMethod === 'debit_card') && (
            <>
              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolderName"
                  value={paymentData.cardHolderName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
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
                  <label>Expiry Date</label>
                  <input
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
                  <label>CVV</label>
                  <input
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
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;