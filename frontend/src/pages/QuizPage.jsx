import QuizLayout from "../components/QuizLayout";
import { Link, useParams } from "react-router-dom";

function QuizPage() {
    const { slug, chapter_id } = useParams();

    return (
        <main className="main-layout-full">
            <div className="chapter-column">
                <div className="page-actions">
                    <Link to={`/modules/${slug}/${chapter_id}`} className="back-link">
                        <button type="button" className="icon-button">
                            <img src="/images/back.svg" alt="Back" id="back-icon" />
                            Back to SubChapters
                        </button>
                    </Link>
                </div>
                <QuizLayout />
            </div>
        </main>
    );
}

export default QuizPage;