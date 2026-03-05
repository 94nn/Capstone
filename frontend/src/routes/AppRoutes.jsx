import { Routes, Route } from "react-router-dom";

import ModulePage from "../pages/ModulePage";
import ChapterPage from "../pages/ChapterPage";
import SimplePage from "../pages/SimplePage";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/module" element={<ModulePage />} />

      <Route path="/module/:moduleId" element={<ChapterPage />} />

      <Route 
        path="/challenge"
        element={<SimplePage title="Challenge" description="Challenge" />}
      />

      <Route 
        path="/leaderboard"
        element={<SimplePage title="Leaderboard" description="Leaderboard" />}
      />

    </Routes>
  );
}

export default AppRoutes;