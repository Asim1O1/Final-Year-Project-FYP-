import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Link,
  Flex,
  useColorModeValue,
  Divider,
  Button,
} from "@chakra-ui/react";
import ServiceCard from "../common/ServiceCard";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Heart,
  Hospital,
  Microscope,
  Stethoscope,
} from "lucide-react";

const ServiceSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Enhanced service data with more professional icons and improved descriptions
  const services = [
    {
      icon: <Hospital size={32} />,
      title: "Hospitals",
      description:
        "Access to our extensive network of state-of-the-art healthcare facilities and specialized medical centers.",
      color: "blue.500",
      bgColor: "blue.50",
    },
    {
      icon: <Microscope size={32} />,
      title: "Medical Tests",
      description:
        "Comprehensive diagnostic services with cutting-edge laboratory equipment and quick result delivery.",
      color: "purple.500",
      bgColor: "purple.50",
    },
    {
      icon: <Stethoscope size={32} />,
      title: "Doctor Appointment",
      description:
        "Seamless scheduling with specialists and physicians across all medical fields with 24/7 online booking.",
      color: "teal.500",
      bgColor: "teal.50",
    },
    {
      icon: <Heart size={32} />,
      title: "Health Campaigns",
      description:
        "Join community health initiatives to promote wellness, education, and preventive healthcare services.",
      color: "red.500",
      bgColor: "red.50",
    },
  ];

  // Enhanced Chakra UI color tokens
  const headingColor = useColorModeValue("gray.800", "white");
  const subHeadingColor = useColorModeValue("gray.600", "gray.400");
  const bgGradient = useColorModeValue(
    "linear(to-b, blue.50, gray.50)",
    "linear(to-b, gray.800, gray.900)"
  );
  const dividerColor = useColorModeValue("blue.400", "blue.500");

  return (
    <Box py={{ base: 16, md: 24 }} bgGradient={bgGradient} position="relative">
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        height="300px"
        width="300px"
        bg="blue.400"
        opacity="0.05"
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        height="200px"
        width="200px"
        bg="purple.400"
        opacity="0.05"
        borderRadius="full"
        filter="blur(40px)"
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={{ base: 12, md: 16 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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
            className="w-full"
          >
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={{ base: 8, md: 10 }}
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
                  index={index}
                />
              ))}
            </SimpleGrid>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
};

// Enhanced version of the ServiceCard component
const ServiceCardEnhanced = ({
  icon,
  title,
  description,
  color,
  bgColor,
  index,
}) => {
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

  return (
    <motion.div variants={item}>
      <Box
        bg={isHovered ? cardHoverBg : cardBg}
        p={8}
        borderRadius="2xl"
        boxShadow={isHovered ? "lg" : "md"}
        border="1px"
        borderColor={borderColor}
        height="100%"
        transition="all 0.3s ease"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        overflow="hidden"
        transform={isHovered ? "translateY(-8px)" : "none"}
        role="group"
      >
        {/* Decorative corner accent */}
        <Box
          position="absolute"
          top="-2px"
          right="-2px"
          width="100px"
          height="100px"
          bg={color}
          opacity="0.1"
          clipPath="polygon(100% 0, 0 0, 100% 100%)"
          transition="all 0.3s ease"
          transform={isHovered ? "scale(1.2)" : "scale(1)"}
        />

        {/* Icon with animated background */}
        <Flex
          bg={bgColor}
          color={color}
          w="70px"
          h="70px"
          borderRadius="xl"
          align="center"
          justify="center"
          mb={6}
          position="relative"
          transition="all 0.3s ease"
          transform={isHovered ? "scale(1.1)" : "scale(1)"}
          boxShadow={isHovered ? "md" : "sm"}
        >
          {icon}
        </Flex>

        <Heading
          as="h3"
          fontSize="xl"
          fontWeight="semibold"
          mb={4}
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
        >
          {description}
        </Text>

        {/* Learn more link that shows on hover */}
        <Link
          display="flex"
          alignItems="center"
          color={color}
          fontWeight="medium"
          mt={4}
          opacity={isHovered ? 1 : 0}
          transform={isHovered ? "translateY(0)" : "translateY(10px)"}
          transition="all 0.3s ease"
        >
          Learn more
          <Icon as={ArrowRightIcon} ml={2} h={4} w={4} />
        </Link>
      </Box>
    </motion.div>
  );
};

export default ServiceSection;
