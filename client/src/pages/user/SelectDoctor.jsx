import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  Checkbox,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
  Badge,
  HStack,
  Icon,
  Button,
  Divider,
  useColorModeValue,
  VStack,
  Collapse,
  useDisclosure,
  Tag,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Fade,
  ScaleFade,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  FaUserMd,
  FaFilter,
  FaRegCalendarAlt,
  FaSortAmountDown,
  FaRegClock,
} from "react-icons/fa";
import { SearchBar } from "../../component/common/SearchBar";
import DoctorCard from "../../component/common/DoctorCard";
import { fetchDoctorsBySpecialization } from "../../features/doctor/doctorSlice";
import { useParams, useNavigate } from "react-router-dom";
import StepIndicator from "../../component/common/StepIndicator";
import Pagination from "../../utils/Pagination";

const SelectDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, loading, error } = useSelector(
    (state) => state?.doctorSlice || {}
  );
  const { specialization } = useParams();
  const { isOpen: isFilterOpen, onToggle: toggleFilter } = useDisclosure({
    defaultIsOpen: true,
  });

  // State for filters
  const [filters, setFilters] = useState({
    searchQuery: "",
    experienceFilter: {
      novice: false,
      intermediate: false,
      expert: false,
    },
    feeRange: [0, 500],
    sortOption: "recommended",
    page: 1,
    limit: 10,
  });

  // Debounce search to avoid too many API calls
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("blue.600", "blue.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");

  // Fetch doctors when filters or specialization change
  useEffect(() => {
    if (specialization) {
      dispatch(
        fetchDoctorsBySpecialization({
          specialization,
          filters: {
            searchQuery: debouncedSearchQuery,
            experienceFilter: filters.experienceFilter,
            feeRange: filters.feeRange,
            sortOption: filters.sortOption,
            page: filters.page,
            limit: filters.limit,
          },
        })
      );
    }
  }, [
    dispatch,
    specialization,
    debouncedSearchQuery,
    filters.experienceFilter,
    filters.feeRange,
    filters.sortOption,
    filters.page,
    filters.limit
  ]);

  const doctorsList = doctors?.doctors || [];
  const hasDoctors = Array.isArray(doctorsList) && doctorsList.length > 0;

  const handleSearchChange = (query) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleExperienceChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      experienceFilter: {
        ...prev.experienceFilter,
        [type]: !prev.experienceFilter[type],
      },
    }));
  };

  const handleFeeRangeChange = (values) => {
    setFilters((prev) => ({ ...prev, feeRange: values }));
  };

  const handleSortChange = (option) => {
    setFilters((prev) => ({ ...prev, sortOption: option }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      experienceFilter: {
        novice: false,
        intermediate: false,
        expert: false,
      },
      feeRange: [0, 500],
      sortOption: "recommended",
      page: 1,
      limit: 10,
    });
  };

  const goBack = () => {
    navigate("/book-appointment");
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header Section (unchanged) */}
        {/* ... */}

        {/* Main Content */}
        <Box
          bg={cardBgColor}
          p={6}
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
        >
          {/* Header (unchanged) */}
          {/* ... */}

          <Flex direction={{ base: "column", lg: "row" }} gap={6}>
            {/* Filters Section */}
            <Box
              w={{ base: "100%", lg: "280px" }}
              mb={{ base: 6, lg: 0 }}
              bg={cardBgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              height="fit-content"
            >
              <Flex
                p={4}
                justify="space-between"
                align="center"
                bg={highlightColor}
                borderBottom="1px"
                borderColor={borderColor}
                onClick={toggleFilter}
                cursor="pointer"
                _hover={{ bg: useColorModeValue("blue.100", "blue.800") }}
              >
                <HStack>
                  <Icon as={FaFilter} color={primaryColor} />
                  <Text fontWeight="bold" color={secondaryColor}>
                    Filters
                  </Text>
                </HStack>
                <Icon
                  as={isFilterOpen ? ChevronUpIcon : ChevronDownIcon}
                  color={primaryColor}
                />
              </Flex>

              <Collapse in={isFilterOpen} animateOpacity>
                <VStack spacing={6} p={4} align="stretch">
                  {/* Experience Filter */}
                  <Box>
                    <Text fontWeight="medium" mb={3} color={textColor}>
                      Experience
                    </Text>
                    <Stack spacing={3}>
                      <Checkbox
                        colorScheme="blue"
                        isChecked={filters.experienceFilter.novice}
                        onChange={() => handleExperienceChange("novice")}
                      >
                        <HStack>
                          <Text>0-5 years</Text>
                          <Badge colorScheme="gray" variant="subtle">
                            Novice
                          </Badge>
                        </HStack>
                      </Checkbox>
                      <Checkbox
                        colorScheme="blue"
                        isChecked={filters.experienceFilter.intermediate}
                        onChange={() => handleExperienceChange("intermediate")}
                      >
                        <HStack>
                          <Text>5-10 years</Text>
                          <Badge colorScheme="blue" variant="subtle">
                            Intermediate
                          </Badge>
                        </HStack>
                      </Checkbox>
                      <Checkbox
                        colorScheme="blue"
                        isChecked={filters.experienceFilter.expert}
                        onChange={() => handleExperienceChange("expert")}
                      >
                        <HStack>
                          <Text>10+ years</Text>
                          <Badge colorScheme="green" variant="subtle">
                            Expert
                          </Badge>
                        </HStack>
                      </Checkbox>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Fee Range Filter */}
                  <Box>
                    <Text fontWeight="medium" mb={3} color={textColor}>
                      Consultation Fee
                    </Text>
                    <Flex justify="space-between" mb={2}>
                      <Text fontSize="sm" color={mutedColor}>
                        ${filters.feeRange[0]}
                      </Text>
                      <Text fontSize="sm" color={mutedColor}>
                        ${filters.feeRange[1]}
                      </Text>
                    </Flex>
                    <RangeSlider
                      value={filters.feeRange}
                      min={0}
                      max={500}
                      step={10}
                      colorScheme="blue"
                      onChange={handleFeeRangeChange}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <Tooltip
                        label={`$${filters.feeRange[0]}`}
                        placement="top"
                        hasArrow
                      >
                        <RangeSliderThumb index={0} boxSize={6} />
                      </Tooltip>
                      <Tooltip
                        label={`$${filters.feeRange[1]}`}
                        placement="top"
                        hasArrow
                      >
                        <RangeSliderThumb index={1} boxSize={6} />
                      </Tooltip>
                    </RangeSlider>
                  </Box>

                  <Divider />

                  {/* Reset/Apply Filters */}
                  <Flex justify="space-between">
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      size="sm"
                      leftIcon={<Icon as={FaFilter} />}
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      leftIcon={<SearchIcon />}
                      onClick={() => handlePageChange(1)} // Reset to first page when applying filters
                    >
                      Apply Filters
                    </Button>
                  </Flex>
                </VStack>
              </Collapse>
            </Box>

            {/* Doctors List Section */}
            <Box flex="1">
              <VStack spacing={6} align="stretch">
                {/* Search and Sort */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  gap={4}
                >
                  <InputGroup maxW="400px">
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color={mutedColor} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search doctors..."
                      value={filters.searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </InputGroup>

                  <HStack>
                    <Text fontSize="sm" color={mutedColor} whiteSpace="nowrap">
                      Sort by:
                    </Text>
                    <Select
                      value={filters.sortOption}
                      onChange={(e) => handleSortChange(e.target.value)}
                      size="sm"
                      width="200px"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="fee-low-high">Fee: Low to High</option>
                      <option value="fee-high-low">Fee: High to Low</option>
                      <option value="experience">Experience</option>
                      <option value="rating">Rating</option>
                    </Select>
                  </HStack>
                </Flex>

                {/* Loading State */}
                {loading && (
                  <Center py={10}>
                    <VStack spacing={4}>
                      <Spinner
                        size="xl"
                        color={primaryColor}
                        thickness="4px"
                        speed="0.8s"
                      />
                      <Text color={mutedColor}>Loading doctors...</Text>
                    </VStack>
                  </Center>
                )}

                {/* Error State */}
                {error && (
                  <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    borderRadius="lg"
                    py={6}
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      Error Loading Doctors
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">{error}</AlertDescription>
                    <Button
                      mt={4}
                      colorScheme="red"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </Alert>
                )}

                {/* Success State */}
                {!loading && !error && (
                  <>
                    {hasDoctors ? (
                      <>
                        <HStack justify="space-between" px={2}>
                          <Text fontSize="sm" color={mutedColor}>
                            {doctors.pagination?.totalCount ||
                              doctorsList.length}{" "}
                            doctors found
                          </Text>
                          <HStack>
                            <Icon
                              as={FaRegClock}
                              color={primaryColor}
                              boxSize={3}
                            />
                            <Text fontSize="xs" color={mutedColor}>
                              Last updated: Today
                            </Text>
                          </HStack>
                        </HStack>

                        <SimpleGrid columns={1} spacing={6}>
                          {doctorsList.map((doctor, index) => (
                            <ScaleFade
                              key={`${doctor._id}-${index}`}
                              in={true}
                              initialScale={0.95}
                            >
                              <Box
                                transition="all 0.2s"
                                _hover={{
                                  transform: "translateY(-4px)",
                                  shadow: "md",
                                }}
                              >
                                <DoctorCard doctor={doctor} />
                              </Box>
                            </ScaleFade>
                          ))}
                        </SimpleGrid>

                        {/* Pagination */}
                        {doctors.pagination?.totalPages > 1 && (
                          <Flex justify="center" mt={6}>
                            <Pagination
                              currentPage={filters.page}
                              totalPages={doctors.pagination.totalPages}
                              onPageChange={handlePageChange}
                            />
                          </Flex>
                        )}

                        {doctorsList.length === 0 && (
                          <Box
                            textAlign="center"
                            p={8}
                            bg={highlightColor}
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <Icon
                              as={SearchIcon}
                              boxSize={10}
                              color={mutedColor}
                              mb={4}
                            />
                            <Heading size="md" mb={2} color={textColor}>
                              No doctors match your filters
                            </Heading>
                            <Text color={mutedColor} mb={4}>
                              Try adjusting your search criteria or filters
                            </Text>
                            <Button colorScheme="blue" onClick={resetFilters}>
                              Reset Filters
                            </Button>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box
                        textAlign="center"
                        p={8}
                        bg={highlightColor}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Icon
                          as={FaUserMd}
                          boxSize={10}
                          color={mutedColor}
                          mb={4}
                        />
                        <Heading size="md" mb={2} color={textColor}>
                          No doctors found
                        </Heading>
                        <Text color={mutedColor} mb={4}>
                          We couldn't find any doctors for {specialization} at
                          this time.
                        </Text>
                        <Button colorScheme="blue" onClick={goBack}>
                          Choose Another Specialty
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
export default SelectDoctor;
