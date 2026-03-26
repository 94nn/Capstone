import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/Admin.css';
import { Link } from "react-router-dom";

function AdminChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [challenge, setChallenge] = useState({
    id: null,
    title: '',
    content: '',
    module_id: '',
    chapter_id: '',
  });

  useEffect(() => {
    fetchChallenges();
    fetchModules();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get('/api/admin/challenge');
      setChallenges(res.data);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/modules'); // 所有 Module
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChapters = async (moduleId) => {
    try {
      if (!moduleId) return setChapters([]);
      const res = await axios.get(`/api/modules/${moduleId}/chapters`); // 该 Module 下的 Chapter
      setChapters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const handleCreate = () => {
  // 初始化 challenge 状态
  setChallenge({
    id: null,
    title: '',
    content: '',
    module_id: '',
    chapter_id: '',
  });

  // 初始化章节列表为空
  setChapters([]);

  // 打开 modal
  setShowModal(true);
};

// Module select onChange
const handleModuleChange = async (moduleId) => {
  // 更新 module_id，同时清空 chapter_id
  setChallenge(prev => ({ ...prev, module_id: moduleId, chapter_id: '' }));

  if (!moduleId) {
    setChapters([]);
    return;
  }

  try {
    // 请求该 Module 对应的 Chapters
    const res = await axios.get(`/api/api/modules/${moduleId}/chapters`);
    setChapters(res.data);
  } catch (err) {
    console.error('Failed to fetch chapters:', err);
    setChapters([]);
  }
};

const handleEdit = async (ch) => {
  // 先设基本数据，但 chapter_id 暂空
  setChallenge({
    id: ch.id,
    title: ch.title,
    content: ch.content,
    module_id: ch.module_id,
    chapter_id: '',
    questions: ch.questions ?? [],
  });

  try {
    // fetch 该 module 的章节
    const res = await axios.get(`/api/api/modules/${ch.module_id}/chapters`);
    setChapters(res.data);

    // fetch 完后再设回原 chapter_id
    setChallenge(prev => ({ ...prev, chapter_id: ch.chapter_id }));

  } catch (err) {
    console.error('Failed to fetch chapters:', err);
  } finally {
    setShowModal(true); // 确保 modal 一定打开
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: challenge.title,
        content: challenge.content,
        module_id: challenge.module_id,
        chapter_id: challenge.chapter_id,
        questions: challenge.questions ?? [],
      };

      if (challenge.id) {
        await axios.put(`/api/admin/challenge/${challenge.id}`, payload);
        alert('Update successfully!');
      } else {
        await axios.post('/api/admin/challenge', payload);
        alert('Create successfully!');
      }
      setShowModal(false);
      fetchChallenges();
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
        {challenges.map(ch => (
          <div key={ch.id} className="challenge-card">
            <h3>{ch.title}</h3>
            <p>{ch.content}</p>
            <Link to={`/admin/challenge/${ch.id}`}>
              <button>Enter</button>
            </Link>
            <button onClick={() => handleEdit(ch)}>Edit</button>
            <button onClick={() => axios.delete(`/api/admin/challenge/${ch.id}`).then(fetchChallenges)}>Delete</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{challenge.id ? 'Edit Challenge' : 'Create Challenge'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
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
                <label>Module:</label>
                    <select
                      value={challenge.module_id}
                      onChange={e => handleModuleChange(e.target.value)}
                      required
                    > 
                  <option value="">-- Select Module --</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div>
                <label>Chapter:</label>
                <select
                  value={challenge.chapter_id}
                  onChange={e => setChallenge(prev => ({ ...prev, chapter_id: e.target.value }))}
                  required
                  disabled={!challenge.module_id} // 没选 Module 时禁用
                >
                  <option value="">-- Select Chapter --</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

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