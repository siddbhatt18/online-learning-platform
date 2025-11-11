// server/routes/authRoutes.js
const express = require('express');
const supabase = require('../config/supabaseClient');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // We pass fullName here so our trigger can use it
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) throw error;
        if (!data.user) throw new Error('Signup successful, but no user data returned. Check email confirmation settings.');


        // By default, Supabase sends a confirmation email.
        // If you disable that, the user is created and logged in immediately.
        res.status(201).json({ message: 'Signup successful! Please check your email to confirm.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        res.status(200).json({ message: 'Login successful!', session: data.session, user: data.user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/auth/profile - Fetch user profile (Protected)
router.get('/profile', protect, async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', req.user.id) // req.user is attached by the 'protect' middleware
            .single();

        if (error) throw error;
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;