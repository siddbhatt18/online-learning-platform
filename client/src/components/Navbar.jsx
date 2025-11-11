import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false); // State for mobile menu

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        LearnSphere
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-secondary hover:text-primary">Home</Link>
                        <Link to="/courses" className="text-secondary hover:text-primary">Courses</Link>
                        {user && user.role === 'instructor' && (
                            <Link to="/instructor/dashboard" className="text-secondary hover:text-primary">Dashboard</Link>
                        )}
                        {user && user.role === 'admin' && ( // <-- ADD THIS
                            <Link to="/admin/dashboard" className="font-bold text-primary hover:text-primary-hover">Admin</Link>
                        )}
                        {user ? (
                            <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="toggle menu">
                            {isOpen ? (
                                // Close Icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // Hamburger Icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} mt-4`}>
                    <Link to="/" className="block py-2 text-secondary hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/courses" className="block py-2 text-secondary hover:text-primary" onClick={() => setIsOpen(false)}>Courses</Link>
                    {user && user.role === 'instructor' && (
                        <Link to="/instructor/dashboard" className="block py-2 text-secondary hover:text-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    )}
                    {user && user.role === 'admin' && ( // <-- ADD THIS
                        <Link to="/admin/dashboard" className="font-bold text-primary hover:text-primary-hover">Admin</Link>
                    )}
                    <div className="mt-4">
                        {user ? (
                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;