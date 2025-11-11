import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    if (!user || user.role !== 'admin') return <Navigate to="/" />;
    return <Outlet />;
};

export default AdminRoute;