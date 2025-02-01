import React from "react";
import { Box, Button, HStack, Text, Icon, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const visiblePages = 5; // Number of page buttons to show

  const getPageNumbers = () => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const middlePage = Math.floor(visiblePages / 2);

    if (currentPage <= middlePage) {
      return Array.from({ length: visiblePages }, (_, i) => i + 1);
    }

    if (currentPage >= totalPages - middlePage) {
      return Array.from(
        { length: visiblePages },
        (_, i) => totalPages - visiblePages + 1 + i
      );
    }

    const startPage = currentPage - middlePage;
    return Array.from({ length: visiblePages }, (_, i) => startPage + i);
  };

  return (
    <Flex justify="center" alignItems="center" direction="column" mt={6}>
      {" "}
      {/* Use Flex for centering */}
      <HStack spacing={4}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          variant="solid"
          colorScheme="blue"
          size="md" // Slightly smaller button size
          rounded="md" // Slightly less rounded buttons
          leftIcon={<ChevronLeftIcon />}
          _hover={{ bg: "blue.600" }} // Darker hover color
        >
          Prev
        </Button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            variant={currentPage === page ? "solid" : "ghost"}
            colorScheme={currentPage === page ? "blue" : "gray"}
            size="md"
            rounded="md"
            _hover={{
              bg: currentPage === page ? "blue.600" : "gray.200",
              color: currentPage === page ? "white" : "gray.800",
            }} // Conditional hover
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          variant="solid"
          colorScheme="blue"
          size="md"
          rounded="md"
          rightIcon={<ChevronRightIcon />}
          _hover={{ bg: "blue.600" }}
        >
          Next
        </Button>
      </HStack>
      <Text mt={4} fontSize="sm" color="gray.500">
        {" "}
        {/* Smaller, less prominent text */}
        Page {currentPage} of {totalPages}
      </Text>
    </Flex>
  );
};

export default Pagination;
