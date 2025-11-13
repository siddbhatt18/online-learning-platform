import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient'; // <-- 1. Import the new configured axios client
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // Using toast for better feedback

const InstructorDashboardPage = () => {
    // --- STATE ---
    const [myCourses, setMyCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // --- DATA FETCHING ---
    const fetchMyCourses = async () => {
        setLoading(true);
        try {
            // 2. Use the new client with a relative URL
            const response = await axiosClient.get('/api/courses/instructor/my-courses', {
                headers: { Authorization: `Bearer ${token}` } // This header is still needed for protected routes
            });
            setMyCourses(response.data);
        } catch (err) {
            console.error('Failed to fetch courses', err);
            toast.error('Could not load your courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMyCourses();
        }
    }, [token]); // Re-fetch if the token changes (e.g., on login)

    // --- FORM HANDLER ---
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating course...');
        try {
            // 3. Use the new client for the POST request
            const response = await axiosClient.post('/api/courses',
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(`Course "${response.data.title}" created successfully!`, { id: toastId });
            
            // Reset form and refresh list
            setTitle('');
            setDescription('');
            fetchMyCourses(); // Re-fetch courses to include the new one
        } catch (err) {
            console.error('Failed to create course', err);
            toast.error(err.response?.data?.error || 'Failed to create course.', { id: toastId });
        }
    };

    // --- RENDER LOGIC ---
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Create Course Form */}
            <div className="w-full lg:w-1/3">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-dark-text mb-4">Create New Course</h2>
                    <form onSubmit={handleCreateCourse}>
                        <div className="mb-4">
                            <label className="block text-secondary mb-2" htmlFor="title">Course Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-secondary mb-2" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-md hover:bg-primary-hover font-semibold">
                            Create Course
                        </button>
                    </form>
                </div>
            </div>

            {/* Right side: My Courses List */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-2xl font-bold text-dark-text mb-4">My Courses</h2>
                <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px]">
                    {loading ? (
                        <p className="text-center text-secondary">Loading your courses...</p>
                    ) : myCourses.length > 0 ? (
                        <ul className="space-y-4">
                            {myCourses.map(course => (
                                <li key={course.id} className="flex justify-between items-center p-3 bg-light-bg rounded-md">
                                    <span className="font-semibold text-dark-text">{course.title}</span>
                                    <div>
                                        <button className="text-sm text-blue-500 hover:underline mr-4">Edit</button>
                                        <button className="text-sm text-red-500 hover:underline">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-secondary">You have not created any courses yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboardPage;
