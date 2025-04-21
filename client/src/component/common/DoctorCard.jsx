import { useState } from "react";

import {
  FaHospital,
  FaMedal,
  FaMapMarkerAlt,
  FaUserMd,
  FaGraduationCap,
  FaCalendarCheck,
  FaStethoscope,
} from "react-icons/fa";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Color theme based on blue
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subtleText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("#00A9FF", "#38B2FF");
  const cardBg = useColorModeValue("white", "gray.900");
  const highlightColor = useColorModeValue(
    "blue.50",
    "rgba(0, 169, 255, 0.15)"
  );
  const badgeBg = useColorModeValue("#00A9FF", "#38B2FF");

  const handleSelectDoctor = () => {
    navigate(`/book-appointment/select-time/${doctor._id}`);
  };
  const handleViewDoctorProfile = () => {
    navigate(`/doctor-profile/${doctor._id}`);
  };

  const doctorProfileImage =
    doctor?.doctorProfileImage || "/placeholder.svg?height=400&width=300";
  const doctorFullName = doctor?.fullName || "Name Unknown";
  const doctorConsultationFee = doctor?.consultationFee || "N/A";
  const doctorHospitalName = doctor?.hospital?.name || "Not specified";
  const doctorYearsOfExperience = doctor?.yearsOfExperience || "5+";
  const doctorAddress = doctor?.address || "Damak";
  const doctorQualifications = doctor?.qualifications || [];
  const doctorSpecialization = doctor?.specialization || "General";

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      boxShadow={isHovered ? "md" : "sm"}
      transition="all 0.2s ease"
      borderWidth="1px"
      borderColor={isHovered ? accentColor : borderColor}
      position="relative"
      maxW="600px"
      minH="300px"
      w="100%"
      mb={4}
      mx="auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex direction={{ base: "column", sm: "row" }} h="full">
        {/* Doctor Image Section - Taller */}
        <Box
          width={{ base: "100%", sm: "110px", md: "130px" }}
          height={{ base: "180px", sm: "auto" }}
          position="relative"
          overflow="hidden"
          bg={`linear-gradient(to bottom, ${useColorModeValue(
            "blue.50",
            "blue.900"
          )}, ${useColorModeValue("cyan.50", "cyan.900")})`}
        >
          {doctor?.doctorProfileImage ? (
            <Box position="relative" h="full">
              <Image
                src={doctorProfileImage}
                alt={`Dr. ${doctorFullName}`}
                w="full"
                h="full"
                objectFit="cover"
                objectPosition="center"
                transition="transform 0.3s ease"
                _groupHover={{ transform: "scale(1.05)" }}
              />
              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)"
              />
            </Box>
          ) : (
            <Flex
              justify="center"
              align="center"
              h="full"
              bg={`linear-gradient(135deg, ${useColorModeValue(
                "blue.50",
                "blue.900"
              )}, ${useColorModeValue("cyan.50", "cyan.900")})`}
              p={3}
            >
              <Avatar
                size="lg"
                name={doctorFullName}
                src={undefined}
                bg={accentColor}
                color="white"
                icon={<FaUserMd fontSize="1.2rem" />}
                border="2px solid"
                borderColor="white"
              />
            </Flex>
          )}

          {/* Specialization Badge */}
          <Box
            position="absolute"
            bottom={2}
            left={0}
            right={0}
            zIndex={1}
            px={2}
          >
            <Badge
              bg={badgeBg}
              color="white"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="2xs"
              fontWeight="semibold"
              boxShadow="0 1px 3px rgba(0,0,0,0.2)"
            >
              <Flex align="center" gap={1}>
                <Icon as={FaStethoscope} boxSize={2} />
                <Text fontSize="xs">{doctorSpecialization}</Text>
              </Flex>
            </Badge>
          </Box>
        </Box>

        <Box
          flex={1}
          p={{ base: 3, md: 4 }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Flex
              justify="space-between"
              align={{ base: "flex-start", sm: "center" }}
              mb={3}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 2, sm: 0 }}
            >
              {/* Doctor name */}
              <Heading
                as="h3"
                fontSize={{ base: "md", md: "lg" }}
                color={textColor}
                fontWeight="bold"
                transition="color 0.2s"
                _groupHover={{ color: accentColor }}
              >
                Dr. {doctorFullName}
              </Heading>

              {/* Consultation Fee */}
              <Box
                bg={highlightColor}
                px={2}
                py={1}
                borderRadius="md"
                textAlign="center"
                borderLeft="2px solid"
                borderColor={accentColor}
              >
                <Text fontWeight="bold" fontSize="sm" color={accentColor}>
                  Rs. {doctorConsultationFee}
                </Text>
                <Text fontSize="2xs" color={subtleText}>
                  Consultation Fee
                </Text>
              </Box>
            </Flex>

            <Divider mb={3} borderColor={borderColor} />

            {/* Key Details - Vertical layout for more height */}
            <VStack align="stretch" mb={4} spacing={2.5}>
              <Flex align="center" gap={2}>
                <Flex
                  align="center"
                  justify="center"
                  bg={highlightColor}
                  p={1.5}
                  borderRadius="md"
                  w="24px"
                  h="24px"
                >
                  <Icon as={FaHospital} color={accentColor} boxSize={3} />
                </Flex>
                <Box>
                  <Text fontSize="xs" color={subtleText}>
                    Hospital
                  </Text>
                  <Text fontSize="sm">{doctorHospitalName}</Text>
                </Box>
              </Flex>

              <Flex align="center" gap={2}>
                <Flex
                  align="center"
                  justify="center"
                  bg={highlightColor}
                  p={1.5}
                  borderRadius="md"
                  w="24px"
                  h="24px"
                >
                  <Icon as={FaMedal} color={accentColor} boxSize={3} />
                </Flex>
                <Box>
                  <Text fontSize="xs" color={subtleText}>
                    Experience
                  </Text>
                  <Text fontSize="sm">{doctorYearsOfExperience} years</Text>
                </Box>
              </Flex>

              <Flex align="center" gap={2}>
                <Flex
                  align="center"
                  justify="center"
                  bg={highlightColor}
                  p={1.5}
                  borderRadius="md"
                  w="24px"
                  h="24px"
                >
                  <Icon as={FaMapMarkerAlt} color={accentColor} boxSize={3} />
                </Flex>
                <Box>
                  <Text fontSize="xs" color={subtleText}>
                    Location
                  </Text>
                  <Text fontSize="sm">{doctorAddress}</Text>
                </Box>
              </Flex>
            </VStack>

            {/* Education Accordion */}
            <Accordion allowToggle mb={4}>
              <AccordionItem border="none">
                <AccordionButton
                  px={2}
                  py={1.5}
                  _hover={{ bg: subtleBg }}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderColor}
                  fontSize="sm"
                >
                  <Icon
                    as={FaGraduationCap}
                    color={accentColor}
                    boxSize={3}
                    mr={2}
                  />
                  <Text
                    fontSize="xs"
                    fontWeight="medium"
                    flex="1"
                    textAlign="left"
                  >
                    Education & Qualifications
                  </Text>
                  <AccordionIcon boxSize={4} />
                </AccordionButton>
                <AccordionPanel pb={2} pt={2} px={2}>
                  {doctorQualifications?.length > 0 ? (
                    <VStack align="stretch" spacing={2}>
                      {doctorQualifications.map((qual, index) => (
                        <Box
                          key={index}
                          p={2}
                          borderRadius="md"
                          bg={subtleBg}
                          borderLeft="2px solid"
                          borderColor={accentColor}
                        >
                          <Text fontSize="xs" fontWeight="bold">
                            {qual.degree}
                          </Text>
                          <Flex
                            justify="space-between"
                            fontSize="2xs"
                            mt={0.5}
                            color={subtleText}
                          >
                            <Text>{qual.university}</Text>
                            <Text>Graduated: {qual.graduationYear}</Text>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="xs" color={subtleText} p={1}>
                      No qualification details available
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          {/* Action Buttons - At the bottom of the flex container */}
          <Flex gap={2} mt="auto">
            <Button
              bg={accentColor}
              color="white"
              onClick={handleSelectDoctor}
              size="sm"
              borderRadius="md"
              leftIcon={<FaCalendarCheck size="12px" />}
              flex={1}
              _hover={{
                bg: useColorModeValue("blue.600", "blue.400"),
              }}
              transition="all 0.2s"
              fontSize="xs"
              py={2}
            >
              Book Appointment
            </Button>

            <Button
            onClick={handleViewDoctorProfile}
              variant="outline"
              borderColor={accentColor}
              color={accentColor}
              size="sm"
              borderRadius="md"
              _hover={{
                bg: highlightColor,
              }}
              transition="all 0.2s"
              fontSize="xs"
              py={2}
            >
              View Profile
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default DoctorCard;
