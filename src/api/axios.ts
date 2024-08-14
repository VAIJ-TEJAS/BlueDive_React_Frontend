import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Use BASE_URL from .env file in Vite
});

// Add a request interceptor to include the token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('bluedive-token');

    // If a token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
