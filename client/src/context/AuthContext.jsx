import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient'; // <-- 1. Import our new configured client

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // --- STATE ---
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({});

    // --- HELPER FUNCTION FOR FETCHING PROGRESS ---
    const fetchProgress = async () => {
        if (!localStorage.getItem('token')) return;
        try {
            // 2. Use the new client
            const res = await axiosClient.get('/api/progress/all');
            setProgress(res.data);
        } catch (err) {
            console.error("Failed to fetch progress", err);
        }
    };

    // --- MAIN EFFECT FOR AUTHENTICATION ---
    useEffect(() => {
        const fetchUserAndProgress = async () => {
            if (token) {
                try {
                    // Fetch user profile and progress in parallel
                    const [userProfileRes, progressRes] = await Promise.all([
                        // 3. Use the new client for all requests
                        axiosClient.get('/api/auth/profile'),
                        axiosClient.get('/api/progress/all')
                    ]);
                    setUser(userProfileRes.data);
                    setProgress(progressRes.data);
                } catch (error) {
                    console.error('Failed to fetch user data, token might be invalid.', error);
                    // It's better to only log out on a 401 Unauthorized error
                    if (error.response && error.response.status === 401) {
                        logout();
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserAndProgress();
    }, [token]);

    // --- ACTION FUNCTIONS ---
    const login = async (email, password) => {
        // 4. Use the new client for the login request
        const response = await axiosClient.post('/api/auth/login', { email, password });
        const { access_token } = response.data.session;
        
        // 5. Manually set the Authorization header on our client instance for immediate use
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        localStorage.setItem('token', access_token);
        setToken(access_token);
        setLoading(true);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setProgress({});
        localStorage.removeItem('token');
        // 6. Delete the header from our client instance on logout
        delete axiosClient.defaults.headers.common['Authorization'];
    };

    const updateProgress = async (lessonId) => {
        if (!token) return;
        try {
            // 7. Use the new client for the update request
            await axiosClient.post('/api/progress/update', { lesson_id: lessonId });
            await fetchProgress(); // Re-fetch progress after update
        } catch (err) {
            console.error("Failed to update progress", err);
        }
    };

    // --- INITIAL TOKEN SETUP ---
    // This runs once when the app first loads to set the initial header if a token exists in localStorage
    useEffect(() => {
        const initialToken = localStorage.getItem('token');
        if (initialToken) {
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
        }
    }, []);


    const value = {
        user,
        token,
        loading,
        progress,
        login,
        logout,
        updateProgress
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
