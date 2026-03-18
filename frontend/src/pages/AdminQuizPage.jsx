import React, { useState, useEffect } from 'react';
import AdminQuiz from '../components/AdminQuiz.jsx';
import { Link } from "react-router-dom";


function AdminPage() {
  return (
    <main className="main-layout">
      <div className='Quiz Management'>
        <AdminQuiz/>
        </div>
    </main>
 
  );
}

export default AdminPage;