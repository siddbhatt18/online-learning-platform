import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

const CourseCard = ({ course }) => {
    const { user, progress } = useAuth();
    const TOTAL_LESSONS_IN_COURSE = 4;
    const completedLessonsCount = (user && progress[course.id]) ? progress[course.id].length : 0;
    const buttonText = completedLessonsCount === TOTAL_LESSONS_IN_COURSE ? 'Review Course' : 'Continue Learning';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-dark-text mb-2">{course.title}</h3>
                <p className="text-secondary text-base mb-4">{course.description}</p>
                {user && <ProgressBar current={completedLessonsCount} total={TOTAL_LESSONS_IN_COURSE} />}
            </div>
            <div className="p-4 bg-light-bg">
                <Link to={`/courses/${course.id}`} className="block text-center w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover">
                    {buttonText}
                </Link>
            </div>
        </div>
    );
};

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
    const [searchTerm, setSearchTerm] = useState(''); // State for the search input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect to fetch all courses initially
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses(response.data);
                setFilteredCourses(response.data); // Initially, filtered list is the full list
            } catch (err) {
                setError('Failed to load courses.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Effect to filter courses whenever search term changes
    useEffect(() => {
        const results = courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(results);
    }, [searchTerm, courses]);

    if (loading) return <p className="text-center text-secondary">Loading courses...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-dark-text">Explore Courses</h1>
                {/* Search Bar */}
                <div className="w-full max-w-sm">
                    <input
                        type="search"
                        placeholder="Search for courses..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-secondary mt-10">
                    {searchTerm ? 'No courses found matching your search.' : 'No courses available at the moment.'}
                </p>
            )}
        </div>
    );
};

export default CoursesPage;
