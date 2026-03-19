import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./index.css";
import BeforeLoginRoutes from "./routes/BeforeLoginRoutes";
import "./components/buttons.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/AdminNavBar";

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