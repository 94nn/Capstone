import { Link } from "react-router-dom";
import {  useEffect, useState } from "react";
import axios from "axios";
import { NavLink,useParams } from 'react-router-dom'
import "./ChallengeLayout.css";

function ChallengeLayout() {
    const [challenge, setChallenge] = useState([]);
    const [modules, setModules] = useState([]);
    const [chapters, setChapters] = useState([]);
    const { module_id } = useParams();

    useEffect(() => {
    async function loadModules() {
        try {
            const res = await axios.get("/api/modules"); // 你需要在后端建这个 API
            setModules(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load modules", err);
            setModules([]);
        }
    }
    loadModules();
}, []); // 空依赖数组，只执行一次

    useEffect(() => {    
        async function loadChallenge() {
            try {
            const url = module_id
                ? `/api/challenge/module/${module_id}`
                : `/api/challenge`;
            const res = await axios.get(url);
            setChallenge(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log("Failed to load challenge data", error);
                setChallenge([]);
            }
        }

        loadChallenge();
    }, [module_id]);

    return (
        <section className="module-section">
            <div className="module-header">
                <div>
                    <h1 className="module-title">Challenge</h1>
                    <p className="module-description">
                        Explore our learning challenges to master different math topics. Each challenge contains lessons and exercises to help you learn and practice effectively.
                    </p>
                </div>
            </div>

            <div className="challenge-nav-bar">
                <nav className="challenge-nav-bar-items">
                    <NavLink
                        to="/challenge"
                        end
                        className={({ isActive }) =>
                            `challenge-nav-item ${isActive ? "challenge-nav-item-active" : ""}`
                        }
                    >
                        All
                    </NavLink>
                    {modules.map((module) => (
                        <NavLink
                            to={`/challenge/module/${module.id}`}
                            key={module.id}
                            className={({ isActive }) =>
                                `challenge-nav-item ${isActive ? "challenge-nav-item-active" : ""}`
                            }
                        >                       
                            {module.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <br />
            <br />
            <div className="module-grid">
                {challenge.length === 0 ? (
                    <div className="module-card">
                        <div className="module-row">
                            <h1 className="module-row-header">No challenge found</h1>
                            <p className="module-row-description">
                                Your table returned an empty list.
                            </p>
                        </div>
                    </div>
                ) : (
                    challenge.map((c) => (
                        <Link to={`/challenge/${c.slug}`} key={c.id} className="module-link-wrapper">
                            <div className="module-card">
                                <div className="module-row">
                                    <h1 className="module-row-header">{c.module_name}</h1>
                                    <p className="module-row-description">{c.chapter_title}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}

export default ChallengeLayout;