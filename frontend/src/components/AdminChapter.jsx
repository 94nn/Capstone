import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Admin.css';
import { Link } from "react-router-dom";



{/*按了button 要去 chapter*/}
function AdminChapter() {
    const { slug } = useParams();
    const [chapters, setChapters] = useState([]);
	const chapter = chapters[0];
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
				const res = await axios.get(`/api/modules/${slug}`);
				setChapters(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log("Failed to load data", error);
                setChapters([]);
            }
        }

        if (slug) loadData();
        }, [slug]);

// model connect backend
const handleSubmit = async () => {
    try {
        if (isEdit) {
            const lvl = parseInt(level);
            if (isNaN(lvl)) {
                alert("Level must be a number");
                return;
            }

            if (!Number.isInteger(lvl)) {
                alert("Level must be an integer");
                return;
            }

            if (lvl < 1 || lvl > 10) {
                alert("Level must be between 1 and 10");
                return;
            }
        
            // UPDATE
            const res = await axios.put(`/api/modules/${slug}/${currentId}`, {
                title: title,
                description: description,
                level: level
            });

            // 更新 UI（替换那一笔）
            const updated = chapters.map((c) =>
                c.id === currentId
                    ? { ...c, title: title, description: description}
                    : c
            );

            setChapters(updated);

            } else {
            const res = await axios.post(`/api/modules/${slug}`, {
                title: title,
                description: description
            });
            // 更新 UI
            setChapters([...chapters, res.data]);
            }
            // reset
            setShowModal(false);
            setIsEdit(false);
            setTitle("");
            setDescription("");

        } catch (err) {
            console.error(err);
        }
    };

        //delete function
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (!confirmDelete) return;

    try {
        await fetch(`http://127.0.0.1:8000/api/modules/${slug}/${id}`, {
            method: "DELETE",
        });

        // 删除后更新 UI（很重要）
        setChapters(chapters.filter(c => c.id !== id));

    } catch (error) {
        console.error("Delete failed:", error);
    }
};

const closeModal = () => {
    setShowModal(false);
};

  return (
      <section className="lesson-section"> &nbsp;
            <div className="lesson-header">
                <div>
                    <h1 className="chapter-management-header">Chapter Management</h1>
                    <h2 className="lesson-title">{chapter?.module_name}</h2>
                </div>
            </div>
            <button className="create-button" onClick={() => setShowModal(true)}>Create Chapter</button>
            <div className="lesson-card">
                {chapters.length === 0 ? (
                    <div className="chapter-row">
                        <h1 className="chapter-row-header">No chapters found</h1>
                    </div>
                ) : (
                    <div className="exercise-list">
                        <div className="exercise-row exercise-row-header">
                            <span>Level</span>
                            <span>Title</span>
                            <span>Status</span>
                        </div>

                        {chapters.map((c) => (
                            <div key={c.id} className="exercise-row">
                                <span className="exercise-label">
                                    Level {c.level}
                                </span>
                                <span className="exercise-title">{c.title}</span>
                                <div className="button-row">
                                    <Link to={`/admin/${slug}/${c.id}`} >
									<button className="secondary-button">Enter</button>
								    </Link> &nbsp;

									<button className="edit-button"
                                        onClick={(e) => {
                                        e.preventDefault(); // 防止 Link 跳页

                                        setIsEdit(true);
                                        setShowModal(true);

                                        setCurrentId(c.id);
                                        setTitle(c.title);
                                        setDescription(c.description);
                                        setLevel(c.level); 
                                    }}
                                    >Edit</button>
								     &nbsp;
                                  
									<button className="delete-button"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(c.id);
                                    }}
                                    >Delete</button>
								   
                                </div>
								
								
                            </div>
                        ))}
                    </div>
                )}
                        {/* Modal for user */}
                        {showModal && (
                        <div className="modal-overlay">
                            <div className="chapter-box">
                                <div className="modal-box-header">
                                    <h2 className="edit-module">{isEdit ? "Edit Chapter" : "Add Chapter"}</h2>
                                    <button className="close-button" onClick={closeModal}>X</button>
                                </div>
                                <input
                                    type="text"
                                    className="module-name"
                                    placeholder="Chapter Name"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <textarea
                                    className="description"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    style={{ width: "90%", resize: "vertical" }} // fills width, allows vertical resize
                                 />

                                {isEdit && (
                                    <input
                                        type="number"
                                        className="module-name"
                                        placeholder="Level"
                                        value={level}
                                        min="1"
                                        max="10"   
                                        step="1"
                                        onChange={(e) => setLevel(e.target.value)}
                                    />
                                )}
                                <div className="modal-box-bottom">
                                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                                    <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                                
                            </div>
                        </div>
                        )}
            </div>
   </section>
  );
}


export default AdminChapter;