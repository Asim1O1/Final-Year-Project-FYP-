import { configureStore } from "@reduxjs/toolkit";

import appointmentSlice from "../features/appointment/appointmentSlice.jsx";
import authSlice from "../features/auth/authSlice.jsx";
import campaignSlice from "../features/campaign/campaignSlice.jsx";
import doctorSlice from "../features/doctor/doctorSlice.jsx";
import hospitalSlice from "../features/hospital/hospitalSlice.jsx";
import hospitalAdminSlice from "../features/hospital_admin/hospitalAdminSlice.jsx";
import medicalTestSlice from "../features/medical_test/medicalTestSlice.jsx";
import messageSlice from "../features/messages/messageSlice.jsx";
import notificationSlice from "../features/notification/notificationSlice.jsx";
import paymentSlice from "../features/payment/paymentSlice.jsx";
import recentActivitySlice from "../features/recent_activity/recentActivitySlice.jsx";
import systemAdminSlice from "../features/system_admin/systemadminslice.jsx";
import testReportSlice from "../features/test_report/testReportSlice.jsx";
import userSlice from "../features/user/userSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authSlice,
    hospitalSlice: hospitalSlice,
    hospitalAdminSlice: hospitalAdminSlice,
    doctorSlice: doctorSlice,
    appointmentSlice: appointmentSlice,
    campaignSlice: campaignSlice,
    notifications: notificationSlice,
    userSlice: userSlice,
    paymentSlice: paymentSlice,
    messageSlice: messageSlice,
    medicalTestSlice: medicalTestSlice,
    systemAdminSlice: systemAdminSlice,
    testReportSlice: testReportSlice,
    recentActivitySlice: recentActivitySlice,
  },
});

export default store;
