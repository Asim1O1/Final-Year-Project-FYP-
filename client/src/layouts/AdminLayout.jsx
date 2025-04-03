import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "../component/admin/Sidebar";
import { TopNav } from "../component/admin/TopNav";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <Flex minH="100vh">
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
        <Sidebar />
      </Box>

      {/* Content Area */}
      <Box flex="1" ml="64" bg="gray.50">
        <TopNav />
        <Box p={8}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};
