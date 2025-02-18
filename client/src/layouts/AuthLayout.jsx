import React from "react";
import { Box, Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const containerPadding = useBreakpointValue({
    base: 4,
    sm: 6,
    md: 10,
  });

  const containerHeight = useBreakpointValue({
    base: "auto",
    md: "600px",
    lg: "650px",
  });

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      py={{ base: 4, md: 8 }}
      px={containerPadding}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl" p={0}>
        <Flex
          direction="column"
          bg="white"
          rounded={{ base: "lg", md: "xl" }}
          shadow={{
            base: "md",
            md: "xl",
          }}
          h={containerHeight}
          overflow="hidden"
          transition="all 0.3s ease"
          _hover={{
            shadow: "2xl",
          }}
        >
          {children || <Outlet />}
        </Flex>
      </Container>
    </Box>
  );
};

export default AuthLayout;
