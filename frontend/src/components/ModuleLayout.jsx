import { Link } from "react-router-dom";

function ModuleLayout() {
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
                <Link to="/module/1" className="module-link-wrapper">
                    <div className="module-card">
                        <div className="module-row">
                            <h1 className="module-row-header">Calculus</h1>
                            <p className="module-row-description">
                                Learn the fundamentals of differential and integral calculus.
                            </p>
                        </div>
                    </div>
                </Link>

                <Link to="/module/2" className="module-link-wrapper">
                    <div className="module-card">
                        <div className="module-row">
                            <h1 className="module-row-header">Algebra</h1>
                            <p className="module-row-description">
                                Learn the fundamentals of algebraic concepts and equations.
                            </p>
                        </div>
                    </div>
                </Link>

                <Link to="/module/3" className="module-link-wrapper">
                    <div className="module-card">
                        <div className="module-row">
                            <h1 className="module-row-header">Geometry</h1>
                            <p className="module-row-description">
                                Learn the fundamentals of geometric principles and shapes.
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}

export default ModuleLayout;