import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/modules', { name, description })
      .then(res => {
        alert('Module added successfully!');
        setName('');
        setDescription('');
        fetchModules();
      });
  };

  const handleDeleteModule = (id) => {
    if (!window.confirm('Delete this module?')) return;
    axios.delete(`http://127.0.0.1:8000/api/modules/${id}`)
      .then(res => {
        alert(res.data.message);
        fetchModules();
      });
  };

  const fetchModules = () => {
    axios.get('http://127.0.0.1:8000/api/modules')
      .then(res => setModules(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2>Module Management</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Module Name" required />
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Module Description" required />
        <button type="submit">Add Module</button>
      </form>

      <h2>Existing Modules</h2>
      <ul>
        {modules.map(module => (
          <li key={module.id}>
            <strong>{module.name}</strong>: {module.description} 
            <button onClick={() => handleDeleteModule(module.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Delete
            </button>

            {/* 章节 */}
            <h3>Chapters</h3>
            <ul>
              {module.chapters?.map(chapter => (
                <li key={chapter.id}>
                  <strong>{chapter.title}</strong>: {chapter.description}

                  {/* 子章节 */}
                  <h4>Subchapters</h4>
                  <ul>
                    {chapter.subchapters?.map(sub => (
                      <li key={sub.id}>
                        {sub.title} - Pass: {sub.passing_score}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
            <h2>Feedback</h2>
      <button>View Feedback</button>
    </div>
  );
}

export default AdminPage;