import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Card,
  useColorModeValue,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { Clock, MapPin } from "lucide-react";
import { fetchAllMedicalTests } from "../../features/medical_test/medicalTestSlice";

import Pagination from "../../utils/Pagination";
import { useNavigate } from "react-router-dom";

const MedicalTests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this line for navigation

  const { medicalTests, loading, error } = useSelector(
    (state) => state.medicalTestSlice
  );
  const { currentPage, totalPages } = useSelector(
    (state) => state.medicalTestSlice?.medicalTests
  );

  console.log("The medical tests aere", medicalTests?.data);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const priceBg = useColorModeValue("blue.50", "blue.900");
  const badgeBg = useColorModeValue("green.50", "green.900");
  const badgeColor = useColorModeValue("green.600", "green.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const descriptionColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    dispatch(fetchAllMedicalTests());
  }, [dispatch]);

  const onTestSelect = (testId) => {
    console.log("Selected test:", testId);
    navigate(`/tests/${testId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">Error loading medical tests: {error}</Text>
      </Box>
    );
  }

  return (
    <Box p={[4, 6]} overflow="auto">
      <Box mb={6}>
        <Heading as="h1" size="xl" fontWeight="bold">
          Available Medical Tests
        </Heading>
        <Text color="gray.500">
          Browse through our comprehensive range of medical tests
        </Text>
      </Box>

      {medicalTests.data?.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text>No medical tests available at the moment.</Text>
        </Box>
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
            spacing={6}
            width="full"
          >
            {medicalTests?.data?.map((test) => (
              <Card
                key={test._id}
                overflow="hidden"
                bg={cardBg}
                border="1px solid"
                borderColor={cardBorder}
                borderRadius="xl"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "lg",
                  borderColor: "blue.300",
                }}
                position="relative"
              >
                {/* Image container with gradient overlay */}
                <Box position="relative" h="44" w="full" overflow="hidden">
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    height="40%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.7), transparent)"
                    zIndex={1}
                  />
                  <Box
                    as="img"
                    src={
                      test.testImage || "/placeholder.svg?height=200&width=400"
                    }
                    alt={test.testName}
                    objectFit="cover"
                    width="full"
                    height="full"
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                </Box>

                <Box p={5}>
                  {/* Header section */}
                  <Heading
                    as="h3"
                    size="md"
                    mb={2}
                    noOfLines={1}
                    fontWeight="semibold"
                    color={headingColor}
                  >
                    {test.testName}
                  </Heading>

                  {/* Location info */}
                  <Flex align="center" fontSize="sm" color="gray.500" mb={3}>
                    <Icon as={MapPin} size={14} mr={1} />
                    <Text noOfLines={1} fontSize="sm">
                      {test.hospital?.name || "Hospital not specified"},{" "}
                      {test.hospital?.location || "Location not specified"}
                    </Text>
                  </Flex>

                  {/* Description */}
                  <Text
                    fontSize="sm"
                    color={descriptionColor}
                    mb={4}
                    noOfLines={2}
                    lineHeight="taller"
                  >
                    {test?.testDescription}
                  </Text>

                  {/* Stats/Info row */}
                  <Flex mb={4} justify="space-between">
                    <Flex align="center">
                      <Icon as={Clock} size={14} color="blue.500" mr={1} />
                      <Text fontSize="xs" color="gray.500">
                        {test.duration || "45-60"} min
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Price and CTA row */}
                  <Flex align="center" justify="space-between">
                    <Flex
                      direction="column"
                      bg={priceBg}
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      <Text fontSize="xs" color="gray.500">
                        Price
                      </Text>
                      <Text fontWeight="bold" fontSize="lg" color="blue.600">
                        ${test.testPrice?.toFixed(2) || "0.00"}
                      </Text>
                    </Flex>

                    <Button
                      onClick={() => onTestSelect(test._id)}
                      colorScheme="blue"
                      size="md"
                      borderRadius="lg"
                      px={6}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "md",
                      }}
                    >
                      Book Now
                    </Button>
                  </Flex>
                </Box>
              </Card>
            ))}
          </SimpleGrid>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
};

export default MedicalTests;
