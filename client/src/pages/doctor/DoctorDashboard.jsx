// src/pages/Dashboard.js
import {
  Calendar,
  MessageSquare,
  Check,
  X as XIcon,
  ChevronRight,
  User,
  Bell,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Grid,
  FileText,
  Mail,
  Stethoscope,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorAppointmentsSummary,
  fetchDoctorDashboardStats,
} from "../../features/doctor/doctorSlice";
import { notification } from "antd";
import {
  handleClearAllNotifications,
  handleGetNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";
import CustomLoader from "../../component/common/CustomSpinner";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AppointmentPreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, appointmentsSummary } = useSelector(
    (state) => state.doctorSlice
  );
  const cardBg = useColorModeValue("white", "gray.800");

  const borderColor = useColorModeValue("gray.200", "gray.700");

  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  const todayAppointments = appointmentsSummary?.data?.todaysAppointments || [];
  console.log("The today appointments is", todayAppointments);
  const upcomingAppointments =
    appointmentsSummary?.data?.upcomingAppointments || [];

  const todayCount = todayAppointments.length;

  console.log("Th etodays counbtt", todayCount);
  const upcomingCount = upcomingAppointments.length;

  useEffect(() => {
    dispatch(fetchDoctorAppointmentsSummary());
  }, [dispatch]);

  const AppointmentCard = ({ appointment, highlight = false }) => {
    // Dynamic styling based on highlight status for visual distinction
    const borderColor = highlight ? "border-blue-400" : "border-gray-200";
    const bgColor = highlight ? "bg-blue-50" : "bg-white";

    // Get appropriate status color for visual indicator
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "confirmed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        case "completed":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    // Calculate appointment duration in minutes
    const calculateDuration = (start, end) => {
      if (!start || !end) return "";

      const [startHour, startMin] = start.split(":").map(Number);
      const [endHour, endMin] = end.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const duration = endMinutes - startMinutes;

      return duration > 0 ? `(${duration} min)` : "";
    };

    const status = appointment?.status || "pending";
    const statusClass = getStatusColor(status);
    const duration = calculateDuration(
      appointment?.startTime,
      appointment?.endTime
    );

    return (
      <div
        className={`rounded-lg border-2 ${borderColor} ${bgColor} shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden`}
        aria-label={`Appointment for ${
          appointment?.user?.fullName || "Patient"
        }`}
      >
        {/* Status banner at top */}
        <div
          className={`w-full py-1 px-3 text-center text-sm font-medium ${statusClass} border-b border-gray-200`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        <div className="p-5">
          {/* Card header with patient name and appointment ID */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="font-semibold text-gray-900 text-lg">
                {appointment?.user?.fullName || "Unnamed Patient"}
              </h3>
            </div>
          </div>

          {/* Detailed appointment information section */}
          <div className="space-y-4">
            {/* Contact email */}
            <div className="flex items-center text-gray-600 group">
              <div className="bg-gray-100 p-1 rounded mr-3">
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Contact Email</p>
                <span
                  className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors"
                  title={appointment?.user?.email}
                >
                  {appointment?.user?.email || "No email provided"}
                </span>
              </div>
            </div>

            {/* Appointment date */}
            <div className="flex items-center text-gray-600 group">
              <div className="bg-gray-100 p-1 rounded mr-3">
                <Calendar className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Appointment Date</p>
                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  {appointment?.date || "Date not specified"}
                </span>
              </div>
            </div>

            {/* Appointment time slot */}
            <div className="flex items-center text-gray-600 group">
              <div className="bg-gray-100 p-1 rounded mr-3">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Time Slot</p>
                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  {appointment?.startTime || "00:00"} -{" "}
                  {appointment?.endTime || "00:00"}
                  <span className="text-gray-400 text-xs ml-1">{duration}</span>
                </span>
              </div>
            </div>

            {/* Appointment reason/description */}
            <div className="flex items-start text-gray-600 group">
              <div className="bg-gray-100 p-1 rounded mr-3 mt-0.5">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Reason for Visit</p>
                <span
                  className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors"
                  title={appointment?.reason}
                >
                  {appointment?.reason || "No reason specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-5 pb-2">
          <div className="flex justify-between items-center">
            <div className="h-7 bg-gray-200 animate-pulse rounded w-40"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 bg-gray-100 animate-pulse rounded-md w-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      shadow="lg"
      borderRadius="xl"
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      overflow="hidden"
    >
      <Tabs variant="soft-rounded" colorScheme="blue" size="md">
        <CardHeader pb={0}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading
              size="md"
              fontWeight="bold"
              color={useColorModeValue("gray.800", "white")}
              display="flex"
              alignItems="center"
            >
              <Icon as={Calendar} boxSize={5} mr={2} />
              Appointments
            </Heading>
            <Button
              variant="outline"
              colorScheme="blue"
              size="sm"
              rightIcon={<ChevronRight size={16} />}
              borderRadius="full"
              _hover={{ bg: highlightBg }}
              onClick={() => navigate("/doctor/appointments")} // 👈 Change this to your actual route
            >
              View All
            </Button>
          </Flex>

          <TabList>
            <Tab>Today's Schedule ({todayCount || 0})</Tab>
            <Tab>Upcoming ({upcomingCount || 0})</Tab>
          </TabList>
        </CardHeader>

        <CardBody pt={4}>
          <TabPanels>
            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id || appointment._id}
                      appointment={appointment}
                      highlight={true}
                    />
                  ))
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    p={8}
                    color={secondaryText}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderStyle="dashed"
                  >
                    <Icon as={CheckCircle} boxSize={9} mb={2} />
                    <Text fontWeight="medium">
                      No appointments scheduled for today
                    </Text>
                    <Text fontSize="sm">
                      Your schedule is clear for the day
                    </Text>
                  </Flex>
                )}
              </VStack>
            </TabPanel>

            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => {
                    console.log("Rendering appointment:", appointment);
                    return (
                      <AppointmentCard
                        key={appointment?._id || appointment?.id}
                        appointment={appointment}
                        s
                      />
                    );
                  })
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    p={8}
                    color={secondaryText}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderStyle="dashed"
                  >
                    <Icon as={Calendar} boxSize={9} mb={2} />
                    <Text fontWeight="medium">No upcoming appointments</Text>
                    <Text fontSize="sm">
                      Your future schedule is currently empty
                    </Text>
                  </Flex>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </CardBody>
      </Tabs>
    </Card>
  );
};

