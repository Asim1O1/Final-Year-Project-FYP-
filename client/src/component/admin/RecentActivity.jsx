import React from "react";
import { VStack, HStack, Text, Icon, Box, Avatar } from "@chakra-ui/react";
import {
  RiHospitalLine,
  RiUserAddLine,
  RiFileTextLine,
  RiStethoscopeLine,
} from "react-icons/ri";

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "hospital_registration",
      icon: RiHospitalLine,
      title: "New Hospital Registration",
      description: "Central Medical Center submitted registration",
      time: "5 minutes ago",
      color: "blue.500",
    },
    {
      id: 2,
      type: "new_user",
      icon: RiUserAddLine,
      title: "New User Registration",
      description: "Dr. Sarah Wilson created an account",
      time: "15 minutes ago",
      color: "green.500",
    },
    {
      id: 3,
      type: "report",
      icon: RiFileTextLine,
      title: "Monthly Report Generated",
      description: "December 2024 analytics report is ready",
      time: "1 hour ago",
      color: "purple.500",
    },
    {
      id: 4,
      type: "doctor_approval",
      icon: RiStethoscopeLine,
      title: "Doctor Profile Approved",
      description: "Dr. Michael Chen profile verified",
      time: "2 hours ago",
      color: "teal.500",
    },
  ];

  return (
    <VStack spacing={4} align="stretch">
      {activities.map((activity) => (
        <HStack
          key={activity.id}
          p={4}
          bg="gray.50"
          rounded="md"
          spacing={4}
          _hover={{ bg: "gray.100" }}
        >
          <Box p={2} bg={activity.color} color="white" rounded="lg">
            <Icon as={activity.icon} boxSize={5} />
          </Box>

          <Box flex={1}>
            <Text fontWeight="medium">{activity.title}</Text>
            <Text fontSize="sm" color="gray.600">
              {activity.description}
            </Text>
          </Box>

          <Text fontSize="sm" color="gray.500">
            {activity.time}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
};
