import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create a custom hook for easy consumption of the context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Create the AuthProvider component that will wrap our application
export const AuthProvider = ({ children }) => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // Manages initial auth check
    const [progress, setProgress] = useState({}); // NEW: Holds user progress data, e.g., { courseId: [lessonId1, lessonId2] }

    // --- HELPER FUNCTION FOR FETCHING PROGRESS ---
    const fetchProgress = async () => {
        // This function can be called to get the latest progress data
        if (!localStorage.getItem('token')) return; // Check localStorage directly as token state might be stale
        try {
            const res = await axios.get('http://localhost:5000/api/progress/all');
            setProgress(res.data);
        } catch (err) {
            console.error("Failed to fetch progress", err);
        }
    };

    // --- MAIN EFFECT FOR AUTHENTICATION & DATA FETCHING ---
    useEffect(() => {
        const fetchUserAndProgress = async () => {
            if (token) {
                // If a token exists, set it as the default auth header for all axios requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // Fetch user profile and progress data in parallel for efficiency
                    const [userProfileRes, progressRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/auth/profile'),
                        axios.get('http://localhost:5000/api/progress/all')
                    ]);
                    setUser(userProfileRes.data);
                    setProgress(progressRes.data);
                } catch (error) {
                    console.error('Failed to fetch user data, token might be invalid.', error);
                    logout(); // If the token is invalid, log the user out
                } finally {
                    setLoading(false); // Signal that the initial loading is complete
                }
            } else {
                // If there's no token, we are done loading
                setLoading(false);
            }
        };

        fetchUserAndProgress();
    }, [token]); // This effect runs whenever the token changes

    // --- ACTION FUNCTIONS ---

    const login = async (email, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { access_token } = response.data.session;
        localStorage.setItem('token', access_token);
        setToken(access_token); // This will trigger the useEffect to run and fetch user data
        setLoading(true); // Indicate that we are now verifying the new token
    };

    const logout = () => {
        // Clear all user-related state
        setUser(null);
        setToken(null);
        setProgress({});
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    // NEW: Function to mark a lesson as complete
    const updateProgress = async (lessonId) => {
        if (!token) return;
        try {
            await axios.post('http://localhost:5000/api/progress/update', { lesson_id: lessonId });
            // After successfully updating, re-fetch the progress to update the UI
            await fetchProgress();
        } catch (err) {
            console.error("Failed to update progress", err);
        }
    };

    // --- PROVIDER VALUE ---
    // The value object holds all the state and functions that will be available to child components
    const value = {
        user,
        token,
        loading,
        progress,
        login,
        logout,
        updateProgress
    };

    // Render the provider, passing the value. Children will only render after the initial load is false.
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};