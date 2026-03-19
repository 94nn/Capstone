import { Routes, Route } from "react-router-dom";

import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import SimplePage from "../pages/SimplePage";
import RegisterPage from "../pages/RegisterPage";
import QuizPage from "../pages/QuizPage";
import AboutUsPage from "../pages/AboutUsPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";

function BeforeLoginRoutes() {
	return (
		<Routes>

			<Route path="/" element={<LandingPage />} />

			<Route path="/register" element={<RegisterPage />} />

			<Route path="/login" element={<LoginPage />} />

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

			<Route path="/aboutus" element={<AboutUsPage />} />

		</Routes>
	);
}

export default BeforeLoginRoutes;