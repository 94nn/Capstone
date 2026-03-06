import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ModuleLayout() {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        axios.get("/api/modules").then((res) => {
            setModules(Array.isArray(res.data) ? res.data : []);
        });
    }, []);

    return (
        <section className="module-section">
            <div className="module-header">
                <div>
                    <h1 className="module-title">Modules</h1>
                    <p className="module-description">
                        Explore our learning modules to master different math topics. Each module contains lessons and exercises to help you learn and practice effectively.
                    </p>
                </div>
            </div>

            <div className="module-grid">
                {modules.length === 0 ? (
                    <div className="module-card">
                        <div className="module-row">
                            <h1 className="module-row-header">No modules found</h1>
                            <p className="module-row-description">
                                Your table returned an empty list.
                            </p>
                        </div>
                    </div>
                ) : (
                    modules.map((m) => (
                        <Link to={`/modules/${m.slug}`} className="module-link-wrapper">
                            <div className="module-card">
                                <div className="module-row">
                                    <h1 className="module-row-header">{m.title}</h1>
                                    <p className="module-row-description">{m.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}

export default ModuleLayout;