// layouts/MainLayout.jsx
import React from "react";
import {
  Box,

} from "@chakra-ui/react";

import NavBar from "../component/layout/NavBar";
import Footer from "../component/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <NavBar />
      <Box as="main" flex="1" bg="gray.50">
        {children}
      </Box>
      <Footer/>
    </Box>
  );
};

export default MainLayout;
