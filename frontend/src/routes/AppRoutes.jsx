<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
=======
import { Routes, Route, Navigate } from "react-router-dom";

>>>>>>> 2b41ff8d0b21e2a884e7e8b684d15608db979142
import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SubChapterPage from "../pages/SubChapterPage";
import SimplePage from "../pages/SimplePage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import EditProfilePage from "../pages/EditProfilePage";
import QuizPage from "../pages/QuizPage";
<<<<<<< HEAD
import AdminPage from "../pages/AdminPage";
import AdminChapterPage from "../pages/AdminChapterPage";
import AdminSubChapterPage from "../pages/AdminSubChapterPage";
import AdminQuizPage from "../pages/AdminQuizPage";
import FeedbackPage from "../pages/FeedbackPage";
import AdminChallengePage from "../pages/AdminChallengePage";
=======
import AboutUsPage from "../pages/AboutUsPage";
>>>>>>> 2b41ff8d0b21e2a884e7e8b684d15608db979142

function AppRoutes() {
	return (
		<Routes>

			<Route path="/homepage" element={<HomePage />} />

			<Route path="/modules" element={<ModulePage />} />

			<Route path="/modules/:slug" element={<ChapterPage />} />

			<Route path="/modules/:slug/:chapter_id" element={<SubChapterPage />} />

			<Route path="/modules/:slug/:chapter_id/:subchapter_id" element={<QuizPage />} />



			<Route 
				path="/leaderboard"
				element={<SimplePage title="Leaderboard" description="Leaderboard" />}
			/>
			<Route path="/admin" element={<AdminPage />} />

<<<<<<< HEAD
			<Route path="/admin/:slug" element={<AdminChapterPage />} />

			<Route path="/admin/:slug/:chapter_id" element={<AdminSubChapterPage />} />

			<Route path="/admin/:slug/:chapter_id/:subchapter_id" element={<AdminQuizPage />} />

			<Route path="/feedback"element={<FeedbackPage  />}/>
			
			<Route path="/challenge"element={<AdminChallengePage  />}/>



			</Routes>
		);
=======
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

			<Route path="*" element={<Navigate to="/" replace />} />
			
			<Route path="/aboutus" element={<AboutUsPage />} />

		</Routes>
	);
>>>>>>> 2b41ff8d0b21e2a884e7e8b684d15608db979142
}

export default AppRoutes;