import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Building2, Filter, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HospitalCard from "../../component/common/HospitalCard";
import TopSection from "../../component/common/TopSection";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";
import Pagination from "../../utils/Pagination";

// Motion components
const MotionBox = motion.create(Box);

const MotionSimpleGrid = motion.create(SimpleGrid);

// Loading skeleton for hospital cards
const HospitalCardSkeleton = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      boxShadow="md"
      overflow="hidden"
      border="1px"
      borderColor={borderColor}
    >
      <Skeleton height="200px" />
      <Box p={6}>
        <SkeletonText noOfLines={1} height="24px" width="70%" mb={3} />
        <SkeletonText noOfLines={1} height="16px" width="40%" mb={5} />
        <SkeletonText noOfLines={3} spacing="4" mb={5} />
        <Skeleton height="40px" borderRadius="md" />
      </Box>
    </Box>
  );
};

export const HospitalsPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Get data from Redux store
  const {
    hospitals,
    isLoading: reduxLoading,
    error,
  } = useSelector((state) => state?.hospitalSlice?.hospitals);

  const totalPages = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.Pagination?.totalPages
  );

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const filterBg = useColorModeValue("white", "gray.800");

  // Responsive design
  const filterLayout = useBreakpointValue({
    base: "column",
    md: "row",
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle search input with debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch hospitals
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        // Include filters in your API call
        await dispatch(
          fetchAllHospitals({
            page: currentPage,
            limit: 9,
            search: debouncedSearchTerm,
            specialty:
              selectedSpecialty !== "All Specialties" ? selectedSpecialty : "",
            location:
              selectedLocation !== "All Locations" ? selectedLocation : "",
          })
        ).unwrap();
      } finally {
        // Add a small delay to make loading state visible
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    fetchData();
  }, [
    dispatch,
    currentPage,
    debouncedSearchTerm,
    selectedSpecialty,
    selectedLocation,
  ]);

  // Handle filters
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("All Specialties");
    setSelectedLocation("All Locations");
    setCurrentPage(1);
  };

  // Placeholder for hospitals count - replace with actual count from your API
  const totalHospitals = hospitals?.length || 0;

  return (
    <Box bg={bgColor} minH="100vh">
      <TopSection
        title="Our Hospital Network"
        subtitle="Find the perfect healthcare facility for your needs"
      />

      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        {/* Filters Section */}
        <MotionBox
          bg={filterBg}
          p={{ base: 5, md: 6 }}
          borderRadius="xl"
          boxShadow="sm"
          border="1px"
          borderColor={borderColor}
          mb={{ base: 8, md: 10 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <VStack spacing={5} align="stretch">
            <Flex align="center" justify="space-between">
              <HStack>
                <Icon as={Filter} color={accentColor} />
                <Heading as="h3" size="md" color={headingColor}>
                  Find the Right Hospital
                </Heading>
              </HStack>

              <Badge
                colorScheme="blue"
                fontSize="sm"
                borderRadius="full"
                px={3}
                py={1}
              >
                {isLoading ? (
                  <Flex align="center">
                    <Icon
                      as={RefreshCw}
                      className="animate-spin"
                      size={12}
                      mr={1}
                    />
                    <Text>Searching...</Text>
                  </Flex>
                ) : (
                  `${totalHospitals} results`
                )}
              </Badge>
            </Flex>

            <Flex
              direction={filterLayout}
              gap={{ base: 3, md: 5 }}
              align={{ base: "stretch", md: "center" }}
            >
              <InputGroup flex={{ md: 2 }}>
                <InputLeftElement>
                  <Icon as={Search} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search hospitals"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  bg={useColorModeValue("white", "gray.700")}
                  borderColor={borderColor}
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500",
                  }}
                />
              </InputGroup>

              <Button
                variant="outline"
                colorScheme="blue"
                onClick={handleClearFilters}
                size="md"
                leftIcon={<RefreshCw size={16} />}
                minW="120px"
              >
                Clear Filters
              </Button>
            </Flex>
          </VStack>
        </MotionBox>

        {/* Error Message */}
        {error && (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="lg"
            mb={8}
          >
            <AlertIcon boxSize={6} mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error Loading Hospitals
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {error.message || "Something went wrong. Please try again later."}
            </AlertDescription>
          </Alert>
        )}

        {/* Hospitals Grid */}
        <MotionBox mb={10}>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            color={headingColor}
            display="flex"
            alignItems="center"
          >
            <Icon as={Building2} mr={2} color={accentColor} />
            Our Healthcare Network
            <Divider
              orientation="horizontal"
              ml={4}
              flex="1"
              borderColor={borderColor}
            />
          </Heading>

          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {[...Array(9)].map((_, i) => (
                <HospitalCardSkeleton key={i} />
              ))}
            </SimpleGrid>
          ) : hospitals?.length > 0 ? (
            <MotionSimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={8}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {hospitals.map((hospital) => (
                <MotionBox
                  key={hospital._id}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <HospitalCard hospital={hospital} />
                </MotionBox>
              ))}
            </MotionSimpleGrid>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={10}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Icon as={Building2} boxSize={12} color="gray.400" mb={4} />
              <Heading as="h3" size="md" mb={2} color={headingColor}>
                No Hospitals Found
              </Heading>
              <Text color={textColor} textAlign="center" maxW="md" mb={6}>
                We couldn't find any hospitals matching your current filters.
                Try adjusting your search criteria or explore our entire
                network.
              </Text>
              <Button
                colorScheme="blue"
                onClick={handleClearFilters}
                leftIcon={<RefreshCw size={16} />}
              >
                Reset Filters
              </Button>
            </Flex>
          )}
        </MotionBox>

        {/* Pagination */}
        {!isLoading && hospitals?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Box>
  );
};

export default HospitalsPage;
