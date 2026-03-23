import { useEffect, useState } from "react";
import './Admin.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";



{/*按了button 要去 chapter*/}
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
            const res = await axios.put(`/api/modules/${slug}/${chapter_id}`, {
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
    
  return (
    <section>
      <div className="lesson-header">
                <div className="step-indicator">{subchapter?.chapter_level}</div>
                <div>
                  <h1>SubChapter Management</h1>
                    <h3 className="lesson-title">{subchapter?.chapter_title}</h3>
                </div>
            </div>
            <br /> <br />
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
                                    <Link to={`/modules/${slug}/${chapter_id}/${s.id}`} >
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
                                        setsubchapter_order(s.level); 
                                    }}>Edit</button>
								     &nbsp;
                                    <Link to={`/modules/${slug}/${chapter_id}/${s.id}`} className="link">
									<button className="delete-button">Delete</button>
								    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Modal for user */}
                        {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-box">
                                <h2>{isEdit ? "Edit SubChapter" : "Add SubChapter"}</h2> 

                                <input
                                    type="text"
                                    placeholder="SubChapter Name"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                 {isEdit && (
                                <input
                                    type="number"
                                    placeholder="Subchapter order"
                                    value={subchapter_order}
                                    onChange={(e) => setsubchapter_order(e.target.value)}
                                />
                                )} 
                                <br /><br />

                                <button onClick={handleSubmit}>Submit</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                        )}
            </div>

  </section>
  );
}

export default AdminSubChapter;