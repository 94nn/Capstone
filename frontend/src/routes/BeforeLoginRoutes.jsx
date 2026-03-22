import { Routes, Route } from "react-router-dom";

import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import RegisterPage from "../pages/RegisterPage";
import QuizPage from "../pages/QuizPage";
import ChallengePage from "../pages/ChallengePage";
import ChallengeQuestionPage from "../pages/ChallengeQuestionPage";
import LeaderboardPage from "../pages/LeaderboardPage";
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
				path="/challenge/module/:module_id" element={<ChallengePage />} />

			<Route path="/challenge/:slug" element={<ChallengeQuestionPage />} />

			<Route path="/leaderboard" element={<LeaderboardPage />}/>

			<Route path="/aboutus/b4login" element={<AboutUsPage />} />

		</Routes>
	);
}

export default BeforeLoginRoutes;