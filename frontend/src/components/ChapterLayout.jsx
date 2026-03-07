import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function ChapterLayout() {
    const { slug } = useParams();
    const [chapters, setChapters] = useState([]);
	const chapter = chapters[0];

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

    return (
        <section className="lesson-section">
            <div className="lesson-header">
                <div>
                    <h1 className="lesson-title">{chapter?.module_name}</h1>
                </div>
            </div>

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
								<Link to={`/modules/${slug}/${c.id}`} className="start-link">
									<button className="secondary-button">Go</button>
								</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ChapterLayout;