import DoctorSidebar from "../component/doctor/appointment/doctorSidebar";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorLayout = ({ children }) => {
  const doctor = useSelector((state) => state?.auth?.user?.data);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src={doctor?.doctorProfileImage || "/api/placeholder/40/40"}
                  alt="Doctor"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-800">
                    Dr. {doctor?.fullName || "Doctor"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {doctor?.specialization || "Specialist"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Box p={8}>{children || <Outlet />}</Box>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
