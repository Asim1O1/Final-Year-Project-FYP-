// src/components/TabButton.js
import React from 'react';

const TabButton = ({ name, label, count, activeTab, setActiveTab }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === name
          ? "bg-white text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-blue-600"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {label} ({count})
    </button>
  );
};

export default TabButton;
