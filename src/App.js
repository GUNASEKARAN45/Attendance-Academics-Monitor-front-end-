// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UnifiedLogin from "./pages/UnifiedLogin";        // ← NEW unified page
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDasboard";      // ← fixed typo: StaffDasboard → StaffDashboard
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* SINGLE LOGIN PAGE */}
        <Route path="/login" element={<UnifiedLogin />} />

        {/* Protected Dashboards */}
        <Route path="/student_dashboard" element={<StudentDashboard />} />
        <Route path="/staff_dashboard"   element={<StaffDashboard />} />
        <Route path="/admin_dashboard"   element={<AdminDashboard />} />

        
      </Routes>
    </BrowserRouter>
  );
}