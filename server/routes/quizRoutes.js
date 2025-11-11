const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');

// GET /api/quizzes/:courseId - Fetch a quiz for a specific course
router.get('/:courseId', protect, async (req, res) => {
    const { courseId } = req.params;
    try {
        // First, find the quiz associated with the course
        const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .select('id, title')
            .eq('course_id', courseId)
            .single();

        if (quizError || !quizData) {
            return res.status(404).json({ error: 'Quiz not found for this course.' });
        }

        // Then, fetch the questions for that quiz, but EXCLUDE the correct_answer
        const { data: questionsData, error: questionsError } = await supabase
            .from('questions')
            .select('id, question_text, options') // Notice we are not selecting 'correct_answer'
            .eq('quiz_id', quizData.id);

        if (questionsError) throw questionsError;

        res.status(200).json({ ...quizData, questions: questionsData });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/quizzes/submit - Submit quiz answers and get a score
router.post('/submit', protect, async (req, res) => {
    const { quizId, answers } = req.body;

    // --- Validation (Keep this) ---
    if (!quizId || !answers) {
        return res.status(400).json({ error: 'Missing quizId or answers.' });
    }

    // This handles a submission with no answers selected.
    if (Object.keys(answers).length === 0) {
        // We need to fetch the total number of questions for this quiz to return an accurate total.
        const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('quiz_id', quizId);
        return res.status(200).json({ score: 0, total: count ?? 0 });
    }

    try {
        // Fetch the questions with the correct answers for validation
        const { data: correctQuestions, error } = await supabase
            .from('questions')
            .select('id, correct_answer')
            .eq('quiz_id', quizId);

        if (error) throw error;

        if (!correctQuestions || correctQuestions.length === 0) {
            return res.status(404).json({ error: 'Quiz not found or has no questions.' });
        }

        let score = 0;
        const totalQuestions = correctQuestions.length;

        // Compare user's answers with the correct ones
        for (const question of correctQuestions) {
            const userAnswer = answers[question.id];
            if (userAnswer !== undefined && parseInt(userAnswer) === question.correct_answer) {
                score++;
            }
        }

        res.status(200).json({ score, total: totalQuestions });

    } catch (error) {
        // Log only critical, unexpected errors
        console.error("ERROR in /quiz/submit:", error.message);
        res.status(500).json({ error: 'An internal server error occurred while grading the quiz.' });
    }
});

module.exports = router;