import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { HospitalSidebar } from '../component/hospital_admin/HospitalSidebar';
import { HospitalTopNav } from '../component/hospital_admin/HospitalTopNav';

export const HospitalAdminLayout = ({ children }) => {
  return (
    <Flex minH="100vh">
      <HospitalSidebar />
      <Box flex="1" bg="gray.50">
        <HospitalTopNav />
        <Box p={8}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};