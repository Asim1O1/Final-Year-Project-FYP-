import React from "react";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const ServiceCard = ({ icon, title, description }) => (
  <Box
    as={motion.div}
    whileHover={{ y: -10 }}
    position="relative"
    overflow="hidden"
    bg="white"
    p={6}
    borderRadius="xl"
    boxShadow="md"
    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    _before={{
      content: '""',
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: "linear-gradient(135deg, cyan.400, blue.400)",
      opacity: "0",
      transition: "all 0.4s ease",
      transform: "translateY(100%)",
    }}
    _hover={{
      boxShadow: "2xl",
      _before: {
        opacity: "0.95",
        transform: "translateY(0)",
      },
    }}
  >
    <VStack
      spacing={4}
      align="center" // Center-aligns horizontally
      justify="center" // Center-aligns vertically
      position="relative"
      zIndex="1"
      textAlign="center" // Ensures text and elements are centrally aligned
      transition="all 0.3s"
    >
      <Box
        color="cyan.400"
        fontSize="4xl" 
        transition="all 0.4s"
        _groupHover={{ transform: "scale(1.1) rotate(5deg)" }}
        className="group-hover:text-white"
      >
        {icon}
      </Box>
      <Heading
        size="md"
        color="gray.700"
        transition="all 0.4s"
        className="group-hover:text-white"
      >
        {title}
      </Heading>
      <Text
        color="gray.600"
        fontSize="sm"
        transition="all 0.4s"
        className="group-hover:text-gray-100"
      >
        {description}
      </Text>
    </VStack>

    {/* Decorative Elements */}
    <Box
      position="absolute"
      right="-20px"
      bottom="-20px"
      width="100px"
      height="100px"
      borderRadius="full"
      bg="cyan.50"
      transition="all 0.4s"
      opacity="0.5"
      _groupHover={{
        transform: "scale(1.5)",
        bg: "white",
        opacity: "0.1",
      }}
    />
  </Box>
);

export default ServiceCard;
