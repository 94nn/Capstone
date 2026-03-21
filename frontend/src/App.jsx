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

    const beforeLoginPages = ['/', '/login', '/register', '/aboutus/b4login', '/modules/b4login', '/modules/b4login/:slug', '/modules/b4login/:slug/:chapter_id', '/modules/b4login/:slug/:chapter_id/:subchapter_id', '/challenge/b4login', '/leaderboard/b4login']
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
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    {/* Student pages (with NavBar)  */}
                    <Route 
                    path="/login"
                    element={<LoginPage />} 
                    />
                    
                    <Route path="/register" element={<RegisterPage />} />
            
                    <Route 
                        path="/challenge" 
                        element={
                            <>
                                <NavBar />
                                <SimplePage
                                    title="Challenge"
                                    description="Challenge"
                                />
                            </>
                        }
                    />
                    
                    <Route path="/login" element={<LoginPage />}
                      
                    />
                    <Route
                        path="/leaderboard"
                        element={
                            <>
                                <NavBar />
                                <SimplePage
                                    title="Leaderboard"
                                    description="Leaderboatd"
                                />
                            </>
                        }
                        />
                </Routes>
             <div className="App">
                <AppContent />
            </div>
        </div>
        </BrowserRouter>
    );
}

export default App;