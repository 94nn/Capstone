import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";

import "./components/buttons.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import SimplePage from "./pages/SimplePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    {/* Student pages (with NavBar)  */}
                    <Route 
                    path="/login"
                    element={
                    <div className="text-white p-10">Login Page</div>
                    }
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
            </div>
        </BrowserRouter>
    );
}

export default App;