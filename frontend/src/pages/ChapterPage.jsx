import ChapterLayout from "../components/ChapterLayout";
import SidebarProfile from "../components/SidebarProfile";
import ProgressSummary from "../components/ProgressSummary";
import { Link } from "react-router-dom";

function ChapterPage() {
    return (
        <main className="main-layout">
            <div className="chapter-column">
                <div className="page-actions">
                    <Link to="/modules" className="back-link">
                        <button type="button" className="icon-button">
                            <img src="/images/back.svg" alt="Back" id="back-icon"/>
                            Back to Modules
                        </button>
                    </Link>
                </div>
                <ChapterLayout />
            </div>
            <aside className="learning-sidebar">
                <SidebarProfile />
                <ProgressSummary />
            </aside>
        </main>
    );
}

export default ChapterPage;