import { Routes, Route } from "react-router-dom";

import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import SimplePage from "../pages/SimplePage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import EditProfilePage from "../pages/EditProfilePage";
import QuizPage from "../pages/QuizPage";

function AppRoutes() {
	return (
		<Routes>

			<Route path="/" element={<HomePage />} />

			<Route path="/register" element={<RegisterPage />} />

			<Route path="/modules" element={<ModulePage />} />

			<Route path="/modules/:slug" element={<ChapterPage />} />

			<Route path="/modules/:slug/:chapter_id" element={<SubChapterPage />} />

			<Route path="/modules/:slug/:chapter_id/:subchapter_id" element={<QuizPage />} />

			<Route 
				path="/challenge"
				element={<SimplePage title="Challenge" description="Challenge" />}
			/>

			<Route 
				path="/leaderboard"
				element={<SimplePage title="Leaderboard" description="Leaderboard" />}
			/>

			<Route 
				path="/ProfilePage"
				element={<ProfilePage />}
			/>

			<Route 
				path="/SettingsPage"
				element={<SettingsPage />}
			/>

			<Route 
				path="/EditProfilePage"
				element={<EditProfilePage />}
			/>

		</Routes>
	);
}

export default AppRoutes;