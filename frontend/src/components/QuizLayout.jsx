import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function QuizLayout({setCurrentQuizId}) {
    const { slug, chapter_id, subchapter_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isBeforeLogin = location.pathname.includes('b4login');
    const isLoggedIn = !!localStorage.getItem('student_id');
    const [subchapters, setSubchapters] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [correctOptionId, setCorrectOptionId] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [explanation, setExplanation] = useState("");
    const [answered, setAnswered] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

        // create feedback
const handleSubmitFeedback = async () => {
  try {
    const studentId = localStorage.getItem("student_id");

    if (!studentId) {
      alert("User not logged in");
      return;
    }

    if (!currentQuiz?.subchapter_id) {
      alert("Subchapter not found");
      return;
    }

    if (!feedback.trim()) {
      alert("Feedback cannot be empty");
      return;
    }

    await axios.post("/api/feedback", {
        student_id: Number(studentId),
      feedback: feedback.trim(),
      subchapter_id: currentQuiz.subchapter_id, 
    });

    alert("Feedback submitted");
    setFeedback("");
    setShowFeedback(false);
  } catch (err) {
    console.error(err.response?.data);
    alert("Failed to submit feedback");
  }
};
   

    useEffect(() => {
        if (!isLoggedIn || isBeforeLogin) {
            navigate('/login');
            return;
        }

        async function loadSubChapters() {
            try {
                const res = await axios.get(`/api/modules/${slug}/${chapter_id}`);
                setSubchapters(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log("Failed to load subchapter data", error);
                setSubchapters([]);
            }
        }

        async function loadQuiz() {
            try {
                const res = await axios.get(`/api/modules/${slug}/${chapter_id}/${subchapter_id}`);
                setQuizzes(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log("Failed to load quiz data", error);
                setQuizzes([]);
            }
        }

        if (slug && chapter_id) {
            loadSubChapters();
        }

        if (slug && chapter_id && subchapter_id) {
            loadQuiz();
        }
    }, [slug, chapter_id, subchapter_id, isLoggedIn, isBeforeLogin, navigate]);

    useEffect(() => {
        setCurrentIndex(0);
        setSelectedOptionId(null);
        setCorrectOptionId(null);
        setIsCorrect(null);
        setExplanation("");
        setAnswered(false);
        setCorrectCount(0);
    }, [subchapter_id]);

    const currentQuiz = quizzes[currentIndex];
    const isLastQuestion = currentIndex === quizzes.length - 1;
    const passMark = Math.max(1, quizzes.length - 1);
    const passed = correctCount >= passMark;
    const currentSubchapterIndex = subchapters.findIndex((s) => String(s.id) === String(subchapter_id));
    const nextSubchapter = subchapters[currentSubchapterIndex + 1];
    const isLastSubchapter = currentSubchapterIndex !== -1 && currentSubchapterIndex === subchapters.length - 1;

    useEffect(() => {
        if (currentQuiz?.id) {
            setCurrentQuizId(currentQuiz.id);
        }
    }, [currentQuiz, setCurrentQuizId]);

    async function handleAnswer(optionId) {
        if (!currentQuiz || answered) return;

        try {
            const res = await axios.post(`/api/quiz/check`, {
                quiz_id: currentQuiz.id,
                option_id: optionId,
            });

            setSelectedOptionId(optionId);
            setIsCorrect(res.data.correct);
            setCorrectOptionId(res.data.correct_option_id);
            setExplanation(res.data.explanation);
            setAnswered(true);

            if (res.data.correct) {
                setCorrectCount((prev) => prev + 1);
            }

        } catch (error) {
            console.error("Failed to submit answer", error);
        }
    }

    function handleNextQuestion() {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setSelectedOptionId(null);
        setCorrectOptionId(null);
        setIsCorrect(null);
        setExplanation("");
        setAnswered(false);
    }

    async function updateProgress() {
        try {
            await axios.post("/api/progress/update", {
                student_id: student_id,
                subchapter_id: subchapter_id,
                correct_answers: correctCount,
                total_questions: quizzes.length,
                passed: passed
            });
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    }

    async function handleOpenPopup() {
        await updateProgress();
        setFinished(true);
    }

    function handleClosePopup() {
        setFinished(false);
    }

    async function handleNextQuiz() {
        setFinished(false);

        if (nextSubchapter) {
            navigate(`/modules/${slug}/${chapter_id}/${nextSubchapter.id}`);
        } else {
            navigate(`/modules/${slug}/${chapter_id}`);
        }
    }

    function handleFinishNow() {
        setFinished(false);
        navigate(`/modules/${slug}/${chapter_id}`);
    }

    async function handleRetryQuiz() {
        await updateProgress();

        setCurrentIndex(0);
        setSelectedOptionId(null);
        setCorrectOptionId(null);
        setIsCorrect(null);
        setExplanation("");
        setAnswered(false);
        setCorrectCount(0);
    }

    function getOptionClass(optionId) {
        if (!answered) return "quiz-option";

        if (optionId === correctOptionId) return "quiz-option correct";
        if (optionId === selectedOptionId && optionId !== correctOptionId) {
            return "quiz-option wrong";
        }

        return "quiz-option";
    }

    if (!currentQuiz) {
        return (
            <section className="lesson-section">
                <div className="lesson-card">
                    <h1>No quizzes found</h1>
                </div>
            </section>
        );
    }
    return (
        <section className="lesson-section">
            
            <div className="lesson-header">
                <div className="step-indicator">{currentQuiz.subchapter_order}</div>
                <div>
                    <h1 className="lesson-title">{currentQuiz.subchapter_title}</h1>
                </div>
            </div>

            <div className="lesson-card">
                <div className="question-row">
                    <h3 className="question-header">Question {currentIndex + 1}</h3>
                    <p className="question-title">{currentQuiz.question}</p>

                    <div className="quiz-options">
                        {currentQuiz.options?.map((option) => (
                            <button
                                key={option.id}
                                className={getOptionClass(option.id)}
                                onClick={() => handleAnswer(option.id)}
                                disabled={answered}
                            >
                                {option.option_text}
                            </button>
                        ))}
                        
                    </div>
                                
                    {answered && (
                        <div className="quiz-explanation">
                            <h2>{isCorrect ? "Correct!" : "Wrong answer"}</h2>
                            <p>{explanation}</p>

                            {!isLastQuestion ? (
                                <button className="next-button" onClick={handleNextQuestion}>
                                    Next Question
                                </button>
                            ) : (
                                <div className="quiz-result">
                                    {passed ? (
                                        <>
                                            <button className="next-button" onClick={handleOpenPopup}>
                                                Continue
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h2>Quiz Completed</h2>
                                            <p>You answered {correctCount} out of {quizzes.length} questions correctly</p>
                                            <p>You have to answer at least {passMark} questions correctly to pass</p>
                                            <button className="retry-button" onClick={handleRetryQuiz}>
                                                Retry Quiz
                                            </button>
                                        </>
                                    )}                                    
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {finished && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                        <h2>Congratulations! You have completed the quiz</h2>
                        <p>You answered {correctCount} out of {quizzes.length} questions correctly</p>

                        <div className="popup-buttons">
                            <button className="retry-button" onClick={handleFinishNow}>
                                Finish Now
                            </button>
                            <div className="feedback-button">
                                <button onClick={() =>{
                                    setFinished(false);  
                                    setShowFeedback(true)}}>
                                    Give Feedback
                                </button>
                            </div>
                            {!isLastSubchapter && (
                                <button className="next-button" onClick={handleNextQuiz}>
                                    Next Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
                {showFeedback && (
                <div className="modal-overlay">
                    <div className="feedback-popup-box">

                        <h2 className="feedback-title">Feedback</h2>

                        <textarea
                            className="feedback-content"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback..."
                        />
                        <div className="button-row">
                            <button className="submit-button" onClick={handleSubmitFeedback}>Submit</button>
                            <button className="cancel-button" onClick={() => setShowFeedback(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
                )}
                
        </section>
        
    );
}

export default QuizLayout;