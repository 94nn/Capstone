import { useEffect, useState } from "react";
import './Admin.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";


function AdminSubChapter() {

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { slug, chapter_id } = useParams();
    const [subchapters, setSubchapters] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [subchapter_order, setsubchapter_order] = useState("");
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
    
        async function loadSubChapter() {
            try {
				const res = await axios.get(`/api/modules/${slug}/${chapter_id}`);
				setSubchapters(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log("Failed to load subchapter data", error);
                setSubchapters([]);
            }
        }
        if (chapter_id && slug) {
            loadSubChapter();
        }
    }, [chapter_id, slug]);
    const subchapter = subchapters[0];

    const handleSubmit = async () => {
    try {
        if (isEdit) {
            // UPDATE
             await axios.put(`/api/modules/${slug}/${chapter_id}/${currentId}`, {
                title: title,
                description: description,
                subchapter_order: subchapter_order,
            });

            // 更新 UI（替换那一笔）
            const updated = subchapters.map((s) =>
                s.id === currentId
                    ? { ...s, title: title, description: description}
                    : s
            );

            setSubchapters(updated);

            } else {
             const res = await axios.post(`/api/modules/${slug}/${chapter_id}`, {
                title: title,
                description: description,
                subchapter_order: subchapters.length + 1
            });
            // 更新 UI
                      
            setSubchapters([...subchapters, res.data]);
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
        await fetch(`/api/modules/${slug}/${chapter_id}/${id}`, {
            method: "DELETE",
        });

        // 删除后更新 UI（很重要）
        setSubchapters(subchapters.filter(s => s.id !== id));

    } catch (error) {
        console.error("Delete failed:", error);
    }
};

const closeModal = () => {
    setShowModal(false);
};

  return (
    <section>
        <br />
        <div className="lesson-header">
            <div>
                <h1 className="subchapter-management-header">SubChapter Management</h1>
                <h3 className="lesson-title">{subchapter?.chapter_title}</h3>
            </div>
        </div>
            <br />
            <button className="create-button" onClick={() => setShowModal(true)} >Create SubChapter</button>
            <br />
            <div className="lesson-card">
                {subchapters.length === 0 ? (
                    <div className="chapter-row">
                        <h1 className="chapter-row-header">No subchapters found</h1>
                    </div>
                ) : (
                    <div className="exercise-list">
                        <div className="exercise-row exercise-row-header">
                            <span>SubChapter</span>
                            <span>Title</span>
                            <span>Status</span>
                        </div>

                        {subchapters.map((s) => (
                            <div key={s.id} className="exercise-row">
                                <span className="exercise-label">
                                    Exercise {s?.subchapter_order}
                                </span>
                                <span className="exercise-title">{s?.title}</span>
                                <div className="button-row">
                                    <Link to={`/admin/${slug}/${chapter_id}/${s.id}`} >
									<button className="secondary-button">Enter</button>
								    </Link> &nbsp;
                                    
									<button className="edit-button" 
                                    onClick={(e) => {
                                        e.preventDefault(); // 防止 Link 跳页

                                        setIsEdit(true);
                                        setShowModal(true);

                                        setCurrentId(s.id);
                                        setTitle(s.title);
                                        setDescription(s.description);
                                        setsubchapter_order(s.subchapter_order); 
                                    }}>Edit</button>
								     &nbsp;
                                    
									<button className="delete-button"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(s.id);
                                    }}>Delete</button>
								    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Modal for user */}
                        {showModal && (
                        <div className="modal-overlay">
                            <div className="subchapter-box">
                                <div className="modal-box-header">
                                    <h2 className="edit-module">{isEdit ? "Edit SubChapter" : "Add SubChapter"}</h2> 
                                    <button className="close-button" onClick={closeModal}>X</button>
                                </div>
                                <input
                                    type="text"
                                    className="module-name"
                                    placeholder="SubChapter Name"
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
                                    placeholder="Subchapter order"
                                    value={subchapter_order}
                                    onChange={(e) => setsubchapter_order(e.target.value)}
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

export default AdminSubChapter;