import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './ChallengeLayout.css';

function ChallengeQuestionLayout() {
    const { slug } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [selected, setSelected] = useState({});   // { [question_id]: option_id }
    const [revealed, setRevealed] = useState({});   // { [question_id]: true }

    useEffect(() => {
        async function loadData() {
            try {
                const res = await axios.get(`/api/challenge/${slug}`);
                setChallenge(res.data);
            } catch (error) {
                console.log("Failed to load data", error);
            }
        }
        if (slug) loadData();
    }, [slug]);

    const handleSelect = (questionId, optionId) => {
        if (revealed[questionId]) return;
        setSelected(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleReveal = (questionId) => {
        if (!selected[questionId]) return;
        setRevealed(prev => ({ ...prev, [questionId]: true }));
    };

    if (!challenge) return <p>Loading...</p>;

    return (
        <section className="challenge-section">
            <div className="challenge-header">
                <h1 className="challenge-title">{challenge.title}</h1>
                {challenge.topic && <span className="ch-card-topic">{challenge.topic}</span>}
            </div>

            {challenge.descriptions && (
                <div className="challenge-card">
                    <p>{challenge.descriptions}</p>
                </div>
            )}

            <br />

            {(!challenge.questions || challenge.questions.length === 0) ? (
                <div className="challenge-card">
                    <p>No questions available for this challenge.</p>
                </div>
            ) : (
                challenge.questions.map((q, index) => {
                    const selectedOption = selected[q.id];
                    const isRevealed = revealed[q.id];
                    const correctOption = q.options?.find(o => o.is_correct);

                    return (
                        <div className="challenge-card" key={q.id}>
                            <div className="question-row">
                                <h3 className="challenge-question-header">Question {index + 1}</h3>
                                <p>{q.question}</p>
                            </div>

                            <div className="answer-row">
                                {q.options?.map(option => {
                                    let optionClass = "challenge-option";
                                    if (isRevealed) {
                                        if (option.is_correct) optionClass += " correct";
                                        else if (option.id === selectedOption) optionClass += " incorrect";
                                    } else if (option.id === selectedOption) {
                                        optionClass += " selected";
                                    }

                                    return (
                                        <button
                                            key={option.id}
                                            className={optionClass}
                                            onClick={() => handleSelect(q.id, option.id)}
                                        >
                                            {option.option_text}
                                        </button>
                                    );
                                })}
                            </div>

                            {!isRevealed && (
                                <button
                                    className="challenge-submit-btn"
                                    onClick={() => handleReveal(q.id)}
                                    disabled={!selectedOption}
                                >
                                    Submit
                                </button>
                            )}

                            {isRevealed && q.explanation && (
                                <div className="challenge-explanation">
                                    <p><strong>Explanation:</strong> {q.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </section>
    );
}

export default ChallengeQuestionLayout;
