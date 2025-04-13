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
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from "@chakra-ui/icons";
import { FaUserMd, FaFilter, FaRegCalendarAlt, FaSortAmountDown, FaRegClock } from "react-icons/fa";
import { SearchBar } from "../../component/common/SearchBar";
import DoctorCard from "../../component/common/DoctorCard";
import { fetchDoctorsBySpecialization } from "../../features/doctor/doctorSlice";
import { useParams, useNavigate } from "react-router-dom";
import StepIndicator from "../../component/common/StepIndicator";

const SelectDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, loading, error } = useSelector(
    (state) => state?.doctorSlice || {}
  );
  const { specialization } = useParams();
  const { isOpen: isFilterOpen, onToggle: toggleFilter } = useDisclosure({ defaultIsOpen: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState({
    novice: false,
    intermediate: false,
    expert: false
  });
  const [feeRange, setFeeRange] = useState([0, 500]);
  const [sortOption, setSortOption] = useState("recommended");

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("blue.600", "blue.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");

  useEffect(() => {
    if (specialization) {
      dispatch(fetchDoctorsBySpecialization({ specialization }));
    }
  }, [dispatch, specialization]);

  const doctorsList = doctors?.doctors || [];
  const hasDoctors = Array.isArray(doctorsList) && doctorsList.length > 0;

  // Filter and sort doctors
  const filteredDoctors = hasDoctors 
    ? doctorsList.filter(doctor => {
        // Search filter
        if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Experience filter
        if (experienceFilter.novice && doctor.experience > 5) return false;
        if (experienceFilter.intermediate && (doctor.experience < 5 || doctor.experience > 10)) return false;
        if (experienceFilter.expert && doctor.experience < 10) return false;
        
        // Fee filter
        const fee = doctor.consultationFee || 0;
        if (fee < feeRange[0] || fee > feeRange[1]) return false;
        
        return true;
      })
    : [];

  // Sort doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortOption) {
      case "fee-low-high":
        return (a.consultationFee || 0) - (b.consultationFee || 0);
      case "fee-high-low":
        return (b.consultationFee || 0) - (a.consultationFee || 0);
      case "experience":
        return (b.experience || 0) - (a.experience || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0; // recommended
    }
  });

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleExperienceChange = (type) => {
    setExperienceFilter({
      ...experienceFilter,
      [type]: !experienceFilter[type]
    });
  };

  const handleFeeRangeChange = (values) => {
    setFeeRange(values);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const goBack = () => {
    navigate("/select-specialty");
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header Section */}
        <Box 
          bg={cardBgColor} 
          p={6} 
          borderRadius="xl" 
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            mb={4}
          >
            <HStack mb={{ base: 4, md: 0 }}>
              <Icon as={FaRegCalendarAlt} color={primaryColor} boxSize={6} mr={2} />
              <Heading size="lg" color={primaryColor} fontWeight="bold">
                Book Your Appointment
              </Heading>
            </HStack>
            <Button 
              leftIcon={<ChevronRightIcon transform="rotate(180deg)" />} 
              variant="outline" 
              colorScheme="blue" 
              size="sm"
              onClick={goBack}
            >
              Back to Specialties
            </Button>
          </Flex>

          {/* Breadcrumbs */}
          <Breadcrumb 
            separator={<ChevronRightIcon color={mutedColor} />} 
            fontSize="sm" 
            mb={6}
            spacing="8px"
            fontWeight="medium"
          >
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={goBack}
                color={mutedColor}
                _hover={{ color: textColor, textDecoration: "none" }}
              >
                <HStack>
                  <Badge colorScheme="green" borderRadius="full">1</Badge>
                  <Text>Select Specialty</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink 
                color={primaryColor} 
                fontWeight="bold"
                _hover={{ textDecoration: "none" }}
              >
                <HStack>
                  <Badge colorScheme="blue" borderRadius="full">2</Badge>
                  <Text>Choose Doctor</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">3</Badge>
                  <Text>Book Appointment</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">4</Badge>
                  <Text>Patient Details</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">5</Badge>
                  <Text>Confirmation</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <StepIndicator currentStep={2} />
        </Box>

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
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align="center" 
            justify="space-between"
            mb={6}
          >
            <HStack>
              <Icon as={FaUserMd} color={primaryColor} boxSize={5} mr={2} />
              <Heading size="md" color={textColor}>
                Choose Your Doctor
              </Heading>
              <Badge 
                colorScheme="blue" 
                fontSize="md" 
                px={3} 
                py={1} 
                borderRadius="full"
                ml={2}
              >
                {specialization}
              </Badge>
            </HStack>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="sm" mt={{ base: 4, md: 0 }}>
              Step 2 of 5
            </Badge>
          </Flex>

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
                  <Box>
                    <Text fontWeight="medium" mb={3} color={textColor}>
                      Experience
                    </Text>
                    <Stack spacing={3}>
                      <Checkbox 
                        colorScheme="blue" 
                        isChecked={experienceFilter.novice}
                        onChange={() => handleExperienceChange('novice')}
                      >
                        <HStack>
                          <Text>0-5 years</Text>
                          <Badge colorScheme="gray" variant="subtle">Novice</Badge>
                        </HStack>
                      </Checkbox>
                      <Checkbox 
                        colorScheme="blue"
                        isChecked={experienceFilter.intermediate}
                        onChange={() => handleExperienceChange('intermediate')}
                      >
                        <HStack>
                          <Text>5-10 years</Text>
                          <Badge colorScheme="blue" variant="subtle">Intermediate</Badge>
                        </HStack>
                      </Checkbox>
                      <Checkbox 
                        colorScheme="blue"
                        isChecked={experienceFilter.expert}
                        onChange={() => handleExperienceChange('expert')}
                      >
                        <HStack>
                          <Text>10+ years</Text>
                          <Badge colorScheme="green" variant="subtle">Expert</Badge>
                        </HStack>
                      </Checkbox>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="medium" mb={3} color={textColor}>
                      Consultation Fee
                    </Text>
                    <Flex justify="space-between" mb={2}>
                      <Text fontSize="sm" color={mutedColor}>
                        ${feeRange[0]}
                      </Text>
                      <Text fontSize="sm" color={mutedColor}>
                        ${feeRange[1]}
                      </Text>
                    </Flex>
                    <RangeSlider
                      value={feeRange}
                      min={0}
                      max={500}
                      step={10}
                      colorScheme="blue"
                      onChange={handleFeeRangeChange}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <Tooltip label={`$${feeRange[0]}`} placement="top" hasArrow>
                        <RangeSliderThumb index={0} boxSize={6} />
                      </Tooltip>
                      <Tooltip label={`$${feeRange[1]}`} placement="top" hasArrow>
                        <RangeSliderThumb index={1} boxSize={6} />
                      </Tooltip>
                    </RangeSlider>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="medium" mb={3} color={textColor}>
                      Availability
                    </Text>
                    <Stack spacing={3}>
                      <Checkbox colorScheme="blue">
                        <HStack>
                          <Text>Available Today</Text>
                          <Badge colorScheme="green">Fast</Badge>
                        </HStack>
                      </Checkbox>
                      <Checkbox colorScheme="blue">Available This Week</Checkbox>
                      <Checkbox colorScheme="blue">Video Consultation</Checkbox>
                    </Stack>
                  </Box>

                  <Divider />

                  <Flex justify="space-between">
                    <Button 
                      variant="outline" 
                      colorScheme="gray" 
                      size="sm"
                      leftIcon={<Icon as={FaFilter} />}
                      onClick={() => {
                        setExperienceFilter({ novice: false, intermediate: false, expert: false });
                        setFeeRange([0, 500]);
                      }}
                    >
                      Reset Filters
                    </Button>
                    <Button 
                      colorScheme="blue" 
                      size="sm"
                      leftIcon={<SearchIcon />}
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
                <Flex 
                  direction={{ base: "column", md: "row" }} 
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  gap={4}
                >
                  <Box flex="1">
                    <SearchBar 
                      placeholder="Search doctors by name" 
                      onChange={handleSearchChange}
                      value={searchQuery}
                    />
                  </Box>
                  <HStack>
                    <Text fontSize="sm" color={mutedColor} whiteSpace="nowrap">
                      Sort by:
                    </Text>
                    <Box>
                      <select
                        value={sortOption}
                        onChange={(e) => handleSortChange(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: borderColor,
                          backgroundColor: 'transparent',
                          color: textColor,
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        <option value="recommended">Recommended</option>
                        <option value="fee-low-high">Fee: Low to High</option>
                        <option value="fee-high-low">Fee: High to Low</option>
                        <option value="experience">Experience</option>
                        <option value="rating">Rating</option>
                      </select>
                    </Box>
                  </HStack>
                </Flex>

                {loading && (
                  <Center py={10}>
                    <VStack spacing={4}>
                      <Spinner size="xl" color={primaryColor} thickness="4px" speed="0.8s" />
                      <Text color={mutedColor}>Loading doctors...</Text>
                    </VStack>
                  </Center>
                )}

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
                    <AlertDescription maxWidth="sm">
                      {error}
                    </AlertDescription>
                    <Button mt={4} colorScheme="red" onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </Alert>
                )}

                {!loading && !error && (
                  <>
                    {hasDoctors ? (
                      <>
                        <HStack justify="space-between" px={2}>
                          <Text fontSize="sm" color={mutedColor}>
                            {sortedDoctors.length} doctors found
                          </Text>
                          <HStack>
                            <Icon as={FaRegClock} color={primaryColor} boxSize={3} />
                            <Text fontSize="xs" color={mutedColor}>
                              Last updated: Today
                            </Text>
                          </HStack>
                        </HStack>
                        
                        <SimpleGrid columns={1} spacing={6}>
                          {sortedDoctors.map((doctor, index) => (
                            <ScaleFade key={index} in={true} initialScale={0.95}>
                              <Box
                                transition="all 0.2s"
                                _hover={{ transform: "translateY(-4px)", shadow: "md" }}
                              >
                                <DoctorCard doctor={doctor} />
                              </Box>
                            </ScaleFade>
                          ))}
                        </SimpleGrid>
                        
                        {sortedDoctors.length === 0 && (
                          <Box
                            textAlign="center"
                            p={8}
                            bg={highlightColor}
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <Icon as={SearchIcon} boxSize={10} color={mutedColor} mb={4} />
                            <Heading size="md" mb={2} color={textColor}>
                              No doctors match your filters
                            </Heading>
                            <Text color={mutedColor} mb={4}>
                              Try adjusting your search criteria or filters
                            </Text>
                            <Button 
                              colorScheme="blue" 
                              onClick={() => {
                                setSearchQuery("");
                                setExperienceFilter({ novice: false, intermediate: false, expert: false });
                                setFeeRange([0, 500]);
                              }}
                            >
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
                        <Icon as={FaUserMd} boxSize={10} color={mutedColor} mb={4} />
                        <Heading size="md" mb={2} color={textColor}>
                          No doctors found
                        </Heading>
                        <Text color={mutedColor} mb={4}>
                          We couldn't find any doctors for {specialization} at this time.
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

        {/* Help Box */}
        <Fade in={true}>
          <Box 
            bg={cardBgColor} 
            p={6} 
            borderRadius="xl" 
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            borderLeft="4px solid"
            borderLeftColor={primaryColor}
          >
            <Flex align="center">
              <Icon as={FaUserMd} color={primaryColor} boxSize={5} mr={3} />
              <Box>
                <Text fontWeight="medium" mb={1}>
                  Need help choosing a doctor?
                </Text>
                <Text fontSize="sm" color={mutedColor}>
                  Our medical concierge can help you find the right specialist for your needs.
                  Call us at (800) 123-4567 or chat with us online.
                </Text>
              </Box>
            </Flex>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default SelectDoctor;