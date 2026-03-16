import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProgressCard() {
    const { chapter_id } = useParams();
    const studentId = 1;

    const [progress, setProgress] = useState({
        level: 0,
        completed: 0,
        total: 0,
        percentage: 0,
    });

    useEffect(() => {
        async function loadProgress() {
            try {
                const res = await axios.get(`/api/subchapter_progress/${studentId}/${chapter_id}`);
                setProgress(res.data);
            } catch (error) {
                console.error("Failed to fetch progress", error);
            }
        }

        if (chapter_id) {
            loadProgress();
        }
    }, [chapter_id]);

    return (
        <aside className="sidebar">
            <div className="card progress-card">
                <h1 className="progress-header">Progress of Level {progress.level}</h1>
                <p>
                    You have completed {progress.percentage}% of this level
                </p>
                <p>
                    {progress.completed} out of {progress.total} exercises completed
                </p>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress.percentage}%` }}
                    ></div>
                </div>
            </div>
        </aside>
    );
}

export default ProgressCard;