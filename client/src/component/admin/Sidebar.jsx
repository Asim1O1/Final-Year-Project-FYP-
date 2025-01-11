import React from 'react';
import { Box, VStack, Icon, Text, Flex } from '@chakra-ui/react';
import { RiDashboardLine, RiUserLine, RiHospitalLine, RiStethoscopeLine, RiSettings4Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  const menuItems = [
    { icon: RiDashboardLine, label: 'Dashboard', path: '/admin' },
    { icon: RiUserLine, label: 'Users', path: '/admin/users' },
    { icon: RiHospitalLine, label: 'Hospitals', path: '/admin/hospitals' },
    { icon: RiStethoscopeLine, label: 'Doctors', path: '/admin/doctors' },
    { icon: RiSettings4Line, label: 'Logout', action: () => console.log('Logout logic here') },
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
            as={item.path ? Link : 'div'}
            key={item.label}
            to={item.path}
            onClick={item.action}
            p={3}
            cursor="pointer"
            borderRadius="md"
            _hover={{ bg: 'blue.50' }}
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
