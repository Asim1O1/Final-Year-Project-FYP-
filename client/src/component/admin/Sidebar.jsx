import { Box, VStack, Icon, Text, Flex } from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiUserLine,
  RiHospitalLine,
  RiAdminLine,
  RiStethoscopeLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  const menuItems = [
    { icon: RiDashboardLine, label: "Dashboard", path: "/admin" },
    { icon: RiUserLine, label: "Users", path: "/admin/users" },
    { icon: RiHospitalLine, label: "Hospitals", path: "/admin/hospitals" },
    {
      icon: RiAdminLine,
      label: "Hospital Admin",
      path: "/admin/hospital-admin",
    },
    { icon: RiStethoscopeLine, label: "Doctors", path: "/admin/doctors" },
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
          Admin Portal
        </Text>
      </Flex>

      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => (
          <Flex
            as={item.path ? Link : "div"}
            key={item.label}
            to={item.path}
            onClick={item.action}
            p={3}
            cursor="pointer"
            borderRadius="md"
            _hover={{ bg: "blue.50" }}
            color="gray.700"
            alignItems="center"
          >
            <Icon as={item.icon} boxSize={5} mr={3} />
            <Text>{item.label}</Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};
