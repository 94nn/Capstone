import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import TopBar from "./components/TopBar";
import LearnPage from "./pages/LearnPage";
import SimplePage from "./pages/SimplePage";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import './index.css'
import LandingPage from "./pages/LandingPage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    {/* Student pages (with NavBar)  */}
                    <Route 
                        path="/learn" 
                        element={
                            <>
                                <NavBar />
                                <LearnPage />
                                </>
                        }
                    />
                    
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