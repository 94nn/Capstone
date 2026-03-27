import React from 'react';
import AdminSubChapter from '../components/AdminSubChapter.jsx';
import { Link, useParams } from "react-router-dom";


function AdminPage() {
  const {slug} = useParams();
  return (
    <main className="main-layout">
      <div className='Sub chapter Management'>
        <div className="page-actions">
        <Link to={`/admin/${slug}`} className="back-link">
            <button type="button" className="icon-button">
                <img src="/images/back.svg" alt="Back" id="back-icon"/>
                Back to Chapter
            </button>
        </Link>
        </div>
        <AdminSubChapter/>
        </div>
    </main>
    

  );
}

export default AdminPage;