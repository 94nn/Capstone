import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./index.css";
import BeforeLoginRoutes from "./routes/BeforeLoginRoutes";
import "./components/buttons.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";

function AppContent() {
    const location = useLocation()

    const beforeLoginPages = ['/', '/login', '/register', '/aboutus', '/modules', '/modules/:slug', '/modules/:slug/:chapter_id', '/modules/:slug/:chapter_id/:subchapter_id']
    const isBeforeLogin = beforeLoginPages.includes(location.pathname)

    return (
        <div className="App">
            {isBeforeLogin ? (
                <>
                    <TopBar />
                    <BeforeLoginRoutes />
                </>
            ) : (
                <>
                    <NavBar />
                    <AppRoutes />
                </>
            )}
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
             <div className="App">
                <AppContent />
            </div>
        </BrowserRouter>
    );
}

export default App;