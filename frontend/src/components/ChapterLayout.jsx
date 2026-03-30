import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";

function ChapterLayout() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isBeforeLogin = location.pathname.includes("b4login");
    const isLoggedIn = !!localStorage.getItem("student_id");
    const student_id = localStorage.getItem("student_id");

    const [chapters, setChapters] = useState([]);
    const [chapterProgress, setChapterProgress] = useState({});

    const [completed, setCompleted] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);

    const chapter = chapters[0];

    useEffect(() => {
        if (!isLoggedIn || isBeforeLogin) {
            navigate("/login");
            return;
        }

        async function loadData() {
            try {
                const res = await axios.get(`/api/modules/${slug}`);
                const chapterList = Array.isArray(res.data) ? res.data : [];
                setChapters(chapterList);

                const progressMap = {};

                await Promise.all(
                    chapterList.map(async (c) => {
                        try {
                            const progressRes = await axios.get(
                                `/api/subchapter_progress/${student_id}/${c.id}`
                            );
                            progressMap[c.id] = progressRes.data;
                        } catch {
                            progressMap[c.id] = {
                                completed: 0,
                                total: 0,
                                percentage: 0,
                            };
                        }
                    })
                );

                setChapterProgress(progressMap);
            } catch (error) {
                console.log("Failed to load data", error);
                setChapters([]);
            }
        }

        if (slug) loadData();
    }, [slug, isLoggedIn, isBeforeLogin, navigate, student_id]);

    function isChapterCompleted(chapterId) {
        const progress = chapterProgress[chapterId];
        return progress && progress.total > 0 && progress.completed === progress.total;
    }

    function handleOpenPopup(chapter) {
        setSelectedChapter(chapter);
        setCompleted(true);
    }

    function handleClosePopup() {
        setCompleted(false);
    }

    return (
        <section className="lesson-section">
            <div className="lesson-header">
                <h1 className="lesson-title">{chapter?.module_name}</h1>
            </div>

            <div className="lesson-card">
                {chapters.length === 0 ? (
                    <h1>No chapters found</h1>
                ) : (
                    <div className="exercise-list">
                        <div className="exercise-row exercise-row-header">
                            <span>Level</span>
                            <span>Title</span>
                            <span>Status</span>
                        </div>

                        {chapters.map((c) => (
                            <div key={c.id} className="exercise-row">
                                <span>Level {c.level}</span>
                                <span>{c.title}</span>

                                {isChapterCompleted(c.id) ? (
                                    <button className="next-button"
                                        onClick={() => handleOpenPopup(c)}
                                    >
                                        Completed
                                    </button>
                                ) : (
                                    <Link to={`/modules/${slug}/${c.id}`}>
                                        <button className="secondary-button">Go</button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {completed && selectedChapter && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                        <h2>You have completed this chapter!</h2>
                        <p>Do you want to retry it?</p>
                        <div className="popup-buttons">
                            <Link to={`/modules/${slug}/${selectedChapter.id}`}>
                                <button className="retry-button">Retry</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ChapterLayout;