import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FormLapor from "./components/FormLapor";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminReport from "./components/AdminReport";
import { colors } from "./designSystem";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const appContainerStyle = {
    minHeight: "100vh",
    background: colors.gradientBackgroundAnimated,
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    position: "relative",
    paddingTop: "140px", // Space for floating navbar
    paddingBottom: "50px",
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 122, 255, 0.3);
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 122, 255, 0.5);
          }
        `}
      </style>

      <BrowserRouter>
        <Navbar />
        <div style={appContainerStyle}>
          <Routes>
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

            <Route path="/" element={token ? <FormLapor /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

            {/* Admin Route */}
            <Route path="/admin" element={token && role === 'admin' ? <AdminReport /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;