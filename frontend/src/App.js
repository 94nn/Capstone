import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import TopBar from "./components/TopBar";
import LearnPage from "./pages/LearnPage";
import SimplePage from "./pages/SimplePage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <TopBar />
                    <Routes>
                    <Route path="/" element={<LearnPage />} />
                    <Route path="/practice" element={
                        <SimplePage
                            title="Practice"
                            description="Practice"
                        />
                        }
                    />
                    <Route path="/build" element={
                        <SimplePage
                            title="Build"
                            description="Build"
                        />
                        }
                    />
                    <Route path="/community" element={
                        <SimplePage
                            title="Community"
                            description="Community"
                        />
                        }
                    />
                    <Route path="/pricing" element={
                        <SimplePage
                            title="Pricing"
                            description="Plans and pricing"
                        />
                        }
                    />
                    </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;