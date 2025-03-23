import axios from 'axios';

const adminApiInstance = axios.create({
  baseURL: 'http://localhost:3000', // Make sure this matches your backend port
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include token in requests
adminApiInstance.interceptors.request.use(
  (config) => {
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
adminApiInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    return Promise.reject(error);
  }
);

interface AdminLoginData {
  email: string;
  password: string;
}

interface AdminRegisterData {
  email: string;
  password: string;
  username: string;
}

interface AdminUpdateData {
  adminId: string;
  email?: string;
  password?: string;
  username?: string;
  permissions?: string[];
}

export const adminApi = {
  // Admin Authentication
  login: async (loginData: AdminLoginData) => {
    console.log('Attempting login with data:', {
      email: loginData.email,
      passwordLength: loginData.password.length
    });

    try {
      const response = await adminApiInstance.post('/admin/login', loginData);
      console.log('Login response:', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('isAdmin', 'true');
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  register: async (registerData: AdminRegisterData) => {
    // Add default empty permissions array
    const dataWithPermissions = {
      ...registerData,
      permissions: []
    };
    
    console.log('Making register request with data:', dataWithPermissions);
    try {
      const response = await adminApiInstance.post('/admin/register', dataWithPermissions);
      console.log('Register response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Register request failed:', {
        config: error.config,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Admin Profile
  getProfile: async () => {
    const response = await adminApiInstance.get('/admin/profile');
    return response.data;
  },

  updateProfile: async (updateData: AdminUpdateData) => {
    const response = await adminApiInstance.put('/admin/update', updateData);
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await adminApiInstance.get('/admin/users');
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await adminApiInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await adminApiInstance.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // User Growth Data
  getUserGrowthData: (userId: string) => {
    return adminApiInstance.get(`/admin/users/${userId}/growth`).then(response => response.data);
  },

  // Post Management
  getAllPosts: async () => {
    const response = await adminApiInstance.get('/admin/posts');
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await adminApiInstance.delete(`/admin/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId: string, postData: any) => {
    try {
      const response = await adminApiInstance.put(`/admin/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },
};