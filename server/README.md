# LearnSphere - Backend API Documentation

This is the backend server for the LearnSphere Online Learning Platform. It is a Node.js application using Express.js and Supabase for database and authentication services.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Courses](#courses)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- A running Supabase project

### Installation & Setup

1.  **Navigate to the Server Directory:**
    Open your terminal in the `server` folder.

    ```bash
    cd online-learning-platform/server
    ```

2.  **Create Environment File:**
    Create a file named `.env` in the `server` directory. This file will store your secret keys for Supabase. Copy the contents of `.env.example` below into your new `.env` file.

    **.env.example**
    ```
    # Get these from your Supabase Project -> Settings -> API
    SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Run the Server:**
    This command starts the server with `nodemon`, which will automatically restart on file changes.
    ```bash
    npm run start
    ```
    The server will be running at `http://localhost:5000`.

---

## API Endpoints

**Base URL:** `http://localhost:5000/api`

### Authentication
All authentication routes are prefixed with `/auth`.

#### 1. Register New User
- **Endpoint:** `POST /auth/signup`
- **Description:** Registers a new user. The `role` is automatically set to `student` in the database.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "strongpassword123",
    "fullName": "Jane Doe"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "message": "Signup successful! Please check your email to confirm."
  }
  ```

#### 2. Login User
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a user and returns a session object containing a JWT `access_token`.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "strongpassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "message": "Login successful!",
    "session": {
        "access_token": "ey...",
        "token_type": "bearer",
        "user": { ... }
    },
    "user": { ... }
  }
  ```

#### 3. Get User Profile
- **Endpoint:** `GET /auth/profile`
- **Description:** Fetches the profile (`full_name` and `role`) of the authenticated user.
- **Access:** **Protected**
- **Headers:** Must include `Authorization: Bearer YOUR_ACCESS_TOKEN`.
- **Success Response (200 OK):**
  ```json
  {
    "full_name": "Instructor Name",
    "role": "instructor"
  }
  ```

---

### Courses
All course-related routes are prefixed with `/courses`.

#### 1. Fetch All Courses
- **Endpoint:** `GET /courses`
- **Description:** Retrieves a public list of all available courses.
- **Access:** Public
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "created_at": "2023-10-27T10:00:00Z",
      "title": "Introduction to React",
      "description": "Learn the fundamentals of React from scratch.",
      "instructor_id": "uuid-of-instructor"
    }
  ]
  ```

#### 2. Fetch a Single Course
- **Endpoint:** `GET /courses/:id`
- **Description:** Retrieves the details for a specific course by its unique `id`.
- **Access:** Public
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "title": "Introduction to React",
    "description": "Learn the fundamentals of React from scratch.",
    "instructor_id": "uuid-of-instructor"
  }
  ```

#### 3. Create a New Course
- **Endpoint:** `POST /courses`
- **Description:** Creates a new course. The `instructor_id` is automatically set to the ID of the authenticated user.
- **Access:** **Protected - Instructor Only**
- **Headers:** Must include `Authorization: Bearer YOUR_ACCESS_TOKEN`.
- **Request Body:**
  ```json
  {
    "title": "Advanced Node.js",
    "description": "A deep dive into Node.js performance."
  }
  ```
- **Success Response (201 Created):** Returns the newly created course object.

#### 4. Fetch Instructor's Own Courses
- **Endpoint:** `GET /courses/instructor/my-courses`
- **Description:** Retrieves all courses created by the currently logged-in instructor.
- **Access:** **Protected - Instructor Only**
- **Headers:** Must include `Authorization: Bearer YOUR_ACCESS_TOKEN`.
- **Success Response (200 OK):** Returns an array of the instructor's course objects.
```