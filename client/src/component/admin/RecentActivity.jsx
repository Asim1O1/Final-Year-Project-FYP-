import { useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  Center,
  Button,
  Flex,
  useColorModeValue,
  Heading,
  Divider,
} from "@chakra-ui/react";
import {
  RiHospitalLine,
  RiUserAddLine,
  RiFileTextLine,
  RiStethoscopeLine,
  RiUserForbidLine,
  RiCalendarEventLine,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { handleGetRecentActivities } from "../../features/recent_activity/recentActivitySlice";
import CustomLoader from "../common/CustomSpinner";

// Icon mapping for different activity types
const activityIcons = {
  hospital_registration: RiHospitalLine,
  new_user: RiUserAddLine,
  report: RiFileTextLine,
  doctor_approval: RiStethoscopeLine,
  account_deactivated: RiUserForbidLine,
  appointment_completed: RiCalendarEventLine,
  // Add more mappings as needed
};

// Color mapping for different activity types
const activityColors = {
  hospital_registration: "blue.500",
  new_user: "green.500",
  report: "purple.500",
  doctor_approval: "teal.500",
  account_deactivated: "red.500",
  appointment_completed: "orange.500",
};

export const RecentActivity = () => {
  const dispatch = useDispatch();
  const {
    activities,
    isLoading,
    error,
    pagination = { currentPage: 1, totalPages: 1 },
  } = useSelector((state) => state.recentActivitySlice || {});
  const cardBg = useColorModeValue("white", "gray.800");
  const statCardBg = useColorModeValue("blue.50", "blue.900");
  const headingColor = useColorModeValue("blue.600", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { currentPage, totalPages } = pagination;

  useEffect(() => {
    console.log("Fetching recent activities...");
    dispatch(handleGetRecentActivities({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    dispatch(handleGetRecentActivities({ page: newPage, limit: 10 }));
  };

  if (isLoading) {
    return (
      <Center p={8}>
        <CustomLoader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center p={8} color="red.500">
        <Text>Failed to load activities: {error}</Text>
      </Center>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Center p={8}>
        <Text color="gray.500">No recent activities found</Text>
      </Center>
    );
  }

  // Format time to relative (e.g., "5 minutes ago")
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Activities List */}
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
        </VStack>
      </Box>

      {/* Pagination Controls */}
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
  );
};
