import {
  Box,
  Image,
  VStack,
  Heading,
  Text,
  HStack,
  IconButton,
  Button,
  Badge,
  Flex,
  Divider,
  useColorModeValue,
  Tooltip,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaStar,
  FaHospital,
  FaMedal,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaCalendarCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const badgeBg = useColorModeValue("blue.50", "blue.900");

  const handleSelectDoctor = () => {
    navigate(`/book-appointment/select-time/${doctor._id}`);
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex direction={{ base: "column", md: "row" }}>
        <Box
          width={{ base: "100%", md: "30%" }}
          position="relative"
          bg="blue.50"
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            h="100%"
            position="relative"
            overflow="hidden"
          >
            <Image
              src={
                doctor?.doctorProfileImage ||
                "https://via.placeholder.com/300x400"
              }
              alt={doctor?.fullName}
              w="full"
              h={{ base: "250px", md: "100%" }}
              objectFit="cover"
              transition="transform 0.5s"
              _hover={{ transform: "scale(1.05)" }}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              height="80px"
              bgGradient="linear(to-b, rgba(0,0,0,0.5), transparent)"
            />
          </Flex>

          <HStack position="absolute" top="10px" left="10px" spacing={2}>
            <Badge
              colorScheme="blue"
              p="2"
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              boxShadow="sm"
            >
              {doctor?.specialization}
            </Badge>

            {doctor?.isVerified ? (
              <Badge
                colorScheme="green"
                p="2"
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
                boxShadow="sm"
              >
                Verified
              </Badge>
            ) : (
              <Badge
                colorScheme="yellow"
                p="2"
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
                boxShadow="sm"
              >
                Pending
              </Badge>
            )}
          </HStack>

          <HStack
            position="absolute"
            bottom="10px"
            left="10px"
            spacing={1}
            bg="rgba(0,0,0,0.6)"
            p="2"
            borderRadius="md"
          >
            {[...Array(5)].map((_, i) => (
              <Box
                as={FaStar}
                key={i}
                color={i < 4 ? "yellow.400" : "gray.300"}
                fontSize="sm"
              />
            ))}
            <Text color="white" fontSize="xs" fontWeight="bold">
              4.0
            </Text>
          </HStack>
        </Box>

        <Box flex="1" p={{ base: 4, md: 6 }}>
          <Flex direction="column" h="100%">
            <Flex justify="space-between" align="flex-start" mb={4}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="blue.600">
                  Dr. {doctor?.fullName}
                </Heading>
                <HStack>
                  <Box as={FaUserMd} color="blue.500" />
                  <Text color="gray.600" fontWeight="medium">
                    {doctor?.specialization} Specialist
                  </Text>
                </HStack>
              </VStack>

              <VStack align="end" spacing={1}>
                <Text fontWeight="bold" fontSize="xl" color="blue.600">
                  Rs. {doctor?.consultationFee}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Consultation Fee
                </Text>
              </VStack>
            </Flex>

            <Divider />

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} mt={4}>
              <Flex align="center">
                <Box as={FaHospital} color="blue.500" fontSize="lg" mr={3} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Hospital
                  </Text>
                  <Text fontWeight="medium">
                    {doctor?.hospital?.name || "Not specified"}
                  </Text>
                </VStack>
              </Flex>

              <Flex align="center">
                <Box as={FaMedal} color="blue.500" fontSize="lg" mr={3} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Experience
                  </Text>
                  <Text fontWeight="medium">
                    {doctor?.yearsOfExperience} years
                  </Text>
                </VStack>
              </Flex>

              <Flex align="center">
                <Box
                  as={FaMapMarkerAlt}
                  color="blue.500"
                  fontSize="lg"
                  mr={3}
                />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Location
                  </Text>
                  <Text fontWeight="medium">{doctor?.address || "Damak"}</Text>
                </VStack>
              </Flex>

              <Flex align="center">
                <Box as={FaPhone} color="blue.500" fontSize="lg" mr={3} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">
                    Contact
                  </Text>
                  <Text fontWeight="medium">{doctor?.phone}</Text>
                </VStack>
              </Flex>
            </SimpleGrid>

            <Accordion allowToggle mt={4}>
              <AccordionItem border="none">
                <AccordionButton
                  p={2}
                  _hover={{ bg: "blue.50" }}
                  borderRadius="md"
                >
                  <Box as={FaGraduationCap} color="blue.500" mr={2} />
                  <Text fontWeight="medium" flex="1" textAlign="left">
                    Qualifications & Education
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {doctor?.qualifications?.length > 0 ? (
                    <VStack align="stretch" spacing={2}>
                      {doctor.qualifications.map((qual, index) => (
                        <Box key={index} p={3} borderRadius="md" bg="blue.50">
                          <Text fontWeight="bold">{qual.degree}</Text>
                          <Flex justify="space-between" fontSize="sm">
                            <Text>{qual.university}</Text>
                            <Text>Graduated: {qual.graduationYear}</Text>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.500">
                      No qualification details available
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Flex
              mt="auto"
              pt={4}
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={2}
            >
              <HStack spacing={2}>
                <Tooltip label="Share on Facebook">
                  <IconButton
                    aria-label="Facebook"
                    icon={<FaFacebook />}
                    size="sm"
                    colorScheme="facebook"
                    variant="outline"
                    borderRadius="full"
                  />
                </Tooltip>
                <Tooltip label="Share on Twitter">
                  <IconButton
                    aria-label="Twitter"
                    icon={<FaTwitter />}
                    size="sm"
                    colorScheme="twitter"
                    variant="outline"
                    borderRadius="full"
                  />
                </Tooltip>
                <Tooltip label="Share on LinkedIn">
                  <IconButton
                    aria-label="LinkedIn"
                    icon={<FaLinkedin />}
                    size="sm"
                    colorScheme="linkedin"
                    variant="outline"
                    borderRadius="full"
                  />
                </Tooltip>
              </HStack>

              <Button
                colorScheme="blue"
                onClick={handleSelectDoctor}
                size="md"
                borderRadius="full"
                px={6}
                boxShadow="md"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                leftIcon={<FaCalendarCheck />}
              >
                Book Appointment
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default DoctorCard;
