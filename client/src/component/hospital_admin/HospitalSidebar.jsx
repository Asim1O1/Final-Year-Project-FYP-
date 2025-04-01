import React from "react";
import { Box, VStack, Icon, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";                                                                                        
import {
  RiDashboardLine,
  RiStethoscopeLine,
  RiTestTubeLine,
  RiCalendarCheckLine,
  RiMegaphoneLine,
  RiSettings4Line,
  RiUserHeartLine, // Added for volunteer requests
} from "react-icons/ri";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { LogOutIcon } from "lucide-react";

export const HospitalSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("Entered the handle logout");
    dispatch(logoutUser());
    navigate("/login");
  };

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
      path: "/hospital-admin/medicalTests",
    },
    {
      icon: RiCalendarCheckLine,
      label: "Appointments",
      path: "/hospital-admin/bookings",
    },
    {
      icon: RiMegaphoneLine,
      label: "Campaigns",
      path: "/hospital-admin/campaign",
    },
    {
      icon: RiUserHeartLine, // Using heart user icon for volunteer requests
      label: "Volunteer Requests",
      path: "/hospital-admin/volunteer-requests",
    },
    {
      icon: RiSettings4Line,
      label: "Settings",
      path: "/hospital-admin/settings",
    },
    {
      icon: LogOutIcon,
      label: "Logout",
      action: handleLogout, // Logout action
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
            onClick={() => {
              if (item.action) {
                item.action(); // Call the logout action
              } else {
                navigate(item.path); // Navigate if no action is present
              }
            }}
          >
            <Icon as={item.icon} boxSize={5} mr={3} />
            <Text>{item.label}</Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};