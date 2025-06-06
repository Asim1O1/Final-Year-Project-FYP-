import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiCheck, FiEye, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  handleClearAllNotifications,
  handleGetNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../../features/notification/notificationSlice";
import CustomLoader from "../common/CustomSpinner";

export const Notifications = () => {
  const dispatch = useDispatch();
  const notification = useToast();
  const { notifications, isLoading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(handleGetNotifications());
  }, [dispatch]);

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

  const formatTime = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }
    return notificationDate.toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(handleMarkNotificationAsRead(notificationId)).unwrap();
      notification.success({
        title: "Notification marked as read",
        status: "success",
        duration: 2,
        isClosable: true,
      });
    } catch (error) {
      notification.error({
        title: "Error marking notification as read",
        description: error.message,
        status: "error",
        duration: 3,
        isClosable: true,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(handleMarkAllNotificationsAsRead()).unwrap();
      notification.success({
        title: "All notifications marked as read",
        status: "success",
        duration: 2,
        isClosable: true,
      });
    } catch (error) {
      notification.error({
        title: "Error marking notifications as read",
        description: error.message,
        status: "error",
        duration: 3,
        isClosable: true,
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await dispatch(handleClearAllNotifications()).unwrap();
      notification.success({
        title: "All notifications cleared",
        status: "success",
        duration: 2,
        isClosable: true,
      });
    } catch (error) {
      notification.error({
        title: "Error clearing notifications",
        description: error.message,
        status: "error",
        duration: 3,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <CustomLoader size="xl" />
        <Text mt={4}>Loading notifications...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" rounded="md" border="1px" borderColor="red.200">
        <Text color="red.600">
          Error loading notifications: {error.message}
        </Text>
      </Box>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">No notifications available</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="flex-end" spacing={4}>
        <Button
          leftIcon={<FiCheck />}
          size="sm"
          onClick={handleMarkAllAsRead}
          isDisabled={notifications.every((n) => n.read)}
        >
          Mark All as Read
        </Button>
        <Button
          leftIcon={<FiTrash2 />}
          size="sm"
          colorScheme="red"
          variant="outline"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </HStack>

      {notifications.map((notification) => (
        <Box
          key={notification._id}
          p={4}
          bg={notification.read ? "white" : "blue.50"}
          border="1px"
          borderColor={notification.read ? "gray.200" : "blue.200"}
          rounded="md"
          _hover={{ bg: notification.read ? "gray.50" : "blue.100" }}
        >
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="medium">{notification.title}</Text>
            <HStack>
              <Badge colorScheme={getStatusColor(notification.type)}>
                {notification.type.replace(/_/g, " ")}
              </Badge>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  size="sm"
                  variant="ghost"
                  isDisabled={notification.read} // disable if no menu items
                />
                <MenuList>
                  {!notification.read && (
                    <MenuItem
                      icon={<FiEye />}
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      Mark as Read
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </HStack>
          </HStack>

          <Text fontSize="sm" color="gray.600" mb={2}>
            {notification.message}
          </Text>

          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.500">
              {formatTime(notification.createdAt)}
            </Text>
            {!notification.read && (
              <Badge colorScheme="blue" variant="subtle">
                New
              </Badge>
            )}
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};
