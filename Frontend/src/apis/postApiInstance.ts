import axios from 'axios';

// Create the API instance
const postApiInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend's base URL
  headers: {
    'Content-Type': 'application/json', // Default to JSON
  },
});

// Optional: Add interceptors for response handling (if needed)
postApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle errors globally if needed
    console.error('API error occurred:', error);
    return Promise.reject(error);
  }
);

// For multipart/form-data requests (like file uploads), override the Content-Type header
export const setMultipartHeader = () => {
  postApiInstance.defaults.headers['Content-Type'] = 'multipart/form-data';
};

// For JSON requests, override the Content-Type header
export const setJsonHeader = () => {
  postApiInstance.defaults.headers['Content-Type'] = 'application/json';
};

export default postApiInstance;
