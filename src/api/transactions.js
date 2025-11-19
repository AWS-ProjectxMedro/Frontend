import api from '../config/api';

/**
 * Transactions API Service
 * Handles all transaction-related API calls
 */

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/api/transactions', {
      userId: transactionData.userId,
      amount: transactionData.amount,
      type: transactionData.type,
      planId: transactionData.planId,
      status: transactionData.status,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Transaction creation failed',
        status: error.response?.status,
      },
    };
  }
};

// Get transactions for a specific user
export const getUserTransactions = async (userId) => {
  try {
    const response = await api.get(`/api/transactions/user/${userId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch user transactions',
        status: error.response?.status,
      },
    };
  }
};

// Get all transactions (Admin only)
export const getAllTransactions = async () => {
  try {
    const response = await api.get('/api/transactions');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch transactions',
        status: error.response?.status,
      },
    };
  }
};

