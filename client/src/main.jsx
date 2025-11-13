import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import axios from 'axios';

// This line makes your app production-ready. It tells Axios to use the
// Vercel environment variable, or fall back to localhost if it's not found (for local dev).
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
