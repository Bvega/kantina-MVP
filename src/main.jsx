import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import VendorDashboard from "./pages/VendorDashboard.jsx";
import Home from "./pages/Home.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/test" element={<App />} /> {/* Optional test page */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
