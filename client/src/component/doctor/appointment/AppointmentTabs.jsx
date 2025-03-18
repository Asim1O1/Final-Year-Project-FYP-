import React from "react";
import TabButton from "./TabButton.jsx";

const AppointmentTabs = ({ appointments, activeTab, setActiveTab }) => {
  return (
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
  );
};

export default AppointmentTabs;