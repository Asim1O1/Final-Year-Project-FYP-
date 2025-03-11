import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Check,
  X,

  AlertCircle,
  Download,
  RefreshCcw,
} from "lucide-react";

import TabButton from "../../component/doctor/appointment/TabButton.jsx";
import StatusBadge from "../../component/doctor/appointment/StatusBadge.jsx";
import AppointmentDetailsModal from "../../component/doctor/appointment/AppointmentDetailModal.jsx";

import {
  fetchDoctorAppointments,
  updateAppointmentStatus,
} from "../../features/appointment/appointmentSlice.jsx";

const Appointments = () => {
  const dispatch = useDispatch();
  const {
    appointments: rawAppointments = [], // Provide default empty array
    isLoading,
    error,
  } = useSelector((state) => state?.appointmentSlice);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [appointmentToReject, setAppointmentToReject] = useState(null);

  const doctorId = useSelector((state) => state?.auth?.user?.data?._id);

  // Fetch appointments when the component mounts or the active tab changes
  useEffect(() => {
    if (doctorId) {
      let status = [];

      // Set status based on the active tab
      if (activeTab === "upcoming") {
        status = ["pending"];
      } else if (activeTab === "completed") {
        status = ["completed"];
      } else if (activeTab === "canceled") {
        status = ["canceled"];
      } else if (activeTab === "confirmed") {
        status = ["confirmed"];
      } else if (activeTab === "all") {
        status = ["all"];
      }

      // Dispatch the action with the individual status values
      dispatch(fetchDoctorAppointments({ doctorId, status }));
    }
  }, [dispatch, doctorId, activeTab]);

  // Handle appointment approval
  const handleApproveAppointment = (appointmentId) => {
    dispatch(
      updateAppointmentStatus({
        appointmentId,
        status: "confirmed",
      })
    )
      .unwrap()
      .then(() => {
        // Refresh the appointments list after successful update
        dispatch(
          fetchDoctorAppointments({ doctorId, status: "pending,confirmed" })
        );
      })
      .catch((error) => {
        console.error("Failed to approve appointment:", error);
        // You can add toast notification here
      });
  };

  // Handle appointment rejection
  const handleRejectClick = (appointment) => {
    setAppointmentToReject(appointment);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = () => {
    if (!appointmentToReject) return;

    dispatch(
      updateAppointmentStatus({
        appointmentId: appointmentToReject._id,
        status: "rejected",
        rejectionReason,
      })
    )
      .unwrap()
      .then(() => {
        // Close modal and refresh appointments
        setShowRejectionModal(false);
        setRejectionReason("");
        setAppointmentToReject(null);
        dispatch(fetchDoctorAppointments({ doctorId, status: "canceled" }));
      })
      .catch((error) => {
        console.error("Failed to reject appointment:", error);

      });
  };

  // Handle marking appointment as completed
  const handleCompleteAppointment = (appointmentId) => {
    dispatch(
      updateAppointmentStatus({
        appointmentId,
        status: "completed",
      })
    )
      .unwrap()
      .then(() => {
        // Refresh the appointments list after successful update
        dispatch(fetchDoctorAppointments({ doctorId, status: "completed" }));
      })
      .catch((error) => {
        console.error("Failed to complete appointment:", error);
        // You can add toast notification here
      });
  };

  // Transform raw appointments into grouped structure

  const appointments = {
    upcoming: Array.isArray(rawAppointments)
      ? rawAppointments.filter((app) => app.status === "pending")
      : [],
    completed: Array.isArray(rawAppointments)
      ? rawAppointments.filter((app) => app.status === "completed")
      : [],
    cancelled: Array.isArray(rawAppointments)
      ? rawAppointments.filter((app) => app.status === "canceled")
      : [],
    confirmed: Array.isArray(rawAppointments)
      ? rawAppointments.filter((app) => app.status === "confirmed")
      : [],
    all: Array.isArray(rawAppointments)
      ? rawAppointments.filter(
          (app) =>
            app.status === "pending" ||
            app.status === "confirmed" ||
            app.status === "completed" ||
            app.status === "canceled" ||
            app.status === "rejected"
        )
      : [],
  };

  // Handler for Add Appointment button
  const handleAddAppointment = () => {
    // Implement your add appointment logic here
    console.log("Add appointment clicked");
    // You could navigate to another page or open a modal
  };

  // Handler for Reschedule button
  const handleReschedule = (appointment) => {
    // Implement your reschedule logic here
    console.log("Reschedule clicked for appointment:", appointment._id);
    // You could open a reschedule modal
  };

  // Function to safely check if error contains a specific string
  const errorIncludes = (searchString) => {
    if (!error) return false;
    if (typeof error === "string") return error.includes(searchString);
    if (error.message && typeof error.message === "string")
      return error.message.includes(searchString);
    if (error.statusCode) return error.statusCode === 404;
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to get error message
  const getErrorMessage = () => {
    if (!error) return "Try changing your filters or create a new appointment";

    // If it's a 404 error
    if (errorIncludes("404") || error.statusCode === 404) {
      return "No appointments in this category yet.";
    }

    // For other errors, try to extract a readable message
    if (typeof error === "string") return `Error: ${error}`;
    if (error.message) return `Error: ${error.message}`;
    return "Something went wrong. Please try again.";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Manage Appointments
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            onClick={handleAddAppointment}
          >
            <Calendar size={16} className="mr-2" />
            Add Appointment
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-1 mb-6">
          <TabButton
            name="all"
            label="All"
            count={appointments.all?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            name="confirmed"
            label="Approved"
            count={appointments.confirmed?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

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
                key={appointment._id}
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

                {appointment.rejectionReason && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Rejection Reason:</span>{" "}
                      {appointment.rejectionReason}
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
                          <button
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                            onClick={() =>
                              handleApproveAppointment(appointment._id)
                            }
                          >
                            <Check size={14} className="mr-1" />
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
                            onClick={() => handleRejectClick(appointment)}
                          >
                            <X size={14} className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    {activeTab === "upcoming" &&
                      appointment.status === "confirmed" && (
                        <button
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                          onClick={() =>
                            handleCompleteAppointment(appointment._id)
                          }
                        >
                          <Check size={14} className="mr-1" />
                          Mark Completed
                        </button>
                      )}
                    {activeTab === "upcoming" && (
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        onClick={() => handleReschedule(appointment)}
                      >
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
                      <button
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                        onClick={() => handleReschedule(appointment)}
                      >
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
              <p className="text-gray-500">{getErrorMessage()}</p>
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

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reject Appointment</h3>
            <p className="mb-4">
              Please provide a reason for rejecting this appointment:
            </p>
            <textarea
              className="w-full border rounded p-2 mb-4 h-24"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason("");
                  setAppointmentToReject(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
