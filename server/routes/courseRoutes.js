const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');

// GET /api/courses - Fetch all courses (Public)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/courses/:id - Fetch a single course (Public)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Course not found' });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/courses - Create a new course (Protected, Instructor only)
router.post('/', protect, async (req, res) => {
    const { title, description } = req.body;
    const user = req.user;

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile.role !== 'instructor') {
            return res.status(403).json({ error: 'Forbidden. Only instructors can create courses.' });
        }

        const { data, error } = await supabase
            .from('courses')
            .insert([{ title, description, instructor_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/courses/instructor/my-courses - Fetch courses for the logged-in instructor (Protected)
router.get('/instructor/my-courses', protect, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('instructor_id', req.user.id);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- NEW ROUTE FOR DAY 9 ---
// GET /api/courses/:id/lessons - Fetch all lessons for a single course (Protected)
router.get('/:id/lessons', protect, async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', id)
            .order('created_at', { ascending: true }); // Order lessons by creation date

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// --- END OF NEW ROUTE ---

module.exports = router;