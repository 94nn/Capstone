import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function SubChapterLayout() {
    const { slug, chapter_id } = useParams();
    const [subchapters, setSubchapters] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [selectedSubchapter, setSelectedSubchapter] = useState(null);
    const student_id = localStorage.getItem("student_id");

    useEffect(() => {
        async function loadSubChapter() {
            try {
                const { data } = await axios.get(`/api/modules/${slug}/${chapter_id}`);
                const subchapterList = Array.isArray(data) ? data : [];
                const subchaptersStatus = await Promise.all(
                    subchapterList.map(async (s) => {
                        try {
                            const { data: progressData } = await axios.get(`/api/subchapter_progress/${student_id}/${chapter_id}/${s.id}`);
                            return { 
                                ...s,
                                status: progressData.status 
                            };
                        } catch {
                            return { 
                                ...s, 
                                status: null 
                            };
                        }
                    })
                );
                setSubchapters(subchaptersStatus);
            } catch (error) {
                console.log("Failed to load subchapter data", error);
                setSubchapters([]);
            }
        }
        if (chapter_id && slug) {
            loadSubChapter();
        }
    }, [chapter_id, slug, student_id]);

    function handleOpenPopup(subchapter) {
        setSelectedSubchapter(subchapter);
        setCompleted(true);
    }

    function handleClosePopup() {
        setCompleted(false);
    }

    const subchapter_header = subchapters[0];
    
    return (
        <section className="lesson-section">
            <div className="lesson-header">
                <div className="step-indicator">{subchapter_header?.chapter_level}</div>
                <div>
                    <h1 className="lesson-title">{subchapter_header?.chapter_title}</h1>
                </div>
            </div>

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
                                {s.status === "completed" ? (
                                    <>
                                        <button className="next-button" onClick={() => handleOpenPopup(s)}>
                                            Completed
                                        </button>
                                    </>
                                ) : (
                                    <Link to={`/modules/${slug}/${chapter_id}/${s.id}`} className="start-link">
                                        <button className="secondary-button">Start</button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {completed && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                        <h2>You have completed this subchapter!</h2>
                        <p>Do you want to retry it?</p>

                        <div className="popup-buttons">
                            <Link to={`/modules/${slug}/${chapter_id}/${selectedSubchapter?.id}`}>
                                <button className="retry-button">Retry</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default SubChapterLayout;