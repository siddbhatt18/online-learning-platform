import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const InstructorDashboardPage = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();

    const fetchMyCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/courses/instructor/my-courses');
            setMyCourses(response.data);
        } catch (err) {
            console.error('Failed to fetch courses', err);
        }
    };

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:5000/api/courses',
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } } // Pass token for protected route
            );
            setSuccess(`Course "${response.data.title}" created successfully!`);
            setTitle('');
            setDescription('');
            fetchMyCourses(); // Refresh the course list
        } catch (err) {
            setError('Failed to create course. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="flex gap-8">
            {/* Left side: Create Course Form */}
            <div className="w-1/3">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-dark-text mb-4">Create New Course</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <form onSubmit={handleCreateCourse}>
                        <div className="mb-4">
                            <label className="block text-secondary mb-2" htmlFor="title">Course Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-secondary mb-2" htmlFor="description">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-hover">Create Course</button>
                    </form>
                </div>
            </div>

            {/* Right side: My Courses List */}
            <div className="w-2/3">
                <h2 className="text-2xl font-bold text-dark-text mb-4">My Courses</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {myCourses.length > 0 ? (
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
                        <p>You have not created any courses yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboardPage;