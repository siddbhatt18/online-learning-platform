import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // <-- 1. Import the new configured axios client
import { useAuth } from '../context/AuthContext';
import { useStripe } from '@stripe/react-stripe-js';

const CourseDetailsPage = () => {
    // --- HOOKS ---
    const { courseId } = useParams();
    const { token, progress, updateProgress } = useAuth();
    const stripe = useStripe();

    // --- STATE ---
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true);
            try {
                // 2. Use the new client with a relative URL
                const courseRes = await axiosClient.get(`/api/courses/${courseId}`);
                setCourse(courseRes.data);

                if (token) {
                    // Use the new client for the lessons request as well
                    const lessonsRes = await axiosClient.get(`/api/courses/${courseId}/lessons`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setLessons(lessonsRes.data);
                }
            } catch (err) {
                console.error("Failed to load course data", err);
                setError("Could not load course data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, token]);

    // --- PAYMENT HANDLER ---
    const handlePayment = async () => {
        if (!token) {
            alert("Please log in to enroll in the course.");
            return;
        }
        if (!stripe) return;

        try {
            // 3. Use the new client for the payment request
            const response = await axiosClient.post('/api/payment/create-checkout-session', {
                courseId: course.id,
                courseName: course.title,
                coursePrice: 19.99,
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            const { url } = response.data;
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Payment failed. Please try again.");
        }
    };

    // --- DERIVED STATE & RENDER LOGIC (No changes below this line) ---
    const completedLessons = progress[courseId] || [];

    if (loading) return <p className="text-center text-secondary">Loading course content...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!course) return <p className="text-center text-secondary">Course not found.</p>;

    return (
        <div>
            {/* Header Section */}
            <div className="bg-primary text-white p-8 rounded-lg mb-8">
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="mt-2 text-lg opacity-90">{course.description}</p>
                <button
                    onClick={handlePayment}
                    className="mt-4 bg-white text-primary font-bold py-2 px-6 rounded-md hover:bg-light-bg transition-colors disabled:opacity-50"
                    disabled={!stripe}
                >
                    Enroll for $19.99
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Video Player & Description */}
                <div className="flex-grow lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe className="w-full h-full" src="https://www.youtube.com/embed/SqcY0GlETPk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-dark-text mb-3">About this course</h2>
                            <p className="text-secondary">{course.description}</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Lesson List & Quiz */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-dark-text mb-4">Course Content</h2>
                        {token ? (
                            <>
                                <ul className="space-y-2">
                                    {lessons.length > 0 ? lessons.map(lesson => {
                                        const isCompleted = completedLessons.includes(lesson.id);
                                        return (
                                            <li key={lesson.id} className="flex items-center justify-between p-3 bg-light-bg rounded-md">
                                                <span className={`mr-3 font-bold ${isCompleted ? 'text-green-500' : 'text-primary'}`}>{isCompleted ? '✔' : '▶'}</span>
                                                <span className="flex-grow">{lesson.title}</span>
                                                {!isCompleted && (
                                                    <button onClick={() => updateProgress(lesson.id)} className="text-sm bg-primary text-white py-1 px-3 rounded-full hover:bg-primary-hover">Done</button>
                                                )}
                                            </li>
                                        );
                                    }) : <p className="text-secondary text-sm">No lessons available yet.</p>}
                                </ul>
                                <Link to={`/courses/${course.id}/quiz`} className="block text-center w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                                    Take the Quiz
                                </Link>
                            </>
                        ) : (
                            <p className="text-secondary text-center p-4 bg-light-bg rounded-md">
                                Please <Link to="/login" className="text-primary font-semibold underline">log in</Link> or <Link to="/signup" className="text-primary font-semibold underline">sign up</Link> to view lessons and take the quiz.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
