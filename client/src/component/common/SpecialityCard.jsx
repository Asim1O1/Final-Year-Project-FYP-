// SpecialtyCard.js
import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  FaHeartbeat,
  FaBrain,
  FaBone,
  FaEye,
  FaTooth,
  FaUserMd,
} from "react-icons/fa";

export const SpecialtyCard = ({ specialization, onClick }) => {
  console.log("The specialty received in the specialty card is", specialization);

  const getIcon = (type) => {
    switch (type) {
      case "Cardiology":
        return FaHeartbeat;
      case "Neurology":
        return FaBrain;
      case "Orthopedics":
        return FaBone;
      case "Ophthalmology":
        return FaEye;
      case "Dentistry":
        return FaTooth;
      case "General Medicine":
        return FaUserMd;
      default:
        return FaUserMd;
    }
  };

  return (
    <Box
      p={4}
      borderRadius="md"
      bg="white"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
      mb={4}
      transition="all 0.2s"
      _hover={{ boxShadow: "md", borderColor: "blue.200", cursor: "pointer" }}
      onClick={onClick} // Call the onClick function when clicked
    >
      <Flex alignItems="center">
        <Box bg="blue.50" p={2} borderRadius="full" mr={3}>
          <Icon as={getIcon(specialization)} color="blue.400" boxSize={5} />
        </Box>
        <Box flex="1">
          <Text fontWeight="bold" color="gray.800">
            {specialization} {/* Display the specialty string */}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {/* Add a placeholder description or leave it empty */}
            Specialists in {specialization.toLowerCase()}
          </Text>
        </Box>
      
      </Flex>
    </Box>
  );
};

export default SpecialtyCard;
