import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/Admin.css';
import { Link } from "react-router-dom";

function AdminChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [modules, setModules] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [badgeName, setBadgeName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentBadgeImage, setCurrentBadgeImage] = useState('');
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

const handleUpload = async () => {
  if (!badgeName || !imageFile) {
    alert('Please fill all fields');
    return;
  }

  const formData = new FormData();
  formData.append('name', badgeName);
  formData.append('image', imageFile);

  try {
    const res = await axios.post('/api/admin/badge', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // 上传成功后，把 badge_id 存进 challenge
    setChallenge(prev => ({
      ...prev,
      badge_id: res.data.id 
    }));

    alert('Badge uploaded and linked to challenge!');
  } catch (err) {
    console.error(err);
    alert('Upload failed!');
  }
};

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
    description: '',
    content: '',
    badge_id: null,       
    xp_quantity: 0,       
    coins_quantity: 0,     
    module_id: '',         
    chapter_id: '',        
    questions: [],         
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
  setChallenge({
    id: ch.id,
    title: ch.title,
    description: ch.description ?? '',
    content: ch.content ?? '',
    badge_id: ch.badge_id,
    xp_quantity: ch.xp_quantity ?? 0,
    coins_quantity: ch.coins_quantity ?? 0,
    module_id: ch.module_id,
    chapter_id: '',
    questions: ch.questions ?? [],
  });

  try {
    const res = await axios.get(`/api/admin/challenge/${ch.id}`);
    const challengeData = res.data;

    // 先拿真正的 chapters
    const chapterRes = await axios.get(`/api/api/modules/${challengeData.module_id}/chapters`);
    setChapters(chapterRes.data);

    // 再一次性更新 challenge
    setChallenge(prev => ({
      ...prev,
      module_id: challengeData.module_id ?? '',
      chapter_id: challengeData.chapter_id ?? '',
      badge_image: challengeData.badge_image ?? '',
      questions: challengeData.questions ?? [],
    }));

    setBadgeName(challengeData.badge_name ?? '');
    setCurrentBadgeImage(challengeData.badge_image ?? '');
    setImageFile(null);
  } catch (err) {
    console.error('Failed to fetch chapters:', err);
  } finally {
    setShowModal(true);
  }
};
const handleDelete = async (challengeId) => {
  if (!window.confirm('Are you sure you want to delete this challenge?')) return;

  try {
    await axios.delete(`/api/admin/challenge/${challengeId}`);
    alert('Challenge deleted successfully!');
    fetchChallenges(); // 删除后刷新列表
  } catch (err) {
    console.error('Failed to delete challenge:', err);
    alert('Delete failed!');
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (challenge.id) {
      const formData = new FormData();

      formData.append('title', challenge.title);
      formData.append('description', challenge.description || '');
      formData.append('content', challenge.content || '');
      formData.append('badge_id', challenge.badge_id || '');
      formData.append('badge_name', badgeName || '');
      formData.append('xp_quantity', challenge.xp_quantity || 0);
      formData.append('coins_quantity', challenge.coins_quantity || 0);
      formData.append('module_id', challenge.module_id || '');
      formData.append('chapter_id', challenge.chapter_id || '');
      formData.append('questions', JSON.stringify(challenge.questions || []));

      if (imageFile instanceof File) {
        formData.append('badge_image', imageFile);
      }

      await axios.post(`/api/admin/challenge/${challenge.id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Update successfully!');
    } else {
      let badgeId = challenge.badge_id;

      if (imageFile instanceof File && !badgeId) {
        const badgeForm = new FormData();
        badgeForm.append('name', badgeName);
        badgeForm.append('image', imageFile);

        const res = await axios.post('/api/admin/badge', badgeForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        badgeId = res.data.id;
      }

      const payload = {
        title: challenge.title,
        description: challenge.description,
        content: challenge.content,
        badge_id: badgeId,
        xp_quantity: challenge.xp_quantity,
        coins_quantity: challenge.coins_quantity,
        module_id: challenge.module_id,
        chapter_id: challenge.chapter_id,
        questions: challenge.questions,
      };

      await axios.post('/api/admin/challenge', payload);
      alert('Create successfully!');
    }

    setShowModal(false);
    fetchChallenges();
  } catch (err) {
    console.error(err);
    console.log(err.response?.data);
    alert(err.response?.data?.error || 'Submit failed!');
  }
};


const closeModal = () => {
  setShowModal(false);
};
  return (
    <div className="admin-challenge-page">
      <h2 className="challenge-header">Challenges</h2> <br />
      <button className="create-button" onClick={handleCreate}>Create Challenge</button> <br />
      <div className="challenge-list">
        {challenges.map(ch => (
          <div key={ch.id} className="challenge-card">
            <h2 className='admin-challenge-title'>{ch.title}</h2> <br />
            <h3 className='admin-challenge-description'>{ch.description}</h3> <br />
            <p className='admin-challenge-content'>{ch.content}</p>
              <p><strong>XP:</strong> {ch.xp_quantity ?? 0}</p>
              <p><strong>Coins:</strong> {ch.coins_quantity ?? 0}</p>

              <p><strong>Badge:</strong> {ch.badge_name ?? 'None'}</p>

              {ch.badge_image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${ch.badge_image}`}
                  alt="Badge"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginTop: '10px' }}
                />
              )}
            <br />
            <Link to={`/admin/challenge/${ch.id}`}> 
              <button className='secondary-button'>Enter</button>
            </Link> &nbsp;
            <button className="edit-button" onClick={() => handleEdit(ch)}>Edit</button> &nbsp;
            <button className="delete-button" onClick={() => handleDelete(ch.id)}>Delete</button>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="edit-popup-box">
            <div className="edit-popup-box-header">
              <h2 className="edit-title">{challenge.id ? 'Edit Challenge' : 'Create Challenge'}</h2>
            <button className="close-button" onClick={closeModal}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <input
                  className="edit-challenge-title"
                  value={challenge.title}
                  onChange={e => setChallenge(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Description:</label>
                <textarea
                  className="edit-challenge-description"
                  value={challenge.description}
                  onChange={e => setChallenge(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>


              <div>
                <label>Content:</label>
                <textarea
                  className="edit-challenge-content"
                  value={challenge.content}
                  onChange={e => setChallenge(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="">
              <label>Badge</label> 
              <input
                type="text"
                className='edit-challenge-badge-name'
                placeholder="Badge Name"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                
              /></div>
              <div className="">
                <label>Badge</label>
                  {/* 显示当前 badge 图片 */}
                  {challenge.badge_image && (
                    <div style={{ marginBottom: '10px' }}>
                      <img
                        src={`http://127.0.0.1:8000/storage/${challenge.badge_image}`}
                        alt="Badge"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {/* 上传新图片 */}
                  <input
                    type="file"
                    className='edit-challenge-badge'
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
              </div>
              <div>
                <label>Module:</label>
                    <select
                      className='edit-challenge-module'
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
                  className='edit-challenge-chapter'
                  value={challenge.chapter_id}
                  onChange={e => setChallenge(prev => ({ ...prev, chapter_id: e.target.value }))}
                  required
                  disabled={!challenge.module_id} // 没选 Module 时禁用
                >
                  <option value="">-- Select Chapter --</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
               <div className="form-group">
                <label>XP Quantity</label>
                <input
                  type="number"
                  className='edit-challenge-xp'
                  min="0"
                  value={challenge.xp_quantity}
                  onChange={e =>
                    setChallenge(prev => ({
                      ...prev,
                      xp_quantity: parseInt(e.target.value) || 0
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Coins Quantity</label>
                <input
                  type="number"
                  className='edit-challenge-coins'
                  min="0"
                  value={challenge.coins_quantity}
                  onChange={e =>
                    setChallenge(prev => ({
                      ...prev,
                      coins_quantity: parseInt(e.target.value) || 0
                    }))
                  }
                />
              </div>
              <br />
              <div className="button-row">
                <button className='submit-button' type="submit">Submit</button> &nbsp;
                <button className='cancel-button' type="button" onClick={() => setShowModal(false)}>Close</button>
              </div>
             
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminChallenge;