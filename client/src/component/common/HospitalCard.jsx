import {
  Box,
  Badge,
  Image,
  Text,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const HospitalCard = ({ hospital }) => {
  return (
    <Box className="w-full max-w-md border rounded-lg overflow-hidden shadow-sm">
      <Box className="relative">
        <Image
          src={hospital?.hospitalImage}
          alt={hospital?.name}
          className="w-full h-48 object-cover"
        />
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 bg-white rounded-full"
        >
          <StarIcon />
        </Button>
      </Box>

      <VStack align="stretch" p={4} spacing={3}>
        <Text fontSize="xl" fontWeight="bold">
          {hospital?.name}
        </Text>
        <Text color="gray.600">
          <span className="mr-2">📍</span>
          {hospital?.location}
        </Text>

        <HStack spacing={2} wrap="wrap">
          {/* Loop through specialties */}
          {hospital.specialties.map((specialty) => (
            <Badge
              key={specialty}
              colorScheme="blue"
              variant="subtle"
              className="px-2 py-1 rounded-full"
            >
              {specialty}
            </Badge>
          ))}
        </HStack>

        <Button colorScheme="blue" width="100%">
          View Details
        </Button>
      </VStack>
    </Box>
  );
};

export default HospitalCard;
