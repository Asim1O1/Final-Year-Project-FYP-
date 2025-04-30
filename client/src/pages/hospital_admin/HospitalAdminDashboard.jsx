import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  CloseButton,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  FaBell,
  FaBellSlash,
  FaCalendarAlt,
  FaCalendarCheck,
  FaChartBar,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEllipsisV,
  FaExclamationTriangle,
  FaFlask,
  FaHistory,
  FaProjectDiagram,
  FaTrash,
  FaUser,
  FaUserCog,
  FaUserMd,
} from "react-icons/fa";
import { RiFileTextLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CustomLoader from "../../component/common/CustomSpinner";

import { Hospital } from "lucide-react";
import { handleGetDashboardStats } from "../../features/hospital_admin/hospitalAdminSlice";
import {
  handleClearAllNotifications,
  handleGetNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";
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

  const {
    notifications,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useSelector((state) => state.notifications || {});

  const cardBg = useColorModeValue("white", "gray.800");
  const statCardBg = useColorModeValue("blue.50", "blue.900");
  const headingColor = useColorModeValue("blue.600", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleHoverBg = useColorModeValue("gray.50", "gray.700");

  const activityIcons = {
    doctor_created: FaUserMd,
    campaign_created: FaCalendarAlt,
    medical_test_created: FaFlask,
    appointment_created: FaCalendarCheck,
  };

  const gradients = {
    "Total Doctors": "linear(to-br, purple.400, purple.600)",
    "Total Hospitals": "linear(to-br, teal.400, teal.600)",
    "Total Tests": "linear(to-br, orange.400, orange.600)",
    "Total Appointments": "linear(to-br, pink.400, pink.600)",
    "Total Campaigns": "linear(to-br, green.400, green.600)",
  };

  const statIcons = {
    "Total Doctors": FaUserMd,
    "Total Hospitals": Hospital,
    "Total Medical Tests": FaFlask,
    "Total Appointments": FaCalendarCheck,
    "Total Campaigns": FaProjectDiagram,
  };

  const allStats = [
    ...(dashboardStats?.stats?.map((stat) => ({
      label: stat.label,
      value: stat.number,
    })) || []),
    {
      label: "Total Appointments",
      value: dashboardStats?.totalAppointments || 0,
    },
    { label: "Total Campaigns", value: dashboardStats?.totalCampaigns || 0 },
  ];

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
    return date.toLocaleString();
  };

  const handlePageChange = (newPage) => {
    dispatch(handleGetRecentActivities({ page: newPage, limit: 10 }));
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(handleMarkNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(handleMarkAllNotificationsAsRead());
  };

  const handleClearAll = () => {
    dispatch(handleClearAllNotifications());
  };

  if (isLoading || notificationsLoading) {
    return (
      <Center h="60vh">
        <VStack spacing={4}>
          <CustomLoader size="xl" />
          <Text color="gray.500">Loading dashboard data...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || notificationsError) {
    return (
      <Alert status="error" variant="left-accent" borderRadius="md" my={4}>
        <AlertIcon />
        <Box>
          <AlertTitle mb={1}>Error Loading Dashboard</AlertTitle>
          <AlertDescription>
            {error?.message ||
              notificationsError?.message ||
              "An error occurred"}
          </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );
  }

  if (!dashboardStats || !dashboardStats.stats) {
    return (
      <Box
        p={10}
        textAlign="center"
        borderRadius="xl"
        bg={cardBg}
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Icon as={FaChartBar} boxSize={12} color="gray.300" mb={4} />
        <Heading size="md" color="gray.500" mb={2}>
          No Dashboard Data Available
        </Heading>
        <Text color="gray.400">
          Statistics will appear here once data is available.
        </Text>
        <Button mt={6} colorScheme="blue">
          Refresh Data
        </Button>
      </Box>
    );
  }

  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg={useColorModeValue("gray.50", "gray.900")}
      borderRadius="xl"
    >
      {/* Stats Cards */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 5 }} // Reduced columns to make each card wider
        spacing={6} // Balanced spacing
        mb={8}
      >
        {allStats.map((stat) => (
          <Box
            key={stat.label}
            bg={statCardBg}
            p={6}
            rounded="xl"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
            transition="all 0.3s ease"
            minW="200px" // Minimum width constraint
            flex="1" // Allow cards to grow
            _hover={{
              transform: "translateY(-5px)",
              shadow: "lg",
              borderColor: "blue.300",
            }}
          >
            {/* Gradient background overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient={gradients[stat.label]}
              opacity={0.1}
              borderRadius="xl"
            />

            {/* Icon with better positioning */}
            <Box
              position="absolute"
              top={4}
              right={3.5}
              opacity={0.3}
              _hover={{ opacity: 0.6 }}
            >
              <Icon as={statIcons[stat.label]} boxSize={7} color="blue.500" />
            </Box>

            {/* Stat content with better spacing */}
            <Stat position="relative">
              <StatLabel
                fontSize="md" // Slightly larger font
                fontWeight="medium"
                color="gray.600"
                mb={5} // Increased margin
                noOfLines={2} // Ensure long labels wrap nicely
                minH="48px" // Consistent height for labels
              >
                {stat.label}
              </StatLabel>
              <StatNumber
                fontSize="2xl"
                fontWeight="bold"
                color={useColorModeValue("blue.700", "blue.300")}
                mt={2} // More spacing
                lineHeight="1.2"
              >
                {stat.value.toLocaleString()}
              </StatNumber>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      {/* Recent Activity + Notifications */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={{ base: 6, lg: 8 }}
      >
        {/* Recent Activity Panel */}
        <Box
          bg={cardBg}
          p={{ base: 4, md: 6 }}
          rounded="xl"
          shadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          height="fit-content"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            pb={3}
            borderBottom="1px"
            borderColor={borderColor}
          >
            <HStack>
              <Icon as={FaHistory} color={headingColor} boxSize={5} />
              <Heading size="md" color={headingColor} fontWeight="semibold">
                Recent Activity
              </Heading>
            </HStack>
          </Flex>

          {/* Activities List */}
          <VStack
            spacing={3}
            align="stretch"
            maxH="500px"
            overflowY="auto"
            pr={2}
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--chakra-colors-gray-300)",
                borderRadius: "4px",
              },
            }}
          >
            {activities.length > 0 ? (
              activities.map((activity) => (
                <Box
                  key={activity._id}
                  p={4}
                  bg={useColorModeValue("white", "gray.750")}
                  rounded="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  _hover={{
                    bg: subtleHoverBg,
                    transform: "translateX(2px)",
                  }}
                  transition="all 0.2s ease"
                >
                  <Flex align="flex-start" gap={4}>
                    <Box
                      p={3}
                      bg={useColorModeValue("blue.100", "blue.800")}
                      color={useColorModeValue("blue.700", "blue.200")}
                      rounded="xl"
                      height="fit-content"
                    >
                      <Icon
                        as={activityIcons[activity.type] || RiFileTextLine}
                        boxSize={5}
                      />
                    </Box>

                    <Box flex={1}>
                      <Text fontWeight="semibold" mb={1}>
                        {activity.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        {activity.description}
                      </Text>
                      <Flex
                        justify="space-between"
                        align="center"
                        fontSize="xs"
                        color="gray.500"
                      >
                        <HStack>
                          <Icon as={FaUser} boxSize={3} />
                          <Text>{activity.performedBy?.name || "System"}</Text>
                        </HStack>
                        <Flex align="center" gap={1}>
                          <Icon as={FaClock} boxSize={3} />
                          <Text>{formatTime(activity.createdAt)}</Text>
                        </Flex>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))
            ) : (
              <Center p={12} borderRadius="lg" bg={subtleHoverBg}>
                <VStack spacing={3}>
                  <Icon as={FaHistory} boxSize={10} color="gray.300" />
                  <Text color="gray.500" fontWeight="medium">
                    No recent activities found
                  </Text>
                  <Text fontSize="sm" color="gray.400" textAlign="center">
                    Recent activities will appear here as they occur
                  </Text>
                </VStack>
              </Center>
            )}
          </VStack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex
              justify="center"
              mt={6}
              pt={4}
              borderTop="1px"
              borderColor={borderColor}
            >
              <ButtonGroup size="sm" isAttached variant="outline">
                <IconButton
                  icon={<FaChevronLeft />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage <= 1}
                  aria-label="Previous page"
                />
                <Button variant="outline" isDisabled>
                  Page {currentPage} of {totalPages}
                </Button>
                <IconButton
                  icon={<FaChevronRight />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage >= totalPages}
                  aria-label="Next page"
                />
              </ButtonGroup>
            </Flex>
          )}
        </Box>

        {/* Notifications Panel */}
        <Box
          bg={cardBg}
          p={{ base: 4, md: 6 }}
          rounded="xl"
          shadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          height="fit-content"
        >
          {/* Header Section */}
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            pb={3}
            borderBottom="1px"
            borderColor={borderColor}
          >
            <HStack>
              <Icon as={FaBell} color={headingColor} boxSize={5} />
              <Heading size="md" color={headingColor} fontWeight="semibold">
                Notifications
              </Heading>
              {notifications &&
                notifications.filter((n) => !n.read).length > 0 && (
                  <Badge colorScheme="blue" borderRadius="full" px={2}>
                    {notifications.filter((n) => !n.read).length}
                  </Badge>
                )}
            </HStack>
            <HStack spacing={2}>
              <Tooltip label="Mark all as read" hasArrow placement="top">
                <IconButton
                  icon={<FaCheck />}
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAllAsRead}
                  isDisabled={
                    !notifications ||
                    notifications.length === 0 ||
                    notifications.every((n) => n.read)
                  }
                  aria-label="Mark all as read"
                />
              </Tooltip>
              <Tooltip label="Clear all notifications" hasArrow placement="top">
                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleClearAll}
                  isDisabled={!notifications || notifications.length === 0}
                  aria-label="Clear all notifications"
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Notifications List */}
          <VStack
            spacing={3}
            align="stretch"
            maxH="500px"
            overflowY="auto"
            pr={2}
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--chakra-colors-gray-300)",
                borderRadius: "4px",
              },
            }}
          >
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification._id}
                  p={4}
                  bg={
                    notification.read
                      ? "transparent"
                      : useColorModeValue("blue.50", "blue.900")
                  }
                  borderLeft="4px"
                  borderColor={
                    notification.read
                      ? borderColor
                      : `${getStatusColor(notification.type)}.500`
                  }
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{
                    bg: notification.read
                      ? subtleHoverBg
                      : useColorModeValue("blue.100", "blue.800"),
                  }}
                  transition="all 0.2s"
                  position="relative"
                >
                  <Flex direction="column">
                    <Flex justify="space-between" align="center" mb={2}>
                      <HStack>
                        {notification.type && (
                          <Icon
                            as={
                              notification.type.includes("campaign")
                                ? FaCalendarAlt
                                : notification.type.includes("appointment")
                                ? FaCalendarCheck
                                : notification.type.includes("admin")
                                ? FaUserCog
                                : notification.type.includes("system")
                                ? FaExclamationTriangle
                                : FaBell
                            }
                            color={`${getStatusColor(notification.type)}.500`}
                            boxSize={4}
                          />
                        )}
                        <Text
                          fontWeight={notification.read ? "medium" : "bold"}
                        >
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <Badge
                            colorScheme="blue"
                            variant="solid"
                            fontSize="xs"
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
                          aria-label="Options"
                        />
                        <MenuList>
                          {!notification.read && (
                            <MenuItem
                              icon={<FaCheck />}
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              Mark as read
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                    </Flex>

                    <Text
                      fontSize="sm"
                      color={notification.read ? "gray.600" : "gray.700"}
                      mb={3}
                    >
                      {notification.message}
                    </Text>

                    <Flex
                      justify="space-between"
                      align="center"
                      mt={1}
                      fontSize="xs"
                    >
                      <HStack spacing={1}>
                        <Icon as={FaClock} color="gray.400" boxSize={3} />
                        <Text color="gray.500">
                          {formatTime(notification.createdAt)}
                        </Text>
                      </HStack>
                      {notification.type && (
                        <Badge
                          colorScheme={getStatusColor(notification.type)}
                          variant="subtle"
                          textTransform="capitalize"
                        >
                          {notification.type.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              ))
            ) : (
              <Center p={12} borderRadius="lg" bg={subtleHoverBg}>
                <VStack spacing={3}>
                  <Icon as={FaBellSlash} boxSize={10} color="gray.300" />
                  <Text color="gray.500" fontWeight="medium">
                    No notifications available
                  </Text>
                  <Text fontSize="sm" color="gray.400" textAlign="center">
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
