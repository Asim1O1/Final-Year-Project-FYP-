import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  Download,
  RefreshCcw,
} from "lucide-react";

import TabButton from "../../component/doctor/appointment/TabButton.jsx";
import StatusBadge from "../../component/doctor/appointment/StatusBadge.jsx";
import AppointmentDetailsModal from "../../component/doctor/appointment/AppointmentDetailModal.jsx";

import { fetchDoctorAppointments } from "../../features/appointment/appointmentSlice.jsx";

const Appointments = () => {
  const dispatch = useDispatch();
  const {
    appointments: rawAppointments,
    isLoading,
    error,
  } = useSelector((state) => state?.appointmentSlice);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const doctorId = useSelector((state) => state?.auth?.user?.data?._id);

  // Transform raw appointments into grouped structure
  const appointments = {
    upcoming: rawAppointments.filter(
      (app) => app.status === "pending" || app.status === "confirmed"
    ),
    completed: rawAppointments.filter((app) => app.status === "completed"),
    cancelled: rawAppointments.filter((app) => app.status === "cancelled"),
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorAppointments(doctorId));
    }
  }, [dispatch, doctorId]);

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error fetching appointments: {error}</div>;
  }

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

        {/* Tabs for Upcoming, Completed, and Cancelled Appointments */}
        <div className="bg-gray-100 rounded-lg p-1 mb-6">
          <TabButton
            name="upcoming"
            label="Upcoming"
            count={appointments.upcoming?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            name="completed"
            label="Completed"
            count={appointments.completed?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            name="cancelled"
            label="Cancelled"
            count={appointments.cancelled?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments[activeTab]?.length > 0 ? (
            appointments[activeTab].map((appointment) => (
              <div
                key={appointment._id} // Use _id instead of id
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {appointment?.user?.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment?.user?.email}
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
                        {new Date(appointment.date).toLocaleDateString()},{" "}
                        {appointment.startTime} - {appointment.endTime}
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
