import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Admin.css';

function AdminQuizLayout() {
    const { slug, chapter_id, subchapter_id } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
    question: "",
    explanation: "",
    options: [{ id: Date.now(), option_text: "", is_correct: false }]
});

// 如果你要编辑 quiz，可以用这个 state
const [isEdit, setIsEdit] = useState(false);
const [editQuizId, setEditQuizId] = useState(null);

    // 加载 quizzes
    useEffect(() => {
        async function loadQuiz() {
            try {
                const res = await axios.get(`/api/modules/${slug}/${chapter_id}/${subchapter_id}`);
                setQuizzes(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to load quiz data", error);
                setQuizzes([]);
            }
        }

        if (slug && chapter_id && subchapter_id) loadQuiz();
    }, [slug, chapter_id, subchapter_id]);

    // 修改题目字段
    const handleQuizChange = (quizId, field, value) => {
        setQuizzes((prev) =>
            prev.map((q) => (q.id === quizId ? { ...q, [field]: value } : q))
        );
    };

    // 修改选项字段
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

    // 增加选项
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


    // 保存编辑
    const handleSaveQuiz = async (quiz) => {
        try {
            await axios.put(
                `/api/modules/${slug}/${chapter_id}/${subchapter_id}/quiz/${quiz.id}`,
                quiz
            );
            alert("Quiz saved successfully!");
        } catch (error) {
            console.error("Failed to save quiz", error);
        }
    };

    // 删除题目
    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(
                `/api/modules/${slug}/${chapter_id}/${subchapter_id}/quiz/${quizId}`
            );
            setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        } catch (error) {
            console.error("Failed to delete quiz", error);
        }
    };

    if (!quizzes.length) return <div>No quizzes found</div>;
const handleSubmitQuiz = async () => {
    // 前端验证
    if (!newQuiz.question.trim()) {
        alert("Question cannot be empty");
        return;
    }
    if (!newQuiz.options.length) {
        alert("Please add at least one option");
        return;
    }

    try {
        const res = await axios.post(
            `/api/modules/${slug}/${chapter_id}/${subchapter_id}/quiz`,
            newQuiz
        );

        // 后端返回 quiz_id
        const createdQuiz = { ...newQuiz, id: res.data.quiz_id };
        setQuizzes([...quizzes, createdQuiz]);

        // reset modal
        setShowModal(false);
        setNewQuiz({
            question: "",
            explanation: "",
            options: [{ id: Date.now(), option_text: "", is_correct: false }]
        });
    } catch (err) {
        console.error(err);
        alert("Failed to create quiz");
    }
};
    return (
        <section className="admin-quiz-section">
            <div className="lesson-header">
                <h1 className="quiz-management-header">Quiz Management</h1>
            </div>
            <button className="create-button" onClick={() => setShowModal(true)} >Create Quiz</button>

            {quizzes.map((quiz, index) => (
                <div key={quiz.id} className="quiz-card">
                    <h3 className="quiz-question">Question {index + 1}</h3>
                    <br />
                    <input
                        type="text"
                        value={quiz.question}
                        onChange={(e) => handleQuizChange(quiz.id, "question", e.target.value)}
                        placeholder="Edit question"
                        className="quiz-question-input"
                    />

                    <div className="options-editor">
                        {quiz.options.map((opt) => (
                            <div
                                key={opt.id}
                                className="option-row"
                                style={{ display: "flex", flexDirection: "column", marginBottom: "0.5rem" }}
                            >
                                <input
                                    type="text"
                                    value={opt.option_text}
                                    onChange={(e) =>
                                        handleOptionChange(quiz.id, opt.id, "option_text", e.target.value)
                                    }
                                    placeholder="Option text"
                                    className="option-text"
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={opt.is_correct || false}
                                        onChange={(e) =>
                                            handleOptionChange(quiz.id, opt.id, "is_correct", e.target.checked)
                                        }
                                    />{" "}
                                    Correct
                                </label>
                            </div>
                        ))}
                        <button className="quiz-add-option-button" onClick={() => handleAddOption(quiz.id)}>Add Option</button>
                    </div>

                    <textarea
                        value={quiz.explanation || ""}
                        onChange={(e) => handleQuizChange(quiz.id, "explanation", e.target.value)}
                        placeholder="Explanation"
                    />

                    <div className="button-row" style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button className="save-quiz-button" onClick={() => handleSaveQuiz(quiz)}>Save Question</button>
                        <button className="delete-quiz-button" onClick={() => handleDeleteQuiz(quiz.id)}>Delete Question</button>
                    </div>

{/* Modal for Create Quiz */}
{showModal && (
    <div className="modal-overlay">
        <div className="quiz-box">
            <div className="modal-box-header">
                <h2 className="edit-module">Create Quiz</h2>
                <button className="close-button" onClick={() => setShowModal(false)}>X</button>
            </div>
            <input
                type="text"
                className="module-name"
                placeholder="Question"
                value={newQuiz.question}
                onChange={(e) =>
                    setNewQuiz({ ...newQuiz, question: e.target.value })
                }
            />

            <div className="options-editor">
                {newQuiz.options.map((opt, index) => (
                    <div key={opt.id} className="option-row" style={{ display: "flex", flexDirection: "column", marginBottom: "0.5rem" }}>
                        <input
                            type="text"
                            className="create-quiz-option-text"
                            value={opt.option_text}
                            onChange={(e) => {
                                const newOptions = [...newQuiz.options];
                                newOptions[index].option_text = e.target.value;
                                setNewQuiz({ ...newQuiz, options: newOptions });
                            }}
                            placeholder={`Option ${index + 1}`}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={opt.is_correct}
                                onChange={(e) => {
                                    const newOptions = [...newQuiz.options];
                                    newOptions[index].is_correct = e.target.checked;
                                    setNewQuiz({ ...newQuiz, options: newOptions });
                                }}
                            /> Correct
                        </label>
                    </div>
                ))}
                <button
                    className="create-quiz-add-option-button"
                    onClick={() =>
                        setNewQuiz({
                            ...newQuiz,
                            options: [...newQuiz.options, { id: Date.now(), option_text: "", is_correct: false }]
                        })
                    }
                >
                    Add Option
                </button>
            </div>

            <textarea
                className="description"
                placeholder="Explanation"
                value={newQuiz.explanation}
                onChange={(e) =>
                    setNewQuiz({ ...newQuiz, explanation: e.target.value })
                }
                rows={3}
                style={{ width: "90%", resize: "vertical" }}
            />
            <div className="modal-box-bottom">
                <button className="submit-button" onClick={handleSubmitQuiz}>Submit</button>
                <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}
                </div>
                
            ))}
            
        </section>
    );
}

export default AdminQuizLayout;