import { Routes, Route, Navigate } from "react-router-dom";

import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import SimplePage from "../pages/SimplePage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import EditProfilePage from "../pages/EditProfilePage";
import QuizPage from "../pages/QuizPage";
import ChallengePage from "../pages/ChallengePage";
import ChallengeQuestionPage from "../pages/ChallengeQuestionPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import AboutUsPage from "../pages/AboutUsPage";

function AppRoutes() {
	return (
		<Routes>

			<Route path="/homepage" element={<HomePage />} />

			<Route path="/modules" element={<ModulePage />} />

			<Route path="/modules/:slug" element={<ChapterPage />} />

			<Route path="/modules/:slug/:chapter_id" element={<SubChapterPage />} />

			<Route path="/modules/:slug/:chapter_id/:subchapter_id" element={<QuizPage />} />

			<Route path="/challenge/module/:module_id" element={<ChallengePage />} />

			<Route path="/challenge/:slug" element={<ChallengeQuestionPage />} />

			<Route path="/leaderboard" element={<LeaderboardPage />}/>

			<Route path="/ProfilePage" element={<ProfilePage />}/>

			<Route path="/SettingsPage" element={<SettingsPage />}/>

			<Route 
				path="/EditProfilePage"
				element={<EditProfilePage />}
			/>

			<Route path="*" element={<Navigate to="/" replace />} />
			
			<Route path="/aboutus" element={<AboutUsPage />} />

		</Routes>
	);
}

export default AppRoutes;