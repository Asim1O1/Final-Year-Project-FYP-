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
import DoctorCard from "../common/DoctorCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { fetchFeaturedDoctors } from "../../features/doctor/doctorSlice";
import { Stethoscope, ArrowRight } from "lucide-react";
import { fetchAllDoctors } from "../../features/doctor/doctorSlice";

const DoctorSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch featured doctors for the homepage
 useEffect(() => {
    const fetchDoctors = async () => {
      try {
        await dispatch(fetchAllDoctors({ page: 1, limit: 3 })).unwrap();
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, [dispatch]);

  const { doctors } = useSelector((state) => state?.doctorSlice?.doctors);
  const featuredDoctors = doctors?.slice(0, 3) || [];

  // Chakra UI color tokens
  const bgColor = useColorModeValue("blue.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("blue.100", "blue.800");

  return (
    <Box
      py={{ base: 12, md: 20 }}
      bg={bgColor}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="0"
        right="0"
        height="300px"
        width="300px"
        bg="blue.400"
        opacity="0.03"
        borderRadius="full"
        transform="translate(100px, -150px)"
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        height="200px"
        width="200px"
        bg="blue.400"
        opacity="0.03"
        borderRadius="full"
        transform="translate(-100px, 100px)"
      />

      <Container maxW="container.xl">
        <VStack spacing={{ base: 8, md: 12 }}>
          <Box textAlign="center" maxW="800px" mx="auto">
            <Flex justify="center" mb={4}>
              <Icon as={Stethoscope} w={8} h={8} color={accentColor} />
            </Flex>
            <Heading
                mb={4}
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                color={headingColor}
                letterSpacing="tight"
                lineHeight="shorter"
              >
                Our Expert{" "}
                <Text
                  as="span"
                  bgGradient="linear(to-r, blue.400, teal.400)"
                  bgClip="text"
                >
                  Doctors
                </Text>
              </Heading>
            <Text
              color={subheadingColor}
              fontSize={{ base: "md", md: "lg" }}
              maxW="600px"
              mx="auto"
            >
              Highly qualified professionals dedicated to providing exceptional
              healthcare services
            </Text>
            <Divider
              width="80px"
              borderColor={dividerColor}
              borderWidth="2px"
              opacity="1"
              mt={6}
              mx="auto"
            />
          </Box>

          {isLoading ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 6, md: 8 }}
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
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                >
                  <Skeleton height="240px" />
                  <Box p={6}>
                    <SkeletonText
                      noOfLines={1}
                      height="24px"
                      width="70%"
                      mb={4}
                    />
                    <SkeletonText
                      noOfLines={1}
                      height="20px"
                      width="50%"
                      mb={6}
                    />
                    <Skeleton height="40px" borderRadius="lg" />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 6, md: 8 }}
              width="full"
            >
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </SimpleGrid>
          )}

          <Flex justify="center" width="full" mt={{ base: 6, md: 10 }}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/doctors")}
              px={8}
              py={6}
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              fontWeight="medium"
              borderRadius="lg"
            >
              View All Doctors
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default DoctorSection;
