import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [studentFilter, setStudentFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredFeedbacks = feedbacks.filter((fb) =>
  fb.student_name.toLowerCase().includes(studentFilter.toLowerCase()) &&
  fb.module_name.toLowerCase().includes(moduleFilter.toLowerCase())
);
  // Fetch all feedback
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/api/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch feedback data");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Create or update feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update feedback
        await axios.put(`/api/feedback/${editingId}`, { feedback: message });
        setEditingId(null);
      } else {
        // Create new feedback
        await axios.post("/api/feedback", {
          student_id: studentId,
          module_id: moduleId,
          feedback: message,
        });
      }
      setStudentId("");
      setModuleId("");
      setMessage("");
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  // Delete feedback
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    
    <div style={{ padding: 20 }}>
      {/* <div className="Add Feedback button">
      <button onClick={() => setShowModal(true)}>
        Add Feedback
      </button>
      </div> */}
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">

      <h2 className="feedback-header">
        {editingId ? "Edit Feedback" : "Add Feedback"}
      </h2>

      <form onSubmit={(e) => {
        handleSubmit(e);
        setShowModal(false);
      }}>

        <div className="info">
          {!editingId && (
            <>
              <input
                type="number"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Module ID"
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                required
              />
            </>
          )}
        </div>

        <textarea
          placeholder="Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <div className="button-row">
          <button type="submit">
            {editingId ? "Update" : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      <div className="filter-container" style={{ marginBottom: 10 }}>
        <input
            type="text"
            className="filter-student"
            placeholder="Filter by Student Name"
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            style={{ marginRight: 10 }}
        />
        <input
            type="text"
            className="filter-module"
            placeholder="Filter by Module Name"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
        />
        </div>
        <br />
      <h2 className="feedback-list-header">Feedback List</h2>
      <table className="feedback-table" border="1" cellPadding="5">
        <thead>
          <tr>
            <th>No.</th>
            <th>Student</th>
            <th>Module</th>
            <th>Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.map((fb, index) => (
            <tr key={fb.id}>
              <td>{index + 1}</td>
              <td>{fb.student_name}</td>
              <td>{fb.module_name}</td>
              <td>{fb.feedback}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(fb.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackManager;