import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/Admin.css';
import { Link } from "react-router-dom";

function AdminChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [challenge, setChallenge] = useState({
    id: null,
    title: '',
    content: '',
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

  const handleCreate = () => {
    setChallenge({ id: null, title: '', content: '' });
    setShowModal(true);
  };

  const handleEdit = (ch) => {
    setChallenge({ id: ch.id, title: ch.title, content: ch.content });
    setShowModal(true);
  };

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await axios.delete(`/api/challenge/${id}`);
      alert('Challenge deleted successfully!');
      fetchChallenges();
    } catch (err) {
      console.error(err);
      alert('Failed to delete challenge.');
    }
  };

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
              <Link to={`/challenge/${ch.id}`}>
              <button>Enter</button>
              </Link>
            <button onClick={() => handleEdit(ch)}>Edit</button>
            <button onClick={() => handleDeleteChallenge(ch.id)}>Delete</button>

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