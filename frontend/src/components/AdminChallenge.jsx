import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/Admin.css';

function AdminChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false); // 控制 Modal 显示
  const [challenge, setChallenge] = useState({
    id: null,
    title: '',
    content: '',
    badges: '',
    module_id: '',
    chapter_id: '',
    slug: '',
    questions: [
      { question: '', explanation: '', options: [{ text: '', is_correct: false }] }
    ],
  });

  // 拉取所有 Challenge
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get('/api/challenge');
      setChallenges(res.data);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  };

  // 打开 Create Modal
  const handleCreate = () => {
    setChallenge({
      id: null,
      title: '',
      content: '',
      badges: '',
      module_id: '',
      chapter_id: '',
      slug: '',
      questions: [
        { question: '', explanation: '', options: [{ text: '', is_correct: false }] }
      ],
    });
    setShowModal(true);
  };

  // 打开 Edit Modal
  const handleEdit = (ch) => {
    setChallenge(ch);
    setShowModal(true);
  };

  // Modal 表单操作函数
  const addQuestion = () => {
    setChallenge(prev => ({
      ...prev,
      questions: [...(prev.questions || []), { question: '', explanation: '', options: [{ text: '', is_correct: false }] }]
    }));
  };

  const removeQuestion = (qIndex) => {
    setChallenge(prev => ({
      ...prev,
      questions: (prev.questions || []).filter((_, i) => i !== qIndex)
    }));
  };

  const addOption = (qIndex) => {
    const newQuestions = [...(challenge.questions || [])];
    newQuestions[qIndex].options.push({ text: '', is_correct: false });
    setChallenge(prev => ({ ...prev, questions: newQuestions }));
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...(challenge.questions || [])];
    newQuestions[qIndex].options = (newQuestions[qIndex].options || []).filter((_, i) => i !== oIndex);
    setChallenge(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...(challenge.questions || [])];
    newQuestions[qIndex].question = value;
    setChallenge(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleExplanationChange = (qIndex, value) => {
    const newQuestions = [...(challenge.questions || [])];
    newQuestions[qIndex].explanation = value;
    setChallenge(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...(challenge.questions || [])];
    newQuestions[qIndex].options[oIndex].text = value;
    setChallenge(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleCorrectChange = (qIndex, oIndex, checked) => {
    const newQuestions = [...(challenge.questions || [])];
    newQuestions[qIndex].options[oIndex].is_correct = checked;
    setChallenge(prev => ({ ...prev, questions: newQuestions }));
  };

  // 在 AdminChallenge 函数里添加删除函数
const handleDeleteChallenge = async (id) => {
  if (!window.confirm('Are you sure you want to delete this challenge?')) return;
  try {
    await axios.delete(`/api/challenge/${id}`);
    alert('Challenge deleted successfully!');
    fetchChallenges(); // 刷新列表
  } catch (err) {
    console.error(err);
    alert('Failed to delete challenge.');
  }
};

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (challenge.id) {
        await axios.put(`/api/challenge/${challenge.id}`, challenge);
        alert('Update successfully!');
      } else {
        await axios.post('/api/challenge', challenge);
        alert('Create successfully!');
      }
      setShowModal(false);
      fetchChallenges(); // 刷新列表
    } catch (err) {
      console.error(err);
      alert('Submit failed!');
    }
  };

  return (
    <div className="admin-challenge-page">
      <h2>All Challenges</h2>
      <button onClick={handleCreate}>Create Challenge</button>
      <div className="challenge-list">
        {(challenges || []).map(ch => (
          <div key={ch.id} className="challenge-card">
            <h3>{ch.title}</h3>
            <p>{ch.content}</p>
            <p><strong>Badge:</strong> {ch.badges}</p>
            <p><strong>Module ID:</strong> {ch.module_id}</p>
            <p><strong>Chapter ID:</strong> {ch.chapter_id}</p>
            <p><strong>Slug:</strong> {ch.slug}</p>
            <button onClick={() => handleEdit(ch)}>Edit</button>
            <button onClick={() => handleDeleteChallenge(ch.id)}>Delete</button>
            <hr />
            <div className="questions-preview">
              {(ch.questions || []).map((q, qi) => (
                <div key={qi}>
                  <p><strong>Q:</strong> {q.question}</p>
                  <p><em>Explanation:</em> {q.explanation}</p>
                  <ul>
                    {(q.options || []).map((opt, oi) => (
                      <li key={oi}>
                        {opt.text} {opt.is_correct ? "(Correct)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{challenge.id ? 'Edit Challenge' : 'Create Challenge'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title: </label>
                <input
                  value={challenge.title}
                  onChange={e => setChallenge(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label>Content:</label>
                <textarea
                  value={challenge.content}
                  onChange={e => setChallenge(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div>
                <label>Badge:</label>
                <input
                  value={challenge.badges}
                  onChange={e => setChallenge(prev => ({ ...prev, badges: e.target.value }))}
                />
              </div>
              <div>
                <label>Module ID:</label>
                <input
                  type="number"
                  value={challenge.module_id}
                  onChange={e => setChallenge(prev => ({ ...prev, module_id: e.target.value }))}
                />
              </div>
              <div>
                <label>Chapter ID:</label>
                <input
                  type="number"
                  value={challenge.chapter_id}
                  onChange={e => setChallenge(prev => ({ ...prev, chapter_id: e.target.value }))}
                />
              </div>
              <div>
                <label>Slug:</label>
                <input
                  value={challenge.slug}
                  onChange={e => setChallenge(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <hr />

              {(challenge.questions || []).map((q, qIndex) => (
                <div key={qIndex} className="question-card">
                  <label>Question:</label>
                  <input
                    value={q.question}
                    onChange={e => handleQuestionChange(qIndex, e.target.value)}
                    required
                  />
                  <label>Explanation:</label>
                  <input
                    value={q.explanation}
                    onChange={e => handleExplanationChange(qIndex, e.target.value)}
                  />
                  <button type="button" onClick={() => removeQuestion(qIndex)}>Remove Question</button>

                  <div className="option-row">
                    {(q.options || []).map((opt, oIndex) => (
                      <div key={oIndex}>
                        <input
                          value={opt.text}
                          onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                          required
                        />
                        <label>
                          <input
                            type="checkbox"
                            checked={opt.is_correct}
                            onChange={e => handleCorrectChange(qIndex, oIndex, e.target.checked)}
                          />
                          Correct Answer
                        </label>
                        <button type="button" onClick={() => removeOption(qIndex, oIndex)}>Delete Option</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(qIndex)}>Create Option</button>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addQuestion}>Create Question</button>
              <hr />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowModal(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminChallenge;