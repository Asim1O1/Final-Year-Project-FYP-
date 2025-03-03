// src/components/Sidebar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  User,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const DoctorSidebar = () => {
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
    <div
      className={`bg-white shadow-lg ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen ? (
            <div className="text-xl font-bold text-blue-600">MedConnect</div>
          ) : (
            <div className="text-xl font-bold text-blue-600">MC</div>
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
  );
};

export default DoctorSidebar;
