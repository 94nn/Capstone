import ChapterLayout from "../components/ChapterLayout";
import SidebarProfile from "../components/SidebarProfile";
import { Link } from "react-router-dom";

function ChapterPage() {
    return (
        <main className="main-layout main-layout-split">
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
            <SidebarProfile />
        </main>
    );
}

export default ChapterPage;