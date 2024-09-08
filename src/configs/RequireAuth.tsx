import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RequireAuth = ({ children }: any) => {
  const navigate = useNavigate();
  //   const [loading, setLoading] = useState(true);

  const notify = (message: string, type: "success" | "error" | "warn") => {
    const toastTypes = {
      success: toast.success,
      error: toast.error,
      warn: toast.warn,
    };

    toastTypes[type](message, { position: "top-right" });
  };

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const userInfo = jwtDecode(storedToken) as { exp: number };
          const currentTime = Math.floor(Date.now() / 1000);

          if (userInfo.exp && userInfo.exp < currentTime) {
            // Token expired
            notify("Token has expired", "warn");
            localStorage.removeItem("token");
            navigate("/login");
          }
        } catch (error) {
          // Token is invalid or decoding failed
          console.error("Failed to decode token", error);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        // No token found
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return <>{children}</>; // Render children if authenticated
};

export default RequireAuth;
