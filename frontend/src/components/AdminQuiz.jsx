import React from 'react';
import './Admin.css';
import { Link } from "react-router-dom";


{/*按了button 要去 chapter*/}
function AdminPanel() {
  return (
  <div className='adminmodule'>
  <h1>Subchapter Management</h1>
    <div className='Module Button'> 
    {/* <Link to={`/modules/${m.slug}`} className="module-link-wrapper">
    <button>Module 1</button>
    </Link> */}
    <ul>QUIZ 2</ul>
    <ul>QUIZ 3</ul>
    </div>
  </div>
  );
}

export default AdminPanel;