import api from '../config/api';

/**
 * User API Service
 * Handles all user-related API calls
 */

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/users/register', {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Registration failed',
        status: error.response?.status,
      },
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/users/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Login failed',
        status: error.response?.status,
      },
    };
  }
};

// Verify phone number with OTP
export const verifyPhone = async (phoneData) => {
  try {
    const response = await api.post('/api/users/verify-phone', {
      phone: phoneData.phone,
      otp: phoneData.otp,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Phone verification failed',
        status: error.response?.status,
      },
    };
  }
};

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/api/users/verify-email/${token}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Email verification failed',
        status: error.response?.status,
      },
    };
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/users/forgot-password', {
      email: email,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Forgot password request failed',
        status: error.response?.status,
      },
    };
  }
};

// Reset password
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/api/users/reset-password', {
      token: resetData.token,
      newPassword: resetData.newPassword,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Password reset failed',
        status: error.response?.status,
      },
    };
  }
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch users',
        status: error.response?.status,
      },
    };
  }
};

