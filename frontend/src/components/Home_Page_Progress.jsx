import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

const HomePageProgress = () => {
    const [progress, setProgress] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const student_id = localStorage.getItem('student_id')
        if (!student_id) return
        axios.get(`/api/progress/${student_id}`)
            .then(res => setProgress(res.data))
            .catch(err => console.error('Error fetching progress:', err))
    }, []);

    if (progress.length === 0) return null

    return (
        <div className="cp-section">
            <h1 className="cp-heading">Continue progress</h1>

            <div className="cp-cards-row">
                {progress.map(progress => (
                    <div key={progress.course_slug} className="cp-card" onClick={() => navigate(`/modules/${progress.course_slug}`)}>
                        <div className="cp-image-wrap">
                            <img src='/images/course_background.jpg' alt='Course background' className="cp-image" />
                        </div>

                        <div className="cp-body">
                            <span className="cp-label">COURSE</span>
                            <span className="cp-title">{progress.course_title}</span>

                            {progress.progress_percentage > 0 && (
                                <div className="cp-progress-wrap">
                                    <span className="cp-progress-label">{progress.progress_percentage}%</span>
                                    <div className="cp-progress-bar">
                                    <div
                                        className="cp-progress-fill"
                                        style={{ width: `${progress.progress_percentage}%` }}
                                    />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePageProgress;