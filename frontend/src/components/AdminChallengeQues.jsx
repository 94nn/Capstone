import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ChallengeQuestion() {
  const { challenge_id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // 用 index 代替 question id

  const [form, setForm] = useState({
    question: "",
    explanation: "",
    options: [{ text: "", is_correct: false }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`/api/challenge/${challenge_id}`);
    setChallenge(res.data);
  };

  const openCreate = () => {
    setEditingIndex(null);
    setForm({
      question: "",
      explanation: "",
      options: [{ text: "", is_correct: false }]
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedQuestions = [...(challenge.questions || [])];

    if (editingIndex !== null) {
      // 编辑现有 question
      updatedQuestions[editingIndex] = { ...form };
    } else {
      // 新增 question
      updatedQuestions.push({ ...form });
    }

    try {
      await axios.put(`/api/challenge/${challenge_id}`, {
        ...challenge,
        questions: updatedQuestions
      });

      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  const handleDelete = (index) => {
    if (!window.confirm("Delete this question?")) return;

    const updatedQuestions = [...(challenge.questions || [])];
    updatedQuestions.splice(index, 1);

    axios.put(`/api/challenge/${challenge_id}`, {
      ...challenge,
      questions: updatedQuestions
    }).then(fetchData)
      .catch(err => {
        console.error(err);
        alert("Error deleting question");
      });
  };

  const addOption = () => {
    setForm(prev => ({
      ...prev,
      options: [...prev.options, { text: "", is_correct: false }]
    }));
  };

  const updateOption = (index, key, value) => {
    const newOptions = [...form.options];
    newOptions[index][key] = value;
    setForm(prev => ({ ...prev, options: newOptions }));
  };

  if (!challenge) return <p>Loading...</p>;

  return (
    <div>
      <h2>{challenge.title}</h2>

      <button onClick={openCreate}>Add Question</button>

      {challenge.questions?.map((q, i) => (
        <div key={i}>
          <p><strong>{q.question}</strong></p>
          <p>{q.explanation}</p>
          <ul>
            {q.options?.map((opt, oi) => (
              <li key={oi}>
                {opt.text} {opt.is_correct ? "(✔)" : ""}
              </li>
            ))}
          </ul>
          <button onClick={() => openEdit(q, i)}>Edit</button>
          <button onClick={() => handleDelete(i)}>Delete</button>
          <hr />
        </div>
      ))}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Question"
            value={form.question}
            onChange={e => setForm({ ...form, question: e.target.value })}
          />
          <input
            placeholder="Explanation"
            value={form.explanation}
            onChange={e => setForm({ ...form, explanation: e.target.value })}
          />
          <h4>Options</h4>
          {form.options.map((opt, i) => (
            <div key={i}>
              <input
                value={opt.text}
                onChange={e => updateOption(i, "text", e.target.value)}
              />
              <input
                type="checkbox"
                checked={opt.is_correct}
                onChange={e => updateOption(i, "is_correct", e.target.checked)}
              />
            </div>
          ))}
          <button type="button" onClick={addOption}>Add Option</button>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default ChallengeQuestion;