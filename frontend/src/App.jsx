import { BrowserRouter, useLocation, matchPath } from "react-router-dom";
import "./App.css";
import "./index.css";
import BeforeLoginRoutes from "./routes/BeforeLoginRoutes";
import "./components/buttons.css";
import "./components/cards.css";
import "./components/popup.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import AdminNavBar from "./components/AdminNavBar";

function AppContent() {
    const location = useLocation();
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isLoggedIn = !!user;

    const beforeLoginPages = [
        "/",
        "/login",
        "/register",
        "/aboutus/b4login",
        "/modules/b4login",
        "/modules/b4login/:slug",
        "/modules/b4login/:slug/:chapter_id",
        "/modules/b4login/:slug/:chapter_id/:subchapter_id",
        "/challenge/b4login",
        "/leaderboard/b4login",
    ];

    const isBeforeLogin = beforeLoginPages.some((path) =>
        matchPath({ path, end: true }, location.pathname)
    );

    return (
        <div className="App">
            {isBeforeLogin ? (
                <>
                    <TopBar />
                    <BeforeLoginRoutes />
                </>
            ) : (
                <>
                    {role === "admin" ? <AdminNavBar /> : <NavBar />}
                    <AppRoutes />
                </>
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;