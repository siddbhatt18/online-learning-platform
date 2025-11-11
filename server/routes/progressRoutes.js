const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');

// GET /api/progress/all - Fetch all progress for the logged-in user
router.get('/all', protect, async (req, res) => {
    try {
        // Get all completed lesson IDs for the current user
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', req.user.id);

        if (progressError) throw progressError;

        // To calculate percentage, we need the course for each lesson
        const lessonIds = progressData.map(p => p.lesson_id);
        if (lessonIds.length === 0) {
            return res.status(200).json({});
        }

        const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select('id, course_id')
            .in('id', lessonIds);
        
        if (lessonsError) throw lessonsError;

        // Group completed lessons by course_id
        const progressByCourse = lessonsData.reduce((acc, lesson) => {
            if (!acc[lesson.course_id]) {
                acc[lesson.course_id] = [];
            }
            acc[lesson.course_id].push(lesson.id);
            return acc;
        }, {});

        res.status(200).json(progressByCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST /api/progress/update - Mark a lesson as complete
router.post('/update', protect, async (req, res) => {
    const { lesson_id } = req.body;
    const user_id = req.user.id;

    if (!lesson_id) {
        return res.status(400).json({ error: 'Lesson ID is required' });
    }

    try {
        // upsert will insert a new row, or do nothing if the row (user_id, lesson_id) already exists.
        // This prevents errors from trying to complete the same lesson twice.
        const { data, error } = await supabase
            .from('user_progress')
            .upsert({ user_id, lesson_id });
        
        if (error) throw error;

        res.status(201).json({ message: 'Progress updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;