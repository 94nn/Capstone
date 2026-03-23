import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EditModule() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // 页面加载时获取现有模块信息
  useEffect(() => {
    axios.get(`api/modules/${id}`)
      .then(res => {
        setName(res.data.name);
        setDescription(res.data.description);
      });
  }, [id]); 

  const handleUpdate = () => {
    axios.put(`api/modules/${id}`, {
      name,
      description
    })
    .then(res => alert('Module updated!'))
    .catch(err => alert('Failed to update module'));
  };

  return (
    <div>
      <h1>Edit Module</h1>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={handleUpdate}>Save</button>
    </div>
  );
}

export default EditModule;