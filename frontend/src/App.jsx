import "./App.css";
import "./index.css";

import "./components/buttons.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <NavBar />
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
}

export default App;