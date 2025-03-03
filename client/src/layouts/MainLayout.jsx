// layouts/MainLayout.jsx
import React from "react";
import {
  Box,
  Flex,
  Container,
  Link,
  Image,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import NavBar from "../component/layout/NavBar";

const MainLayout = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <NavBar />
      <Box as="main" flex="1" bg="gray.50">
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
