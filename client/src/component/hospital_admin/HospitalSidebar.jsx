import React from "react";
import { Box, VStack, Icon, Text, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom"; // Import for navigation
import {
  RiDashboardLine,
  RiStethoscopeLine,
  RiTestTubeLine,
  RiCalendarCheckLine,
  RiMegaphoneLine,
  RiSettings4Line,
} from "react-icons/ri";

export const HospitalSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: RiDashboardLine, label: "Dashboard", path: "/hospital-admin" },
    {
      icon: RiStethoscopeLine,
      label: "Doctors",
      path: "/hospital-admin/doctors",
    },
    {
      icon: RiTestTubeLine,
      label: "Medical Tests",
      path: "/hospital-admin/tests",
    },
    {
      icon: RiCalendarCheckLine,
      label: "Appointments",
      path: "/hospital-admin/appointments",
    },
    {
      icon: RiMegaphoneLine,
      label: "Campaigns",
      path: "/hospital-admin/campaigns",
    },
    {
      icon: RiSettings4Line,
      label: "Settings",
      path: "/hospital-admin/settings",
    },
  ];

  return (
    <Box w="64" bg="white" borderRight="1px" borderColor="gray.200" p={4}>
      <Flex mb={8} p={4}>
        <Text fontSize="xl" fontWeight="bold" color="blue.600">
          Hospital Admin
        </Text>
      </Flex>

      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => (
          <Flex
            key={item.label}
            p={3}
            cursor="pointer"
            borderRadius="md"
            _hover={{ bg: "blue.50" }}
            color="gray.700"
            alignItems="center"
            onClick={() => navigate(item.path)} // Trigger navigation on click
          >
            <Icon as={item.icon} boxSize={5} mr={3} />
            <Text>{item.label}</Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};
