import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building,
  FileText,
  AlertCircle,
  CreditCard,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Loader,
  ExternalLink,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointmentById } from "../../features/appointment/appointmentSlice";

const AppointmentDetail = () => {
  const { id } = useParams();
  console.log("The appointment id", id)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const appointment = useSelector(
    (state) => state.appointmentSlice.appointment
  );

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      dispatch(fetchAppointmentById(id))
        .unwrap()
        .then(() => setLoading(false))
        .catch((err) => {
          console.error("Error fetching appointment details:", err);
          setError(err.message || "Failed to fetch appointment details");
          setLoading(false);
        });
    }
  }, [id, dispatch]);

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "not_required":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment method display text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "pay_on_site":
        return "Pay on site";
      case "pay_now":
        return "Online payment";
      default:
        return method;
    }
  };

  // Handle back button
  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader
          className="w-12 h-12 text-blue-600 animate-spin"
          aria-label="Loading"
        />
        <p className="mt-4 text-gray-600 font-medium">
          Loading appointment details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-500" aria-label="Error" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Error Loading Appointment
        </h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          aria-label="Go back"
        >
          <ChevronLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle
          className="w-16 h-16 text-yellow-500"
          aria-label="Not found"
        />
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Appointment Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The appointment you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          aria-label="Go back"
        >
          <ChevronLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Back to notifications"
          >
            <ChevronLeft size={20} />
            <span>Back to Notifications</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Appointment Details
          </h1>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Appointment Status Banner */}
          <div
            className={`p-4 ${
              appointment.status === "canceled"
                ? "bg-red-500"
                : appointment.status === "completed"
                ? "bg-green-500"
                : "bg-blue-500"
            } text-white`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {appointment.status === "canceled" ? (
                  <XCircle size={24} aria-label="Canceled" />
                ) : appointment.status === "completed" ? (
                  <CheckCircle size={24} aria-label="Completed" />
                ) : (
                  <Calendar size={24} aria-label="Pending" />
                )}
                <h2 className="text-lg font-semibold">
                  {appointment.status === "canceled"
                    ? "Canceled Appointment"
                    : appointment.status === "completed"
                    ? "Completed Appointment"
                    : appointment.status === "confirmed"
                    ? "Confirmed Appointment"
                    : "Pending Appointment"}
                </h2>
              </div>
              <div
                className={`px-3 py-1 rounded-full ${getStatusColor(
                  appointment.status
                )} text-sm font-medium`}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Date & Time */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Date & Time
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar
                        className="w-5 h-5 text-blue-600"
                        aria-label="Date"
                      />
                      <div className="text-gray-800">
                        {formatDate(appointment.date)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock
                        className="w-5 h-5 text-blue-600"
                        aria-label="Time"
                      />
                      <div className="text-gray-800">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor & Hospital */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Healthcare Provider
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Stethoscope
                        className="w-5 h-5 text-blue-600"
                        aria-label="Doctor"
                      />
                      <div>
                        <div className="text-gray-800 font-medium">
                          {appointment.doctor.fullName}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {appointment.doctor.specialty}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building
                        className="w-5 h-5 text-blue-600"
                        aria-label="Hospital"
                      />
                      <div>
                        <div className="text-gray-800 font-medium">
                          {appointment.hospital.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {appointment.hospital.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User
                        className="w-5 h-5 text-blue-600"
                        aria-label="Patient"
                      />
                      <div>
                        <div className="text-gray-800 font-medium">
                          {appointment.user.fullName}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {appointment.user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Appointment Reason */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Reason for Visit
                  </h3>
                  <div className="flex items-start gap-3">
                    <FileText
                      className="w-5 h-5 text-blue-600 mt-1"
                      aria-label="Reason"
                    />
                    <p className="text-gray-800">{appointment.reason}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CreditCard
                        className="w-5 h-5 text-blue-600"
                        aria-label="Payment method"
                      />
                      <div>
                        <div className="text-gray-800 font-medium">
                          Payment Method
                        </div>
                        <div className="text-gray-600">
                          {getPaymentMethodText(appointment.paymentMethod)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div
                          className={`px-2 py-1 rounded-full ${getPaymentStatusColor(
                            appointment.paymentStatus
                          )} text-xs font-medium`}
                        >
                          {appointment.paymentStatus.charAt(0).toUpperCase() +
                            appointment.paymentStatus.slice(1)}
                        </div>
                      </div>
                      {appointment.paymentId && (
                        <div className="text-gray-600 text-sm">
                          Payment ID: {appointment.paymentId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rejection Reason (if applicable) */}
                {appointment.status === "canceled" &&
                  appointment.rejectionReason && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h3 className="text-sm font-medium text-red-500 mb-2">
                        Cancellation Reason
                      </h3>
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="w-5 h-5 text-red-500 mt-1"
                          aria-label="Cancellation reason"
                        />
                        <p className="text-gray-800">
                          {appointment.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                  {appointment.status === "confirmed" && (
                    <button
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      aria-label="Get directions"
                    >
                      <ExternalLink size={16} />
                      Get Directions to Hospital
                    </button>
                  )}

                  {appointment.status === "pending" && (
                    <button
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      aria-label="Cancel appointment"
                    >
                      <XCircle size={16} />
                      Cancel Appointment
                    </button>
                  )}

                  {appointment.paymentStatus === "pending" &&
                    appointment.paymentMethod === "pay_now" && (
                      <button
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        aria-label="Complete payment"
                      >
                        <CreditCard size={16} />
                        Complete Payment
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Created At / Updated At */}
        <div className="mt-4 text-right text-xs text-gray-500">
          <p>Created: {new Date(appointment.createdAt).toLocaleString()}</p>
          {appointment.updatedAt !== appointment.createdAt && (
            <p>
              Last updated: {new Date(appointment.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
