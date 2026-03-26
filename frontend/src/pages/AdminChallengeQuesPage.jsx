import React, { useState, useEffect } from 'react';
import AdminChallengeQues from '../components/AdminChallengeQues.jsx';
import { Link } from "react-router-dom";


function AdminChallengeQuesPage() {
  return (
    <main className="main-layout">
       <div className='Module Management'>
      <div className="page-actions">
          <Link to="/admin/challenge" className="back-link">
              <button type="button" className="icon-button">
                  <img src="/images/back.svg" alt="Back" id="back-icon"/>
                  Back to challenges
              </button>
          </Link>
          </div>
          <AdminChallengeQues/>
      </div>
      
    </main>
    

  );
}

export default AdminChallengeQuesPage;