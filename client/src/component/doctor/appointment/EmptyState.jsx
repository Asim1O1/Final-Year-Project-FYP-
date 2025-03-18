import React from "react";
import { AlertCircle } from "lucide-react";

const EmptyState = ({ getErrorMessage }) => {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <AlertCircle size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        No appointments found
      </h3>
      <p className="text-gray-500">{getErrorMessage()}</p>
    </div>
  );
};

export default EmptyState;