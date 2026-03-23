import { useState } from "react";
import QuizLayout from "../components/QuizLayout";
import Hint from "../components/hint";
import { Link, useParams } from "react-router-dom";

function QuizPage() {
    const { slug, chapter_id } = useParams();
    const [currentQuizId, setCurrentQuizId] = useState(null);

    return (
        <main className="main-layout">
            <div className="chapter-column">
                <div className="page-actions">
                    <Link to={`/modules/${slug}/${chapter_id}`} className="back-link">
                        <button type="button" className="icon-button">
                            <img src="/images/back.svg" alt="Back" id="back-icon" />
                            Back to SubChapters
                        </button>
                    </Link>
                </div>
                <QuizLayout setCurrentQuizId={setCurrentQuizId} />
            </div>
            <aside className="learning-sidebar">
                <Hint quiz_id={currentQuizId} />
            </aside>
        </main>
    );
}

export default QuizPage;