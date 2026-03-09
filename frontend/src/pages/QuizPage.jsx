import QuizLayout from "../components/QuizLayout";
import SidebarProfile from "../components/SidebarProfile";
import ProgressCard from "../components/ProgressCard";
import { Link, useParams } from "react-router-dom";

function QuizPage() {
    const { slug } = useParams();
    const {subchapter_id} = useParams();

    return (
        <main className="main-layout">
            <div className="chapter-column">
                <div className="page-actions">
                    <Link to={`/modules/${slug}/${subchapter_id}/`} className="back-link">
                        <button type="button" className="icon-button">
                            <img src="/images/back.svg" alt="Back" id="back-icon" />
                            Back to SubChapters
                        </button>
                    </Link>
                </div>
                <QuizLayout />
            </div>
            <aside className="sidebar">
                <SidebarProfile />
                <ProgressCard />
            </aside>
        </main>
    );
}

export default QuizPage;