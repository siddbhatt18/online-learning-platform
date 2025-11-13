import axios from 'axios';

// 1. Create a new Axios instance with a custom configuration
const axiosClient = axios.create({
  // 2. Set the base URL for this instance. It will read the .env variable in production
  //    or fall back to localhost for local development.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
});

// 3. You can also add interceptors here later for handling tokens automatically, etc.
// For example:
// axiosClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosClient;
