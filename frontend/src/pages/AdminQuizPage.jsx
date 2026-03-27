import React from 'react';
import AdminQuiz from '../components/AdminQuiz.jsx';
import { Link, useParams } from "react-router-dom";


function AdminPage() {
   const {slug, chapter_id} = useParams();
  return (
    <main className="module-page-container">
      <div className='Quiz Management'>
                <div className="page-actions">
                <Link to={`/admin/${slug}/${chapter_id}`} className="back-link">
                    <button type="button" className="icon-button">
                        <img src="/images/back.svg" alt="Back" id="back-icon"/>
                        Back to SubChapter
                    </button>
                </Link>
                </div>
        <AdminQuiz/>
        </div>
    </main>
 
  );
}

export default AdminPage;