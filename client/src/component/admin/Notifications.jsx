import React from 'react';
import { VStack, HStack, Text, Box, Badge } from '@chakra-ui/react';

export const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Pending Hospital Approvals',
      message: '5 new hospitals awaiting verification',
      time: '2 hours ago',
      status: 'urgent'
    },
    {
      id: 2,
      type: 'warning',
      title: 'User Reports',
      message: '3 new user complaints need review',
      time: '4 hours ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'Platform maintenance scheduled for tonight',
      time: '5 hours ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Complete',
      message: 'Daily backup completed successfully',
      time: '6 hours ago',
      status: 'success'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      urgent: 'red',
      warning: 'orange',
      info: 'blue',
      success: 'green'
    };
    return colors[status] || 'gray';
  };

  return (
    <VStack spacing={4} align="stretch">
      {notifications.map((notification) => (
        <Box
          key={notification.id}
          p={4}
          bg="white"
          border="1px"
          borderColor="gray.200"
          rounded="md"
          _hover={{ bg: 'gray.50' }}
        >
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="medium">{notification.title}</Text>
            <Badge colorScheme={getStatusColor(notification.status)}>
              {notification.status}
            </Badge>
          </HStack>
          
          <Text fontSize="sm" color="gray.600" mb={2}>
            {notification.message}
          </Text>
          
          <Text fontSize="xs" color="gray.500">
            {notification.time}
          </Text>
        </Box>
      ))}
    </VStack>
  );
};