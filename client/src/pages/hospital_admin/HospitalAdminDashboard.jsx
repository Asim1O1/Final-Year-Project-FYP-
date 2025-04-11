import React, { useEffect } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Text,
  Icon,
  useColorModeValue,
  Divider,
  Alert,
  AlertIcon,
  Center,
  HStack,
  VStack,
  Button,
  Badge,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { handleGetDashboardStats } from "../../features/hospital_admin/hospitalAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetNotifications,
  handleClearAllNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";
import CustomLoader from "../../component/common/CustomSpinner";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaFlask,
  FaProjectDiagram,
  FaUserMd,
  FaBell,
  FaCheck,
  FaTrash,
  FaClock,
  FaCircleNotch,
  FaEllipsisV,
} from "react-icons/fa";

import { RiFileTextLine } from "react-icons/ri";
import { handleGetRecentActivities } from "../../features/recent_activity/recentActivitySlice";

export const HospitalAdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, error } = useSelector(
    (state) => state?.hospitalAdminSlice || {}
  );
  const {
    activities,
    isLoading,
    pagination = { currentPage: 1, totalPages: 1 },
  } = useSelector((state) => state.recentActivitySlice || {});
  const { currentPage, totalPages } = pagination;

  // Add notifications state
  const {
    notifications,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useSelector((state) => state.notifications || {});

  const cardBg = useColorModeValue("white", "gray.800");
  const statCardBg = useColorModeValue("blue.50", "blue.900");
  const headingColor = useColorModeValue("blue.600", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const unreadNotificationBg = useColorModeValue("blue.50", "blue.900");
  const notificationHoverBg = useColorModeValue("gray.100", "gray.700");

  // Icons for stat cards
  const statIcons = {
    "Total Doctors": FaUserMd,
    "Total Appointments": FaCalendarCheck,
    "Total Campaigns": FaProjectDiagram,
    "Medical Tests Today": FaFlask,
  };
  const activityIcons = {
    doctor_created: FaUserMd,
    campaign_created: FaCalendarAlt,
    medical_test_created: FaFlask,
    appointment_created: FaCalendarCheck,
  };
  const getStatusColor = (type) => {
    const colors = {
      new_hospital_admin: "blue",
      content_reported: "orange",
      system_alert: "red",
      system_wide: "purple",
      appointment: "teal",
      message: "green",
      payment: "yellow",
      campaign: "pink",
      test_booking: "cyan",
    };
    return colors[type] || "gray";
  };

  useEffect(() => {
    dispatch(handleGetDashboardStats());
    dispatch(handleGetRecentActivities({ page: currentPage, limit: 10 }));
    dispatch(handleGetNotifications());
  }, [dispatch, currentPage]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
  };

  const handlePageChange = (newPage) => {
    dispatch(handleGetRecentActivities({ page: newPage, limit: 10 }));
  };

  const handleMarkAsRead = (notificationId) => {
    console.log("eneterd the mark as read");
    dispatch(handleMarkNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    console.log("entered the handle mark all as read");
    dispatch(handleMarkAllNotificationsAsRead());
  };

  const handleClearAll = () => {
    dispatch(handleClearAllNotifications());
  };

  if (isLoading || notificationsLoading) return <CustomLoader size="xl" />;

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );

  // Check if dashboardStats exists and has stats array
  if (!dashboardStats || !dashboardStats.stats)
    return (
      <Alert status="info">
        <AlertIcon />
        No dashboard data available
      </Alert>
    );

  return (
    <Box p={5} bg={useColorModeValue("gray.50", "gray.900")} borderRadius="xl">
      {/* Summary Stats - Enhanced with gradients and icons */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {dashboardStats.stats.map((stat) => (
          <Box
            key={stat.label}
            bg={cardBg}
            p={6}
            rounded="xl"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
          >
            <Stat>
              <Flex justify="space-between" align="center" mb={2}>
                <StatLabel fontSize="md" fontWeight="medium" color="gray.600">
                  {stat.label}
                </StatLabel>
                <Box
                  p={2}
                  bg={stat.isIncrease ? "green.100" : "red.100"}
                  borderRadius="full"
                >
                  <StatArrow
                    type={stat.isIncrease ? "increase" : "decrease"}
                    color={stat.isIncrease ? "green.500" : "red.500"}
                  />
                </Box>
              </Flex>
              <StatNumber fontSize="2xl" fontWeight="bold" my={2}>
                {stat.number}
              </StatNumber>
              <StatHelpText
                fontSize="sm"
                color={stat.isIncrease ? "green.500" : "red.500"}
                fontWeight="medium"
              >
                {stat.change} from last month
              </StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      {/* Additional Stats - With icons and improved styling */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {Object.entries({
          "Total Appointments": dashboardStats.totalAppointments,
          "Total Campaigns": dashboardStats.totalCampaigns,
        }).map(([label, value]) => (
          <Box
            key={label}
            bg={statCardBg}
            p={6}
            rounded="xl"
            shadow="md"
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" top={0} right={0} p={4} opacity={0.2}>
              <Icon as={statIcons[label]} boxSize={12} color="blue.600" />
            </Box>
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium" color="gray.600">
                {label}
              </StatLabel>
              <StatNumber
                fontSize="3xl"
                fontWeight="bold"
                color="blue.600"
                my={2}
              >
                {value}
              </StatNumber>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Recent Activity - Enhanced with subtle styling */}
        <Box
          bg={cardBg}
          p={6}
          rounded="xl"
          shadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color={headingColor} fontWeight="semibold">
              Recent Activity
            </Heading>
          </Flex>
          <Divider mb={4} />

          {/* Actual Recent Activities List */}
          <VStack spacing={4} align="stretch" maxH="400px" overflowY="auto">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <HStack
                  key={activity._id}
                  p={4}
                  bg="gray.50"
                  rounded="md"
                  spacing={4}
                  _hover={{ bg: "gray.100" }}
                >
                  <Box p={2} bg="blue.500" color="white" rounded="lg">
                    <Icon
                      as={activityIcons[activity.type] || RiFileTextLine}
                      boxSize={5}
                    />
                  </Box>

                  <Box flex={1}>
                    <Text fontWeight="medium">{activity.title}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {activity.description}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Performed by: {activity.performedBy?.name || "System"}
                    </Text>
                  </Box>

                  <Text fontSize="sm" color="gray.500">
                    {formatTime(activity.createdAt)}
                  </Text>
                </HStack>
              ))
            ) : (
              <Center p={8}>
                <Text color="gray.500">No recent activities found</Text>
              </Center>
            )}
            {totalPages > 1 && (
              <Flex justify="center" mt={4}>
                <HStack spacing={2}>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Notifications Section */}
        <Box
          bg={cardBg}
          p={6}
          rounded="xl"
          shadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          {/* Header Section */}
          <HStack justify="space-between" mb={5}>
            <Heading size="md" color={headingColor} fontWeight="semibold">
              Notifications
            </Heading>
            <HStack spacing={2}>
              <Button
                leftIcon={<FaCheck />}
                size="sm"
                variant="outline"
                onClick={handleMarkAllAsRead}
                isDisabled={
                  !notifications ||
                  notifications.length === 0 ||
                  notifications.every((n) => n.isRead)
                }
                _hover={{ bg: "blue.50" }}
              >
                Mark all as read
              </Button>
              <Button
                leftIcon={<FaTrash />}
                size="sm"
                variant="outline"
                colorScheme="red"
                onClick={handleClearAll}
                isDisabled={!notifications || notifications.length === 0}
              >
                Clear all
              </Button>
            </HStack>
          </HStack>
          <Divider mb={4} />

          {/* Notifications List */}
          <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification._id}
                  p={4}
                  bg={notification.isRead ? "white" : "blue.50"}
                  border="1px"
                  borderColor={notification.isRead ? "gray.200" : "blue.200"}
                  rounded="lg"
                  _hover={{ bg: notification.isRead ? "gray.50" : "blue.100" }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Text
                        fontWeight={notification.isRead ? "medium" : "semibold"}
                      >
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <Badge
                          colorScheme="blue"
                          variant="subtle"
                          borderRadius="full"
                        >
                          New
                        </Badge>
                      )}
                    </HStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FaEllipsisV />}
                        size="sm"
                        variant="ghost"
                      />
                      <MenuList>
                        {!notification.isRead && (
                          <MenuItem
                            icon={<FaCheck />}
                            onClick={() => handleMarkAsRead(notification._id)}
                          >
                            Mark as read
                          </MenuItem>
                        )}
                        <MenuItem icon={<FaTrash />} color="red.500">
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>

                  <Text
                    fontSize="sm"
                    color={notification.isRead ? "gray.600" : "gray.700"}
                    mb={2}
                  >
                    {notification.message}
                  </Text>

                  <HStack justify="space-between">
                    <HStack spacing={1}>
                      <Icon as={FaClock} color="gray.400" boxSize={3} />
                      <Text fontSize="xs" color="gray.500">
                        {formatTime(notification.createdAt)}
                      </Text>
                    </HStack>
                    {notification.type && (
                      <Badge
                        colorScheme={getStatusColor(notification.type)}
                        variant="subtle"
                      >
                        {notification.type.replace(/_/g, " ")}
                      </Badge>
                    )}
                  </HStack>
                </Box>
              ))
            ) : (
              <Center p={10}>
                <VStack spacing={3}>
                  <Icon as={FaBell} boxSize={8} color="gray.300" />
                  <Text color="gray.500" fontWeight="medium">
                    No notifications available
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    You're all caught up!
                  </Text>
                </VStack>
              </Center>
            )}
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
};
