import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ChallengeQuestion() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // 用 index 代替 question id

  const [form, setForm] = useState({
    question: "",
    explanation: "",
    options: [{ option_text: "", is_correct: false }]
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const res = await axios.get(`/api/admin/challenge/${id}`);
    setChallenge(res.data);
  };

  const openCreate = () => {
    setEditingIndex(null);
    setForm({
      question: "",
      explanation: "",
      options: [{ option_text: "", is_correct: false }]
    });
    setShowForm(true);
  };

  const openEdit = (q, index) => {
    setEditingIndex(index);
    setForm({
      question: q.question,
      explanation: q.explanation,
      options: q.options || []
    });
    setShowForm(true);
  };

  

  const handleDelete = (index) => {
    if (!window.confirm("Delete this question?")) return;

    const updatedQuestions = [...(challenge.questions || [])];
    updatedQuestions.splice(index, 1);

    axios.put(`/api/admin/challenge/${id}`, {
      ...challenge,
      questions: updatedQuestions
    }).then(fetchData)
      .catch(err => {
        console.error(err);
        alert("Error deleting question");
      });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  let updatedQuestions = [...(challenge.questions || [])];

  if (editingIndex !== null) {
    // 编辑
    updatedQuestions[editingIndex] = { ...form };
  } else {
    // 新增
    updatedQuestions.push({ ...form });
  }

  try {
    await axios.put(`/api/api/admin/challenge/${id}`, {
      ...challenge,
      questions: updatedQuestions
    });

    setShowForm(false);
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Er9ror");
  }
};

  const addOption = () => {
    setForm(prev => ({
      ...prev,
      options: [...prev.options, { option_text: "", is_correct: false }]
    }));
  };

  const updateOption = (index, key, value) => {
    const newOptions = [...form.options];
    newOptions[index][key] = value;
    setForm(prev => ({ ...prev, options: newOptions }));
  };

  if (!challenge) return <p>Loading...</p>;
  
  const removeOption = (index) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <br />
      <h2 className="admin-challenge-title">{challenge.title}</h2><br />
      <button className="create-button" onClick={openCreate}>Add Question</button><br />

      {challenge.questions?.map((q, i) => (
        <div key={i} className="challenge-card">
          <p className="challenge-question"><strong>{q.question}</strong></p> <br />
          <p className="challenge-explanation">{q.explanation}</p>
          <ul>
            {q.options?.map((opt, oi) => (
              <li key={oi}>
                {opt.option_text} {opt.is_correct ? "(✔)" : ""}
              </li>
            ))}
          </ul>
          <div className="button-row">
            <button className="edit-button" onClick={() => openEdit(q, i)}>Edit</button>
            <button className="delete-button" onClick={() => handleDelete(i)}>Delete</button>
          </div>
          
        </div>
      ))}

      {showForm && (
        <div className="modal-overlay">
          <div className="edit-popup-box">
            <div className="edit-popup-box-header">
              <h2 className="edit-title">{editingIndex !== null ? "Edit Challenge Question" : "Add Challenge Question"}</h2>
              <button className="close-button" onClick={() => setShowForm(false)}>X</button>
            </div>
            <br />
            <form onSubmit={handleSubmit}>
              <label>Question:</label>
                <input
                  className="edit-challenge-question"
                  placeholder="Question"
                  value={form.question}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                />
              <label>Explanation:</label>
                <input
                  className="edit-challenge-explanation"
                  placeholder="Explanation"
                  value={form.explanation}
                  onChange={e => setForm({ ...form, explanation: e.target.value })}
                />
              <label>Options:</label>
              {form.options.map((opt, i) => (
                <div key={i} className="edit-challenge-option">
                  <input
                    value={opt.option_text}
                    onChange={e => updateOption(i, "option_text", e.target.value)}
                  />
                  <div className="row">
                    <input
                      type="checkbox"
                      checked={opt.is_correct}
                      onChange={e => updateOption(i, "is_correct", e.target.checked)}
                    />
                    <button
                      type="button"
                      className='remove-option-button' 
                      onClick={() => removeOption(i)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <br />
              <div className="button-row">
                <button className="challenge-add-option-button" type="button" onClick={addOption}>Add Option</button>
                <button className="submit-button" type="submit">Submit</button>
                <button className='cancel-button' type="button" onClick={() => setShowForm(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengeQuestion;