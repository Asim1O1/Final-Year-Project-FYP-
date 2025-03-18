import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Trash } from "lucide-react";

import {
  fetchDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointments,
} from "../../features/appointment/appointmentSlice.jsx";
import AppointmentDetailsModal from "../../component/doctor/appointment/AppointmentDetailModal.jsx";
import RejectionModal from "../../component/doctor/appointment/RejectionModal.jsx";
import DeleteConfirmationModal from "../../component/doctor/appointment/DeleteConfirmationModal.jsx";
import AppointmentTabs from "../../component/doctor/appointment/AppointmentTabs.jsx";
import BulkSelectionHeader from "../../component/doctor/appointment/BulkSelectionHeader.jsx";
import EmptyState from "../../component/doctor/appointment/EmptyState.jsx";
import AppointmentList from "../../component/doctor/appointment/AppointmentList.jsx";
import { notification } from "antd";

const Appointments = () => {
  const dispatch = useDispatch();
  const {
    appointments: rawAppointments = [],
    isLoading,
    error,
  } = useSelector((state) => state?.appointmentSlice);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [appointmentToReject, setAppointmentToReject] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

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

      dispatch(fetchDoctorAppointments({ doctorId, status }));
    }
  }, [dispatch, doctorId, activeTab]);
  // 🔔 Show Notification
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
  };

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
        dispatch(
          fetchDoctorAppointments({ doctorId, status: "pending,confirmed" })
        );
        showNotification(
          "success",
          "Appointment Approved",
          "The appointment has been successfully confirmed."
        );
      })
      .catch((error) => {
        console.error("Failed to approve appointment:", error);
        showNotification(
          "error",
          "Approval Failed",
          error?.message || "Could not confirm the appointment."
        );
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
        setShowRejectionModal(false);
        setRejectionReason("");
        setAppointmentToReject(null);
        dispatch(fetchDoctorAppointments({ doctorId, status: "canceled" }));
        showNotification(
          "info",
          "Appointment Rejected",
          "The appointment has been successfully rejected."
        );
      })
      .catch((error) => {
        console.error("Failed to reject appointment:", error);
        showNotification(
          "error",
          "Rejection Failed",
          error?.message || "Could not reject the appointment."
        );
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
        dispatch(fetchDoctorAppointments({ doctorId, status: "completed" }));
        showNotification(
          "success",
          "Appointment Completed",
          "The appointment has been successfully marked as completed."
        );
      })
      .catch((error) => {
        console.error("Failed to complete appointment:", error);
        showNotification(
          "error",
          "Completion Failed",
          error?.message || "Could not mark the appointment as completed."
        );
      });
  };

  // Handle single appointment deletion
  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    if (appointmentToDelete) {
      // Single appointment deletion
      dispatch(deleteAppointments([appointmentToDelete._id]))
        .unwrap()
        .then((response) => {
          setShowDeleteConfirmation(false);
          setAppointmentToDelete(null);
          dispatch(fetchDoctorAppointments({ doctorId, status: ["all"] }));
          showNotification("success", "Appointment Deleted", response.message);
        })
        .catch((error) => {
          console.error("Failed to delete appointment:", error);
          showNotification(
            "error",
            "Deletion Failed",
            error?.message || "Failed to delete appointment"
          );
        });
    } else if (selectedAppointments.length > 0) {
      // Bulk deletion
      dispatch(deleteAppointments(selectedAppointments))
        .unwrap()
        .then((response) => {
          setShowDeleteConfirmation(false);
          setSelectedAppointments([]);
          dispatch(fetchDoctorAppointments({ doctorId, status: ["all"] }));
          showNotification("success", "Appointments Deleted", response.message);
        })
        .catch((error) => {
          console.error("Failed to delete appointments:", error);
          showNotification(
            "error",
            "Bulk Deletion Failed",
            error?.message || "Failed to delete selected appointments"
          );
        });
    }
  };

  // Handle checkbox selection for bulk operations
  const handleSelectAppointment = (appointmentId) => {
    setSelectedAppointments((prev) => {
      if (prev.includes(appointmentId)) {
        return prev.filter((id) => id !== appointmentId);
      } else {
        return [...prev, appointmentId];
      }
    });
  };

  // Handle select all appointments
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = appointments[activeTab].map((app) => app._id);
      setSelectedAppointments(allIds);
    } else {
      setSelectedAppointments([]);
    }
  };

  // Handle bulk delete button click
  const handleBulkDeleteClick = () => {
    if (selectedAppointments.length > 0) {
      setShowDeleteConfirmation(true);
    }
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

  const handleAddAppointment = () => {
    console.log("Add appointment clicked");
  };

  // Handler for Reschedule button
  const handleReschedule = (appointment) => {
    console.log("Reschedule clicked for appointment:", appointment._id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Function to safely check if error contains a specific string
  const errorIncludes = (searchString) => {
    if (!error) return false;
    if (typeof error === "string") return error.includes(searchString);
    if (error.message && typeof error.message === "string")
      return error.message.includes(searchString);
    if (error.statusCode) return error.statusCode === 404;
    return false;
  };

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
          <div className="flex space-x-2">
            {selectedAppointments.length > 0 && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
                onClick={handleBulkDeleteClick}
              >
                <Trash size={16} className="mr-2" />
                Delete Selected ({selectedAppointments.length})
              </button>
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleAddAppointment}
            >
              <Calendar size={16} className="mr-2" />
              Add Appointment
            </button>
          </div>
        </div>

        <AppointmentTabs
          appointments={appointments}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Bulk Selection Header */}
        {appointments[activeTab]?.length > 0 && (
          <BulkSelectionHeader
            selectedAppointments={selectedAppointments}
            appointments={appointments}
            activeTab={activeTab}
            handleSelectAll={handleSelectAll}
          />
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments[activeTab]?.length > 0 ? (
            <AppointmentList
              appointments={appointments[activeTab]}
              selectedAppointments={selectedAppointments}
              activeTab={activeTab}
              handleSelectAppointment={handleSelectAppointment}
              handleApproveAppointment={handleApproveAppointment}
              handleRejectClick={handleRejectClick}
              handleCompleteAppointment={handleCompleteAppointment}
              handleReschedule={handleReschedule}
              handleDeleteClick={handleDeleteClick}
              setSelectedAppointment={setSelectedAppointment}
            />
          ) : (
            <EmptyState getErrorMessage={getErrorMessage} />
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {showRejectionModal && (
        <RejectionModal
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          handleRejectConfirm={handleRejectConfirm}
          onClose={() => {
            setShowRejectionModal(false);
            setRejectionReason("");
            setAppointmentToReject(null);
          }}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          appointmentToDelete={appointmentToDelete}
          selectedAppointments={selectedAppointments}
          handleDeleteConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirmation(false);
            setAppointmentToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Appointments;
