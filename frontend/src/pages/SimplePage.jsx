import React from "react";

function SimplePage({ title, description }) {
  return (
    <main className="main-layout">
      <section className="lesson-section">
        <div className="lesson-header">
          <div>
            <h1 className="lesson-title">{title}</h1>
          </div>
        </div>
        <div className="lesson-card">
          <p className="lesson-description">{description}</p>
        </div>
      </section>
    </main>
  );
}

export default SimplePage;

