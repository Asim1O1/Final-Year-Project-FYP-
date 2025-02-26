// src/layouts/DoctorLayout.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  FileText,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Clock,
} from "lucide-react";

const DoctorLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/doctor/dashboard" },
    {
      name: "Appointments",
      icon: <Calendar size={20} />,
      path: "/doctor/appointments",
    },
    {
      name: "Patient Chat",
      icon: <MessageSquare size={20} />,
      path: "/doctor/chat",
    },
    {
      name: "Medical Reports",
      icon: <FileText size={20} />,
      path: "/doctor/reports",
    },
    { name: "Schedule", icon: <Clock size={20} />, path: "/doctor/schedule" },
    { name: "Profile", icon: <User size={20} />, path: "/doctor/profile" },
    {
      name: "Notifications",
      icon: <Bell size={20} />,
      path: "/doctor/notifications",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {isSidebarOpen ? (
              <div className="text-xl font-bold text-blue-600">HealthCare</div>
            ) : (
              <div className="text-xl font-bold text-blue-600">HC</div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex flex-col flex-1 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-4 ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <div className="mr-4">{item.icon}</div>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t">
            <Link
              to="/logout"
              className="flex items-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <LogOut size={20} className="mr-4" />
              {isSidebarOpen && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)
                ?.name || "Dashboard"}
            </h1>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </button>

              <div className="flex items-center">
                <img
                  src="/api/placeholder/40/40"
                  alt="Doctor"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-800">
                    Dr. Sarah Johnson
                  </div>
                  <div className="text-xs text-gray-500">Cardiologist</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
