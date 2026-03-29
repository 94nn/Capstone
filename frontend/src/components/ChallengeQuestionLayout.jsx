import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './ChallengeLayout.css';
import { getImageUrl } from "../utils/imageUrl";

function ChallengeQuestionLayout() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isBeforeLogin = location.pathname.includes('b4login');
    const isLoggedIn = !!localStorage.getItem('student_id');
    const [challenge, setChallenge] = useState(null);
    const [selected, setSelected] = useState({});
    const [revealed, setRevealed] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        if (!isLoggedIn || isBeforeLogin) {
            navigate('/login');
            return;
        }
        async function loadData() {
            try {
                const res = await axios.get(`/api/challenge/${slug}`);
                setChallenge(res.data);
            } catch (error) {
                console.log("Failed to load data", error);
            }
        }
        if (slug) loadData();
    }, [slug, isLoggedIn, navigate]);

    const handleSelect = (questionId, optionId) => {
        if (!isLoggedIn) { setShowLoginPrompt(true); return; }
        if (revealed[questionId]) return;
        setSelected(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleReveal = (questionId) => {
        if (!isLoggedIn) { setShowLoginPrompt(true); return; }
        if (!selected[questionId]) return;
        setRevealed(prev => ({ ...prev, [questionId]: true }));
    };

    const questions = challenge?.questions || [];
    const totalQ = questions.length;
    const answeredQ = Object.keys(revealed).length;
    const correctQ = questions.filter(q => {
        if (!revealed[q.id]) return false;
        const correct = q.options?.find(o => o.is_correct);
        return correct && selected[q.id] === correct.id;
    }).length;
    const allDone = totalQ > 0 && answeredQ === totalQ;

    useEffect(() => {
        if (allDone && challenge?.id && isLoggedIn) {
            const student_id = localStorage.getItem('student_id');
            axios.post('/api/challenge-completion', {
                student_id,
                challenge_id:    challenge.id,
                correct_answers: correctQ,
                total_questions: totalQ,
                xp_earned:       correctQ * challenge.xp_quantity,
                coins_earned:    correctQ * challenge.coins_quantity,
                badge_id:        correctQ >= 2 ? challenge.badge_id : null,
            }).catch(err => console.error('Failed to save completion:', err));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allDone]);

    if (!challenge) return <p className="cq-loading">Loading...</p>;

    const q = questions[currentIndex];
    const isLast = currentIndex === totalQ - 1;

    return (
        <div className="cq-page">

            {/* Top bar */}
            <div className="cq-topbar">
                <button className="cq-back-btn" onClick={() => navigate(isBeforeLogin ? '/challenge/b4login' : '/challenge')}>
                    ← Back
                </button>
                <div className="cq-progress-bar">
                    <div
                        className="cq-progress-fill"
                        style={{ width: totalQ > 0 ? `${((currentIndex + (revealed[q?.id] ? 1 : 0)) / totalQ) * 100}%` : '0%' }}
                    />
                </div>
                <span className="cq-progress-label">{currentIndex + 1}/{totalQ}</span>
            </div>

            {/* Header */}
            <div className="cq-header">
                <div className="cq-header-top">
                    <h1 className="cq-title">{challenge.title}</h1>
                    {challenge.topic && <span className="ch-card-topic">{challenge.topic}</span>}
                </div>
                {challenge.description && (
                    <p className="cq-description">{challenge.description}</p>
                )}
            </div>

            {/* Question intro card */}
            {(challenge.challenge_title || challenge.content) && (
                <div className="cq-card cq-intro-card">
                    {challenge.challenge_title && (
                        <h2 className="cq-intro-title">{challenge.challenge_title}</h2>
                    )}
                    {challenge.content && (
                        <p className="cq-intro-content">{challenge.content}</p>
                    )}
                </div>
            )}

            {/* Single question */}
            {totalQ === 0 ? (
                <div className="cq-card">
                    <p style={{ color: '#5c3d2e', fontFamily: 'Lucida Sans, sans-serif' }}>No questions available for this challenge.</p>
                </div>
            ) : q ? (() => {
                const selectedOption = selected[q.id];
                const isRevealed = revealed[q.id];
                const correctOption = q.options?.find(o => o.is_correct);
                const gotCorrect = isRevealed && correctOption && selectedOption === correctOption.id;

                return (
                    <div className="cq-card" key={q.id}>
                        <div className="cq-question-header">
                            <span className="cq-q-number">Q{currentIndex + 1}</span>
                            {isRevealed && (
                                <span className={`cq-result-badge ${gotCorrect ? 'cq-result-badge--correct' : 'cq-result-badge--wrong'}`}>
                                    {gotCorrect ? '✓ Correct' : '✗ Wrong'}
                                </span>
                            )}
                        </div>

                        <p className="cq-question-text">{q.question}</p>

                        <div className="cq-options">
                            {q.options?.map(option => {
                                let cls = "cq-option";
                                if (isRevealed) {
                                    if (option.is_correct) cls += " cq-option--correct";
                                    else if (option.id === selectedOption) cls += " cq-option--wrong";
                                } else if (option.id === selectedOption) {
                                    cls += " cq-option--selected";
                                }
                                return (
                                    <button
                                        key={option.id}
                                        className={cls}
                                        onClick={() => handleSelect(q.id, option.id)}
                                    >
                                        {option.option_text}
                                    </button>
                                );
                            })}
                        </div>

                        {!isRevealed && (
                            <button
                                className="cq-submit-btn"
                                onClick={() => handleReveal(q.id)}
                                disabled={!selectedOption}
                            >
                                Submit
                            </button>
                        )}

                        {isRevealed && q.explanation && (
                            <div className="cq-explanation">
                                <span className="cq-explanation-label">Explanation</span>
                                <p>{q.explanation}</p>
                            </div>
                        )}

                        <div className="cq-nav-row">
                            {currentIndex > 0 && (
                                <button
                                    className="cq-prev-btn"
                                    onClick={() => setCurrentIndex(i => i - 1)}
                                >
                                    ← Previous
                                </button>
                            )}
                            {isRevealed && !isLast && (
                                <button
                                    className="cq-next-btn"
                                    onClick={() => setCurrentIndex(i => i + 1)}
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>
                );
            })() : null}

            {/* Completion card */}
            {allDone && (
                <div className="cq-completion">
                    <div className="cq-completion-stars">
                        {Array.from({ length: totalQ }, (_, i) => (
                            <span key={i} className={`cq-star ${i < correctQ ? 'cq-star--filled' : 'cq-star--empty'}`}>★</span>
                        ))}
                    </div>
                    <h2 className="cq-completion-title">Challenge Complete!</h2>
                    <p className="cq-completion-score">{correctQ} / {totalQ} correct</p>
                    <div className="cq-completion-rewards">
                        <div className="cq-reward-pill">+{correctQ * challenge.xp_quantity} XP</div>
                        <div className="cq-reward-pill">+{correctQ * challenge.coins_quantity} Coins</div>
                    </div>
                    {correctQ >= 2 && challenge.badge_name && (
                        <div className="cq-badge-earned">
                            {challenge.badge_image
                                ? <img src={`http://127.0.0.1:8000/storage/${challenge.badge_image}`} alt={challenge.badge_name} className="cq-badge-icon" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                                : <span className="cq-badge-icon">🏅</span>
                            }
                            <div>
                                <span className="cq-badge-label">Badge Earned</span>
                                <span className="cq-badge-name">{challenge.badge_name}</span>
                            </div>
                        </div>
                    )}
                    <button className="cq-done-btn" onClick={() => navigate(isBeforeLogin ? '/challenge/b4login' : '/challenge')}>
                        Done
                    </button>
                </div>
            )}

            {/* Login prompt for non-logged-in users */}
            {showLoginPrompt && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
                }}>
                    <div className="cq-card" style={{ maxWidth: 400, textAlign: 'center', padding: '32px 28px' }}>
                        <h2 className="cq-intro-title" style={{ marginBottom: 8 }}>Login Required</h2>
                        <p className="cq-intro-content" style={{ marginBottom: 20 }}>
                            You need to log in to answer challenge questions and earn rewards.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button className="cq-submit-btn" onClick={() => navigate('/login')}>
                                Log In
                            </button>
                            <button className="cq-prev-btn" onClick={() => setShowLoginPrompt(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChallengeQuestionLayout;
