import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import TopBar from "./components/TopBar";
import LearnPage from "./pages/LearnPage";
import SimplePage from "./pages/SimplePage";
import AdminPage from "./pages/AdminPage";
 
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <TopBar />
                    <Routes>
                    <Route path="/" element={<LearnPage />} />
                    <Route path="/challenge" element={
                        <SimplePage
                            title="Challenge"
                            description="Challenge"
                        />
                        }
                    />
                    <Route path="/leaderboard" element={
                        <SimplePage
                            title="Leaderboard"
                            description="Leaderboard"
                        />
                        }
                    />
                    < Route path="/admin" element={<AdminPage />}/>
                    </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;