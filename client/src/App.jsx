import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/public/HomePage";
import HospitalsPage from "./pages/public/HospitalsPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Users } from "./pages/admin/Users";
import { HospitalAdminDashboard } from "./pages/hospital_admin/HospitalAdminDashboard";
import HospitalManagement from "./pages/admin/HospitalManagement";
import HospitalAdminManagement from "./pages/admin/HospitalAdminManagement.jsx";
import { useDispatch, useSelector } from "react-redux";
import { verifyUserAuth } from "./features/auth/authSlice";
import { useEffect } from "react";
import CheckAuth from "./utils/CheckAuth.jsx";
import NotFoundPage from "./pages/public/404Page";
import { AdminLayout } from "./layouts/AdminLayout";  
import UnauthorizedPage from "./pages/auth/UnauthorizedPage.jsx";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUserAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />

        {/* Protected Routes for Register and Login */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              user?.data?.role === "system_admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.data?.role === "system_admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <CheckAuth role="system_admin">
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="hospitals" element={<HospitalManagement />} />
          <Route path="hospital admin" element={<HospitalAdminManagement />} />
        </Route>

        {/* Hospital Admin Protected Routes */}
        <Route
          path="/hospital-admin/*"
          element={
            <CheckAuth role="hospital_admin">
              <HospitalAdminDashboard />
            </CheckAuth>
          }
        />

        {/* 404 Route: Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