const NotificationsPanel = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(handleGetNotifications());
  }, [dispatch]);

  const getStatusColor = (type) => {
    const colors = {
      new_hospital_admin: "bg-blue-100 text-blue-800",
      content_reported: "bg-orange-100 text-orange-800",
      system_alert: "bg-red-100 text-red-800",
      system_wide: "bg-purple-100 text-purple-800",
      appointment: "bg-teal-100 text-teal-800",
      message: "bg-green-100 text-green-800",
      payment: "bg-yellow-100 text-yellow-800",
      campaign: "bg-pink-100 text-pink-800",
      test_booking: "bg-cyan-100 text-cyan-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return notificationDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(handleMarkNotificationAsRead(notificationId)).unwrap();
      notification.success({
        message: "Marked as read",
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: "Failed to update",
        duration: 3,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(handleMarkAllNotificationsAsRead()).unwrap();
      notification.success({
        message: "All marked as read",
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: "Action failed",
        duration: 3,
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await dispatch(handleClearAllNotifications()).unwrap();
      notification.success({
        message: "Notifications cleared",
        duration: 2,
      });
    } catch (error) {
      console.error("The error is", error);
      notification.error({
        message: "Action failed",
        duration: 3,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-center items-center h-48">
            <CustomLoader size="md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <p className="text-red-500 text-sm">Unable to load notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="py-3 px-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell size={16} />
            <span className="font-medium text-sm">Notifications</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
              title="Mark all as read"
              onClick={handleMarkAllAsRead}
              disabled={!notifications || notifications.every((n) => n.read)}
            >
              <Check size={14} />
            </button>
            <button
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
              title="Clear all"
              onClick={handleClearAll}
              disabled={!notifications || notifications.length === 0}
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {!notifications || notifications.length === 0 ? (
          <div className="flex justify-center items-center p-6 text-gray-400 h-24">
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 transition-colors ${
                  notification.read
                    ? "hover:bg-gray-50"
                    : "bg-blue-50 hover:bg-blue-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span
                        className={`text-sm ${
                          notification.read ? "font-normal" : "font-medium"
                        }`}
                      >
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-400 ml-2"></div>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.createdAt)}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(
                          notification.type
                        )} capitalize`}
                      >
                        {notification.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="ml-2 mt-1">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Mark as read"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <AlertCircle size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatsSummary = () => {
  const dispatch = useDispatch();
  const { doctorStats, isLoading } = useSelector((state) => state.doctorSlice);

  useEffect(() => {
    dispatch(fetchDoctorDashboardStats());
  }, [dispatch]);

  const stats = [
    {
      name: "Appointments",
      value: doctorStats?.data?.totalAppointments ?? 0,
      icon: <Calendar size={20} />,
      color: "blue",
    },
    {
      name: "Patients",
      value: doctorStats?.data?.totalPatients ?? 0,
      icon: <User size={20} />,
      color: "green",
    },
    {
      name: "Messages",
      value: doctorStats?.data?.totalUnreadMessages ?? 0,
      icon: <MessageSquare size={20} />,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-transform hover:translate-y-[-4px]"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{stat.name}</p>
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded w-16"></div>
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
            </div>
            <div
              className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-500`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Component
const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <StatsSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentPreview />
        </div>
        <div>
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
