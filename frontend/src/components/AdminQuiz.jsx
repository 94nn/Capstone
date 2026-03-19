import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function AdminQuizLayout() {
    const { slug, chapter_id, subchapter_id } = useParams();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        async function loadQuiz() {
            try {
                const res = await axios.get(`/api/modules/${slug}/${chapter_id}/${subchapter_id}`);
                setQuizzes(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log("Failed to load quiz data", error);
                setQuizzes([]);
            }
        }

        if (slug && chapter_id && subchapter_id) loadQuiz();
    }, [slug, chapter_id, subchapter_id]);

    const handleQuizChange = (quizId, field, value) => {
        setQuizzes((prev) =>
            prev.map((q) => (q.id === quizId ? { ...q, [field]: value } : q))
        );
    };

    const handleOptionChange = (quizId, optionId, field, value) => {
        setQuizzes((prev) =>
            prev.map((q) =>
                q.id === quizId
                    ? {
                          ...q,
                          options: q.options.map((opt) =>
                              opt.id === optionId ? { ...opt, [field]: value } : opt
                          ),
                      }
                    : q
            )
        );
    };

    const handleAddOption = (quizId) => {
        setQuizzes((prev) =>
            prev.map((q) =>
                q.id === quizId
                    ? {
                          ...q,
                          options: [...q.options, { id: Date.now(), option_text: "", is_correct: false }],
                      }
                    : q
            )
        );
    };

    const handleSaveQuiz = async (quiz) => {
        try {
            const res = await axios.put(`/api/quiz/${quiz.id}`, quiz);
            console.log("Quiz saved", res.data);
            alert("Quiz saved successfully!");
        } catch (error) {
            console.error("Failed to save quiz", error);
        }
    };

    if (!quizzes.length) return <div>No quizzes found</div>;

    return (
        <section className="admin-quiz-section">
            {quizzes.map((quiz, index) => (
                <div key={quiz.id} className="quiz-card">
                    <h3>Question {index + 1}</h3>
                    <input
                        type="text"
                        value={quiz.question}
                        onChange={(e) => handleQuizChange(quiz.id, "question", e.target.value)}
                        placeholder="Edit question"
                        className="quiz-question-input"
                    />

                    <div className="options-editor">
                        {quiz.options.map((opt) => (
                            <div key={opt.id} className="option-row" style={{ display: "flex", flexDirection: "column", marginBottom: "0.5rem" }}>
                                <input
                                    type="text"
                                    value={opt.option_text}
                                    onChange={(e) =>
                                        handleOptionChange(quiz.id, opt.id, "option_text", e.target.value)
                                    }
                                    placeholder="Option text"
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={opt.is_correct || false}
                                        onChange={(e) =>
                                            handleOptionChange(quiz.id, opt.id, "is_correct", e.target.checked)
                                        }
                                    />{" "}
                                    Correct
                                </label>
                            </div>
                        ))}
                        <button onClick={() => handleAddOption(quiz.id)}>Add Option</button>
                    </div>

                    <textarea
                        value={quiz.explanation || ""}
                        onChange={(e) => handleQuizChange(quiz.id, "explanation", e.target.value)}
                        placeholder="Explanation"
                        style={{ width: "100%", marginTop: "0.5rem" }}
                    />

                    <button onClick={() => handleSaveQuiz(quiz)} style={{ marginTop: "0.5rem" }}>
                        Save Question
                    </button>
                    <hr style={{ margin: "1rem 0" }} />
                </div>
            ))}
        </section>
    );
}

export default AdminQuizLayout;