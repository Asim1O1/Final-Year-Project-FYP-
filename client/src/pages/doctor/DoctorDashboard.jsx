// src/pages/Dashboard.js
import React from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import {
  Calendar,
  MessageSquare,
  FileText,
  User,
  Bell,
  Clock,
  Check,
  X as XIcon,
  ChevronRight,
} from "lucide-react";

// Dashboard components
const ProfileSummary = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-4">
      <img
        src="/api/placeholder/80/80"
        alt="Doctor Profile"
        className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
      />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dr. Sarah Johnson</h2>
        <p className="text-gray-600">Cardiologist</p>
        <p className="text-gray-600">Memorial Hospital</p>
        <div className="mt-2 flex items-center">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            4.9 ★ (120 reviews)
          </span>
        </div>
      </div>
    </div>
  </div>
);

const AppointmentPreview = () => {
  const appointments = [
    {
      id: 1,
      patientName: "Michael Brown",
      patientImage: "/api/placeholder/40/40",
      time: "09:00 AM",
      reason: "Annual Checkup",
      status: "upcoming",
    },
    {
      id: 2,
      patientName: "Emily Wilson",
      patientImage: "/api/placeholder/40/40",
      time: "10:30 AM",
      reason: "Follow-up Consultation",
      status: "upcoming",
    },
    {
      id: 3,
      patientName: "Robert Davis",
      patientImage: "/api/placeholder/40/40",
      time: "01:15 PM",
      reason: "Blood Pressure Check",
      status: "upcoming",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Today's Appointments
        </h3>
        <button className="text-sm text-blue-600 hover:underline flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src={appointment.patientImage}
                alt={appointment.patientName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-800">
                  {appointment.patientName}
                </h4>
                <p className="text-sm text-gray-500">{appointment.reason}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                {appointment.time}
              </span>
              <div className="flex space-x-1">
                <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                  <Check size={16} />
                </button>
                <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                  <XIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestRequestsPreview = () => {
  const testRequests = [
    {
      id: 1,
      patientName: "James Wilson",
      testType: "Blood Test",
      status: "pending",
      requestDate: "Feb 24, 2025",
    },
    {
      id: 2,
      patientName: "Lisa Cooper",
      testType: "ECG",
      status: "pending",
      requestDate: "Feb 25, 2025",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Medical Test Requests
        </h3>
        <button className="text-sm text-blue-600 hover:underline flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {testRequests.map((request) => (
          <div
            key={request.id}
            className="flex justify-between items-center p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <div>
              <h4 className="font-medium text-gray-800">
                {request.patientName}
              </h4>
              <div className="flex space-x-2 text-sm">
                <span className="text-gray-500">{request.testType}</span>
                <span>•</span>
                <span className="text-gray-500">{request.requestDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {request.status}
              </span>
              <button className="p-1 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      type: "appointment",
      message: "New appointment request from Emily Wilson",
      time: "30 min ago",
    },
    {
      id: 2,
      type: "message",
      message: "James Smith sent you a message",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "result",
      message: "Lab results are available for Robert Davis",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Notifications
        </h3>
        <button className="text-sm text-blue-600 hover:underline flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <div className="flex justify-between">
              <p className="text-gray-800">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


//   const actions = [
//     {
//       name: "Schedule",
//       icon: <Calendar size={24} />,
//       color: "bg-blue-500",
//       path: "/doctor/schedule",
//     },
//     {
//       name: "Chat",
//       icon: <MessageSquare size={24} />,
//       color: "bg-green-500",
//       path: "/doctor/chat",
//     },
//     {
//       name: "Reports",
//       icon: <FileText size={24} />,
//       color: "bg-purple-500",
//       path: "/doctor/reports",
//     },
//     {
//       name: "Profile",
//       icon: <User size={24} />,
//       color: "bg-orange-500",
//       path: "/doctor/profile",
//     },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//         Quick Actions
//       </h3>
//       <div className="grid grid-cols-4 gap-4">
//         {actions.map((action) => (
//           <div key={action.name} className="flex flex-col items-center">
//             <button
//               className={`w-12 h-12 ${action.color} rounded-lg text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all`}
//             >
//               {action.icon}
//             </button>
//             <span className="mt-2 text-xs text-gray-600">{action.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

const StatsSummary = () => {
  const stats = [
    {
      name: "Appointments",
      value: "24",
      icon: <Calendar size={20} />,
      color: "text-blue-600",
    },
    {
      name: "Patients",
      value: "142",
      icon: <User size={20} />,
      color: "text-green-600",
    },
    {
      name: "Test Results",
      value: "8",
      icon: <FileText size={20} />,
      color: "text-purple-600",
    },
    {
      name: "Messages",
      value: "5",
      icon: <MessageSquare size={20} />,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div
              className={`p-3 rounded-full ${stat.color
                .replace("text", "bg")
                .replace("600", "100")}`}
            >
              <span className={stat.color}>{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Component
const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <StatsSummary />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <ProfileSummary />
        </div>
        <div className="col-span-2">
          <AppointmentPreview />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TestRequestsPreview />
        <NotificationsPanel />
      </div>

    
    </div>
  );
};

export default DoctorDashboard;
