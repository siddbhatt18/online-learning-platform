# LearnSphere: Full-Stack E-Learning SaaS Platform

## 📜 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Future Roadmap](#-future-roadmap)
- [Contact](#-contact)

---

## 📖 Project Overview

LearnSphere is a full-stack web application designed to mimic a modern e-learning platform like Udemy or Coursera. It provides a robust and scalable foundation for delivering educational content online. The platform supports multiple user roles (Student, Instructor, Admin), each with a distinct set of permissions and capabilities, demonstrating a comprehensive understanding of authentication, authorization, and database security.

From course creation and payment processing to interactive quizzes and progress tracking, this project showcases the end-to-end development of a real-world SaaS application.

---

## ✨ Core Features

-   **Role-Based Access Control (RBAC):**
    -   **Students:** Can browse courses, purchase access via Stripe, view lessons, take quizzes, and track their progress.
    -   **Instructors:** Have a dedicated dashboard to create, read, update, and delete their own courses and associated content.
    -   **Admins:** Possess a high-level dashboard to view platform-wide analytics, such as total user and course counts, visualized with `Chart.js`.

-   **Secure Authentication:**
    -   Complete user authentication system using Supabase Auth, supporting signup, login, and secure session management via JWTs.

-   **Course Catalog & Filtering:**
    -   A public, responsive course catalog with a client-side search filter for easy discoverability.

-   **Interactive Learning Modules:**
    -   **Video Lessons:** Embedded video player for lesson content.
    -   **Quiz System:** Students can take quizzes and receive an immediate, auto-graded score.
    -   **Progress Tracking:** The system persistently stores which lessons a user has completed, reflected visually with progress bars and checkmarks.

-   **Payment Integration:**
    -   Secure one-time course purchases are handled by integrating Stripe Checkout, offloading PCI compliance and providing a seamless user experience.

---

## 🏗️ Architecture & Tech Stack

This project is built on a robust, decoupled client-server architecture.

-   **Frontend (Client):** A dynamic Single-Page Application (SPA) built with **React** and **Vite**. It uses **React Router** for navigation, **Tailwind CSS** for a responsive and modern UI, and **Axios** for communicating with the backend API.
-   **Backend (Server):** A RESTful API built with **Node.js** and **Express.js**. It handles all business logic, authentication validation, and secure communication with the database.
-   **Database:** **Supabase** serves as the backend-as-a-service, providing a **PostgreSQL** database, authentication, and secure file storage. **Row Level Security (RLS)** is heavily utilized to enforce data access policies at the database layer.

---

## 🚀 Local Development Setup

Follow these steps to run the project on your local machine.

### Prerequisites
- Node.js (v18.x or later)
- Git
- A [Supabase](https://supabase.com) account & project.
- A [Stripe](https://stripe.com) account (in test mode).

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[YOUR_GITHUB_USERNAME]/[YOUR_REPO_NAME].git
    cd [YOUR_REPO_NAME]
    ```

2.  **Setup the Backend (`/server`):**
    ```bash
    cd server
    npm install
    cp .env.example .env 
    ```
    Populate the newly created `.env` file with your secret keys (see the [Environment Variables](#-environment-variables) section below).

3.  **Setup the Frontend (`/client`):**
    ```bash
    cd ../client
    npm install
    cp .env.example .env
    ```
    Populate the new `.env` file with your public keys.

4.  **Run the Application:**
    -   In one terminal, start the backend server (from the `/server` directory):
        ```bash
        npm run start
        ```
    -   In a second terminal, start the frontend dev server (from the `/client` directory):
        ```bash
        npm run dev
        ```
    The application will be live at `http://localhost:5173`.

---

## 🔑 Environment Variables

To run this project, you need to configure the following environment variables:

| File              | Variable                    | Description                                                   |
| ----------------- | --------------------------- | ------------------------------------------------------------- |
| **`server/.env`** | `SUPABASE_URL`              | Your project's URL from Supabase Dashboard > API Settings.      |
|                   | `SUPABASE_ANON_KEY`         | Your project's `anon` public key.                             |
|                   | `SUPABASE_SERVICE_KEY`      | Your project's `service_role` secret key (for admin tasks). |
|                   | `STRIPE_SECRET_KEY`         | Your Stripe secret key (`sk_test_...`).                         |
|                   | `CLIENT_URL`                | The URL of your frontend (e.g., `http://localhost:5173`).     |
| **`client/.env`** | `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (`pk_test_...`).                    |
|                   | `VITE_API_BASE_URL`         | The URL of your backend server (e.g., `http://localhost:5000`). |

---

## 🔌 API Endpoints

The backend exposes the following RESTful API endpoints.

| Method | Endpoint                            | Access     | Description                                       |
| :----- | :---------------------------------- | :--------- | :------------------------------------------------ |
| `POST` | `/api/auth/signup`                  | Public     | Registers a new user.                             |
| `POST` | `/api/auth/login`                   | Public     | Logs in a user and returns a JWT.                 |
| `GET`  | `/api/auth/profile`                 | Protected  | Fetches the profile of the authenticated user.    |
| `GET`  | `/api/courses`                      | Public     | Gets a list of all courses.                       |
| `POST` | `/api/courses`                      | Instructor | Creates a new course.                             |
| `GET`  | `/api/courses/:id/lessons`          | Protected  | Gets all lessons for a specific course.           |
| `GET`  | `/api/quizzes/:courseId`            | Protected  | Fetches a quiz (without answers).                 |
| `POST` | `/api/quizzes/submit`               | Protected  | Submits quiz answers and returns the score.       |
| `POST` | `/api/progress/update`              | Protected  | Marks a lesson as complete for the user.          |
| `POST` | `/api/payment/create-checkout-session` | Protected  | Creates a Stripe payment session.                 |
| `GET`  | `/api/admin/stats`                  | Admin      | Fetches platform-wide user and course counts.   |

---

## 🔮 Future Roadmap

-   [ ] **Direct Video Uploads:** Integrate a cloud storage solution like AWS S3 or Supabase Storage to allow instructors to upload video files directly, providing a more seamless content management experience.
-   [ ] **Certificate Generation:** Implement a service (e.g., using `pdf-lib`) to automatically generate and issue PDF certificates to students upon course completion.
-   [ ] **Advanced Admin Panel:** Expand the admin dashboard to include full user management (view/edit/delete users), course management (approve/reject courses), and detailed revenue analytics.
-   [ ] **Student Reviews & Ratings:** Allow students to provide feedback on courses to create a community-driven rating system.

---

## ✉️ Contact

**Siddharth Bhattacharya**
- GitHub: [@siddbhatt18](https://github.com/siddbhatt18/)
- LinkedIn: [Siddharth Bhattacharya](https://www.linkedin.com/in/siddharth-bhattacharya-8b9710247/)
