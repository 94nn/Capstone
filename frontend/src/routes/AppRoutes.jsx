import { Routes, Route } from "react-router-dom";
import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import SimplePage from "../pages/SimplePage";
import AdminPage from "../pages/AdminPage";

function AppRoutes() {
	return (
		<Routes>

		<Route path="/modules" element={<ModulePage />} />

		<Route path="/modules/:slug" element={<ChapterPage />} />

		<Route path="/modules/:slug/:chapter_id" element={<SubChapterPage />} />

		<Route 
			path="/challenge"
			element={<SimplePage title="Challenge" description="Challenge" />}
		/>

		<Route 
			path="/leaderboard"
			element={<SimplePage title="Leaderboard" description="Leaderboard" />}
		/>

		<Route
			path="/admin"
			element={<AdminPage title="Admin" description="Admin Panel" />}
		/>

		</Routes>
	);
}

export default AppRoutes;