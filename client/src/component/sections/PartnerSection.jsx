"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import HospitalCard from "../common/HospitalCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";
import { Building2, ArrowRight, HeartPulseIcon } from "lucide-react";

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
        setIsLoading(false);
      }
    };
    fetchHospitals();
  }, [dispatch]);

  const { hospitals } = useSelector((state) => state?.hospitalSlice?.hospitals);
  const featuredHospitals = hospitals?.slice(0, 3) || [];

  // Enhanced Chakra UI color tokens
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("blue.400", "blue.500");

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
      {/* Enhanced decorative background elements */}
      <Box
        position="absolute"
        top="-100px"
        right="-50px"
        height="400px"
        width="400px"
        bg="blue.400"
        opacity="0.05"
        borderRadius="full"
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="-150px"
        left="-100px"
        height="500px"
        width="500px"
        bg="teal.300"
        opacity="0.05"
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        top="40%"
        left="60%"
        height="300px"
        width="300px"
        bg="purple.300"
        opacity="0.05"
        borderRadius="full"
        filter="blur(60px)"
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={{ base: 12, md: 16 }}>
          <Box textAlign="center" maxW="800px" mx="auto">
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
              Featured healthcare providers with excellent facilities and
              world-class medical services
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
          </Box>

          {isLoading ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 8, md: 10 }}
              width="full"
              mt={4}
            >
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  bg={cardBgColor}
                  p={0}
                  borderRadius="2xl"
                  boxShadow="lg"
                  overflow="hidden"
                  height="full"
                  transition="all 0.4s"
                  _hover={{ transform: "translateY(-8px)", boxShadow: "xl" }}
                  border="1px"
                  borderColor={useColorModeValue("gray.100", "gray.700")}
                >
                  <Skeleton height="240px" />
                  <Box p={8}>
                    <SkeletonText
                      noOfLines={1}
                      height="28px"
                      width="70%"
                      mb={6}
                      startColor={useColorModeValue("blue.50", "blue.900")}
                      endColor={useColorModeValue("gray.200", "gray.700")}
                    />
                    <SkeletonText 
                      noOfLines={3} 
                      spacing="4" 
                      mb={6} 
                      startColor={useColorModeValue("blue.50", "blue.900")}
                      endColor={useColorModeValue("gray.200", "gray.700")}
                    />
                    <Skeleton 
                      height="48px" 
                      borderRadius="lg" 
                      startColor={useColorModeValue("blue.50", "blue.900")}
                      endColor={useColorModeValue("blue.200", "blue.700")}
                    />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 8, md: 10 }}
              width="full"
              mt={4}
            >
              {featuredHospitals.map((hospital) => (
                <HospitalCard key={hospital._id} hospital={hospital} />
              ))}
            </SimpleGrid>
          )}

          <Flex justify="center" width="full" mt={{ base: 8, md: 12 }}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/hospitals")}
              px={10}
              py={7}
              isLoading={isLoading}
              rightIcon={<ArrowRight size={20} />}
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
              }}
              fontWeight="medium"
              borderRadius="xl"
              bgGradient="linear(to-r, blue.500, blue.600)"
              _active={{
                bgGradient: "linear(to-r, blue.600, blue.700)",
              }}
              transition="all 0.3s"
            >
              View All Hospitals
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default PartnersSection;
