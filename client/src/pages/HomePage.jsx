import React from 'react';
import { Link } from 'react-router-dom';

// A simple array of features to display.
const features = [
    {
        icon: '🎓',
        title: 'Expert-Led Courses',
        description: 'Learn from industry experts who are passionate about teaching real-world skills.',
    },
    {
        icon: '💻',
        title: 'Interactive Learning',
        description: 'Stay engaged with quizzes, coding exercises, and hands-on projects.',
    },
    {
        icon: '📜',
        title: 'Career-Ready Certificates',
        description: 'Earn a certificate upon completion to showcase on your resume or LinkedIn.',
    },
    {
        icon: '🌐',
        title: 'Flexible & On-Demand',
        description: 'Learn at your own pace from anywhere in the world with lifetime course access.',
    }
];

const HomePage = () => {
    return (
        <div className="space-y-24 pb-12">

            {/* 1. Hero Section */}
            <section className="text-center pt-16 pb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-dark-text mb-4 leading-tight">
                    Your Gateway to Lifelong Learning
                </h1>
                <p className="text-lg md:text-xl text-secondary mb-10 max-w-3xl mx-auto">
                    Master new skills, advance your career, or explore your passions with our expert-led online courses. Your journey starts here.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/courses"
                        className="bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-primary-hover transition-transform transform hover:scale-105 shadow-lg"
                    >
                        Explore Courses
                    </Link>
                </div>
            </section>

            {/* 2. Features Section */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-5xl mb-5">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-dark-text mb-2">{feature.title}</h3>
                            <p className="text-secondary">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Final Call to Action Section */}
            <section className="bg-primary text-white rounded-xl p-12 text-center shadow-2xl">
                <h2 className="text-4xl font-bold mb-4">
                    Ready to Start Your Journey?
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                    Join thousands of learners and take the next step in your career. Sign up now and get instant access to our learning community.
                </p>
                <Link
                    to="/signup"
                    className="bg-white text-primary font-bold py-4 px-10 rounded-lg text-lg hover:bg-light-bg transition-transform transform hover:scale-105 shadow-lg"
                >
                    Sign Up for Free
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
