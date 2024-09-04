import "./App.css";
import { Route, Routes } from "react-router-dom";

import KanbanBoard from "./components/KanbanBoard";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<KanbanBoard />} />
      </Routes>
    </div>
  );
}

export default App;
