import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import { toast, ToastContainer } from "react-toastify";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { decodeToken } from "./utils/helper";

function App() {
  const navigate = useNavigate();

  const notify = (message: string, type: "success" | "error" | "warn") => {
    const toastTypes = {
      success: toast.success,
      error: toast.error,
      warn: toast.warn,
    };

    toastTypes[type](message, { position: "top-right" });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const userInfo = decodeToken(storedToken);
      console.log(userInfo)
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (userInfo.exp && userInfo.exp < currentTime) {
        console.warn("Token has expired");
        notify("Token has expired", "warn");
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login page
      }
    } else {
      console.error("Failed to decode token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
