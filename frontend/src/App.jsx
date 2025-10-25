// src/App.jsx 
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { setToken } from "./services/api";
import { Box, Typography, Container, CircularProgress } from "@mui/material";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
            // Only navigate if we're on the root path or login/signup page
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                navigate("/dashboard", { replace: true });
            }
        }
        setIsLoading(false);
    }, [navigate, location.pathname]);

    if (isLoading) {
        // Show a loading spinner while checking the token status
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <nav style={{ padding: 10 }}>
                <Link to="/">Home</Link>{" "}
                <Link to="/dashboard" style={{ marginLeft: 10 }}>Dashboard</Link>
                <div style={{ display: 'inline-block', marginLeft: 10 }}>
                <button
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    }}
                    >
                    Logout
                    </button>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<div style={{ padding: 20 }}>Welcome — <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link></div>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;