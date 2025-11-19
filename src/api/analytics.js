import { analyticsApi } from '../config/api';

/**
 * Analytics API Service
 * Handles all analytics-related API calls
 * Note: Uses port 3308 instead of 3307
 */

// Track an analytics event
export const trackEvent = async (eventData) => {
  try {
    const response = await analyticsApi.post('/api/analytics/track', {
      userId: eventData.userId,
      action: eventData.action,
      page: eventData.page,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to track event',
        status: error.response?.status,
      },
    };
  }
};

// Get analytics dashboard data (Admin only)
export const getAnalyticsDashboard = async () => {
  try {
    const response = await analyticsApi.get('/api/analytics/dashboard');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch analytics dashboard',
        status: error.response?.status,
      },
    };
  }
};

