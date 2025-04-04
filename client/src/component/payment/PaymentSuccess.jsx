
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
  Divider,
  Badge,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get transaction details from URL parameters
  const transactionId = searchParams.get("transaction_id");
  const amount = searchParams.get("amount");
  const purchaseOrderId = searchParams.get("purchase_order_id");
  const pidx = searchParams.get("pidx");

  // Current date for display
  const date = new Date().toLocaleString();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.300");
  const secondaryBgColor = useColorModeValue("green.50", "green.900");

  // Handle case where transaction details are missing
  if (!transactionId && !amount) {
    return (
      <Container maxW="container.md" py={10}>
        <Flex
          direction="column"
          bg={bgColor}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={borderColor}
          className="animate-fade-in-up"
        >
          <Flex direction="column" align="center" mb={6}>
            <Icon
              as={CheckCircleIcon}
              w={20}
              h={20}
              color="green.500"
              className="animate-bounce-once"
            />
            <Heading size="xl" mt={4} textAlign="center" color="green.500">
              Payment Successful
            </Heading>
          </Flex>
          <Text>
            No transaction details available. Your payment has been processed
            but details cannot be displayed.
          </Text>
          <Flex justify="center" mt={8}>
            <Button
              colorScheme="green"
              size="lg"
              px={8}
              className="hover:shadow-lg transition-all duration-300"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </Flex>
        </Flex>
      </Container>
    );
  }

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
        {/* Success Icon and Heading */}
        <Flex direction="column" align="center" mb={6}>
          <Icon
            as={CheckCircleIcon}
            w={20}
            h={20}
            color="green.500"
            className="animate-bounce-once"
          />
          <Heading size="xl" mt={4} textAlign="center" color="green.500">
            Payment Successful
          </Heading>
          <Text fontSize="lg" mt={2} textAlign="center" color="gray.600">
            Your transaction has been completed
          </Text>
          <Badge
            colorScheme="green"
            fontSize="md"
            mt={2}
            p={2}
            borderRadius="md"
          >
            Thank you for your payment
          </Badge>
        </Flex>

        <Divider my={6} />

        {/* Transaction Details */}
        <Box
          bg={secondaryBgColor}
          p={6}
          borderRadius="md"
          borderLeft="4px"
          borderColor={accentColor}
          mb={8}
        >
          <Text fontWeight="bold" fontSize="lg" mb={4}>
            Payment Information
          </Text>

          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Transaction ID:</Text>
              <Text>{transactionId || "N/A"}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Amount:</Text>
              <Text fontWeight="bold">NPR {amount || "N/A"}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Date & Time:</Text>
              <Text>{date}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Payment ID (PIDX):</Text>
              <Text>{pidx || "N/A"}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Order Reference:</Text>
              <Text>{purchaseOrderId || "N/A"}</Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Text fontWeight="medium">Payment Method:</Text>
              <Text>Khalti</Text>
            </Flex>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Flex justify="center" gap={4} wrap="wrap">
          <Button
            colorScheme="green"
            size="lg"
            px={8}
            className="hover:shadow-lg transition-all duration-300"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
          <Button
            variant="outline"
            colorScheme="purple"
            size="lg"
            px={8}
            className="hover:bg-purple-50 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            View Dashboard
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default PaymentSuccess;
