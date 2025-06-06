import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  RiCalendarEventLine,
  RiFileTextLine,
  RiHospitalLine,
  RiRefreshLine,
  RiStethoscopeLine,
  RiUserAddLine,
  RiUserForbidLine,
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
  // Default fallback color
  default: "gray.500",
};

// Format time to relative (e.g., "5 minutes ago")
const formatRelativeTime = (dateString) => {
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

// Format absolute time for tooltip (e.g., "Jan 15, 2025, 3:45 PM")
const formatAbsoluteTime = (dateString) => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// ActivityItem component - extracted for better organization
const ActivityItem = ({ activity }) => {
  const activityColor = activityColors[activity.type] || activityColors.default;

  return (
    <HStack
      p={4}
      bg="gray.50"
      rounded="md"
      spacing={4}
      _hover={{ bg: "gray.100" }}
      transition="background 0.2s ease"
      aria-label={`Activity: ${activity.title}`}
    >
      <Box p={2} bg={activityColor} color="white" rounded="lg">
        <Icon as={activityIcons[activity.type] || RiFileTextLine} boxSize={5} />
      </Box>

      <Box flex={1}>
        <Text fontWeight="medium">{activity.title}</Text>
        <Text fontSize="sm" color="gray.600">
          {activity.description}
        </Text>
        <HStack mt={1} spacing={2}>
          <Text fontSize="xs" color="gray.500">
            Performed by: {activity.performedBy?.name || "System"}
          </Text>
          <Badge size="sm" colorScheme={activityColor.split(".")[0]}>
            {activity.type.replace(/_/g, " ")}
          </Badge>
        </HStack>
      </Box>

      <Tooltip
        label={formatAbsoluteTime(activity.createdAt)}
        placement="top"
        hasArrow
      >
        <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
          {formatRelativeTime(activity.createdAt)}
        </Text>
      </Tooltip>
    </HStack>
  );
};

// Pagination component - extracted for better organization
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5;

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first, last, and pages around current
    let pageNumbers = [1];

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Add last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <Flex justify="center" mt={4} aria-label="Pagination navigation">
      <HStack spacing={2}>
        <Button
          size="sm"
          onClick={() => onPageChange(1)}
          isDisabled={currentPage <= 1}
          aria-label="First page"
        >
          First
        </Button>
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage <= 1}
          aria-label="Previous page"
        >
          Previous
        </Button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <Text key={`ellipsis-${index}`} px={2}>
              ...
            </Text>
          ) : (
            <Button
              key={`page-${page}`}
              size="sm"
              colorScheme={currentPage === page ? "blue" : "gray"}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          )
        )}

        <Button
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          Next
        </Button>
        <Button
          size="sm"
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          Last
        </Button>
      </HStack>
    </Flex>
  );
};

export const RecentActivity = () => {
  const dispatch = useDispatch();
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isLoading, error } = useSelector(
    (state) => state.recentActivitySlice || {}
  );

  const activities = useSelector(
    (state) => state?.recentActivitySlice?.activities?.data || []
  );

  const { currentPage = 1, totalPages = 1 } = useSelector(
    (state) => state?.recentActivitySlice?.activities || {}
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const scrollbarTrackColor = useColorModeValue("gray.100", "gray.700");
  const scrollbarThumbColor = useColorModeValue("gray.400", "gray.500");

  useEffect(() => {
    loadActivities();
  }, [currentPage, itemsPerPage, dispatch]);

  const loadActivities = () => {
    dispatch(
      handleGetRecentActivities({
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  };

  const handlePageChange = (newPage) => {
    dispatch(
      handleGetRecentActivities({
        page: newPage,
        limit: itemsPerPage,
      })
    );
  };

  const handleRetry = () => {
    loadActivities();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center p={8} data-testid="loading-spinner">
          <CustomLoader size="xl" />
        </Center>
      );
    }

    if (error) {
      return (
        <Alert
          status="error"
          variant="left-accent"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={4}
          borderRadius="md"
        >
          <AlertIcon boxSize={6} mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Failed to load activities
          </AlertTitle>
          <AlertDescription maxWidth="sm">{error}</AlertDescription>
          <Button
            leftIcon={<Icon as={RiRefreshLine} />}
            mt={4}
            colorScheme="red"
            variant="outline"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </Alert>
      );
    }

    if (!activities || activities.length === 0) {
      return (
        <Center p={8}>
          <Text color="gray.500">No recent activities found</Text>
        </Center>
      );
    }

    return (
      <VStack
        spacing={4}
        align="stretch"
        maxH="500px"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: scrollbarTrackColor,
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: scrollbarThumbColor,
            borderRadius: "4px",
          },
        }}
        role="list"
        aria-label="Recent activities list"
      >
        {activities.map((activity) => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </VStack>
    );
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box
        bg={cardBg}
        p={6}
        rounded="xl"
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <HStack justifyContent="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="bold">
            You have been Active
          </Text>
          <IconButton
            icon={<Icon as={RiRefreshLine} />}
            aria-label="Refresh activities"
            size="sm"
            onClick={handleRetry}
            isLoading={isLoading}
          />
        </HStack>

        <Divider mb={4} />
        {renderContent()}
      </Box>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </VStack>
  );
};

export default RecentActivity;
