import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProgressSummary() {
    const { slug } = useParams();
    const studentId = 1;

    const [progress, setProgress] = useState({
        completed: 0,
        total: 0,
        percentage: 0,
    });

    useEffect(() => {
        async function loadProgressSummary() {
            try {
                const res = await axios.get(`/api/progress-summary/${studentId}/${slug}`);
                setProgress(res.data);
            } catch (error) {
                console.error("Failed to fetch progress summary", error);
            }
        }

        if (slug) {
            loadProgressSummary();
        }
    }, [slug]);

    return (
        <aside className="sidebar">
            <div className="card progress-card">
                <h1 className="progress-header">Progress Summary</h1>
                <p>
                    You have completed {progress.completed} out of {progress.total} levels
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

export default ProgressSummary;