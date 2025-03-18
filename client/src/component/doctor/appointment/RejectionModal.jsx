import React from "react";

const RejectionModal = ({
  rejectionReason,
  setRejectionReason,
  handleRejectConfirm,
  onClose,
}) => {
  return (
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
            onClick={onClose}
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
  );
};

export default RejectionModal;