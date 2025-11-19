import api from '../config/api';

/**
 * Blogs API Service
 * Handles all blog-related API calls
 */

// Get all blogs
export const getAllBlogs = async () => {
  try {
    const response = await api.get('/api/blogs');
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch blogs',
        status: error.response?.status,
      },
    };
  }
};

// Get a single blog by ID
export const getBlogById = async (blogId) => {
  try {
    const response = await api.get(`/api/blogs/${blogId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch blog',
        status: error.response?.status,
      },
    };
  }
};

// Create a new blog (Admin only)
export const createBlog = async (blogData) => {
  try {
    const response = await api.post('/api/blogs', {
      title: blogData.title,
      content: blogData.content,
      author: blogData.author,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Blog creation failed',
        status: error.response?.status,
      },
    };
  }
};

// Update a blog (Admin only)
export const updateBlog = async (blogId, blogData) => {
  try {
    const response = await api.put(`/api/blogs/${blogId}`, {
      title: blogData.title,
      content: blogData.content,
      author: blogData.author,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Blog update failed',
        status: error.response?.status,
      },
    };
  }
};

// Delete a blog (Admin only)
export const deleteBlog = async (blogId) => {
  try {
    const response = await api.delete(`/api/blogs/${blogId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'Blog deletion failed',
        status: error.response?.status,
      },
    };
  }
};

