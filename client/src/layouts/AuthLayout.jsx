import React from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={10}>
        <Flex 
          bg="white" 
          rounded="xl" 
          shadow="xl" 
          h={{ base: "auto", md: "600px" }}
          overflow="hidden"
        >
          {children || <Outlet />}
        </Flex>
      </Container>
    </Box>
  );
};

export default AuthLayout;
