import api from '../config/api';

/**
 * Feedback API Service
 * Handles all feedback-related API calls
 */

// Get all feedback (Admin only)
export const getAllFeedback = async () => {
  try {
    const response = await api.get('/api/feedback');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch feedback',
        status: error.response?.status,
      },
    };
  }
};

// Create a new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/api/feedback', {
      rating: feedbackData.rating,
      comment: feedbackData.comment,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Feedback submission failed',
        status: error.response?.status,
      },
    };
  }
};

// Get feedback for a specific user
export const getUserFeedback = async (userId) => {
  try {
    const response = await api.get(`/api/feedback/user/${userId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch user feedback',
        status: error.response?.status,
      },
    };
  }
};

