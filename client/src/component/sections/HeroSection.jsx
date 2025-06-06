"use client";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, HeartPulse, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroSectionImage from "../../assets/image-removebg 1.png";

// Animated components using Framer Motion
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/book-appointment");
  };

  const handleLearnMore = () => {
    window.scrollBy({ top: 900, behavior: "smooth" });
  };

  // Responsive adjustments
  const headingSize = useBreakpointValue({
    base: "2xl",
    sm: "3xl",
    md: "4xl",
    lg: "5xl",
  });
  const subHeadingSize = useBreakpointValue({ base: "md", md: "lg", lg: "xl" });

  const imageSize = useBreakpointValue({
    base: "230px",
    sm: "260px",
    md: "300px",
    lg: "340px",
  });
  const borderSize = useBreakpointValue({
    base: "15px",
    sm: "20px",
    md: "30px",
    lg: "35px",
  });

  // Colors optimized for healthcare
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const primaryButtonBg = useColorModeValue("#00A9FF", "#38B2FF");
  const primaryButtonHoverBg = useColorModeValue("blue.600", "blue.500");
  const secondaryButtonColor = useColorModeValue("blue.600", "blue.300");
  const secondaryButtonBorderColor = useColorModeValue("blue.500", "blue.300");
  const secondaryButtonHoverBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const borderColor = useColorModeValue("#A0E9FF", "#A0E9FF");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      minH={{ base: "auto", md: "100vh" }}
      position="relative"
      overflow="hidden"
      py={{ base: 8, md: 0 }}
    >
      {/* Background elements */}
      <Box
        position="absolute"
        top="0"
        right="0"
        width="60%"
        height="100%"
        bgGradient="linear(to-br, blue.50, white)"
        opacity="0.7"
        transform="translateX(15%)"
        zIndex="0"
        display={{ base: "none", lg: "block" }}
      />

      <Box
        position="absolute"
        top="15%"
        left="5%"
        width="150px"
        height="150px"
        borderRadius="full"
        bg="blue.50"
        opacity="0.4"
        zIndex="0"
        display={{ base: "none", lg: "block" }}
      />

      <Box
        position="absolute"
        bottom="15%"
        right="10%"
        width="100px"
        height="100px"
        borderRadius="full"
        bg="teal.50"
        opacity="0.4"
        zIndex="0"
        display={{ base: "none", lg: "block" }}
      />

      {/* Hero Content */}
      <Container
        maxW="container.xl"
        h={{ base: "auto", md: "100vh" }}
        px={4}
        pt={{ base: 6, md: 0 }}
        pb={{ base: 10, md: 0 }}
      >
        <MotionFlex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 8 }}
          align="center"
          justify="space-between"
          h="100%"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Column - Text Content */}
          <MotionBox
            textAlign={{ base: "center", lg: "left" }}
            maxW={{ base: "full", lg: "560px" }}
            zIndex="1"
            variants={itemVariants}
          >
            <VStack spacing={5} align={{ base: "center", lg: "flex-start" }}>
              <HStack spacing={2}>
                <Icon as={HeartPulse} color={accentColor} w={6} h={6} />
                <Text
                  color={accentColor}
                  fontWeight="medium"
                  fontSize={subHeadingSize}
                >
                  Healthcare made simple
                </Text>
              </HStack>

              <Heading
                as="h1"
                fontSize={headingSize}
                fontWeight="bold"
                lineHeight="1.1"
                color={headingColor}
              >
                A Wealth of Experience To Heal And Help You.
              </Heading>

              <MotionText
                fontSize={subHeadingSize}
                color={textColor}
                lineHeight="tall"
                variants={itemVariants}
              >
                We are always fully focused on helping your child and you with
                professional medical care and services.
              </MotionText>

              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                justify={{ base: "center", lg: "flex-start" }}
                width={{ base: "full", sm: "auto" }}
                pt={3}
              >
                <Button
                  bg={primaryButtonBg}
                  color="white"
                  px={8}
                  py={6}
                  size="lg"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                  _hover={{
                    bg: primaryButtonHoverBg,
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                  boxShadow="md"
                  borderRadius="md"
                  onClick={handleLearnMore}
                  leftIcon={<Icon as={Shield} />}
                >
                  Learn More
                </Button>

                <Button
                  bg="white"
                  color={secondaryButtonColor}
                  px={8}
                  py={6}
                  size="lg"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                  border="1px solid"
                  borderColor={secondaryButtonBorderColor}
                  _hover={{
                    bg: secondaryButtonHoverBg,
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                  borderRadius="md"
                  onClick={handleNavigate}
                  leftIcon={<Icon as={CalendarIcon} />}
                >
                  Book Appointment
                </Button>
              </Stack>
            </VStack>
          </MotionBox>

          {/* Right Column - Circle Design */}
          <MotionBox
            display="flex"
            justifyContent={{ base: "center", lg: "flex-end" }}
            zIndex="1"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              position="relative"
              transform={{ lg: "translateY(20px)" }}
              className="hero-image-container"
            >
              <Box
                width={imageSize}
                height={imageSize}
                borderRadius="full"
                border={`${borderSize} solid ${borderColor}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  width: "15px",
                  height: "15px",
                  borderRadius: "full",
                  bg: "blue.500",
                  top: "15%",
                  right: "5%",
                }}
                _after={{
                  content: '""',
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  borderRadius: "full",
                  bg: "teal.400",
                  bottom: "10%",
                  left: "10%",
                }}
              >
                <img
                  src={HeroSectionImage}
                  alt="Healthcare Professional"
                  style={{
                    width: `calc(${imageSize} - ${borderSize} * 2)`,
                    height: `calc(${imageSize} - ${borderSize} * 2)`,
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Floating appointment card */}
              <MotionBox
                position="absolute"
                bottom="-10px"
                right={{ base: "-10px", md: "-30px" }}
                bg="white"
                p={3}
                borderRadius="xl"
                boxShadow="lg"
                maxW="180px"
                border="1px solid"
                borderColor="gray.100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                display={{ base: "none", md: "block" }}
              >
                <HStack spacing={2}>
                  <Icon as={Clock} color="green.500" />
                  <Text fontWeight="medium" fontSize="sm">
                    Quick Appointments
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Book online and get confirmed in minutes
                </Text>
              </MotionBox>
            </Box>
          </MotionBox>
        </MotionFlex>
      </Container>
    </Box>
  );
};

export default HeroSection;
