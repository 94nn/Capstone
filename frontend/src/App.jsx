import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./components/buttons.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";

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