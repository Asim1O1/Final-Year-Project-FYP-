import { Box, Image, VStack, Heading, Text, HStack, IconButton, Button } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const DoctorCard = ({ image, name, specialty }) => (
  <Box
    bg="white"
    borderRadius="lg"
    overflow="hidden"
    boxShadow="md"
    textAlign="center"
      cursor="pointer"
  >
    <Image src={image} alt={name} w="full" h="300px" objectFit="cover" />
    <Box bg="blue.800" p={6} color="white">
      <VStack spacing={3}>
        <Heading size="md">{name}</Heading>
        <Text textTransform="uppercase" fontSize="sm" letterSpacing="wide">
          {specialty}
        </Text>
        <HStack spacing={4} justify="center">
          <IconButton
            aria-label="Facebook"
            icon={<FaFacebook />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: "blue.700" }}
          />
          <IconButton
            aria-label="Twitter"
            icon={<FaTwitter />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: "blue.700" }}
          />
          <IconButton
            aria-label="LinkedIn"
            icon={<FaLinkedin />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: "blue.700" }}
          />
        </HStack>
        <Button
          variant="outline"
          color="white"
          _hover={{ bg: "blue.700" }}
          size="sm"
        >
          View Profile
        </Button>
      </VStack>
    </Box>
  </Box>
);

export default DoctorCard;