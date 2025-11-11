import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg text-secondary">{title}</h3>
        <p className="text-4xl font-bold text-dark-text mt-2">{value}</p>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    const chartData = {
        labels: ['Users', 'Courses'],
        datasets: [{
            label: 'Platform Totals',
            data: [stats?.userCount || 0, stats?.courseCount || 0],
            backgroundColor: ['#007BFF', '#28A745'],
        }],
    };

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-text mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats?.userCount ?? '...'} />
                <StatCard title="Total Courses" value={stats?.courseCount ?? '...'} />
                <StatCard title="Revenue (WIP)" value="$0" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-dark-text mb-4">Platform Overview</h2>
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default AdminDashboardPage;