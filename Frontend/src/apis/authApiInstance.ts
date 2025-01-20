import axios from 'axios';
import { refreshApi } from './refreshApi';

const authApiInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

authApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Check if error is due to expired access token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Attempt to refresh the access token
          const { accessToken, refreshToken: newRefreshToken } = await refreshApi(refreshToken);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with the new access token
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return authApiInstance.request(error.config);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          localStorage.clear(); // Clear tokens if refresh fails
          window.location.href = '/login'; // Redirect to login page
        }
      } else {
        localStorage.clear(); // Clear tokens if no refresh token
        window.location.href = '/login'; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default authApiInstance;
