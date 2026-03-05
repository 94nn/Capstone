import ChapterLayout from "../components/ChapterLayout";
import SidebarProfile from "../components/SidebarProfile";
import { useParams } from "react-router-dom";

// const { moduleId } = useParams();

function ChapterPage() {
    return (
        <main className="main-layout main-layout-split">
            <ChapterLayout />
            <SidebarProfile />
        </main>
    );
}

export default ChapterPage;