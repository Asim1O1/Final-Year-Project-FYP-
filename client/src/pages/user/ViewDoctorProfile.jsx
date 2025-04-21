import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { fetchSingleDoctor } from "../../features/doctor/doctorSlice";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Box,
  Avatar,
  useColorModeValue,
  Container,
  Divider,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tag,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  PhoneIcon,
  StarIcon,
  EmailIcon,
  CalendarIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  FaMapMarkerAlt,
  FaAward,

  FaHospital,
  FaClock,
  FaUserMd,
  FaGraduationCap,
} from "react-icons/fa";

export default function ViewDoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const doctor = useSelector((state) => state?.doctorSlice?.doctor);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(true);

  const handleSelectDoctor = () => {
    navigate(`/book-appointment/select-time/${doctor._id}`);
  };
  // Enhanced color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightBg = useColorModeValue("blue.50", "blue.900");
  const avatarBorderColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const loadDoctorInfo = async () => {
      setIsLoadingDoctor(true);
      try {
        await dispatch(fetchSingleDoctor(doctorId)).unwrap();
      } catch (error) {
        notification.error({
          title: "Error Loading Doctor Information",
          description: error.message || "Could not fetch doctor details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingDoctor(false);
      }
    };

    loadDoctorInfo();
  }, [dispatch, doctorId]);

  if (isLoadingDoctor) {
    return (
      <Container maxW="6xl" py={8}>
        <Flex direction={{ base: "column", md: "row" }} gap={8} mb={10}>
          <Box
            w={{ base: "full", md: "30%" }}
            display="flex"
            justifyContent="center"
          >
            <SkeletonCircle size="200px" />
          </Box>
          <Box flex={1}>
            <Skeleton height="40px" mb={4} width="70%" />
            <Skeleton height="24px" mb={4} width="50%" />
            <SkeletonText mt={4} noOfLines={3} spacing={4} />
            <Flex mt={6} gap={4}>
              <Skeleton height="24px" width="100px" />
              <Skeleton height="24px" width="100px" />
            </Flex>
          </Box>
        </Flex>
        <Skeleton height="200px" mb={8} borderRadius="lg" />
      </Container>
    );
  }

  return (
    <Container maxW="6xl" px={{ base: 4, md: 6 }} py={8}>
      {/* Profile Header Card */}
      <Card
        direction={{ base: "column", md: "row" }}
        overflow="hidden"
        variant="outline"
        mb={8}
        bg={cardBg}
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="lg"
      >
        {/* Avatar Section with Gradient Background */}
        <Box
          w={{ base: "full", md: "300px" }}
          bg="linear-gradient(135deg, #4299E1 0%, #3182CE 100%)"
          p={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Avatar
            src={doctor.doctorProfileImage || "/placeholder.svg"}
            name={doctor.fullName}
            size="2xl"
            borderRadius="full"
            borderWidth={4}
            borderColor={avatarBorderColor}
            boxShadow="lg"
            mb={4}
          />

          <Tag
            size="lg"
            colorScheme="blue"
            borderRadius="full"
            fontWeight="bold"
            variant="solid"
            px={4}
            py={2}
            mb={2}
          >
            {doctor.specialization}
          </Tag>

          <Flex align="center" justify="center" mt={2}>
            <StarIcon color="yellow.400" mr={1} />
            <Text color="white" fontWeight="bold">
              {doctor.rating || "New Doctor"}
            </Text>
          </Flex>

          <Text color="white" fontSize="sm" mt={1} textAlign="center">
            {doctor.yearsOfExperience} years experience
          </Text>
        </Box>

        {/* Details Section */}
        <Box flex={1} p={6}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "flex-start", lg: "center" }}
            mb={4}
          >
            <Box>
              <Heading as="h1" size="xl" mb={1} color={textColor}>
                Dr. {doctor.fullName}
              </Heading>
              <Text fontSize="lg" color={subtleTextColor} fontWeight="medium">
                {doctor.specialization} Specialist
              </Text>
              <Text fontSize="md" color={subtleTextColor} mt={1}>
                {doctor.hospital?.name}
              </Text>
            </Box>

            <Button
              colorScheme="blue"
              onClick={handleSelectDoctor}
              size="lg"
              mt={{ base: 4, lg: 0 }}
              boxShadow="md"
              rightIcon={<CalendarIcon />}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              Book Appointment
            </Button>
          </Flex>

          <Divider my={4} borderColor={borderColor} />

          {/* Qualification Badges */}
          <Flex wrap="wrap" gap={2} mb={4}>
            {doctor.qualifications &&
              doctor.qualifications.map((qual, index) => (
                <Badge
                  key={index}
                  variant="subtle"
                  colorScheme="green"
                  px={3}
                  py={1}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FaGraduationCap} mr={1} />
                  {qual.degree}
                </Badge>
              ))}
            {doctor.isVerified && (
              <Badge
                variant="subtle"
                colorScheme="teal"
                px={3}
                py={1}
                borderRadius="full"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaAward} mr={1} />
                Verified
              </Badge>
            )}
          </Flex>

          {/* Contact Information Grid */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
            mt={4}
          >
            <HStack spacing={3} p={2} borderRadius="md" bg={highlightBg}>
              <Icon as={PhoneIcon} color={accentColor} boxSize={4} />
              <Text fontWeight="medium">{doctor.phone}</Text>
            </HStack>

            <HStack spacing={3} p={2} borderRadius="md" bg={highlightBg}>
              <Icon as={EmailIcon} color={accentColor} boxSize={4} />
              <Text fontWeight="medium">{doctor.email}</Text>
            </HStack>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <HStack spacing={3} p={2} borderRadius="md" bg={highlightBg}>
                <Icon as={FaMapMarkerAlt} color={accentColor} boxSize={4} />
                <Text fontWeight="medium">{doctor.address}</Text>
              </HStack>
            </GridItem>

            <HStack spacing={3} p={2} borderRadius="md" bg={highlightBg}>
              <Icon as={FaHospital} color={accentColor} boxSize={4} />
              <Text fontWeight="medium">{doctor.hospital?.name}</Text>
            </HStack>

            <HStack spacing={3} p={2} borderRadius="md" bg={highlightBg}>
              <Icon as={FaClock} color={accentColor} boxSize={4} />
              <Text fontWeight="medium">
                Consults for Rs {doctor.consultationFee}
              </Text>
            </HStack>
          </Grid>
        </Box>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs variant="soft-rounded" colorScheme="blue" mb={8}>
        <TabList mb={4} overflowX="auto" css={{ scrollbarWidth: "none" }}>
          <Tab _selected={{ bg: highlightBg, color: accentColor }}>About</Tab>
          <Tab _selected={{ bg: highlightBg, color: accentColor }}>
            Education
          </Tab>
          <Tab _selected={{ bg: highlightBg, color: accentColor }}>
            Experience
          </Tab>
         
        </TabList>

        <TabPanels>
          {/* About Panel */}
          <TabPanel>
            <Card
              bg={cardBg}
              borderRadius="lg"
              p={6}
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex mb={4} align="center">
                <Icon as={FaUserMd} boxSize={6} color={accentColor} mr={2} />
                <Heading as="h2" size="md" color={textColor}>
                  About Dr. {doctor.fullName}
                </Heading>
              </Flex>

              <Text fontSize="md" color={textColor} lineHeight="tall">
                Dr. {doctor.fullName} is a dedicated {doctor.specialization}{" "}
                specialist with {doctor.yearsOfExperience} years of experience
                in the field. Currently practicing at {doctor.hospital?.name} in{" "}
                {doctor.hospital?.location}, Dr. {doctor.fullName} is committed
                to providing exceptional healthcare to patients.{" "}
                {doctor.gender === "male" ? "He" : "She"} graduated from{" "}
                {doctor.qualifications?.[0]?.university} with a degree in{" "}
                {doctor.qualifications?.[0]?.degree}. With a consultation fee of
                ${doctor.consultationFee}, Dr. {doctor.fullName} offers expert
                medical services and personalized care.
                {doctor.isVerified
                  ? " Dr. " +
                    doctor.fullName +
                    " is a verified medical professional in our network."
                  : ""}
              </Text>
            </Card>
          </TabPanel>

          {/* Education Panel */}
          <TabPanel>
            <Card
              bg={cardBg}
              borderRadius="lg"
              p={6}
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex mb={4} align="center">
                <Icon
                  as={FaGraduationCap}
                  boxSize={6}
                  color={accentColor}
                  mr={2}
                />
                <Heading as="h2" size="md" color={textColor}>
                  Education & Qualifications
                </Heading>
              </Flex>

              <VStack align="stretch" spacing={4}>
                {doctor.qualifications ? (
                  doctor.qualifications.map((qual, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Flex justify="space-between" mb={1}>
                        <Text fontWeight="bold" color={textColor}>
                          {qual.degree}
                        </Text>
                        <Badge colorScheme="blue">
                          {qual.year || "Completed"}
                        </Badge>
                      </Flex>
                      <Text color={subtleTextColor}>{qual.university}</Text>
                    </Box>
                  ))
                ) : (
                  <Text color={subtleTextColor}>
                    Education details not available
                  </Text>
                )}
              </VStack>
            </Card>
          </TabPanel>

          {/* Experience Panel */}
          <TabPanel>
            <Card
              bg={cardBg}
              borderRadius="lg"
              p={6}
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex mb={4} align="center">
                <Icon as={FaAward} boxSize={6} color={accentColor} mr={2} />
                <Heading as="h2" size="md" color={textColor}>
                  Professional Experience
                </Heading>
              </Flex>

              <Box p={4} borderRadius="md" bg={highlightBg}>
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  {doctor.yearsOfExperience} Years of Experience
                </Text>
                <Text color={subtleTextColor}>
                  Currently practicing at {doctor.hospital?.name} as a{" "}
                  {doctor.specialization} specialist.
                </Text>
              </Box>
            </Card>
          </TabPanel>

     
        </TabPanels>
      </Tabs>

      {/* Call to Action */}
      <Card
        bg="linear-gradient(135deg, #3182CE 0%, #2C5282 100%)"
        color="white"
        borderRadius="xl"
        p={6}
        boxShadow="xl"
        mb={8}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          <VStack
            align={{ base: "center", md: "flex-start" }}
            spacing={1}
            mb={{ base: 4, md: 0 }}
          >
            <Heading size="md" fontWeight="bold">
              Ready to schedule an appointment?
            </Heading>
            <Text fontSize="md">Book online or call {doctor.phone}</Text>
          </VStack>

          <Button
            colorScheme="whiteAlpha"
            onClick={handleSelectDoctor}
            size="lg"
            rightIcon={<CalendarIcon />}
            _hover={{
              bg: "white",
              color: "blue.600",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            fontWeight="bold"
          >
            Book Appointment
          </Button>
        </Flex>
      </Card>

      {/* Additional Information */}
      <Card
        bg={cardBg}
        borderRadius="lg"
        p={6}
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Flex align="center" mb={4}>
          <Icon as={InfoIcon} color={accentColor} mr={2} />
          <Text fontWeight="bold" color={textColor}>
            Important Information
          </Text>
        </Flex>

        <Text fontSize="sm" color={subtleTextColor}>
          Please arrive 15 minutes before your scheduled appointment time. Bring
          your insurance card and any relevant medical records. If you need to
          cancel, please provide at least 24 hours notice.
        </Text>
      </Card>
    </Container>
  );
}
