import axios from 'axios';

// Create the API instance
const postApiInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend's base URL
  headers: {
    'Content-Type': 'multipart/form-data', // Set default Content-Type for form data
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

export default postApiInstance;
