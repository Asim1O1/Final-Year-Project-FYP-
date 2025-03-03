import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.jsx";
import hospitalSlice from "../features/hospital/hospitalSlice.jsx";
import hospitalAdminSlice from "../features/hospital_admin/hospitalAdminSlice.jsx";
import doctorSlice from "../features/doctor/doctorSlice.jsx";
import appointmentSlice from "../features/appointment/appointmentSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authSlice,
    hospitalSlice: hospitalSlice,
    hospitalAdminSlice: hospitalAdminSlice,
    doctorSlice: doctorSlice,
    appointmentSlice: appointmentSlice,

  },
});

export default store;
