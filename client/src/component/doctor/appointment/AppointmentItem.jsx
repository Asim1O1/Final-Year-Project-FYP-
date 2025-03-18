import React from "react";
import { Calendar, Check, X, Download, RefreshCcw, Trash } from "lucide-react";
import StatusBadge from "../../../component/doctor/appointment/StatusBadge.jsx";

const AppointmentItem = ({
  appointment,
  isSelected,
  handleSelectAppointment,
  activeTab,
  handleApproveAppointment,
  handleRejectClick,
  handleCompleteAppointment,
  handleReschedule,
  handleDeleteClick,
  setSelectedAppointment,
}) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectAppointment(appointment._id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <h3 className="font-medium text-gray-800">
              {appointment?.user?.fullName}
            </h3>
            <p className="text-sm text-gray-500">{appointment?.user?.email}</p>
            <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
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
            <span className="font-medium">Notes:</span> {appointment.notes}
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
          {activeTab === "upcoming" && appointment.status === "pending" && (
            <>
              <button
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                onClick={() => handleApproveAppointment(appointment._id)}
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
          {(activeTab === "upcoming" || activeTab === "confirmed") &&
            appointment.status === "confirmed" && (
              <button
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                onClick={() => handleCompleteAppointment(appointment._id)}
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
          <button
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
            onClick={() => handleDeleteClick(appointment)}
          >
            <Trash size={14} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;