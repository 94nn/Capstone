import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  // Edit feedback
  const handleEdit = (fb) => {
    setEditingId(fb.id);
    setMessage(fb.feedback);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 className="feedback-header">{editingId ? "Edit Feedback" : "Add Feedback"}</h2>
      <br />
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div className="info">
          {!editingId && (
          <>
            <input
              type="number"
              className="feedback-studentid"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <input
              type="number"
              className="feedback-moduleid"
              placeholder="Module ID"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              required
            />
          </>
        )}
        </div>
        <br />
        <textarea
          placeholder="Feedback"
          className="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br />
        <div className="button-row">
          <button className="submit-feedback-button" type="submit">
            {editingId ? "Update" : "Submit"}
          </button>
        </div>
        
      </form>
      <h2 className="feedback-list-header">Feedback List</h2>
      <br />
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Module ID</th>
            <th>Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.id}>
              <td>{fb.id}</td>
              <td>{fb.student_id}</td>
              <td>{fb.module_id}</td>
              <td>{fb.feedback}</td>
              <td>
                <button onClick={() => handleEdit(fb)}>Edit</button>
                <button onClick={() => handleDelete(fb.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackManager;