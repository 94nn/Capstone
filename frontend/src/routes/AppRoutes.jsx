import { Routes, Route, Navigate } from "react-router-dom";
import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
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
import AdminChallengeQuesPage from "../pages/AdminChallengeQuesPage";
import AdminProfilePage from "../pages/AdminProfilePage";
import AnalyticsPage from "../pages/AnalyticsPage";
import AdminAnalyticsPage from "../pages/AdminAnalyticsPage";
import StudentAnalytics from "../components/StudentAnalytics";

function AppRoutes() {
	return (
		<Routes>

			<Route path="/homepage" element={<HomePage />} />

			<Route path="/modules" element={<ModulePage />} />

			<Route path="/modules/:slug" element={<ChapterPage />} />

            <Route path="/student/:id" element={<ProfilePage />} />

            <Route path="/student/:id/edit" element={<EditProfilePage />} />

			<Route path="/modules/:slug/:chapter_id" element={<SubChapterPage />} />

			<Route path="/modules/:slug/:chapter_id/:subchapter_id" element={<QuizPage />} />

			<Route path="/challenge" element={<ChallengePage />} />

			<Route path="/challenge/:slug" element={<ChallengeQuestionPage />} />

			<Route path="/leaderboard" element={<LeaderboardPage />}/>

            <Route path="/analytics" element={<StudentAnalytics />} />

			<Route path="/EditProfilePage" element={<EditProfilePage />} />

            <Route path="/aboutus" element={<AboutUsPage />} />

            <Route
                path="/admin"
                element={<AdminPage title="Admin" description="Admin Panel" />}
            />
            <Route path="/admin/:slug" element={<AdminChapterPage />} />
            <Route path="/admin/:slug/:chapter_id" element={<AdminSubChapterPage />} />
            <Route path="/admin/:slug/:chapter_id/:subchapter_id" element={<AdminQuizPage />} />

            <Route path="/analytics" element={<AnalyticsPage />} />

            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

            <Route path="/feedback" element={<FeedbackPage />} />

            <Route path="/admin/profile" element={<AdminProfilePage />} />
			
            <Route path="/admin/challenge" element={<AdminChallengePage />} />
            <Route path="/admin/challenge/:id" element={<AdminChallengeQuesPage />} />

            <Route path="/admin/challenge/:challenge_id" element={<AdminChallengePage />} />

            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

            <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Routes>
    );
}

export default AppRoutes;