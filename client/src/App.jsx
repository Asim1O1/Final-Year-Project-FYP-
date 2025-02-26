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
import ForgotPassword from "./component/auth/ForgotPassword.jsx";
import OTPVerification from "./component/auth/OtpVerification.jsx";
import UpdatePassword from "./component/auth/UpdatePassword.jsx";
import AddDoctorForm from "./component/hospital_admin/doctor/AddDoctor.jsx";
import { HospitalAdminLayout } from "./layouts/HospitalAdminLayout.jsx";
import DoctorManagement from "./pages/hospital_admin/DoctorManagement.jsx";

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

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.data?.role === "system_admin" ? (
                <Navigate to="/admin" />
              ) : user?.data?.role === "hospital_admin" ? (
                <Navigate to="/hospital-admin" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <LoginPage />
            )
          }
        />

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
              <HospitalAdminLayout />
            </CheckAuth>
          }
        >
          <Route index element={<HospitalAdminDashboard />} />
          <Route path="doctors" element={<DoctorManagement />} />
        </Route>

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* 404 Route: Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
