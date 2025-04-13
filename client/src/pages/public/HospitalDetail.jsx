import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  Icon,
  Divider,
  Skeleton,
  Alert,
  AlertIcon,
  useColorModeValue,
  Image,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  GridItem,
  useDisclosure,
  Avatar,
  Tag,
  TagLabel,
  TagLeftIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  Link,
  chakra,
} from "@chakra-ui/react";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdLocalHospital,
  MdMedicalServices,
  MdOutlineHealthAndSafety,
  MdDirections,
  MdOutlineVerified,
  MdNotifications,
  MdInfo,
} from "react-icons/md";
import {
  FaHospital,
  FaAmbulance,
  FaStethoscope,
  FaUserMd,
  FaRegClock,
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaRegStar,
  FaRegHospital,
} from "react-icons/fa";

import { fetchSingleHospital } from "../../features/hospital/hospitalSlice";

const HospitalDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hospital = useSelector(
    (state) => state.hospitalSlice?.hospital?.hospital
  );
  console.log("The hospital is", hospital);
  const doctors = useSelector(
    (state) => state?.hospitalSlice?.hospital?.doctors
  );
  const medicalTests = useSelector(
    (state) => state?.hospitalSlice?.hospital?.medicalTests
  );
  console.log("The doctors are", doctors);

  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const subtleColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchSingleHospital(id)).unwrap();
        setLoading(false);
      } catch (err) {
        console.log("the error is", err);
        setError("Failed to fetch hospital details");
        setLoading(false);
      }
    };

    fetchHospital();
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Container maxW="7xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Skeleton height="400px" borderRadius="xl" />
            <Skeleton height="100px" />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <GridItem colSpan={2}>
                <Skeleton height="300px" borderRadius="lg" />
              </GridItem>
              <GridItem colSpan={1}>
                <Skeleton height="300px" borderRadius="lg" />
              </GridItem>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Skeleton height="200px" borderRadius="lg" />
              <Skeleton height="200px" borderRadius="lg" />
              <Skeleton height="200px" borderRadius="lg" />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || !hospital) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Container maxW="7xl" py={12}>
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="xl"
            py={8}
            bg="red.50"
            borderColor="red.200"
            borderWidth="1px"
          >
            <AlertIcon boxSize="40px" mr={0} color="red.500" />
            <Heading mt={4} mb={2} size="lg">
              Hospital Information Unavailable
            </Heading>
            <Text maxW="lg" color="gray.600">
              {error ||
                "We couldn't find the hospital you're looking for. Please try again later or contact support."}
            </Text>
            <Button
              mt={6}
              colorScheme="blue"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  const defaultImage =
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  const hospitalImage = hospital.hospitalImage || defaultImage;

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero Section with Hospital Image */}
      <Box
        position="relative"
        h={{ base: "300px", md: "400px", lg: "500px" }}
        overflow="hidden"
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
          filter="brightness(0.7)"
          transform="scale(1.05)"
          transition="transform 0.3s ease"
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
            <HStack mb={3}>
              <Badge
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wider"
                fontWeight="bold"
              >
                Verified Hospital
              </Badge>
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
                  24/7 Emergency
                </Badge>
              )}
            </HStack>

            <Heading
              size={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
              mb={3}
            >
              {hospital.name}
            </Heading>

            <HStack spacing={6} flexWrap="wrap">
              <HStack>
                <Icon as={MdLocationOn} boxSize={5} />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                  {hospital.location}
                </Text>
              </HStack>

              <HStack>
                <Icon as={FaRegClock} boxSize={4} />
                <Text fontSize={{ base: "md", md: "lg" }}>Open 24 Hours</Text>
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Box>

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
            <HStack spacing={6}>
              <Button
                leftIcon={<FaPhoneAlt />}
                colorScheme="blue"
                variant="ghost"
                size="sm"
                as={Link}
                href={`tel:${hospital.contactNumber}`}
              >
                Call
              </Button>
              <Button
                leftIcon={<FaMapMarkedAlt />}
                colorScheme="blue"
                variant="ghost"
                size="sm"
                as={Link}
                href={`https://maps.google.com/?q=${hospital.location}`}
                isExternal
              >
                Directions
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Tabs variant="soft-rounded" colorScheme="blue" size="md" isLazy>
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
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                {/* Main Info Section */}
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                  <VStack spacing={8} align="stretch">
                    {/* About Section */}
                    <Box
                      bg={cardBgColor}
                      p={{ base: 5, md: 8 }}
                      borderRadius="xl"
                      boxShadow="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ boxShadow: "lg" }}
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
                          About
                        </Heading>
                      </Flex>

                      <Text color={textColor} fontSize="lg" lineHeight="tall">
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
                              Accreditations
                            </Text>
                          </Flex>
                          <Text>
                            Joint Commission International (JCI), National
                            Accreditation Board for Hospitals & Healthcare
                            Providers (NABH)
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
                          </Flex>
                          <Text>
                            24/7 Emergency care with advanced life support
                            ambulances and trauma care specialists
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Specialties Section */}
                    <Box
                      bg={cardBgColor}
                      p={{ base: 5, md: 8 }}
                      borderRadius="xl"
                      boxShadow="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ boxShadow: "lg" }}
                    >
                      <Flex mb={6} align="center">
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
                          Specialties
                        </Heading>
                      </Flex>

                      <SimpleGrid
                        columns={{ base: 2, md: 3, lg: 4 }}
                        spacing={4}
                      >
                        {hospital.specialties &&
                          hospital.specialties.map((specialty, index) => (
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
                    </Box>
                    {/* MedicalTests Section */}
                    <Box
                      bg={cardBgColor}
                      p={{ base: 5, md: 8 }}
                      borderRadius="xl"
                      boxShadow="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ boxShadow: "lg" }}
                    >
                      <Flex mb={6} align="center">
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
                          Medicaltests
                        </Heading>
                      </Flex>

                      <SimpleGrid
                        columns={{ base: 2, md: 3, lg: 4 }}
                        spacing={4}
                      >
                        {medicalTests &&
                          medicalTests.map((test, index) => (
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
                              }}
                            >
                              <Icon
                                as={FaStethoscope}
                                color={accentColor}
                                boxSize={5}
                                mr={3}
                              />
                              <Text fontWeight="medium">{test?.testName}</Text>
                            </Flex>
                          ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </GridItem>

                {/* Sidebar */}
                <GridItem colSpan={1}>
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
                      boxShadow="md"
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
                          <HStack width="full">
                            <Icon
                              as={MdLocationOn}
                              color={accentColor}
                              boxSize={5}
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

                          <HStack width="full">
                            <Icon
                              as={MdPhone}
                              color={accentColor}
                              boxSize={5}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Phone
                              </Text>
                              <Text>{hospital.contactNumber}</Text>
                            </Box>
                          </HStack>

                          <HStack width="full">
                            <Icon
                              as={MdEmail}
                              color={accentColor}
                              boxSize={5}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Email
                              </Text>
                              <Text>{hospital.email}</Text>
                            </Box>
                          </HStack>

                          <HStack width="full">
                            <Icon
                              as={MdAccessTime}
                              color={accentColor}
                              boxSize={5}
                            />
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                Working Hours
                              </Text>
                              <Text>Open 24/7</Text>
                            </Box>
                          </HStack>
                        </VStack>
                      </VStack>
                    </Box>
                    {/* Hospital Stats */}
                    <Box
                      bg={cardBgColor}
                      p={6}
                      borderRadius="xl"
                      boxShadow="md"
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
                            {hospital.medicalTests?.length || 0}
                          </StatNumber>
                        </Stat>

                        <Stat
                          bg={subtleColor}
                          p={4}
                          borderRadius="lg"
                          textAlign="center"
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
                      boxShadow="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="md" mb={5} color={accentColor}>
                        Featured Doctors
                      </Heading>

                      {doctors.length === 0 ? (
                        <Text color="gray.500" fontStyle="italic">
                          No doctors available for this hospital.
                        </Text>
                      ) : (
                        <VStack spacing={4} align="stretch">
                          {doctors.map((doctor, index) => (
                            <HStack key={index} spacing={3}>
                              <Avatar
                                size="md"
                                src={doctor.doctorProfileImage}
                              />
                              <Box>
                                <Text fontWeight="bold">{doctor.fullName}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {doctor.specialty}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {doctor.gender}
                                </Text>
                              </Box>
                            </HStack>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  </VStack>
                </GridItem>
              </SimpleGrid>
            </TabPanel>

            {/* Doctors Tab */}
            <TabPanel px={0}>
              <Box
                bg={cardBgColor}
                p={{ base: 5, md: 8 }}
                borderRadius="xl"
                boxShadow="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Heading size="lg" mb={6} color={accentColor}>
                  Our Medical Team
                </Heading>

                {doctors.length === 0 ? (
                  <Text fontStyle="italic" color="gray.500">
                    No doctors available at this hospital currently.
                  </Text>
                ) : (
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                    spacing={6}
                  >
                    {doctors.map((doctor, index) => (
                      <Box
                        key={doctor._id || index}
                        bg={subtleColor}
                        borderRadius="xl"
                        overflow="hidden"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
                      >
                        <Image
                          src={doctor.doctorProfileImage || "/placeholder.svg"}
                          alt={doctor.fullName}
                          w="full"
                          h="200px"
                          objectFit="cover"
                        />
                        <Box p={5}>
                          <Text fontWeight="bold" fontSize="lg">
                            Dr. {doctor.fullName}
                          </Text>
                          <HStack mt={1}>
                            <Icon as={FaUserMd} color={accentColor} />
                            <Text color="gray.600">
                              {doctor.specialization}
                            </Text>
                          </HStack>
                          <Button
                            mt={4}
                            colorScheme="blue"
                            size="sm"
                            width="full"
                            variant="outline"
                            onClick={() => navigate(`/doctors/${doctor._id}`)}
                          >
                            View Profile
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default HospitalDetailPage;
