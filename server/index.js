const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Production-Ready CORS Configuration ---
// This is a critical security step. It creates a "whitelist" of allowed origins.
const allowedOrigins = [
    'http://localhost:5173', // Your local frontend for development
    process.env.CLIENT_URL     // The live Vercel URL from your environment variables
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests that have an origin found in our whitelist.
        // Also allow requests with no origin (like Postman or server-to-server requests).
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Block requests from any other origin
            callback(new Error('This origin is not allowed by CORS policy.'));
        }
    },
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// --- 2. Middleware ---
// This must come before your routes to parse incoming JSON bodies
app.use(express.json());


// --- 3. Import and Register All API Routes ---
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// adminRoutes is correctly commented out or can be included if you're debugging it
// const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payment', paymentRoutes);
// app.use('/api/admin', adminRoutes);


// --- 4. Root Health-Check Route ---
// This is useful for checking if the server is running at all.
app.get('/', (req, res) => {
  res.json({ status: 'healthy', message: 'Welcome to the LearnSphere API!' });
});


// --- 5. Start the Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is successfully running on port ${PORT}`);
});
