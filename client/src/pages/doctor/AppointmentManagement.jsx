// src/pages/Appointments.js
import React, { useState } from "react";

import {
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  Clock,
  AlertCircle,
  Download,
  Edit,
  Trash,
  RefreshCcw,
} from "lucide-react";

import TabButton from "../../component/doctor/appointment/TabButton.jsx";
import StatusBadge from "../../component/doctor/appointment/StatusBadge.jsx";
import AppointmentDetailsModal from "../../component/doctor/appointment/AppointmentDetailModal.jsx";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Sample appointments data
  const allAppointments = {
    upcoming: [
      {
        id: 1,
        patientName: "Michael Brown",
        patientImage: "/api/placeholder/40/40",
        patientContact: "+1 (555) 123-4567",
        reason: "Annual Checkup",
        date: "Feb 27, 2025",
        time: "09:00 AM",
        status: "confirmed",
      },
      {
        id: 2,
        patientName: "Emily Wilson",
        patientImage: "/api/placeholder/40/40",
        patientContact: "+1 (555) 987-6543",
        reason: "Follow-up Consultation",
        date: "Feb 27, 2025",
        time: "10:30 AM",
        status: "confirmed",
      },
      {
        id: 3,
        patientName: "Robert Davis",
        patientImage: "/api/placeholder/40/40",
        patientContact: "+1 (555) 456-7890",
        reason: "Blood Pressure Check",
        date: "Feb 28, 2025",
        time: "01:15 PM",
        status: "pending",
      },
    ],
    completed: [
      {
        id: 4,
        patientName: "Jessica Adams",
        patientImage: "/api/placeholder/40/40",
        patientContact: "+1 (555) 234-5678",
        reason: "Diabetes Follow-up",
        date: "Feb 25, 2025",
        time: "11:00 AM",
        status: "completed",
        notes:
          "Patient responded well to medication adjustment. Schedule follow-up in 3 months.",
      },
      {
        id: 5,
        patientName: "Thomas Moore",
        patientImage: "/api/placeholder/40/40",
        patientContact: "+1 (555) 876-5432",
        reason: "Post-surgery Check",
        date: "Feb 24, 2025",
        time: "02:30 PM",
        status: "completed",
        notes: "Healing well. Removed stitches. Advised on physical therapy.",
      },
    ],
    cancelled: [
      {
        id: 6,
        patientName: "Sarah Johnson",
        patientImage: "/api/placeholder/40/40",
        patientContact: "+1 (555) 345-6789",
        reason: "Respiratory Issues",
        date: "Feb 26, 2025",
        time: "03:45 PM",
        status: "cancelled",
        cancellationReason: "Patient requested reschedule",
      },
    ],
  };

  // Filter appointments based on search query and filters
  const getFilteredAppointments = () => {
    let filtered = allAppointments[activeTab];

    if (searchQuery) {
      filtered = filtered.filter((app) =>
        app.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((app) => app.date === dateFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Manage Appointments
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
            <Calendar size={16} className="mr-2" />
            Add Appointment
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type="date"
                className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <Calendar
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                className="pl-8 pr-8 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-1 mb-2">
            <TabButton
              name="upcoming"
              label="Upcoming"
              count={allAppointments.upcoming.length}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              name="completed"
              label="Completed"
              count={allAppointments.completed.length}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              name="cancelled"
              label="Cancelled"
              count={allAppointments.cancelled.length}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.patientContact}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <Calendar size={16} className="text-gray-500 mr-1" />
                      <span className="text-sm text-gray-700">
                        {appointment.date}, {appointment.time}
                      </span>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Notes:</span>{" "}
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {appointment.cancellationReason && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Cancellation Reason:</span>{" "}
                      {appointment.cancellationReason}
                    </p>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t flex justify-between">
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View Details
                  </button>

                  <div className="flex space-x-2">
                    {activeTab === "upcoming" &&
                      appointment.status === "pending" && (
                        <>
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center">
                            <Check size={14} className="mr-1" />
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center">
                            <X size={14} className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    {activeTab === "upcoming" &&
                      appointment.status === "confirmed" && (
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center">
                          <Check size={14} className="mr-1" />
                          Mark Completed
                        </button>
                      )}
                    {activeTab === "upcoming" && (
                      <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                        Reschedule
                      </button>
                    )}
                    {activeTab === "completed" && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center">
                        <Download size={14} className="mr-1" />
                        Download Report
                      </button>
                    )}
                    {activeTab === "cancelled" && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center">
                        <RefreshCcw size={14} className="mr-1" />
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500">
                Try changing your filters or create a new appointment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default Appointments;
