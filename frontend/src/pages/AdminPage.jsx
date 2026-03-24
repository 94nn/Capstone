import React, { useState, useEffect } from 'react';
import AdminModule from '../components/AdminModule.jsx';
import { Link } from "react-router-dom";


function AdminPage() {
  return (
    <main className="main-layout">
      <div className='Module Management'>
        <AdminModule/>
        </div>
    </main>
    

  );
}

export default AdminPage;