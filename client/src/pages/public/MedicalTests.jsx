import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Fade,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  SlideFade,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCcw,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";
import { fetchAllMedicalTests } from "../../features/medical_test/medicalTestSlice";
import Pagination from "../../utils/Pagination";

const MedicalTests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen: isLoaded, onOpen: setLoaded } = useDisclosure();
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    hospital: "",
    sort: "createdAt_desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Redux state
  const {
    medicalTests = [],
    isLoading,
    error,
    pagination = { totalPages: 1 },
    activeFilters = {},
  } = useSelector((state) => state.medicalTestSlice);

  // Get hospitals from Redux state
  const { hospitals = [], isLoading: isLoadingHospitals } = useSelector(
    (state) => state.hospitalSlice?.hospitals
  );

  const { totalPages = 1 } = pagination;

  // Enhanced color mode values for better contrast and visual hierarchy
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const cardHoverBorder = useColorModeValue("blue.400", "blue.500");
  const priceBg = useColorModeValue("blue.50", "blue.900");
  const priceColor = useColorModeValue("blue.700", "blue.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("gray.600", "gray.400");
  const descriptionColor = useColorModeValue("gray.600", "gray.300");
  const sectionBg = useColorModeValue("gray.50", "gray.900");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const filterBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  useEffect(() => {
    // Fetch medical tests based on filters and pagination
    dispatch(
      fetchAllMedicalTests({
        page: currentPage,
        limit: 10,
        ...filters,
      })
    );

    // Fetch hospitals for the filter dropdown
    dispatch(fetchAllHospitals());

    const timer = setTimeout(() => {
      setLoaded();
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, currentPage, filters, setLoaded]);

  const onTestSelect = (testId) => {
    navigate(`/tests/${testId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",

      minPrice: "",
      maxPrice: "",
      hospital: "",
      sort: "createdAt_desc",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Enhanced loading skeletons with better animation
  if (isLoading && !isLoaded) {
    return (
      <Box bg={sectionBg} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch" mb={8}>
            <Skeleton
              height="40px"
              width="300px"
              startColor="blue.50"
              endColor="blue.100"
            />
            <Skeleton
              height="20px"
              width="450px"
              startColor="blue.50"
              endColor="blue.100"
            />
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card
                key={i}
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={cardBorder}
              >
                <Skeleton
                  height="176px"
                  startColor="gray.100"
                  endColor="gray.200"
                />
                <Box p={5}>
                  <Skeleton
                    height="24px"
                    width="80%"
                    mb={2}
                    startColor="blue.50"
                    endColor="blue.100"
                  />
                  <Skeleton
                    height="16px"
                    width="90%"
                    mb={3}
                    startColor="gray.100"
                    endColor="gray.200"
                  />
                  <Skeleton
                    height="16px"
                    width="100%"
                    mb={2}
                    startColor="gray.100"
                    endColor="gray.200"
                  />
                  <Skeleton
                    height="16px"
                    width="95%"
                    mb={4}
                    startColor="gray.100"
                    endColor="gray.200"
                  />
                  <Flex justify="space-between">
                    <Skeleton
                      height="40px"
                      width="80px"
                      startColor="blue.50"
                      endColor="blue.100"
                    />
                    <Skeleton
                      height="40px"
                      width="100px"
                      startColor="blue.50"
                      endColor="blue.100"
                    />
                  </Flex>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  // Error state with improved visual design
  if (error) {
    return (
      <Box bg={sectionBg} minH="60vh" py={12}>
        <Container maxW="container.xl" textAlign="center">
          <VStack
            spacing={5}
            p={8}
            bg={cardBg}
            borderRadius="xl"
            boxShadow="md"
          >
            <Icon as={AlertCircle} boxSize={16} color="red.500" />
            <Heading size="lg" color={headingColor}>
              Unable to Load Medical Tests
            </Heading>
            <Text color="red.500" maxW="lg" fontSize="lg">
              {error}
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => dispatch(fetchAllMedicalTests())}
              leftIcon={<Icon as={Search} />}
              size="lg"
              mt={2}
              px={8}
              borderRadius="lg"
              boxShadow="sm"
            >
              Try Again
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={sectionBg} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Fade in={isLoaded} transition={{ enter: { duration: 0.5 } }}>
          <VStack spacing={4} align="flex-start" mb={8}>
            <HStack spacing={3} mb={2}>
              <Heading
                as="h1"
                size="xl"
                fontWeight="bold"
                color={headingColor}
                letterSpacing="tight"
              >
                Available Medical Tests
              </Heading>
              <Badge
                colorScheme="blue"
                fontSize="md"
                borderRadius="full"
                px={3}
                py={1}
                fontWeight="medium"
                boxShadow="sm"
              >
                {medicalTests?.length || 0} Tests
              </Badge>
            </HStack>

            <Text color={subheadingColor} fontSize="lg" maxWidth="700px">
              Browse through our comprehensive range of medical tests
            </Text>

            <Divider my={5} borderColor={dividerColor} />

            <Flex
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              w="full"
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Text color={descriptionColor} fontWeight="medium">
                Find the right test for your health needs
              </Text>

              {/* Filter Button with animation */}
              <Button
                leftIcon={<Icon as={showFilters ? ChevronUp : ChevronDown} />}
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                colorScheme="blue"
                fontWeight="medium"
                borderRadius="lg"
                borderWidth="2px"
                boxShadow="sm"
                _hover={{
                  boxShadow: "md",
                  borderColor: accentColor,
                  bg: "blue.50",
                }}
                transition="all 0.2s"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </Flex>

            {/* Filter Section with improved visualization and spacing */}
            <AnimatePresence>
              {showFilters && (
                <SlideFade in={showFilters} offsetY="20px">
                  <Box
                    p={6}
                    bg={filterBg}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    boxShadow="md"
                    w="full"
                    mt={4}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {/* Search Filter */}
                      <FormControl>
                        <FormLabel fontWeight="medium" color={headingColor}>
                          Search
                        </FormLabel>
                        <InputGroup size="md">
                          <InputLeftElement>
                            <Icon as={Search} color="blue.500" />
                          </InputLeftElement>
                          <Input
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by test name or description"
                            borderRadius="lg"
                            borderWidth="1px"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px blue.400",
                            }}
                          />
                        </InputGroup>
                      </FormControl>

                      {/* Hospital Filter */}
                      <FormControl>
                        <FormLabel fontWeight="medium" color={headingColor}>
                          Hospital
                        </FormLabel>
                        <Select
                          name="hospital"
                          value={filters.hospital}
                          onChange={handleFilterChange}
                          placeholder="All Hospitals"
                          icon={<Icon as={ChevronDown} />}
                          isDisabled={isLoadingHospitals}
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px blue.400",
                          }}
                        >
                          {hospitals.map((hospital) => (
                            <option key={hospital._id} value={hospital._id}>
                              {hospital.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Price Range Filter */}
                      <FormControl>
                        <FormLabel fontWeight="medium" color={headingColor}>
                          Price Range
                        </FormLabel>
                        <HStack>
                          <InputGroup size="md">
                            <InputLeftElement
                              pointerEvents="none"
                              color="gray.500"
                              fontSize="sm"
                              fontWeight="bold"
                            >
                              Rs.
                            </InputLeftElement>
                            <Input
                              name="minPrice"
                              type="number"
                              value={filters.minPrice}
                              onChange={handleFilterChange}
                              placeholder="Min"
                              borderRadius="lg"
                              _focus={{
                                borderColor: "blue.400",
                                boxShadow: "0 0 0 1px blue.400",
                              }}
                            />
                          </InputGroup>
                          <Text>to</Text>
                          <InputGroup size="md">
                            <InputLeftElement
                              pointerEvents="none"
                              color="gray.500"
                              fontSize="sm"
                              fontWeight="bold"
                            >
                              Rs.
                            </InputLeftElement>
                            <Input
                              name="maxPrice"
                              type="number"
                              value={filters.maxPrice}
                              onChange={handleFilterChange}
                              placeholder="Max"
                              borderRadius="lg"
                              _focus={{
                                borderColor: "blue.400",
                                boxShadow: "0 0 0 1px blue.400",
                              }}
                            />
                          </InputGroup>
                        </HStack>
                      </FormControl>

                      {/* Sort Filter */}
                      <FormControl>
                        <FormLabel fontWeight="medium" color={headingColor}>
                          Sort By
                        </FormLabel>
                        <Select
                          name="sort"
                          value={filters.sort}
                          onChange={handleFilterChange}
                          icon={<Icon as={ChevronDown} />}
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px blue.400",
                          }}
                        >
                          <option value="createdAt_desc">Newest First</option>
                          <option value="createdAt_asc">Oldest First</option>
                          <option value="price_asc">Price: Low to High</option>
                          <option value="price_desc">Price: High to Low</option>
                          <option value="name_asc">Name: A to Z</option>
                          <option value="name_desc">Name: Z to A</option>
                        </Select>
                      </FormControl>

                      {/* Reset Filters */}
                      <Flex align="flex-end">
                        <Button
                          onClick={resetFilters}
                          colorScheme="red"
                          variant="outline"
                          leftIcon={<Icon as={RefreshCcw} size={16} />}
                          borderRadius="lg"
                          fontWeight="medium"
                          _hover={{
                            bg: "red.50",
                          }}
                        >
                          Reset Filters
                        </Button>
                      </Flex>
                    </SimpleGrid>
                  </Box>
                </SlideFade>
              )}
            </AnimatePresence>

            {/* Active Filters Display with enhanced styling */}
            {Object.keys(activeFilters).length > 0 && (
              <Box
                w="full"
                mb={4}
                p={3}
                bg={filterBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={cardBorder}
                mt={3}
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  mb={2}
                  color={headingColor}
                >
                  Active Filters:
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {activeFilters.search && (
                    <Badge
                      colorScheme="blue"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      Search: "{activeFilters.search}"
                      <Icon
                        as={X}
                        ml={1}
                        boxSize="12px"
                        cursor="pointer"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, search: "" }));
                        }}
                      />
                    </Badge>
                  )}
                  {activeFilters.testType && (
                    <Badge
                      colorScheme="green"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      Type: {activeFilters.testType}
                      <Icon
                        as={X}
                        ml={1}
                        boxSize="12px"
                        cursor="pointer"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, testType: "" }));
                        }}
                      />
                    </Badge>
                  )}
                  {activeFilters.hospital && (
                    <Badge
                      colorScheme="teal"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      Hospital:{" "}
                      {hospitals.find((h) => h._id === activeFilters.hospital)
                        ?.name || activeFilters.hospital}
                      <Icon
                        as={X}
                        ml={1}
                        boxSize="12px"
                        cursor="pointer"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, hospital: "" }));
                        }}
                      />
                    </Badge>
                  )}
                  {activeFilters.minPrice && activeFilters.maxPrice && (
                    <Badge
                      colorScheme="purple"
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      Price: Rs.{activeFilters.minPrice} - Rs.
                      {activeFilters.maxPrice}
                      <Icon
                        as={X}
                        ml={1}
                        boxSize="12px"
                        cursor="pointer"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: "",
                            maxPrice: "",
                          }));
                        }}
                      />
                    </Badge>
                  )}
                </Flex>
              </Box>
            )}
          </VStack>

          {medicalTests?.length === 0 ? (
            <Box
              textAlign="center"
              py={16}
              px={4}
              borderRadius="xl"
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              shadow="md"
              mt={6}
            >
              <Icon as={Search} boxSize={16} color="blue.400" mb={5} />
              <Heading as="h3" size="lg" mb={3} color={headingColor}>
                No Medical Tests Available
              </Heading>
              <Text
                color={descriptionColor}
                fontSize="md"
                maxW="600px"
                mx="auto"
              >
                There are no medical tests matching your filters at the moment.
                Please try different filter options or check back later.
              </Text>
              {Object.keys(activeFilters).length > 0 && (
                <Button
                  mt={6}
                  colorScheme="blue"
                  size="lg"
                  onClick={resetFilters}
                  leftIcon={<Icon as={RefreshCcw} size={18} />}
                  borderRadius="lg"
                  px={8}
                  boxShadow="sm"
                >
                  Clear All Filters
                </Button>
              )}
            </Box>
          ) : (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 3 }}
                spacing={8}
                width="full"
              >
                {medicalTests?.map((test) => (
                  <Card
                    key={test._id}
                    overflow="hidden"
                    bg={cardBg}
                    border="1px solid"
                    borderColor={cardBorder}
                    borderRadius="2xl"
                    boxShadow="sm"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-6px)",
                      boxShadow: "xl",
                      borderColor: cardHoverBorder,
                    }}
                    position="relative"
                    role="group"
                  >
                    {/* Image container with enhanced gradient overlay */}
                    <Box position="relative" h="52" w="full" overflow="hidden">
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        height="60%"
                        bgGradient="linear(to-t, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)"
                        zIndex={1}
                      />
                      <Image
                        src={
                          test.testImage ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={test.testName}
                        objectFit="cover"
                        width="full"
                        height="full"
                        transition="transform 0.6s ease"
                        _groupHover={{ transform: "scale(1.08)" }}
                        fallback={
                          <Skeleton
                            height="208px"
                            startColor="gray.100"
                            endColor="gray.200"
                          />
                        }
                      />

                      {/* Optional: Add a badge for popular or featured tests with improved styling */}
                      {test.isPopular && (
                        <Badge
                          position="absolute"
                          top={4}
                          right={4}
                          colorScheme="green"
                          zIndex={2}
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="semibold"
                          boxShadow="md"
                        >
                          <Icon as={Star} mr={1} boxSize="12px" />
                          Popular
                        </Badge>
                      )}

                      {/* Test type badge positioned on image */}
                      {test.testType && (
                        <Badge
                          position="absolute"
                          bottom={4}
                          left={4}
                          size="sm"
                          colorScheme={
                            test.testType === "blood"
                              ? "red"
                              : test.testType === "imaging"
                              ? "purple"
                              : test.testType === "urine"
                              ? "yellow"
                              : test.testType === "genetic"
                              ? "blue"
                              : "gray"
                          }
                          zIndex={2}
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="semibold"
                          boxShadow="sm"
                        >
                          {test.testType.charAt(0).toUpperCase() +
                            test.testType.slice(1)}
                        </Badge>
                      )}
                    </Box>

                    <Box p={6}>
                      {/* Header section with improved typography */}
                      <Heading
                        as="h3"
                        size="md"
                        mb={2}
                        noOfLines={1}
                        fontWeight="bold"
                        color={headingColor}
                        letterSpacing="tight"
                      >
                        {test.testName}
                      </Heading>

                      {/* Location info with enhanced visual hierarchy */}
                      <Flex
                        align="center"
                        fontSize="sm"
                        color="gray.500"
                        mb={3}
                        fontWeight="medium"
                      >
                        <Icon as={MapPin} size={14} mr={1} color="blue.500" />
                        <Text noOfLines={1} fontSize="sm">
                          {test.hospital?.name || "Hospital not specified"},{" "}
                          {test.hospital?.location || "Location not specified"}
                        </Text>
                      </Flex>

                      {/* Description with improved readability */}
                      <Text
                        fontSize="sm"
                        color={descriptionColor}
                        mb={5}
                        noOfLines={2}
                        lineHeight="tall"
                      >
                        {test?.testDescription ||
                          "No description available for this test."}
                      </Text>

                      {/* Stats/Info row with enhanced visual appeal */}

                      {/* Divider for visual separation */}
                      <Divider my={4} borderColor={dividerColor} />

                      {/* Price and CTA row with improved visual hierarchy */}
                      <Flex align="center" justify="space-between" mt={4}>
                        <Flex
                          direction="column"
                          bg={priceBg}
                          px={4}
                          py={2}
                          borderRadius="lg"
                          boxShadow="sm"
                        >
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontWeight="medium"
                          >
                            Price
                          </Text>
                          <Text
                            fontWeight="bold"
                            fontSize="xl"
                            color={priceColor}
                            letterSpacing="tight"
                          >
                            Rs. {test.testPrice || "0.00"}
                          </Text>
                        </Flex>

                        <Button
                          onClick={() => onTestSelect(test._id)}
                          colorScheme="blue"
                          size="md"
                          borderRadius="lg"
                          fontWeight="bold"
                          px={6}
                          py={6}
                          boxShadow="md"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg",
                            bg: "blue.400",
                          }}
                          _active={{
                            transform: "translateY(0)",
                            bg: "blue.600",
                          }}
                          transition="all 0.2s"
                        >
                          Book Now
                        </Button>
                      </Flex>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Pagination with enhanced styling */}
              <Box mt={12} display="flex" justifyContent="center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages || 1}
                  onPageChange={handlePageChange}
                  colorScheme="blue"
                  size="md"
                  borderRadius="lg"
                  fontWeight="medium"
                  boxShadow="sm"
                />
              </Box>
            </>
          )}
        </Fade>
      </Container>
    </Box>
  );
};

export default MedicalTests;
