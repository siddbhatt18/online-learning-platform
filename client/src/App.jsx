import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- Third-party library imports ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Toaster } from 'react-hot-toast';

// --- Local Component Imports ---
// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route Protection Components
import InstructorRoute from './components/InstructorRoute';
import AdminRoute from './components/AdminRoute'; // New for Day 12

// Page Components
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // New for Day 12
import QuizPage from './pages/QuizPage';

// --- Initialization ---
// Load Stripe outside of a component's render to avoid re-creating the object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


/**
 * @component Layout
 * @description Provides a consistent structure (Navbar, main content, Footer) for all pages.
 */
const Layout = () => {
  return (
    <div className="bg-light-bg min-h-screen flex flex-col">
      {/* Toaster component for displaying notifications */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet /> {/* Child routes defined in App.jsx will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};


/**
 * @component App
 * @description The root component that defines the application's routing structure.
 */
function App() {
  return (
    // Elements provider from Stripe must wrap the entire app to use Stripe features.
    <Elements stripe={stripePromise}>
      <Routes>
        {/* All pages using the main layout are nested within this parent Route */}
        <Route path="/" element={<Layout />}>
          
          {/* == Publicly Accessible Pages == */}
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* == Authenticated User Pages == */}
          {/* These routes require a user to be logged in, enforced within the components themselves */}
          <Route path="courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="courses/:courseId/quiz" element={<QuizPage />} />
          
          {/* == Role-Protected Routes == */}
          
          {/* Instructor-only routes */}
          <Route element={<InstructorRoute />}>
            <Route path="instructor/dashboard" element={<InstructorDashboardPage />} />
          </Route>

          {/* Admin-only routes (New for Day 12) */}
          <Route element={<AdminRoute />}>
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

        </Route>

        {/* You can add routes that DON'T use the main Layout component here, if needed */}
        {/* e.g., <Route path="/payment-success" element={<PaymentSuccessPage />} /> */}
        
      </Routes>
    </Elements>
  );
}

export default App;