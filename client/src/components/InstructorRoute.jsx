import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InstructorRoute = () => {
    const { user, loading } = useAuth(); // <-- 1. GET the loading state from context

    // <-- 2. ADD this loading check
    if (loading) {
        // While we are checking for the user, show a loading indicator
        // This prevents the redirect from happening too early
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // Now that loading is false, we can safely check for the user
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'instructor') {
        return <Navigate to="/courses" />;
    }

    // If all checks pass, render the child route (the dashboard)
    return <Outlet />;
};

export default InstructorRoute;