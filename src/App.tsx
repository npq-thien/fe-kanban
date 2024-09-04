import "./App.css";
import { Route, Routes } from "react-router-dom";

import KanbanBoard from "./components/KanbanBoard";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<KanbanBoard />} />
      </Routes>
    </div>
  );
}

export default App;
