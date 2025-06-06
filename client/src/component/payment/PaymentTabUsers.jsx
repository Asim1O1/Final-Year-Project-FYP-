import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";
import { getUserPayments } from "../../features/payment/paymentSlice";

const TransactionsTab = () => {
  const dispatch = useDispatch();
  const { loading: transactionsLoading } = useSelector(
    (state) => state.paymentSlice
  );
  const transactions = useSelector(
    (state) => state.paymentSlice?.userPayments?.payments
  );
  const [isMobile, setIsMobile] = useState(false);

  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const highlightBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("gray.700", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    dispatch(getUserPayments());

    // Check if the screen is mobile size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: isMobile ? undefined : "2-digit",
      minute: isMobile ? undefined : "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get paymentStatus color based on payment paymentStatus
  const getStatusColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "completed":
      case "paid":
      case "successful":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  // Get paymentStatus icon based on payment paymentStatus
  const getStatusIcon = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "completed":
      case "paid":
      case "successful":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return XCircle;
      default:
        return Clock;
    }
  };

  // Mobile card view for each transaction
  const MobileTransactionCard = ({ transaction }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      borderColor={borderColor}
      bg={cardBg}
      shadow="sm"
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between">
          <Text fontSize="xs" color={mutedColor} fontFamily="mono">
            ID: {transaction.transactionId || transaction._id}
          </Text>
          <Tag
            colorScheme={getStatusColor(transaction.paymentStatus)}
            borderRadius="full"
            size="sm"
            fontWeight="medium"
          >
            <Flex align="center">
              <Icon
                as={getStatusIcon(transaction.paymentStatus)}
                boxSize={3}
                mr={1}
              />
              {transaction.paymentStatus}
            </Flex>
          </Tag>
        </Flex>

        <Divider />

        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Amount:
          </Text>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={transaction.type === "refund" ? "red.500" : "green.500"}
          >
            NRS {transaction?.amount}
          </Text>
        </Flex>

        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Date:
          </Text>
          <Text fontSize="sm" color={mutedColor}>
            {formatDate(transaction.createdAt || transaction.date)}
          </Text>
        </Flex>

        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Method:
          </Text>
          <Badge colorScheme="blue" borderRadius="full" px={2}>
            {transaction.paymentMethod || "Card"}
          </Badge>
        </Flex>

        <Flex justify="space-between">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Purpose:
          </Text>
          <Text fontSize="sm" color={textColor}>
            {transaction.purpose ||
              (transaction.appointmentId
                ? "Appointment"
                : transaction.orderId
                ? "Medicine Order"
                : "Payment")}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <VStack spacing={6} py={8} px={4}>
      <Icon as={CreditCard} boxSize={12} color="gray.300" />
      <Heading
        size="md"
        color={mutedColor}
        fontWeight="medium"
        textAlign="center"
      >
        No transactions found
      </Heading>
      <Text
        color="gray.500"
        maxW="md"
        textAlign="center"
        fontSize={{ base: "sm", md: "md" }}
      >
        You don't have any payment transactions yet. They will appear here once
        you make payments for appointments or other services.
      </Text>
    </VStack>
  );

  return (
    <Card
      bg={cardBg}
      borderRadius={{ base: "lg", md: "xl" }}
      boxShadow="md"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      w="100%"
    >
      <CardHeader
        bg={highlightBg}
        py={{ base: 4, md: 6 }}
        px={{ base: 4, md: 8 }}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <Flex align="center">
          <Icon
            as={CreditCard}
            color={primaryColor}
            boxSize={{ base: 5, md: 6 }}
            mr={3}
          />
          <Heading
            size={{ base: "sm", md: "md" }}
            color={secondaryColor}
            fontWeight="700"
          >
            Your Payment History
          </Heading>
        </Flex>
      </CardHeader>

      <CardBody p={{ base: 3, md: 6, lg: 8 }}>
        {transactionsLoading ? (
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                height={{ base: "100px", md: "80px" }}
                borderRadius="lg"
              />
            ))}
          </VStack>
        ) : isMobile ? (
          // Mobile view with cards
          <Box>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <MobileTransactionCard
                  key={transaction._id}
                  transaction={transaction}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </Box>
        ) : (
          // Desktop view with table
          <TableContainer
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="sm"
            overflow="hidden"
            overflowX="auto"
          >
            <Table variant="simple" size={{ base: "sm", lg: "md" }}>
              <Thead bg="gray.50">
                <Tr>
                  <Th
                    py={{ base: 3, md: 4 }}
                    borderColor="gray.100"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Transaction ID
                  </Th>
                  <Th
                    py={{ base: 3, md: 4 }}
                    borderColor="gray.100"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Date
                  </Th>
                  <Th
                    py={{ base: 3, md: 4 }}
                    borderColor="gray.100"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Amount
                  </Th>
                  <Th
                    py={{ base: 3, md: 4 }}
                    borderColor="gray.100"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Payment Method
                  </Th>
                  <Th
                    py={{ base: 3, md: 4 }}
                    borderColor="gray.100"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Status
                  </Th>
                  <Th
                    py={{ base: 3, md: 4 }}
                    borderColor="gray.100"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Purpose
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <Tr key={transaction._id} _hover={{ bg: "gray.50" }}>
                      <Td
                        py={{ base: 3, md: 4 }}
                        borderColor="gray.100"
                        fontWeight="medium"
                        color={textColor}
                      >
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          fontFamily="mono"
                        >
                          {transaction.transactionId || transaction._id}
                        </Text>
                      </Td>
                      <Td
                        py={{ base: 3, md: 4 }}
                        borderColor="gray.100"
                        color={mutedColor}
                      >
                        <HStack spacing={1}>
                          <Icon as={Calendar} boxSize={{ base: 3, md: 4 }} />
                          <Text fontSize={{ base: "xs", md: "sm" }}>
                            {formatDate(
                              transaction.createdAt || transaction.date
                            )}
                          </Text>
                        </HStack>
                      </Td>
                      <Td
                        py={{ base: 3, md: 4 }}
                        borderColor="gray.100"
                        fontWeight="bold"
                        color={
                          transaction.type === "refund"
                            ? "red.500"
                            : "green.500"
                        }
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        NRS {transaction?.amount}
                      </Td>
                      <Td
                        py={{ base: 3, md: 4 }}
                        borderColor="gray.100"
                        color={mutedColor}
                      >
                        <Badge
                          colorScheme="blue"
                          borderRadius="full"
                          px={2}
                          py={0.5}
                          fontSize={{ base: "2xs", md: "xs" }}
                        >
                          {transaction.paymentMethod || "Card"}
                        </Badge>
                      </Td>
                      <Td py={{ base: 3, md: 4 }} borderColor="gray.100">
                        <Tag
                          colorScheme={getStatusColor(
                            transaction.paymentStatus
                          )}
                          borderRadius="full"
                          size={{ base: "sm", md: "md" }}
                          py={0.5}
                          px={2}
                          fontWeight="medium"
                          fontSize={{ base: "2xs", md: "xs" }}
                        >
                          <Flex align="center">
                            <Icon
                              as={getStatusIcon(transaction.paymentStatus)}
                              boxSize={{ base: 2.5, md: 3 }}
                              mr={1}
                            />
                            {transaction.paymentStatus}
                          </Flex>
                        </Tag>
                      </Td>
                      <Td
                        py={{ base: 3, md: 4 }}
                        borderColor="gray.100"
                        color={textColor}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {transaction.purpose ||
                          (transaction.appointmentId
                            ? "Appointment"
                            : transaction.orderId
                            ? "Medicine Order"
                            : "Payment")}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td
                      colSpan={6}
                      textAlign="center"
                      py={12}
                      borderColor="gray.100"
                    >
                      <EmptyState />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {transactions && transactions.length > 0 && (
          <Flex
            justify="space-between"
            align="center"
            mt={{ base: 4, md: 8 }}
            px={{ base: 1, md: 2 }}
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 2, sm: 0 }}
          >
            <Text
              color={mutedColor}
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="medium"
            >
              Showing {transactions.length} transactions
            </Text>
            {transactions.length > 10 && (
              <Button
                variant="link"
                colorScheme="blue"
                size="sm"
                fontWeight="medium"
                fontSize={{ base: "xs", md: "sm" }}
              >
                View All Transactions
              </Button>
            )}
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default TransactionsTab;
