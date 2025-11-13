import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // <-- 1. Import the new configured axios client
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QuizPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // 2. Use the new client with a relative URL
                const response = await axiosClient.get(`/api/quizzes/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuiz(response.data);
            } catch (err) {
                setError('Failed to load quiz or no quiz available for this course.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchQuiz();
        } else {
            // If there's no token, we can't fetch a protected resource, so stop loading.
            setLoading(false);
            setError('You must be logged in to take a quiz.');
        }
    }, [courseId, token]);

    const handleAnswerChange = (questionId, optionIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Submitting your answers...');

        try {
            // 3. Use the new client for the POST request
            const response = await axiosClient.post('/api/quizzes/submit', {
                quizId: quiz.id,
                answers: selectedAnswers,
            });

            const scoreData = response.data;
            setResult(scoreData); 
            toast.success(`Quiz submitted! You scored ${scoreData.score}/${scoreData.total}`, { 
                id: toastId,
            });

        } catch (err) {
            console.error("Error during quiz submission:", err);
            toast.error('Failed to submit quiz. Please try again.', { 
                id: toastId,
            });
        }
    };

    if (loading) return <p className="text-center text-secondary">Loading Quiz...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!quiz) return <p className="text-center text-secondary">Quiz not found for this course.</p>;

    // Show result view if quiz is submitted
    if (result) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-dark-text mb-4">Quiz Results</h1>
                <p className="text-2xl text-secondary mb-6">
                    You scored <span className="font-bold text-primary">{result.score}</span> out of <span className="font-bold text-primary">{result.total}</span>
                </p>
                <button onClick={() => navigate(`/courses/${courseId}`)} className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-hover">
                    Back to Course
                </button>
            </div>
        );
    }

    // Show quiz taking view
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dark-text mb-2">{quiz.title}</h1>
            <p className="text-secondary mb-8">Answer the questions below.</p>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-dark-text mb-4">{index + 1}. {q.question_text}</h2>
                        <div className="space-y-3">
                            {q.options.map((option, i) => (
                                <label key={i} className="flex items-center p-3 border rounded-md hover:bg-light-bg cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={i}
                                        onChange={() => handleAnswerChange(q.id, i)}
                                        className="mr-3 h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg text-lg font-bold hover:bg-primary-hover">
                    Submit Quiz
                </button>
            </form>
        </div>
    );
};

export default QuizPage;
