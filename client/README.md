# LearnSphere - Frontend Client

This directory contains the frontend application for the LearnSphere platform, built with **React** and **Vite**.

## Overview

The client is a modern Single-Page Application (SPA) that provides the user interface for students, instructors, and admins. It handles all user interactions, from browsing courses and taking quizzes to managing content on dashboards.

## Core Technologies

-   **Framework:** [React.js](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **API Communication:** [Axios](https://axios-http.com/)
-   **State Management:** React Context API (`AuthContext`)
-   **UI Enhancements:**
    -   [React Hot Toast](https://react-hot-toast.com/) for notifications.
    -   [Chart.js](https://www.chartjs.org/) for analytics visualization (in the Admin Dashboard).
-   **Payment:** [Stripe.js](https://stripe.com/docs/js) for secure payment processing.

## Project Structure

```
/client
├───public/              # Static assets
└───src/
    ├───assets/          # Images, fonts, etc.
    ├───components/      # Reusable UI components (Navbar, Footer, ProgressBar, etc.)
    ├───context/         # Global state management (AuthContext)
    └───pages/           # Page-level components (HomePage, CoursesPage, LoginPage, etc.)
```

## Available Pages & Features

-   **`HomePage.jsx`**: A professional landing page to attract users.
-   **`CoursesPage.jsx`**: Displays a filterable catalog of all available courses.
-   **`CourseDetailsPage.jsx`**: Shows detailed information for a single course, including lessons and a link to the quiz.
-   **`LoginPage.jsx` & `SignupPage.jsx`**: User authentication forms.
-   **`QuizPage.jsx`**: An interactive interface for taking quizzes and viewing results.
-   **`InstructorDashboardPage.jsx`**: A protected page for instructors to manage their courses.
-   **`AdminDashboardPage.jsx`**: A protected page for admins to view platform analytics.

## Local Development

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in this directory and add your public keys:
    ```env
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_KEY
    VITE_API_BASE_URL=http://localhost:5000
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
