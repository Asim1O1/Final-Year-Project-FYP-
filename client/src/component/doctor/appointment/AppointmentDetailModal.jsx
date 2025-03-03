// src/components/AppointmentDetailsModal.js
import React from "react";
import { X, Check, Edit } from "lucide-react";
import StatusBadge from "./StatusBadge";

const AppointmentDetailsModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Appointment Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex items-center">
          <div>
            <h4 className="text-xl font-semibold">{appointment.patientName}</h4>
            <p className="text-gray-600">{appointment.patientContact}</p>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {appointment.date}, {appointment.time}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Reason for Visit</p>
            <p className="font-medium">{appointment.reason}</p>
          </div>
        </div>

        {appointment.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Notes</p>
            <div className="bg-gray-50 p-3 rounded">
              <p>{appointment.notes}</p>
            </div>
          </div>
        )}

        {appointment.cancellationReason && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Cancellation Reason</p>
            <div className="bg-gray-50 p-3 rounded">
              <p>{appointment.cancellationReason}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          {appointment.status === "pending" && (
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
          {appointment.status === "confirmed" && (
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center">
              <Check size={14} className="mr-1" />
              Mark Completed
            </button>
          )}
          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 flex items-center">
            <Edit size={14} className="mr-1" />
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
