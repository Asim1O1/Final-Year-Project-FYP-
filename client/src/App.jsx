import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { verifyUserAuth } from "./features/auth/authSlice";
import CheckAuth from "./utils/CheckAuth.jsx";

// Auth Pages
import ForgotPassword from "./component/auth/ForgotPassword.jsx";
import OTPVerification from "./component/auth/OtpVerification.jsx";
import UpdatePassword from "./component/auth/UpdatePassword.jsx";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage.jsx";

// Public Pages
import NotFoundPage from "./pages/public/404Page";
import CampaignsPage from "./pages/public/CampaignsPage.jsx";
import HomePage from "./pages/public/HomePage";
import HospitalDetailPage from "./pages/public/HospitalDetail.jsx";
import HospitalsPage from "./pages/public/HospitalsPage";
import MedicalTests from "./pages/public/MedicalTests.jsx";
import { TestDetail } from "./pages/public/TestDetail.jsx";

// Payment Components
import PaymentFailed from "./component/payment/PaymentFailed.jsx";
import PaymentSuccess from "./component/payment/PaymentSuccess.jsx";

// Admin Pages
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Doctors } from "./pages/admin/Doctors.jsx";
import HospitalAdminManagement from "./pages/admin/HospitalAdminManagement.jsx";
import HospitalManagement from "./pages/admin/HospitalManagement";
import { Users } from "./pages/admin/Users";

// Hospital Admin Pages
import VolunteerRequestsManager from "./component/hospital_admin/campaign/VolunteerRequestManager.jsx";
import TestBookingList from "./component/hospital_admin/test_booking/Test_BookingList.jsx";
import MedicalReports from "./component/hospital_admin/test_report/MedicalReports.jsx";
import MedicalReportUpload from "./component/hospital_admin/test_report/UploadReport.jsx";
import { HospitalAdminLayout } from "./layouts/HospitalAdminLayout.jsx";
import CampaignManagement from "./pages/hospital_admin/CampaignManagement.jsx";
import DoctorManagement from "./pages/hospital_admin/DoctorManagement.jsx";
import { HospitalAdminDashboard } from "./pages/hospital_admin/HospitalAdminDashboard";
import MedicalTestManagement from "./pages/hospital_admin/MedicalTestManagement.jsx";

// Doctor Pages
import DoctorChatPage from "./component/doctor/chat/DoctorChatPage.jsx";
import DoctorLayout from "./layouts/DoctorLayout.jsx";
import Appointments from "./pages/doctor/AppointmentManagement.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";

// User Pages
import AppointmentDetail from "./component/user/AppointmentDetail.jsx";
import CampaignDetails from "./component/user/CampaignDetail.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ChatPage from "./pages/user/ChatPage.jsx";
import ConfirmationPage from "./pages/user/ConfirmationPage.jsx";
import PatientDetails from "./pages/user/PatientDetails.jsx";
import SelectDoctor from "./pages/user/SelectDoctor.jsx";
import SelectSpecialty from "./pages/user/SelectSpeciality.jsx";
import SelectTime from "./pages/user/SelectTime.jsx";
import UserProfile from "./pages/user/UserProfile";
import ViewDoctorProfile from "./pages/user/ViewDoctorProfile.jsx";

// Hooks
import { useSocket } from "./hooks/useSocketNotification.js";

function App() {
  // Redux state and dispatch
  const { isAuthenticated, user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [authAttempted, setAuthAttempted] = useState(false);

  // Socket connection
  const { isConnected, disconnect } = useSocket();

  /**
   * Effect to verify user authentication on initial load
   */
  useEffect(() => {
    if (!authAttempted) {
      dispatch(verifyUserAuth());
      setAuthAttempted(true);
    }

    // Clean up socket on unmount
    return () => {
      if (isAuthenticated) {
        disconnect();
      }
    };
  }, [dispatch, isAuthenticated, disconnect, authAttempted]);

  /**
   * Effect to monitor socket connection status
   */
  useEffect(() => {
    console.log("Socket connection status:", isConnected);

    // If authenticated but socket not connected, you might want to try reconnecting
    if (isAuthenticated && user && !isConnected) {
      console.log("User authenticated but socket not connected");
      // Add reconnection logic here if needed
    }
  }, [isConnected, isAuthenticated, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/hospitals"
          element={
            <MainLayout>
              <HospitalsPage />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <MainLayout>
              <CampaignsPage />
            </MainLayout>
          }
        />
        <Route
          path="/hospitals/:id"
          element={
            <MainLayout>
              <HospitalDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/medicalTests"
          element={
            <MainLayout>
              <MedicalTests />
            </MainLayout>
          }
        />
        <Route
          path="/tests/:testId"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <TestDetail />
              </MainLayout>
            </CheckAuth>
          }
        />

        {/* Payment Routes */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/paymentFailed" element={<PaymentFailed />} />

        {/* Protected User Routes */}
        <Route
          path="/campaigns/:id"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <CampaignDetails />
              </MainLayout>
            </CheckAuth>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <AppointmentDetail />
              </MainLayout>
            </CheckAuth>
          }
        />
        <Route
          path="/chat/users"
          element={
            <MainLayout>
              <ChatPage />
            </MainLayout>
          }
        />

        {/* ========== APPOINTMENT BOOKING ROUTES ========== */}
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

        {/* ========== AUTHENTICATION ROUTES ========== */}
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

        {/* ========== USER PROFILE ROUTES ========== */}
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
        <Route
          path="/doctor-profile/:doctorId"
          element={
            <CheckAuth role="user">
              <MainLayout>
                <ViewDoctorProfile />
              </MainLayout>
            </CheckAuth>
          }
        />

        {/* ========== ADMIN PROTECTED ROUTES ========== */}
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
          <Route path="doctors" element={<Doctors />} />
          <Route path="hospitals" element={<HospitalManagement />} />
          <Route path="hospital-admin" element={<HospitalAdminManagement />} />
        </Route>

        {/* ========== HOSPITAL ADMIN PROTECTED ROUTES ========== */}
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
          <Route path="medicalTests" element={<MedicalTestManagement />} />
          <Route path="bookings" element={<TestBookingList />} />
          <Route
            path="medical-reports/upload"
            element={<MedicalReportUpload />}
          />
          <Route path="medical-reports/" element={<MedicalReports />} />
          <Route
            path="volunteer-requests"
            element={<VolunteerRequestsManager />}
          />
        </Route>

        {/* ========== DOCTOR PROTECTED ROUTES ========== */}
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
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        {/* ========== MISC ROUTES ========== */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
