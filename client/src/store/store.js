import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.jsx";
import hospitalSlice from "../features/hospital/hospitalSlice.jsx";
import hospitalAdminSlice from "../features/hospital_admin/hospitalAdminSlice.jsx"

const store = configureStore({
  reducer: {
    auth: authSlice,
    hospitalSlice: hospitalSlice,
    hospitalAdminSlice: hospitalAdminSlice
  },
});

export default store;
