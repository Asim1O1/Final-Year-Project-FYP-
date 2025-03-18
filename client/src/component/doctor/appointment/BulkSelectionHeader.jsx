import React from "react";

const BulkSelectionHeader = ({ 
  selectedAppointments, 
  appointments, 
  activeTab, 
  handleSelectAll 
}) => {
  return (
    <div className="flex items-center mb-4 pb-3 border-b">
      <div className="mr-4">
        <input
          type="checkbox"
          id="selectAll"
          checked={
            selectedAppointments.length === appointments[activeTab].length &&
            appointments[activeTab].length > 0
          }
          onChange={handleSelectAll}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700">
          Select All
        </label>
      </div>
      <div className="text-sm text-gray-500">
        {selectedAppointments.length} of {appointments[activeTab].length} selected
      </div>
    </div>
  );
};

export default BulkSelectionHeader;