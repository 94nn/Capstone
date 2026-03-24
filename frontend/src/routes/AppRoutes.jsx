import { Routes, Route, Navigate } from "react-router-dom";
import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import SimplePage from "../pages/SimplePage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import QuizPage from "../pages/QuizPage";
import ChallengePage from "../pages/ChallengePage";
import ChallengeQuestionPage from "../pages/ChallengeQuestionPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import AboutUsPage from "../pages/AboutUsPage";
import AdminPage from "../pages/AdminPage";
import AdminChapterPage from "../pages/AdminChapterPage";
import AdminSubChapterPage from "../pages/AdminSubChapterPage";
import AdminQuizPage from "../pages/AdminQuizPage";
import FeedbackPage from "../pages/FeedbackPage";
import AdminChallengePage from "../pages/AdminChallengePage";

function AppRoutes() {
	return (
		<Routes>

			<Route path="/homepage" element={<HomePage />} />

			<Route path="/modules" element={<ModulePage />} />

			<Route path="/modules/:slug" element={<ChapterPage />} />

            <Route path="/student/:id" element={<ProfilePage />} />

			<Route path="/modules/:slug/:chapter_id" element={<SubChapterPage />} />

			<Route path="/modules/:slug/:chapter_id/:subchapter_id" element={<QuizPage />} />

			<Route path="/challenge/module/:module_id" element={<ChallengePage />} />

			<Route path="/challenge/:slug" element={<ChallengeQuestionPage />} />

			<Route path="/leaderboard" element={<LeaderboardPage />}/>

			<Route path="/EditProfilePage" element={<EditProfilePage />} />

            <Route path="/leaderboard" element={<SimplePage title="Leaderboard" description="Leaderboard" />}/>

            <Route path="/aboutus" element={<AboutUsPage />} />

            <Route path="/profilepage" element={<ProfilePage />} />

            <Route
                path="/admin"
                element={<AdminPage title="Admin" description="Admin Panel" />}
            />
            <Route path="/admin/:slug" element={<AdminChapterPage />} />
            <Route path="/admin/:slug/:chapter_id" element={<AdminSubChapterPage />} />
            <Route path="/admin/:slug/:chapter_id/:subchapter_id" element={<AdminQuizPage />} />

            <Route path="/feedback" element={<FeedbackPage />} />
			
            <Route path="/challenge" element={<AdminChallengePage />} />

            <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Routes>
    );
}

export default AppRoutes;