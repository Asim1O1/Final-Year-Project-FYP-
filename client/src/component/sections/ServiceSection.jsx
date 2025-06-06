import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  Hospital,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceSection = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Enhanced service data with more professional healthcare details
  const services = [
    {
      icon: <Hospital size={32} />,
      title: "Hospitals",
      description:
        "Access to our extensive network of state-of-the-art healthcare facilities and specialized medical centers.",
      color: "blue.500",
      bgColor: "blue.50",
      features: [
        "24/7 Emergency Care",
        "Specialized Departments",
        "Modern Equipment",
      ],
      link: "/hospitals",
    },
    {
      icon: <Microscope size={32} />,
      title: "Medical Tests",
      description:
        "Comprehensive diagnostic services with cutting-edge laboratory equipment and quick result delivery.",
      color: "purple.500",
      bgColor: "purple.50",
      features: ["Quick Results", "Home Collection", "Digital Reports"],
      link: "/medicalTests",
    },
    {
      icon: <Stethoscope size={32} />,
      title: "Doctor Appointment",
      description:
        "Seamless scheduling with specialists and physicians across all medical fields with 24/7 online booking.",
      color: "teal.500",
      bgColor: "teal.50",
      features: ["Chat with Doctors", "Specialist Referrals", "Follow-up Care"],
      link: "/book-appointment",
    },
    {
      icon: <Heart size={32} />,
      title: "Health Campaigns",
      description:
        "Join community health initiatives to promote wellness, education, and preventive healthcare services.",
      color: "red.500",
      bgColor: "red.50",
      features: ["Preventive Care", "Health Education", "Community Support"],
      link: "/campaigns",
    },
  ];

  // Enhanced Chakra UI color tokens for healthcare theme
  const headingColor = useColorModeValue("gray.800", "white");
  const subHeadingColor = useColorModeValue("gray.600", "gray.400");
  const bgGradient = useColorModeValue(
    "linear(to-b, blue.50, white)",
    "linear(to-b, gray.800, gray.900)"
  );
  const dividerColor = useColorModeValue("blue.400", "blue.500");
  const ctaBg = useColorModeValue("white", "gray.800");

  return (
    <Box py={{ base: 16, md: 24 }} bgGradient={bgGradient} position="relative">
      {/* Decorative elements - more subtle for healthcare */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        height="300px"
        width="300px"
        bg="blue.400"
        opacity="0.03"
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        height="200px"
        width="200px"
        bg="teal.400"
        opacity="0.03"
        borderRadius="full"
        filter="blur(40px)"
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={{ base: 12, md: 16 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ width: "100%" }}
          >
            <Box textAlign="center" maxW="800px" mx="auto">
              <Flex
                justify="center"
                mb={5}
                bg={useColorModeValue("blue.50", "blue.900")}
                w="16"
                h="16"
                borderRadius="full"
                align="center"
                mx="auto"
              >
                <Icon
                  as={Activity}
                  w={8}
                  h={8}
                  color={useColorModeValue("blue.500", "blue.300")}
                />
              </Flex>
              <Heading
                mb={4}
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                color={headingColor}
                letterSpacing="tight"
                lineHeight="shorter"
              >
                Our Healthcare{" "}
                <Text
                  as="span"
                  bgGradient="linear(to-r, blue.400, teal.400)"
                  bgClip="text"
                >
                  Services
                </Text>
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={subHeadingColor}
                maxW="650px"
                mx="auto"
                lineHeight="tall"
              >
                We are dedicated to providing comprehensive healthcare solutions
                tailored to your needs with a focus on quality, accessibility,
                and compassionate care.
              </Text>
              <Box position="relative" mt={8} mb={2}>
                <Divider
                  width="120px"
                  borderColor={dividerColor}
                  borderWidth="3px"
                  opacity="1"
                  mx="auto"
                  borderRadius="full"
                />
              </Box>
            </Box>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ width: "100%" }}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={{ base: 8, md: 6, lg: 8 }}
              width="full"
            >
              {services.map((service, index) => (
                <ServiceCardEnhanced
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  color={service.color}
                  bgColor={service.bgColor}
                  features={service.features}
                  link={service.link}
                  badge={service.badge}
                  index={index}
                />
              ))}
            </SimpleGrid>
          </motion.div>

          {/* Healthcare CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ width: "100%" }}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              bg={ctaBg}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="md"
              border="1px"
              borderColor={useColorModeValue("gray.100", "gray.700")}
              mt={8}
            >
              <Box
                bg={useColorModeValue("blue.50", "blue.900")}
                p={{ base: 6, md: 8 }}
                flex="1"
              >
                <Flex align="center" mb={4}>
                  <Icon as={Clock} color="blue.500" mr={2} />
                  <Text fontWeight="medium" color="blue.700">
                    Quick Response Times
                  </Text>
                </Flex>

                <Heading as="h3" size="lg" mb={4} color={headingColor}>
                  Need Immediate Medical Assistance?
                </Heading>

                <Text color={subHeadingColor} mb={6}>
                  Our healthcare professionals are available 24/7 for emergency
                  consultations and quick assistance.
                </Text>
              </Box>

              <Box
                bg={useColorModeValue("white", "gray.800")}
                p={{ base: 6, md: 8 }}
                flex="1"
                borderLeft="1px"
                borderLeftColor={useColorModeValue("gray.100", "gray.700")}
              >
                <Heading as="h3" size="md" mb={5} color={headingColor}>
                  Why Choose Our Healthcare Services
                </Heading>

                <VStack align="stretch" spacing={4}>
                  <HStack>
                    <Icon as={CheckCircle} color="green.500" />
                    <Text>Experienced medical professionals</Text>
                  </HStack>

                  <HStack>
                    <Icon as={CheckCircle} color="green.500" />
                    <Text>State-of-the-art medical equipment</Text>
                  </HStack>

                  <HStack>
                    <Icon as={CheckCircle} color="green.500" />
                    <Text>Patient-centered approach</Text>
                  </HStack>

                  <HStack>
                    <Icon as={CheckCircle} color="green.500" />
                    <Text>Affordable healthcare solutions</Text>
                  </HStack>
                </VStack>
              </Box>
            </Flex>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
};

// Enhanced version of the ServiceCard component with more healthcare elements
const ServiceCardEnhanced = ({
  icon,
  title,
  description,
  color,
  bgColor,
  features,
  link,

  index,
}) => {
  const navigate = useNavigate();

  // Custom animation variants
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  const [isHovered, setIsHovered] = useState(false);

  // Color tokens
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("gray.800", "white");
  const descColor = useColorModeValue("gray.600", "gray.400");
  const featureColor = useColorModeValue("gray.700", "gray.300");

  return (
    <motion.div variants={item}>
      <Box
        bg={isHovered ? cardHoverBg : cardBg}
        p={6}
        borderRadius="xl"
        boxShadow={isHovered ? "md" : "sm"}
        border="1px"
        borderColor={borderColor}
        height="100%"
        transition="all 0.3s ease"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        overflow="hidden"
        transform={isHovered ? "translateY(-5px)" : "none"}
        role="group"
        display="flex"
        flexDirection="column"
        cursor="pointer"
        onClick={() => navigate(link)}
      >
        {/* Icon with animated background */}
        <Flex
          bg={bgColor}
          color={color}
          w="60px"
          h="60px"
          borderRadius="lg"
          align="center"
          justify="center"
          mb={4}
          position="relative"
          transition="all 0.3s ease"
          transform={isHovered ? "scale(1.05)" : "scale(1)"}
          boxShadow={isHovered ? "md" : "sm"}
        >
          {icon}
        </Flex>

        <Heading
          as="h3"
          fontSize="xl"
          fontWeight="semibold"
          mb={3}
          color={titleColor}
          position="relative"
        >
          {title}
        </Heading>

        <Text
          color={descColor}
          fontSize="md"
          lineHeight="tall"
          position="relative"
          mb={4}
        >
          {description}
        </Text>

        {/* Feature list */}
        <Box mt="auto">
          <Divider my={4} opacity={0.3} />

          <VStack align="start" spacing={2}>
            {features.map((feature, idx) => (
              <HStack key={idx} spacing={2}>
                <Box w="6px" h="6px" borderRadius="full" bg={color} />
                <Text fontSize="sm" color={featureColor}>
                  {feature}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Link
            color={color}
            fontSize="sm"
            fontWeight="medium"
            mt={4}
            display="flex"
            alignItems="center"
            _hover={{ textDecor: "none" }}
          >
            Learn more
            <Icon
              as={ArrowRight}
              ml={1}
              w={4}
              h={4}
              transition="transform 0.3s"
              transform={isHovered ? "translateX(3px)" : "none"}
            />
          </Link>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ServiceSection;
