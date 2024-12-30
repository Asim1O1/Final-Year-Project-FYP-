import { Box, Badge, Image, VStack, Heading, Text, Flex, Button, Link } from "@chakra-ui/react";

const PartnerCard = ({ image, title, description, price, time }) => (
  <Box
    bg="white"
    borderRadius="lg"
    overflow="hidden"
    boxShadow="md"
    transition="all 0.3s"
    _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
  >
    <Box position="relative">
      <Image src={image} alt={title} w="full" h="200px" objectFit="cover" />
      <Badge
        position="absolute"
        top={4}
        right={4}
        colorScheme="red"
        borderRadius="full"
        px={2}
      >
        SALE
      </Badge>
    </Box>
    <VStack p={4} align="start" spacing={2}>
      <Badge colorScheme="blue">4.5 ★</Badge>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600" fontSize="sm">
        {description}
      </Text>
      <Flex justify="space-between" w="full" align="center">
        <Text color="gray.500" fontSize="sm">
          {time} Sales
        </Text>
        <Text fontWeight="bold" color="blue.500">
          ${price}
        </Text>
      </Flex>
      <Button
        as={Link}
        variant="ghost"
        colorScheme="blue"
        rightIcon={<span>→</span>}
        size="sm"
      >
        Learn More
      </Button>
    </VStack>
  </Box>
);

export default PartnerCard;