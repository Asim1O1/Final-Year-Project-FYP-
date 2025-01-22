import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.jsx";
import hospitalSlice from "../features/hospital/hospitalSlice.jsx";




const store = configureStore({
  reducer: {
    auth: authSlice,
  hospitalSlice: hospitalSlice,
  },
});

export default store;
