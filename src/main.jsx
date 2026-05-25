import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import VendorDashboard from "./pages/VendorDashboard.jsx";
import Home from "./pages/Home.jsx";
import CustomerMenu from "./pages/CustomerMenu.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <VendorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/menu/:vendorId" element={<CustomerMenu />} />
            <Route path="/order-status/:orderId" element={<OrderStatus />} />
            <Route path="/test" element={<App />} /> {/* Optional test page */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
