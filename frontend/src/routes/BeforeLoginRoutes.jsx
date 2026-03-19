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

			<Route path="/modules/b4login" element={<ModulePage />} />

			<Route path="/modules/b4login/:slug" element={<ChapterPage />} />

			<Route path="/modules/b4login/:slug/:chapter_id" element={<SubChapterPage />} />

			<Route path="/modules/b4login/:slug/:chapter_id/:subchapter_id" element={<QuizPage />} />

			<Route 
				path="/challenge/b4login"
				element={<SimplePage title="Challenge" description="Challenge" />}
			/>

			<Route 
				path="/leaderboard/b4login"
				element={<SimplePage title="Leaderboard" description="Leaderboard" />}
			/>

			<Route path="/aboutus/b4login" element={<AboutUsPage />} />

		</Routes>
	);
}

export default BeforeLoginRoutes;