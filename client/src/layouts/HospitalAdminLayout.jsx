import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { HospitalSidebar } from "../component/hospital_admin/HospitalSidebar";
import { HospitalTopNav } from "../component/hospital_admin/HospitalTopNav";
import { Outlet } from "react-router-dom";

export const HospitalAdminLayout = ({ children }) => {
  return (
    <Flex minH="100vh">
      {/* Sidebar - Fixed Position */}
      <Box
        as="aside"
        position="fixed"
        top={0}
        left={0}
        w="64"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        height="100vh"
        overflowY="auto"
      >
        <HospitalSidebar />
      </Box>

      {/* Content Area */}
      <Box flex="1" ml="64" bg="gray.50">
        <HospitalTopNav />
        <Box p={8}>{children || <Outlet />}</Box>
      </Box>
    </Flex>
  );
};
