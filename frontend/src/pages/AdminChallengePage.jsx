import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import AdminChallenge from '../components/AdminChallenge.jsx';

function AdminPage() {
  return (
    <main className="main-layout">
      <div className='Challenge'>
        <AdminChallenge/>
        </div>
    </main>
    

  );
}


export default AdminPage;