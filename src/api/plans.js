import api from '../config/api';

/**
 * Plans API Service
 * Handles all investment plan-related API calls
 */

// Get all plans
export const getAllPlans = async () => {
  try {
    const response = await api.get('/api/plans');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch plans',
        status: error.response?.status,
      },
    };
  }
};

// Create a new plan (Admin only)
export const createPlan = async (planData) => {
  try {
    const response = await api.post('/api/plans', {
      name: planData.name,
      description: planData.description,
      price: planData.price,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Plan creation failed',
        status: error.response?.status,
      },
    };
  }
};

// Update a plan (Admin only)
export const updatePlan = async (planId, planData) => {
  try {
    const response = await api.put(`/api/plans/${planId}`, {
      name: planData.name,
      description: planData.description,
      price: planData.price,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Plan update failed',
        status: error.response?.status,
      },
    };
  }
};

// Delete a plan (Admin only)
export const deletePlan = async (planId) => {
  try {
    const response = await api.delete(`/api/plans/${planId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Plan deletion failed',
        status: error.response?.status,
      },
    };
  }
};

