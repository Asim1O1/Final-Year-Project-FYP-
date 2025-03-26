import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyUserAuth } from "./features/auth/authSlice";
import CheckAuth from "./utils/CheckAuth.jsx";

import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/public/HomePage";
import HospitalsPage from "./pages/public/HospitalsPage";
import NotFoundPage from "./pages/public/404Page";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage.jsx";
import ForgotPassword from "./component/auth/ForgotPassword.jsx";
import OTPVerification from "./component/auth/OtpVerification.jsx";
import UpdatePassword from "./component/auth/UpdatePassword.jsx";
import PaymentSuccess from "./component/payment/PaymentSuccess.jsx";
import PaymentFailed from "./component/payment/PaymentFailed.jsx";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Users } from "./pages/admin/Users";
import HospitalManagement from "./pages/admin/HospitalManagement";
import HospitalAdminManagement from "./pages/admin/HospitalAdminManagement.jsx";
import { AdminLayout } from "./layouts/AdminLayout";

import { HospitalAdminDashboard } from "./pages/hospital_admin/HospitalAdminDashboard";
import { HospitalAdminLayout } from "./layouts/HospitalAdminLayout.jsx";
import DoctorManagement from "./pages/hospital_admin/DoctorManagement.jsx";
import CampaignManagement from "./pages/hospital_admin/CampaignManagement.jsx";

import DoctorLayout from "./layouts/DoctorLayout.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import Appointments from "./pages/doctor/AppointmentManagement.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import SelectSpecialty from "./pages/user/SelectSpeciality.jsx";
import SelectDoctor from "./pages/user/SelectDoctor.jsx";
import SelectTime from "./pages/user/SelectTime.jsx";
import PatientDetails from "./pages/user/PatientDetails.jsx";
import ConfirmationPage from "./pages/user/ConfirmationPage.jsx";
import UserProfile from "./pages/user/UserProfile";
import CampaignDetails from "./component/user/CampaignDetail.jsx";
import AppointmentDetail from "./component/user/AppointmentDetail.jsx";
import ChatPage from "./pages/user/ChatPage.jsx";
import DoctorChatPage from "./component/doctor/chat/DoctorChatPage.jsx";

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
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/paymentFailed" element={<PaymentFailed />} />

        <Route
          path="/campaigns/:id"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <CampaignDetails />
              </MainLayout>
            </CheckAuth>
          }
        ></Route>
        <Route
          path="/appointments/:id"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <AppointmentDetail />
              </MainLayout>
            </CheckAuth>
          }
        ></Route>
         <Route
          path="/chat/users"
          element={
            <MainLayout>
              <ChatPage />
            </MainLayout>
          }
        />

        {/* Appointment Booking Routes */}
        <Route
          path="/book-appointment"
          element={
            <MainLayout>
              <SelectSpecialty />
            </MainLayout>
          }
        />
        <Route
          path="/book-appointment/select-doctor/:specialization"
          element={
            <MainLayout>
              <SelectDoctor />
            </MainLayout>
          }
        />
        <Route
          path="/book-appointment/select-time/:doctorId"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <SelectTime />
              </MainLayout>
            </CheckAuth>
          }
        />
        <Route
          path="/book-appointment/patient-details/:doctorId/:date/:startTime"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <PatientDetails />
              </MainLayout>
            </CheckAuth>
          }
        />
        <Route
          path="/book-appointment/confirmation/:appointmentId"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <ConfirmationPage />
              </MainLayout>
            </CheckAuth>
          }
        />

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
              <MainLayout>
                <RegisterPage />
              </MainLayout>
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
              ) : user?.data?.role === "doctor" ? (
                <Navigate to="/doctor/dashboard" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <MainLayout>
                <LoginPage />
              </MainLayout>
            )
          }
        />

        {/* User Profile Route */}
        <Route
          path="/profile"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <UserProfile />
              </MainLayout>
            </CheckAuth>
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
          <Route path="hospital-admin" element={<HospitalAdminManagement />} />
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
          <Route path="campaign" element={<CampaignManagement />} />
        </Route>

        {/* Doctor Protected Routes */}
        <Route
          path="/doctor/*"
          element={
            <CheckAuth role="doctor">
              <DoctorLayout />
            </CheckAuth>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="chat" element={<DoctorChatPage />} />
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
