import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  useColorModeValue,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get error details from URL parameters
  const status = searchParams.get("status");
  const transactionId = searchParams.get("transaction_id");
  const amount = searchParams.get("amount");
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  // Current date for display
  const date = new Date().toLocaleString();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const errorColor = useColorModeValue("red.500", "red.300");
  const secondaryBgColor = useColorModeValue("red.50", "red.900");

  const errorMessage =
    message || error || "Your payment could not be processed at this time.";

  const handleTryAgain = () => {
    // Navigate back to appointment booking
    navigate("/book-appointment");
  };

  return (
    <Container maxW="container.md" py={10}>
      <Flex
        direction="column"
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        border="1px"
        borderColor={borderColor}
        className="animate-fade-in-up"
      >
        {/* Failed Icon and Heading */}
        <Flex direction="column" align="center" mb={6}>
          <Icon
            as={WarningTwoIcon}
            w={20}
            h={20}
            color="red.500"
            className="animate-shake"
          />
          <Heading size="xl" mt={4} textAlign="center" color="red.500">
            Payment Failed
          </Heading>
          <Text fontSize="lg" mt={2} textAlign="center" color="gray.600">
            We couldn't process your payment
          </Text>
          <Badge colorScheme="red" fontSize="md" mt={2} p={2} borderRadius="md">
            Transaction Unsuccessful
          </Badge>
        </Flex>

        <Divider my={6} />

        {/* Error Details */}
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
          mb={6}
          p={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Transaction Failed
          </AlertTitle>
          <AlertDescription maxW="sm" fontSize="md">
            {errorMessage}
          </AlertDescription>
        </Alert>

        {/* Transaction Details */}
        <Box
          bg={secondaryBgColor}
          p={6}
          borderRadius="md"
          borderLeft="4px"
          borderColor={errorColor}
          mb={8}
        >
          <Text fontWeight="bold" fontSize="lg" mb={4}>
            Payment Information
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            If this problem persists, please contact our support team with the
            transaction details below.
          </Text>

          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Transaction ID:</Text>
              <Text>{transactionId || "N/A"}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Amount:</Text>
              <Text>{amount ? `NPR ${amount}` : "N/A"}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Date & Time:</Text>
              <Text>{date}</Text>
            </Flex>
            {error && (
              <Flex justify="space-between" wrap="wrap">
                <Text fontWeight="medium">Error Code:</Text>
                <Text>{error}</Text>
              </Flex>
            )}
            {status && (
              <Flex justify="space-between" wrap="wrap">
                <Text fontWeight="medium">Status:</Text>
                <Text>{status}</Text>
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex justify="center" gap={4} wrap="wrap">
          <Button
            colorScheme="red"
            size="lg"
            px={8}
            className="hover:shadow-lg transition-all duration-300"
            onClick={handleTryAgain}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            colorScheme="purple"
            size="lg"
            px={8}
            className="hover:bg-purple-50 transition-all duration-300"
            onClick={() => navigate("/contact")}
          >
            Contact Support
          </Button>
          <Button
            variant="ghost"
            colorScheme="gray"
            size="lg"
            px={8}
            className="hover:bg-gray-50 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default PaymentFailed;
