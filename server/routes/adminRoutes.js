const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // For role check
const supabaseAdmin = require('../config/supabaseAdminClient'); // For stats
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is an admin
const adminOnly = async (req, res, next) => {
    try {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
        if (profile && profile.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: Admin access required.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify admin role.' });
    }
};

// GET /api/admin/stats - Fetch platform statistics
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
        if (usersError) throw usersError;
        
        const { count: courseCount, error: coursesError } = await supabase.from('courses').select('*', { count: 'exact', head: true });
        if(coursesError) throw coursesError;
        
        // Note: Enrollment count is more complex. For now, we count users and courses.
        res.status(200).json({
            userCount: usersData.users.length,
            courseCount: courseCount,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;