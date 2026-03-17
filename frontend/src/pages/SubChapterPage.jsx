import SubChapterLayout from "../components/SubChapterLayout";
import SidebarProfile from "../components/SidebarProfile";
import ProgressCard from "../components/ProgressCard";
import { Link, useParams } from "react-router-dom";

function SubChapterPage() {
    const { slug } = useParams();

    return (
        <main className="main-layout">
            <div className="chapter-column">
                <div className="page-actions">
                    <Link to={`/modules/${slug}`} className="back-link">
                        <button type="button" className="icon-button">
                            <img src="/images/back.svg" alt="Back" id="back-icon" />
                            Back to Levels
                        </button>
                    </Link>
                </div>
                <SubChapterLayout />
            </div>
            <aside className="sidebar">
                <SidebarProfile />
                <ProgressCard />
            </aside>
        </main>
    );
}

export default SubChapterPage;