import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function SubChapterLayout() {
    const { slug } = useParams();
    const { chapter_id } = useParams();
    const [subchapters, setSubchapters] = useState([]);

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

    return (
        <section className="lesson-section">
            <div className="lesson-header">
                <div className="step-indicator">{subchapter?.chapter_level}</div>
                <div>
                    <h1 className="lesson-title">{subchapter?.chapter_title}</h1>
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
                                <Link to={`/modules/${slug}/${chapter_id}/${s.id}`} className="start-link">
									<button className="secondary-button">Start</button>
								</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* <div className="next-chapter">
                <span className="next-chapter-header">Next Chapter</span>
                <div className="next-chapter-preview">
                    <span className="next-chapter-step-indicator">
                        {nextChapter?.chapter_order || ""}
                    </span>
                    <span className="next-chapter-title">
                        {nextChapter?.title || "No next chapter"}
                    </span>
                </div>
                <button className="next-chapter-button">Next Chapter</button>
            </div> */}
        </section>
    );
}

export default SubChapterLayout;