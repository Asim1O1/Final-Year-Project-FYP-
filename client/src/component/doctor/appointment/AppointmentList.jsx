import React from "react";
import AppointmentItem from "./AppointmentItem";

const AppointmentList = ({
  appointments,
  selectedAppointments,
  activeTab,
  handleSelectAppointment,
  handleApproveAppointment,
  handleRejectClick,
  handleCompleteAppointment,
  handleReschedule,
  handleDeleteClick,
  setSelectedAppointment,
}) => {
  return (
    <>
      {appointments.map((appointment) => (
        <AppointmentItem
          key={appointment._id}
          appointment={appointment}
          isSelected={selectedAppointments.includes(appointment._id)}
          handleSelectAppointment={handleSelectAppointment}
          activeTab={activeTab}
          handleApproveAppointment={handleApproveAppointment}
          handleRejectClick={handleRejectClick}
          handleCompleteAppointment={handleCompleteAppointment}
          handleReschedule={handleReschedule}
          handleDeleteClick={handleDeleteClick}
          setSelectedAppointment={setSelectedAppointment}
        />
      ))}
    </>
  );
};

export default AppointmentList;
