import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from '../component/admin/Sidebar';
import { TopNav } from '../component/admin/TopNav';
import { Outlet } from 'react-router-dom';

export const AdminLayout = ({ children }) => {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" bg="gray.50">
        <TopNav />
        <Box p={8}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Flex>
  );
};
