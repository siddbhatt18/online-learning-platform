# LearnSphere - Backend Server

This directory contains the backend API server for the LearnSphere platform, built with **Node.js** and **Express.js**.

## Overview

The server provides a RESTful API that handles all business logic, data persistence, and security for the platform. It communicates with a **Supabase (PostgreSQL)** database and integrates with third-party services like **Stripe**.

## Core Technologies

-   **Framework:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
-   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
-   **Authentication:** [Supabase Auth](https://supabase.com/docs/guides/auth) (JWT-based)
-   **Security:**
    -   `jsonwebtoken` for verifying tokens.
    -   `cors` for Cross-Origin Resource Sharing policies.
    -   Custom middleware for role-based access control (RBAC).
-   **Payment:** [Stripe Node.js Library](https://github.com/stripe/stripe-node) for creating secure payment sessions.

## Project Structure

```
/server
├───config/          # Configuration files (e.g., Supabase clients)
├───middleware/      # Custom Express middleware (e.g., authentication check)
└───routes/          # API route handlers (auth, courses, quizzes, etc.)
```

## API Endpoints

The API exposes several endpoints to manage users, courses, and platform interactions. All routes are prefixed with `/api`.

-   **`/auth`**: Handles user registration, login, and profile fetching.
-   **`/courses`**: Manages course creation, retrieval, and lesson data.
-   **`/quizzes`**: Provides quiz questions and handles submission grading.
-   **`/progress`**: Tracks and updates user completion of lessons.
-   **`/payment`**: Creates secure Stripe Checkout sessions.
-   **`/admin`**: Provides protected endpoints for platform analytics.

*For a detailed API endpoint list, please refer to the main project README.*

## Local Development

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in this directory and add your secret keys:
    ```env
    SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLIC_ANON_KEY
    SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
    STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_KEY
    CLIENT_URL=http://localhost:5173
    ```
4.  **Start the server:**
    ```bash
    npm run start
    ```
    The API server will run on `http://localhost:5000`.
