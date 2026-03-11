import ChallengeQuestionLayout from "../components/ChallengeQuestionLayout";
import { Link, useParams } from "react-router-dom";

function ChallengeQuestionPage() {
    const { slug } = useParams();

    return (
        <main className="main-layout">
            <div className="chapter-column">
                <div className="page-actions">
                    <Link to={`/challenges`} className="back-link">
                        <button type="button" className="icon-button">
                            <img src="/images/back.svg" alt="Back" id="back-icon" />
                            Back to Challenge
                        </button>
                    </Link>
                </div>
                <ChallengeLayout />
            </div>
        </main>
    );
}

export default ChallengeQuestionPage;