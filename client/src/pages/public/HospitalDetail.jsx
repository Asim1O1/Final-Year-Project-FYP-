import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Divider,
  Flex,
  GridItem,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaAmbulance,
  FaArrowRight,
  FaCalendarAlt,
  FaChevronRight,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaRegHospital,
  FaStethoscope,
  FaUserMd,
  FaVial,
  FaWheelchair,
} from "react-icons/fa";
import {
  MdAccessTime,
  MdEmail,
  MdInfo,
  MdLanguage,
  MdLocationOn,
  MdOutlineHealthAndSafety,
  MdOutlineVerified,
  MdPhone,
  MdStar,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import doctorConsultingImage from "../../assets/doc consulting.jpg";
import { fetchSingleHospital } from "../../features/hospital/hospitalSlice";

// Motion components for smooth animations
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

// Helper component for facility features

const HospitalDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Get hospital data from Redux store
  const hospital = useSelector(
    (state) => state.hospitalSlice?.hospital?.hospital
  );

  const doctors = useSelector(
    (state) => state?.hospitalSlice?.hospital?.doctors
  );

  const medicalTests = useSelector(
    (state) => state?.hospitalSlice?.hospital?.medicalTests
  );
  console.log("The medical tests are", medicalTests);

  // Chakra UI color tokens for consistent theming
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const subtleColor = useColorModeValue("gray.50", "gray.700");
  const secondaryAccentColor = useColorModeValue("teal.500", "teal.300");
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Fetch hospital data
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        await dispatch(fetchSingleHospital(id)).unwrap();
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hospital:", err);
        setError("Failed to fetch hospital details");
        setLoading(false);
      }
    };

    fetchHospital();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  // Scroll to section when tab changes
  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeTab, loading]);

  const handleTestBook = (testId) => {
    navigate(`/tests/${testId}`);
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <Box bg={sectionBg} minH="100vh">
        <Container maxW="7xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Box mb={5}>
              <Skeleton height="20px" width="40%" mb={2} />
              <Skeleton height="30px" width="70%" />
            </Box>
            <Skeleton height="400px" borderRadius="xl" />
            <Skeleton height="60px" width="100%" borderRadius="md" />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <GridItem colSpan={2}>
                <VStack align="stretch" spacing={6}>
                  <Skeleton height="300px" borderRadius="lg" />
                  <Skeleton height="200px" borderRadius="lg" />
                </VStack>
              </GridItem>
              <GridItem colSpan={1}>
                <VStack align="stretch" spacing={6}>
                  <Skeleton height="250px" borderRadius="lg" />
                  <Skeleton height="180px" borderRadius="lg" />
                </VStack>
              </GridItem>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error || !hospital) {
    return (
      <Box bg={sectionBg} minH="100vh">
        <Container maxW="7xl" py={12}>
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="xl"
            py={10}
            px={6}
            bg="red.50"
            borderColor="red.200"
            borderWidth="1px"
          >
            <AlertIcon boxSize="40px" mr={0} color="red.500" />
            <Heading mt={6} mb={3} size="lg">
              Hospital Information Unavailable
            </Heading>
            <Text maxW="lg" color="gray.600" fontSize="lg" mb={6}>
              {error ||
                "We couldn't find the hospital you're looking for. Please try again later or contact support."}
            </Text>
            <HStack spacing={4}>
              <Button
                colorScheme="blue"
                onClick={() => navigate("/hospitals")}
                leftIcon={<FaArrowRight />}
              >
                View All Hospitals
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </HStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  // Default image if hospital image is not available
  const defaultImage =
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  const hospitalImage = hospital.hospitalImage || defaultImage;

  return (
    <MotionBox
      bg={sectionBg}
      minH="100vh"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Breadcrumb Navigation */}
      <Box
        bg={cardBgColor}
        py={3}
        borderBottom="1px"
        borderColor={borderColor}
        mb={{ base: 0, md: 0 }}
      >
        <Container maxW="7xl">
          <Breadcrumb
            separator={
              <Icon as={FaChevronRight} color="gray.400" boxSize={3} />
            }
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/" color={textColor}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/hospitals" color={textColor}>
                Hospitals
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color={accentColor} fontWeight="medium">
                {hospital.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Container>
      </Box>

      {/* Hero Section with Hospital Image */}
      <MotionBox
        position="relative"
        h={{ base: "300px", md: "400px", lg: "500px" }}
        overflow="hidden"
        variants={fadeIn}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgImage={`url(${hospitalImage})`}
          bgPosition="center"
          bgSize="cover"
          bgRepeat="no-repeat"
          filter="brightness(0.75)"
          transform="scale(1.05)"
          transition="transform 0.3s ease"
          // Add these properties for better image quality
          sx={{
            imageRendering: "-webkit-optimize-contrast",
            backfaceVisibility: "hidden",
            perspective: 1000,
            transformStyle: "preserve-3d",
          }}
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgGradient: "linear(to-b, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
            zIndex: 1,
          }}
        />

        <Container maxW="7xl" h="full" position="relative" zIndex={2}>
          <Flex
            direction="column"
            justify="flex-end"
            h="full"
            pb={{ base: 8, md: 12 }}
            color="white"
          >
            <HStack mb={3} flexWrap="wrap" gap={2}>
              {hospital.isEmergency && (
                <Badge
                  colorScheme="red"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  fontWeight="bold"
                >
                  <Flex align="center">
                    <Icon as={FaAmbulance} mr={1} />
                    24/7 Emergency
                  </Flex>
                </Badge>
              )}
            </HStack>

            <Heading
              size={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
              mb={4}
            >
              {hospital.name}
            </Heading>

            <HStack spacing={6} flexWrap="wrap" gap={4}>
              <HStack>
                <Icon as={MdLocationOn} boxSize={5} />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                  {hospital.location}
                </Text>
              </HStack>

              <HStack>
                <Icon as={FaPhoneAlt} boxSize={4} />
                <Text fontSize={{ base: "md", md: "lg" }}>
                  {hospital.contactNumber}
                </Text>
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </MotionBox>

      {/* Quick Actions Bar */}
      <Box
        bg={cardBgColor}
        borderBottom="1px"
        borderColor={borderColor}
        py={4}
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack spacing={{ base: 2, md: 6 }} flexWrap="wrap">
              <Button
                leftIcon={<FaMapMarkedAlt />}
                colorScheme="teal"
                variant="outline"
                size={{ base: "sm", md: "md" }}
                as={Link}
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${hospital.name}, ${hospital.location}`
                )}`}
                isExternal
              >
                Get Directions
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          size="md"
          isLazy
          index={activeTab}
          onChange={setActiveTab}
        >
          <TabList
            mb={8}
            overflowX="auto"
            py={2}
            css={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Tab>Overview</Tab>
            <Tab>Doctors</Tab>
            <Tab>Medical Tests</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel px={0}>
              <MotionFlex
                direction={{ base: "column", lg: "row" }}
                gap={8}
                variants={staggerChildren}
              >
                {/* Main Info Section */}
                <MotionBox flex="2" variants={fadeIn}>
                  <VStack spacing={8} align="stretch">
                    {/* About Section */}
                    <Box
                      bg={cardBgColor}
                      p={{ base: 5, md: 8 }}
                      borderRadius="xl"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ boxShadow: "md" }}
                    >
                      <Flex mb={6} align="center">
                        <Icon
                          as={MdInfo}
                          color={accentColor}
                          boxSize={6}
                          mr={3}
                        />
                        <Heading
                          size="lg"
                          color={accentColor}
                          fontWeight="bold"
                        >
                          About {hospital.name}
                        </Heading>
                      </Flex>

                      <Text
                        color={textColor}
                        fontSize="lg"
                        lineHeight="tall"
                        mb={6}
                      >
                        {hospital.description ||
                          `${hospital.name} is a leading healthcare provider located in ${hospital.location}. The hospital is committed to providing high-quality medical services to patients with a focus on comprehensive care and patient satisfaction.`}
                      </Text>

                      <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={6}
                        mt={8}
                      >
                        <Box
                          p={5}
                          bg={highlightColor}
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Flex align="center" mb={3}>
                            <Icon
                              as={MdOutlineVerified}
                              color={accentColor}
                              boxSize={5}
                              mr={2}
                            />
                            <Text fontWeight="bold" fontSize="lg">
                              Quality Assurance
                            </Text>
                          </Flex>
                          <Text>
                            {hospital.name} maintains the highest standards of
                            healthcare quality and has earned certifications for
                            excellence in patient care.
                          </Text>
                        </Box>

                        <Box
                          p={5}
                          bg={highlightColor}
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Flex align="center" mb={3}>
                            <Icon
                              as={FaAmbulance}
                              color={accentColor}
                              boxSize={5}
                              mr={2}
                            />
                            <Text fontWeight="bold" fontSize="lg">
                              Emergency Services
                            </Text>
                          </Flex>
                          <Text>
                            {hospital.isEmergency
                              ? "24/7 Emergency care with advanced life support ambulances and trauma care specialists"
                              : "Emergency services available during regular hospital hours with qualified medical staff"}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Key Features Section */}
                    <Box
                      bg={cardBgColor}
                      p={{ base: 5, md: 8 }}
                      borderRadius="xl"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Flex mb={6} align="center">
                        <Icon
                          as={MdStar}
                          color={secondaryAccentColor}
                          boxSize={6}
                          mr={3}
                        />
                        <Heading
                          size="lg"
                          color={secondaryAccentColor}
                          fontWeight="bold"
                        >
                          Key Features
                        </Heading>
                      </Flex>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        <HStack align="flex-start" spacing={4}>
                          <Box
                            borderRadius="md"
                            p={2}
                            bg={`${secondaryAccentColor}20`}
                            color={secondaryAccentColor}
                          >
                            <Icon as={FaUserMd} boxSize={5} />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={1}>
                              Expert Medical Team
                            </Text>
                            <Text color={textColor} fontSize="sm">
                              Team of {doctors?.length || "experienced"} medical
                              professionals across various specialties
                            </Text>
                          </Box>
                        </HStack>

                        <HStack align="flex-start" spacing={4}>
                          <Box
                            borderRadius="md"
                            p={2}
                            bg={`${secondaryAccentColor}20`}
                            color={secondaryAccentColor}
                          >
                            <Icon as={MdOutlineHealthAndSafety} boxSize={5} />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={1}>
                              Modern Equipment
                            </Text>
                            <Text color={textColor} fontSize="sm">
                              State-of-the-art medical technology for accurate
                              diagnosis and treatment
                            </Text>
                          </Box>
                        </HStack>

                        <HStack align="flex-start" spacing={4}>
                          <Box
                            borderRadius="md"
                            p={2}
                            bg={`${secondaryAccentColor}20`}
                            color={secondaryAccentColor}
                          >
                            <Icon as={FaWheelchair} boxSize={5} />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={1}>
                              Patient-Centered Care
                            </Text>
                            <Text color={textColor} fontSize="sm">
                              Focused on patient comfort, needs, and holistic
                              well-being
                            </Text>
                          </Box>
                        </HStack>

                        <HStack align="flex-start" spacing={4}>
                          <Box
                            borderRadius="md"
                            p={2}
                            bg={`${secondaryAccentColor}20`}
                            color={secondaryAccentColor}
                          >
                            <Icon as={MdLanguage} boxSize={5} />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={1}>
                              Multilingual Support
                            </Text>
                            <Text color={textColor} fontSize="sm">
                              Staff equipped to assist patients in multiple
                              languages
                            </Text>
                          </Box>
                        </HStack>
                      </SimpleGrid>
                    </Box>

                    {/* Specialties Section */}
                    <Box
                      bg={cardBgColor}
                      p={{ base: 5, md: 8 }}
                      borderRadius="xl"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ boxShadow: "md" }}
                    >
                      <Flex mb={6} align="center" justify="space-between">
                        <Flex align="center">
                          <Icon
                            as={MdOutlineHealthAndSafety}
                            color={accentColor}
                            boxSize={6}
                            mr={3}
                          />
                          <Heading
                            size="lg"
                            color={accentColor}
                            fontWeight="bold"
                          >
                            Medical Specialties
                          </Heading>
                        </Flex>

                        <Tag
                          size="md"
                          variant="subtle"
                          colorScheme="blue"
                          borderRadius="full"
                        >
                          {hospital.specialties?.length || 0} Specialties
                        </Tag>
                      </Flex>

                      {hospital.specialties &&
                      hospital.specialties.length > 0 ? (
                        <SimpleGrid
                          columns={{ base: 2, md: 3, lg: 4 }}
                          spacing={4}
                        >
                          {hospital.specialties.map((specialty, index) => (
                            <Flex
                              key={index}
                              bg={subtleColor}
                              p={4}
                              borderRadius="lg"
                              align="center"
                              transition="all 0.2s"
                              _hover={{
                                bg: highlightColor,
                                transform: "translateY(-2px)",
                                boxShadow: "sm",
                              }}
                            >
                              <Icon
                                as={FaStethoscope}
                                color={accentColor}
                                boxSize={5}
                                mr={3}
                              />
                              <Text fontWeight="medium">{specialty}</Text>
                            </Flex>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <Text color="gray.500" fontStyle="italic">
                          Specialty information is currently being updated.
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </MotionBox>

                {/* Sidebar */}
                <MotionBox flex="1" variants={fadeIn}>
                  <VStack
                    spacing={8}
                    align="stretch"
                    position="sticky"
                    top="100px"
                  >
                    {/* Hospital Info Card */}
                    <Box
                      bg={cardBgColor}
                      p={6}
                      borderRadius="xl"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                      overflow="hidden"
                      position="relative"
                    >
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        h="8px"
                        bgGradient="linear(to-r, blue.400, teal.400)"
                      />

                      <VStack align="start" spacing={5} mt={2}>
                        <Flex align="center" width="full">
                          <Box
                            bg={highlightColor}
                            p={3}
                            borderRadius="full"
                            mr={4}
                          >
                            <Icon
                              as={FaRegHospital}
                              color={accentColor}
                              boxSize={6}
                            />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" fontSize="xl">
                              {hospital.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Healthcare Institution
                            </Text>
                          </Box>
                        </Flex>

                        <Divider />

                        <VStack align="start" spacing={4} width="full">
                          <HStack width="full" align="flex-start">
                            <Icon
                              as={MdLocationOn}
                              color={accentColor}
                              boxSize={5}
                              mt={1}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Address
                              </Text>
                              <Text>{hospital.location}</Text>
                            </Box>
                          </HStack>

                          <HStack width="full" align="flex-start">
                            <Icon
                              as={MdPhone}
                              color={accentColor}
                              boxSize={5}
                              mt={1}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Phone
                              </Text>
                              <Link
                                href={`tel:${hospital.contactNumber}`}
                                color={accentColor}
                              >
                                {hospital.contactNumber}
                              </Link>
                            </Box>
                          </HStack>

                          <HStack width="full" align="flex-start">
                            <Icon
                              as={MdEmail}
                              color={accentColor}
                              boxSize={5}
                              mt={1}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Email
                              </Text>
                              <Link
                                href={`mailto:${hospital.email}`}
                                color={accentColor}
                              >
                                {hospital.email}
                              </Link>
                            </Box>
                          </HStack>

                          <HStack width="full" align="flex-start">
                            <Icon
                              as={MdAccessTime}
                              color={accentColor}
                              boxSize={5}
                              mt={1}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Working Hours
                              </Text>
                              <Text>
                                {hospital.isEmergency
                                  ? "Open 24/7"
                                  : "8:00 AM - 8:00 PM"}
                              </Text>
                            </Box>
                          </HStack>
                        </VStack>

                        <Button
                          colorScheme="blue"
                          size="md"
                          width="full"
                          leftIcon={<FaMapMarkedAlt />}
                          mt={2}
                          as={Link}
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            `${hospital.name}, ${hospital.location}`
                          )}`}
                          isExternal
                        >
                          View on Map
                        </Button>
                      </VStack>
                    </Box>

                    {/* Hospital Stats */}
                    <Box
                      bg={cardBgColor}
                      p={6}
                      borderRadius="xl"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="md" mb={5} color={accentColor}>
                        Hospital Overview
                      </Heading>

                      <SimpleGrid columns={2} spacing={4}>
                        <Stat
                          bg={subtleColor}
                          p={4}
                          borderRadius="lg"
                          textAlign="center"
                        >
                          <StatLabel color="gray.500">Specialties</StatLabel>
                          <StatNumber
                            fontSize="2xl"
                            fontWeight="bold"
                            color={accentColor}
                          >
                            {hospital.specialties?.length || 0}
                          </StatNumber>
                        </Stat>

                        <Stat
                          bg={subtleColor}
                          p={4}
                          borderRadius="lg"
                          textAlign="center"
                        >
                          <StatLabel color="gray.500">Medical Tests</StatLabel>
                          <StatNumber
                            fontSize="2xl"
                            fontWeight="bold"
                            color={accentColor}
                          >
                            {medicalTests?.length || 0}
                          </StatNumber>
                        </Stat>

                        <Stat
                          bg={subtleColor}
                          p={4}
                          borderRadius="lg"
                          textAlign="center"
                          gridColumn={{ base: "span 1", md: "span 2" }}
                        >
                          <StatLabel color="gray.500">Doctors</StatLabel>
                          <StatNumber
                            fontSize="2xl"
                            fontWeight="bold"
                            color={accentColor}
                          >
                            {doctors?.length || 0}
                          </StatNumber>
                        </Stat>
                      </SimpleGrid>
                    </Box>

                    {/* Featured Doctors */}
                    <Box
                      bg={cardBgColor}
                      p={6}
                      borderRadius="xl"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Flex align="center" justify="space-between" mb={5}>
                        <Heading size="md" color={accentColor}>
                          Featured Doctors
                        </Heading>

                        <Button
                          size="xs"
                          variant="link"
                          colorScheme="blue"
                          onClick={() => setActiveTab(1)}
                          rightIcon={<FaArrowRight />}
                        >
                          View All
                        </Button>
                      </Flex>

                      {doctors?.length === 0 ? (
                        <Text color="gray.500" fontStyle="italic">
                          No doctors available for this hospital.
                        </Text>
                      ) : (
                        <VStack spacing={4} align="stretch">
                          {(doctors || []).slice(0, 3).map((doctor, index) => (
                            <HStack
                              key={index}
                              spacing={3}
                              p={3}
                              borderRadius="md"
                              bg={subtleColor}
                              cursor="pointer"
                              _hover={{
                                bg: highlightColor,
                                transform: "translateY(-2px)",
                              }}
                              transition="all 0.2s"
                              onClick={() =>
                                navigate(`/doctor-profile/${doctor._id}`)
                              }
                            >
                              <Avatar
                                size="md"
                                src={doctor.doctorProfileImage}
                                name={doctor.fullName}
                                bg="blue.500"
                              />
                              <Box>
                                <Text fontWeight="bold">{doctor.fullName}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {doctor.specialty || doctor.specialization}
                                </Text>
                              </Box>
                            </HStack>
                          ))}

                          {doctors?.length > 3 && (
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="blue"
                              onClick={() => setActiveTab(1)}
                              rightIcon={<FaArrowRight />}
                              width="full"
                            >
                              View All {doctors.length} Doctors
                            </Button>
                          )}
                        </VStack>
                      )}
                    </Box>
                  </VStack>
                </MotionBox>
              </MotionFlex>
            </TabPanel>

            {/* Doctors Tab */}
            <TabPanel px={0}>
              <MotionBox variants={fadeIn}>
                <Box
                  bg={cardBgColor}
                  p={{ base: 5, md: 8 }}
                  borderRadius="xl"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex
                    mb={8}
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "start", md: "center" }}
                    gap={4}
                  >
                    <Box>
                      <Heading size="lg" color={accentColor} mb={2}>
                        Medical Professionals at {hospital.name}
                      </Heading>
                      <Text color={textColor}>
                        Our team of qualified doctors and specialists provide
                        exceptional care across multiple medical specialties.
                      </Text>
                    </Box>
                  </Flex>

                  {doctors?.length === 0 ? (
                    <Box
                      bg={subtleColor}
                      p={8}
                      borderRadius="lg"
                      textAlign="center"
                    >
                      <Icon
                        as={FaUserMd}
                        boxSize={12}
                        color="gray.400"
                        mb={4}
                      />
                      <Heading size="md" mb={2} color={textColor}>
                        No Doctors Available
                      </Heading>
                      <Text color="gray.500">
                        There are currently no doctors listed for this hospital.
                        Please check back later for updates.
                      </Text>
                    </Box>
                  ) : (
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                      spacing={6}
                    >
                      {(doctors || []).map((doctor, index) => (
                        <MotionBox
                          key={doctor._id || index}
                          bg="white"
                          borderRadius="xl"
                          overflow="hidden"
                          transition="all 0.2s"
                          _hover={{
                            transform: "translateY(-5px)",
                            shadow: "lg",
                          }}
                          borderWidth="1px"
                          borderColor={borderColor}
                          boxShadow="sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: index * 0.05, duration: 0.5 },
                          }}
                        >
                          <Box position="relative">
                            <Image
                              src={
                                doctor.doctorProfileImage || "/placeholder.svg"
                              }
                              alt={doctor.fullName}
                              w="full"
                              h="200px"
                              objectFit="cover"
                            />
                            {doctor.specialty && (
                              <Tag
                                position="absolute"
                                top="10px"
                                right="10px"
                                colorScheme="blue"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                {doctor.specialty}
                              </Tag>
                            )}
                          </Box>

                          <Box p={5}>
                            <Heading as="h3" size="md" mb={2}>
                              Dr. {doctor.fullName}
                            </Heading>

                            <HStack mt={1} mb={3}>
                              <Icon as={FaUserMd} color={accentColor} />
                              <Text color="gray.600">
                                {doctor.specialization ||
                                  doctor.specialty ||
                                  "Specialist"}
                              </Text>
                            </HStack>

                            {doctor.experience && (
                              <Text fontSize="sm" color="gray.500" mb={3}>
                                {doctor.experience} years of experience
                              </Text>
                            )}

                            <HStack mt={4} spacing={2}>
                              <Button
                                colorScheme="blue"
                                size="sm"
                                flex="1"
                                onClick={() =>
                                  navigate(`/doctor-profile/${doctor._id}`)
                                }
                              >
                                View Profile
                              </Button>

                              <Tooltip label="Book appointment">
                                <IconButton
                                  aria-label="Book appointment"
                                  icon={<FaCalendarAlt />}
                                  colorScheme="teal"
                                  size="sm"
                                  variant="outline"
                                />
                              </Tooltip>
                            </HStack>
                          </Box>
                        </MotionBox>
                      ))}
                    </SimpleGrid>
                  )}
                </Box>
              </MotionBox>
            </TabPanel>

            {/* Medical Tests Tab */}
            <TabPanel px={0}>
              <MotionBox variants={fadeIn}>
                <Box
                  bg={cardBgColor}
                  p={{ base: 5, md: 8 }}
                  borderRadius="xl"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex mb={8} align="center" justify="space-between">
                    <Box>
                      <Heading size="lg" color={accentColor} mb={2}>
                        Diagnostic Services & Medical Tests
                      </Heading>
                      <Text color={textColor}>
                        Comprehensive diagnostic services with state-of-the-art
                        equipment and skilled technicians.
                      </Text>
                    </Box>

                    <Tag
                      size="lg"
                      colorScheme="blue"
                      borderRadius="full"
                      px={4}
                    >
                      {medicalTests?.length || 0} Tests Available
                    </Tag>
                  </Flex>

                  {!medicalTests || medicalTests.length === 0 ? (
                    <Box
                      bg={subtleColor}
                      p={8}
                      borderRadius="lg"
                      textAlign="center"
                    >
                      <Icon as={FaVial} boxSize={12} color="gray.400" mb={4} />
                      <Heading size="md" mb={2} color={textColor}>
                        No Medical Tests Available
                      </Heading>
                      <Text color="gray.500">
                        There are currently no medical tests listed for this
                        hospital. Please contact the hospital directly for
                        information about available diagnostic services.
                      </Text>
                    </Box>
                  ) : (
                    <>
                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 3 }}
                        spacing={5}
                      >
                        {(medicalTests || []).map((test, index) => (
                          <Box
                            key={test._id || index}
                            p={5}
                            bg="white"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            boxShadow="sm"
                            _hover={{
                              boxShadow: "md",
                              borderColor: "blue.200",
                            }}
                            transition="all 0.2s"
                          >
                            <Flex mb={3} justify="space-between" align="center">
                              <Heading size="sm" color={textColor}>
                                {test?.testName}
                              </Heading>

                              {test?.testPrice && (
                                <Tag colorScheme="green" fontWeight="bold">
                                  Nrs. {test.testPrice}
                                </Tag>
                              )}
                            </Flex>

                            {test?.testDescription && (
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                mb={3}
                                noOfLines={2}
                              >
                                {test.testDescription}
                              </Text>
                            )}

                            <Button
                              mt={4}
                              size="sm"
                              width="full"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => handleTestBook(test._id)}
                            >
                              Book This Test
                            </Button>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </>
                  )}
                </Box>
              </MotionBox>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* CTA Section */}
      <Box bg={highlightColor} py={10} mt={10}>
        <Container maxW="7xl">
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={8}
            alignItems="center"
          >
            <Box>
              <Heading as="h2" size="xl" mb={4} color={textColor}>
                Need Medical Assistance?
              </Heading>
              <Text fontSize="lg" mb={6} color={textColor}>
                Contact {hospital.name} directly or book an appointment with one
                of our specialists. Our team is ready to provide the care you
                need.
              </Text>
              <HStack spacing={4}></HStack>
            </Box>
            <Box display={{ base: "none", md: "block" }}>
              {/* Enhanced image quality settings */}
              <Box
                borderRadius="xl"
                boxShadow="lg"
                overflow="hidden"
                position="relative"
                height="300px"
                width="100%"
              >
                {/* Attempt to load the actual image with quality optimizations */}
                <Image
                  src={doctorConsultingImage}
                  alt="Doctor consulting with patient"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  objectPosition="center"
                  quality={100}
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                  display={imageLoaded ? "block" : "none"}
                  style={{
                    imageRendering: "high-quality",
                    transform: "translateZ(0)", // Force GPU acceleration
                  }}
                />

                {/* Placeholder that shows until image loads or if image fails */}
                {!imageLoaded && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bg="teal.50"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    color="teal.500"
                  >
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <Text mt={4} fontWeight="medium">
                      Healthcare Professional Consultation
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </MotionBox>
  );
};

export default HospitalDetailPage;
