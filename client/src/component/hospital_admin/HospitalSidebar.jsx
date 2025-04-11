import React, { useState } from "react";
import { Box, VStack, Icon, Text, Flex, Collapse } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiStethoscopeLine,
  RiTestTubeLine,
  RiCalendarCheckLine,
  RiMegaphoneLine,

  RiUserHeartLine,
  RiFileListLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { LogOutIcon } from "lucide-react";

export const HospitalSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleLogout = () => {
    console.log("Entered the handle logout");
    dispatch(logoutUser());
    navigate("/login");
  };

  const toggleSubMenu = (label) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubMenuActive = (item) => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem) => location.pathname === subItem.path);
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
      label: "Test Bookings",
      path: "/hospital-admin/bookings",
    },
    {
      icon: RiFileListLine,
      label: "Medical Reports",
      path: "/hospital-admin/medical-reports",
      subItems: [
        {
          label: "All Reports",
          path: "/hospital-admin/medical-reports",
        },
        {
          label: "Upload Report",
          path: "/hospital-admin/medical-reports/upload",
        },
      ],
    },
    {
      icon: RiMegaphoneLine,
      label: "Campaigns",
      path: "/hospital-admin/campaign",
    },
    {
      icon: RiUserHeartLine,
      label: "Volunteer Requests",
      path: "/hospital-admin/volunteer-requests",
    },

    {
      icon: LogOutIcon,
      label: "Logout",
      action: handleLogout,
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
          <Box key={item.label}>
            <Flex
              p={3}
              cursor="pointer"
              borderRadius="md"
              bg={
                isActive(item.path) || isSubMenuActive(item)
                  ? "blue.50"
                  : "transparent"
              }
              _hover={{ bg: "blue.50" }}
              color={
                isActive(item.path) || isSubMenuActive(item)
                  ? "blue.600"
                  : "gray.700"
              }
              alignItems="center"
              onClick={() => {
                if (item.action) {
                  item.action(); 
                } else if (item.subItems) {
                  toggleSubMenu(item.label); 
                  navigate(item.path); 
                } else {
                  // Handle regular menu items
                  navigate(item.path);
                }
              }}
            >
              <Icon as={item.icon} boxSize={5} mr={3} />
              <Text flex="1">{item.label}</Text>
              {item.subItems && (
                <Icon
                  as={
                    openSubMenu === item.label
                      ? RiArrowUpSLine
                      : RiArrowDownSLine
                  }
                  boxSize={5}
                />
              )}
            </Flex>

            {/* Render submenu items if they exist */}
            {item.subItems && (
              <Collapse in={openSubMenu === item.label}>
                <VStack spacing={1} pl={8} mt={1} align="stretch">
                  {item.subItems.map((subItem) => (
                    <Flex
                      key={subItem.label}
                      p={2}
                      cursor="pointer"
                      borderRadius="md"
                      bg={isActive(subItem.path) ? "blue.50" : "transparent"}
                      _hover={{ bg: "blue.50" }}
                      color={isActive(subItem.path) ? "blue.600" : "gray.600"}
                      alignItems="center"
                      onClick={() => navigate(subItem.path)}
                    >
                      <Text fontSize="sm">{subItem.label}</Text>
                    </Flex>
                  ))}
                </VStack>
              </Collapse>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
