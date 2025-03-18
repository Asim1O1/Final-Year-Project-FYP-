import React from "react";

const DeleteConfirmationModal = ({
  appointmentToDelete,
  selectedAppointments,
  handleDeleteConfirm,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
        <p className="mb-4">
          {appointmentToDelete
            ? `Are you sure you want to delete this appointment with ${appointmentToDelete?.user?.fullName}?`
            : `Are you sure you want to delete ${selectedAppointments.length} selected appointments?`}
        </p>
        <p className="text-red-600 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;