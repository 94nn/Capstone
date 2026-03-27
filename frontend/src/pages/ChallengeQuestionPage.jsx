import ChallengeQuestionLayout from "../components/ChallengeQuestionLayout";
import { Link, useParams } from "react-router-dom";


function ChallengeQuestionPage() {
    const { slug } = useParams();

    return (
        <main className="main-layout-full">
            <div className="chapter-column">
                <ChallengeQuestionLayout />
            </div>
        </main>
    );
}

export default ChallengeQuestionPage;