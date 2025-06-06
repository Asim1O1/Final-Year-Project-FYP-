import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  ScaleFade,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaStethoscope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SpecialtyCard from "../../component/common/SpecialityCard";
import StepIndicator from "../../component/common/StepIndicator";

import PREDEFINED_SPECIALTIES from "@shared/Specialties";
import Pagination from "../../utils/Pagination";

const specialties = PREDEFINED_SPECIALTIES;

const SelectSpecialty = () => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState(specialties);
  const itemsPerPage = 9;

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("blue.600", "blue.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Filter specialties based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = specialties.filter((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpecialties(filtered);
      setCurrentPage(1); // Reset to first page when searching
    } else {
      setFilteredSpecialties(specialties);
    }
  }, [searchQuery]);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredSpecialties.length / itemsPerPage);

  // Get specialties for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpecialties = filteredSpecialties.slice(startIndex, endIndex);

  // Function to handle specialization selection
  const handleSelectSpecialty = (specialization) => {
    console.log("The selected specialization is", specialization);
    navigate(`/book-appointment/select-doctor/${specialization}`);
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of specialty grid
    document
      .getElementById("specialtyGrid")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Box bg={bgColor} minH="100vh" display="flex" flexDirection="column">
      <Container maxW="container.xl" py={8} flex="1">
        {/* Header Section */}
        <Flex
          direction="column"
          bg={cardBgColor}
          p={6}
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
        >
          <Flex align="center" mb={4}>
            <Icon
              as={FaRegCalendarAlt}
              color={primaryColor}
              boxSize={6}
              mr={3}
            />
            <Heading size="lg" color={primaryColor} fontWeight="bold">
              Book Your Appointment
            </Heading>
          </Flex>

          {/* Breadcrumbs for consistent navigation */}
          <Breadcrumb
            separator={<ChevronRightIcon color={mutedColor} />}
            fontSize="sm"
            mb={6}
            spacing="8px"
            fontWeight="medium"
          >
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                color={primaryColor}
                fontWeight="bold"
                _hover={{ textDecoration: "none" }}
              >
                <HStack>
                  <Badge colorScheme="blue" borderRadius="full">
                    1
                  </Badge>
                  <Text>Select Specialty</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">
                    2
                  </Badge>
                  <Text>Choose Doctor</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">
                    3
                  </Badge>
                  <Text>Book Appointment</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">
                    4
                  </Badge>
                  <Text>Patient Details</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">
                    5
                  </Badge>
                  <Text>Confirmation</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <StepIndicator currentStep={1} />
        </Flex>

        {/* Main Content */}
        <VStack spacing={8} align="stretch">
          <Box
            bg={cardBgColor}
            p={8}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                width="full"
                mb={2}
              >
                <HStack mb={{ base: 4, md: 0 }}>
                  <Icon as={FaStethoscope} color={primaryColor} boxSize={5} />
                  <Heading size="md" color={textColor}>
                    Choose Medical Specialty
                  </Heading>
                </HStack>
                <Badge
                  colorScheme="blue"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  Step 1 of 5
                </Badge>
              </Flex>

              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                spacing={6}
                mt={4}
              >
                {currentSpecialties.map((specialization, index) => (
                  <ScaleFade in={true} initialScale={0.9} key={index}>
                    <Box
                      onClick={() => handleSelectSpecialty(specialization)}
                      bg={cardBgColor}
                      p={5}
                      borderRadius="lg"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                      cursor="pointer"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "md",
                        borderColor: primaryColor,
                      }}
                      height="100%"
                    >
                      <SpecialtyCard
                        specialization={specialization}
                        onClick={() => handleSelectSpecialty(specialization)}
                      />
                    </Box>
                  </ScaleFade>
                ))}
              </SimpleGrid>

              {/* Pagination */}
              {filteredSpecialties.length > itemsPerPage && (
                <Box mt={8}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    colorScheme="blue"
                    size="md"
                  />
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SelectSpecialty;
