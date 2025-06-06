"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, HeartPulseIcon, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";
import HospitalCard from "../common/HospitalCard";

// Motion components
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

const PartnersSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch first 3 hospitals for the homepage
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        await dispatch(fetchAllHospitals({ page: 1, limit: 3 })).unwrap();
      } finally {
        // Add a small delay to make the loading state visible (optional)
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    fetchHospitals();
  }, [dispatch]);

  const { hospitals } = useSelector((state) => state?.hospitalSlice?.hospitals);
  const featuredHospitals = hospitals?.slice(0, 3) || [];

  // Enhanced Chakra UI color tokens
  const bgColor = useColorModeValue("white", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("blue.400", "blue.500");
  const statsBgColor = useColorModeValue("blue.50", "blue.900");
  const statTextColor = useColorModeValue("blue.700", "blue.200");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      py={{ base: 16, md: 24 }}
      bg={bgColor}
      position="relative"
      overflow="hidden"
      borderTop="1px"
      borderBottom="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      {/* Subtle decorative background elements appropriate for healthcare */}
      <Box
        position="absolute"
        top="-50px"
        right="-20px"
        height="300px"
        width="300px"
        bg="blue.400"
        opacity="0.03"
        borderRadius="full"
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="-100px"
        left="-50px"
        height="400px"
        width="400px"
        bg="teal.300"
        opacity="0.03"
        borderRadius="full"
        filter="blur(60px)"
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={{ base: 12, md: 16 }}>
          <MotionBox
            textAlign="center"
            maxW="800px"
            mx="auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Flex
              justify="center"
              mb={5}
              bg={`${accentColor}15`}
              w="16"
              h="16"
              borderRadius="full"
              align="center"
              mx="auto"
            >
              <Icon as={Building2} w={8} h={8} color={accentColor} />
            </Flex>
            <Heading
              mb={4}
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color={headingColor}
              letterSpacing="tight"
              lineHeight="shorter"
            >
              Our Partner{" "}
              <Text
                as="span"
                bgGradient="linear(to-r, blue.400, teal.400)"
                bgClip="text"
              >
                Hospitals
              </Text>
            </Heading>
            <Text
              color={subheadingColor}
              fontSize={{ base: "lg", md: "xl" }}
              maxW="650px"
              mx="auto"
              lineHeight="tall"
            >
              Collaborate with leading healthcare institutions to provide
              exceptional medical care with cutting-edge facilities and
              specialized expertise
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
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg={cardBgColor}
                p={1}
                borderRadius="full"
                boxShadow="sm"
              >
                <Icon as={HeartPulseIcon} color={accentColor} w={6} h={6} />
              </Box>
            </Box>
          </MotionBox>

          {/* Hospital network statistics */}
          <MotionBox
            width="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, md: 8 }}
              mx="auto"
              maxW="900px"
              mb={{ base: 10, md: 14 }}
            ></SimpleGrid>
          </MotionBox>

          {/* Featured hospitals section */}
          <Box width="full">
            <Heading
              as="h3"
              fontSize={{ base: "xl", md: "2xl" }}
              textAlign="center"
              mb={{ base: 6, md: 8 }}
              color={headingColor}
            >
              Featured Healthcare Partners
            </Heading>

            {isLoading ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 8, md: 10 }}
                width="full"
              >
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    bg={cardBgColor}
                    p={0}
                    borderRadius="xl"
                    boxShadow="md"
                    overflow="hidden"
                    height="full"
                    border="1px"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                  >
                    <Skeleton height="220px" />
                    <Box p={6}>
                      <SkeletonText
                        noOfLines={1}
                        height="24px"
                        width="60%"
                        mb={4}
                        startColor={useColorModeValue("blue.50", "blue.900")}
                        endColor={useColorModeValue("gray.200", "gray.700")}
                      />
                      <Skeleton
                        height="20px"
                        width="40%"
                        mb={4}
                        startColor={useColorModeValue("blue.50", "blue.900")}
                        endColor={useColorModeValue("gray.200", "gray.700")}
                      />
                      <SkeletonText
                        noOfLines={2}
                        spacing="4"
                        mb={4}
                        startColor={useColorModeValue("blue.50", "blue.900")}
                        endColor={useColorModeValue("gray.200", "gray.700")}
                      />
                      <Skeleton
                        height="40px"
                        borderRadius="md"
                        startColor={useColorModeValue("blue.50", "blue.900")}
                        endColor={useColorModeValue("blue.200", "blue.700")}
                      />
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <MotionFlex
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                direction="column"
                width="full"
              >
                {featuredHospitals.length > 0 ? (
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={{ base: 8, md: 10 }}
                    width="full"
                  >
                    {featuredHospitals.map((hospital, index) => (
                      <MotionBox
                        key={hospital._id}
                        variants={itemVariants}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      >
                        <HospitalCard hospital={hospital} />
                      </MotionBox>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box
                    textAlign="center"
                    py={10}
                    px={6}
                    borderRadius="xl"
                    bg="blue.50"
                    color="blue.900"
                  >
                    <Icon
                      as={Building2}
                      w={12}
                      h={12}
                      mb={4}
                      color="blue.400"
                    />
                    <Heading as="h3" size="lg" mb={3}>
                      No Hospitals Available
                    </Heading>
                    <Text>
                      Our partner hospitals information is being updated.
                    </Text>
                  </Box>
                )}
              </MotionFlex>
            )}
          </Box>

          {/* Quality assurance banner */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            width="full"
            bg={statsBgColor}
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            boxShadow="sm"
            border="1px"
            borderColor={`${accentColor}20`}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={{ base: 6, md: 0 }}
            >
              <HStack spacing={4}>
                <Icon as={Shield} w={8} h={8} color={statTextColor} />
                <Box>
                  <Text fontWeight="bold" fontSize="lg" color={statTextColor}>
                    Healthcare Quality Assurance
                  </Text>
                  <Text color={statTextColor} opacity={0.9}>
                    All our partner hospitals are certified and regularly
                    audited for service quality
                  </Text>
                </Box>
              </HStack>

              <Button
                colorScheme="blue"
                size="md"
                onClick={() => navigate("/hospitals")}
                rightIcon={<ArrowRight size={16} />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                variant="solid"
                px={6}
              >
                View All Hospitals
              </Button>
            </Flex>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default PartnersSection;
