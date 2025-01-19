import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/public/HomePage";
import HospitalsPage from "./pages/public/HospitalsPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Users } from "./pages/admin/Users";
import { HospitalAdminDashboard } from "./pages/hospital_admin/HospitalAdminDashboard";
import HospitalManagement from "./pages/admin/HospitalManagement";
import { useDispatch, useSelector } from "react-redux";
import { verifyUserAuth } from "./features/auth/authSlice";
import { useEffect } from "react";
import CheckAuth from "./utils/ProtectRoute";
import NotFoundPage from "./pages/public/404Page";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state?.auth);
  console.log("The is authenticates state at  inital ", isAuthenticated, user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyUserAuth());
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/hospitals" element={<HospitalsPage />}></Route>
            {/* Wrap the Admin routes with CheckAuth */}
            <Route
          path="/admin"
          element={
            <CheckAuth role="system_admin">
              <AdminDashboard />
            </CheckAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <CheckAuth role="system_admin">
              <Users />
            </CheckAuth>
          }
        />
        <Route
          path="/admin/hospitals"
          element={
            <CheckAuth role="system_admin">
              <HospitalManagement />
            </CheckAuth>
          }
        />
          <Route
            path="/hospital_admin/dashboard"
            element={<HospitalAdminDashboard />}
          ></Route>

        {/* 404 Route: Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
