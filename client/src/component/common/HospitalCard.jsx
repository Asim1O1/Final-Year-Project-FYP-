import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ArrowRight, Mail, MapPin, Phone, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HospitalCard({ hospital }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/hospitals/${hospital._id}`);
  };

  // Enhanced Chakra UI color tokens with blue theme
  const cardBg = useColorModeValue("white", "gray.800");
  const badgeBg = useColorModeValue("blue.50", "blue.900");

  const borderColor = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("#00A9FF", "#38B2FF");
  const buttonBg = useColorModeValue("#00A9FF", "#38B2FF");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.500");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const iconBgColor = useColorModeValue("blue.50", "rgba(0, 169, 255, 0.15)");

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s ease"
      transform={isHovered ? "translateY(-4px)" : "none"}
      display="flex"
      flexDirection="column"
      maxW="560px"
      minH="400px"
      w="100%"
      mx="auto"
      border="1px"
      borderColor={isHovered ? iconColor : borderColor}
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with streamlined styling */}
      <Box position="relative" height="180px" width="full" overflow="hidden">
        <Image
          src={hospital?.hospitalImage || "/placeholder.svg"}
          alt={hospital?.name || "Hospital"}
          objectFit="cover"
          width="100%"
          height="100%"
          transition="transform 0.6s"
          transform={isHovered ? "scale(1.05)" : "scale(1)"}
        />

        {/* Gradient overlay */}
        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-t, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"
        />

        {/* Premier quality badge */}
        <Badge
          position="absolute"
          top="3"
          right="3"
          px="2"
          py="1"
          bg={buttonBg}
          color="white"
          fontWeight="medium"
          borderRadius="full"
          boxShadow="0 1px 3px rgba(0, 0, 0, 0.2)"
          fontSize="xs"
        >
          Premier Care
        </Badge>

        {/* Hospital name on image */}
        <Box position="absolute" bottom="0" left="0" right="0" p="4">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="white"
            textShadow="0 1px 3px rgba(0,0,0,0.3)"
          >
            {hospital?.name}
          </Text>
        </Box>
      </Box>

      <Flex p="5" direction="column" flex="1" bg={cardBg}>
        {/* Contact information */}
        <Box mb="4" flex="1">
          <VStack align="stretch" spacing={3}>
            <Flex align="center" color={textColor}>
              <Flex
                align="center"
                justify="center"
                bg={iconBgColor}
                p="1.5"
                borderRadius="md"
                mr="3"
                w="28px"
                h="28px"
              >
                <Box as={MapPin} h="3.5" w="3.5" color={iconColor} />
              </Flex>
              <Box>
                <Text fontSize="xs">Location</Text>
                <Text fontSize="sm" fontWeight="medium" isTruncated>
                  {hospital?.location || "Location not specified"}
                </Text>
              </Box>
            </Flex>

            <Flex align="center" color={textColor}>
              <Flex
                align="center"
                justify="center"
                bg={iconBgColor}
                p="1.5"
                borderRadius="md"
                mr="3"
                w="28px"
                h="28px"
              >
                <Box as={Phone} h="3.5" w="3.5" color={iconColor} />
              </Flex>
              <Box>
                <Text fontSize="xs">Contact</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {hospital?.contactNumber || "Not available"}
                </Text>
              </Box>
            </Flex>

            <Flex align="center" color={textColor}>
              <Flex
                align="center"
                justify="center"
                bg={iconBgColor}
                p="1.5"
                borderRadius="md"
                mr="3"
                w="28px"
                h="28px"
              >
                <Box as={Mail} h="3.5" w="3.5" color={iconColor} />
              </Flex>
              <Box>
                <Text fontSize="xs">Email</Text>
                <Text fontSize="sm" fontWeight="medium" isTruncated>
                  {hospital?.email || "Not available"}
                </Text>
              </Box>
            </Flex>
          </VStack>
        </Box>

        {/* Specialties section */}
        <Box mb="4">
          <Flex align="center" mb="2">
            <Icon as={Stethoscope} color={iconColor} mr="2" boxSize={3.5} />
            <Text fontSize="sm" fontWeight="semibold" color={iconColor}>
              Specialties
            </Text>
          </Flex>
          <Flex wrap="wrap" gap="2">
            {hospital?.specialties?.slice(0, 3).map((specialty, index) => (
              <Badge
                key={index}
                px="2"
                py="1"
                borderRadius="full"
                bg={badgeBg}
                color="black" // changed here
                fontWeight="medium"
                fontSize="xs"
                boxShadow="sm"
              >
                {specialty}
              </Badge>
            ))}
            {hospital?.specialties?.length > 3 && (
              <Badge
                px="2"
                py="1"
                borderRadius="full"
                bg={badgeBg}
                color="black" // changed here
                fontWeight="medium"
                fontSize="xs"
                boxShadow="sm"
              >
                +{hospital?.specialties.length - 3} more
              </Badge>
            )}
          </Flex>
        </Box>

        {/* CTA button */}
        <Box mt="auto">
          <Button
            onClick={handleViewDetails}
            width="full"
            py="2"
            bg={buttonBg}
            _hover={{
              bg: buttonHoverBg,
              transform: "translateY(-2px)",
            }}
            color="white"
            borderRadius="md"
            fontWeight="medium"
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
            size="sm"
          >
            <Text>View Hospital Details</Text>
            <Box as={ArrowRight} w="3.5" h="3.5" ml="2" />
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
