import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDasboard";
import AdminDashboard from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login/student_login" element={<StudentLogin/>} />
        <Route path="/login/staff_login" element={<StaffLogin/>} />
        <Route path="/login/admin_login" element={<AdminLogin/>} />
        <Route path="/student_dashboard" element={<StudentDashboard/>} />
        <Route path="/staff_dashboard" element={<StaffDashboard/>} />
        <Route path="/admin_dashboard" element={<AdminDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}
