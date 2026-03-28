import React from 'react';
import AdminChapter from '../components/AdminChapter.jsx';
import { Link } from "react-router-dom";


function AdminPage() {
  return (
    <main className="main-layout">
       <div className='Module Management'>
      <div className="page-actions">
          <Link to="/admin" className="back-link">
              <button type="button" className="icon-button">
                  <img src="/images/back.svg" alt="Back" id="back-icon"/>
                  Back to Modules
              </button>
          </Link>
          </div>
          <AdminChapter/>
      </div>
      
    </main>
    

  );
}

export default AdminPage;