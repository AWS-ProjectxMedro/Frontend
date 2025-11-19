import api from '../config/api';

/**
 * FAQs API Service
 * Handles all FAQ-related API calls
 */

// Get all FAQs
export const getAllFAQs = async () => {
  try {
    const response = await api.get('/api/faqs');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch FAQs',
        status: error.response?.status,
      },
    };
  }
};

// Create a new FAQ (Admin only)
export const createFAQ = async (faqData) => {
  try {
    const response = await api.post('/api/faqs', {
      question: faqData.question,
      answer: faqData.answer,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'FAQ creation failed',
        status: error.response?.status,
      },
    };
  }
};

// Update a FAQ (Admin only)
export const updateFAQ = async (faqId, faqData) => {
  try {
    const response = await api.put(`/api/faqs/${faqId}`, {
      question: faqData.question,
      answer: faqData.answer,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'FAQ update failed',
        status: error.response?.status,
      },
    };
  }
};

// Delete a FAQ (Admin only)
export const deleteFAQ = async (faqId) => {
  try {
    const response = await api.delete(`/api/faqs/${faqId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'FAQ deletion failed',
        status: error.response?.status,
      },
    };
  }
};

