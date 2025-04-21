import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Icon,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Skeleton,
  Text,
  Tag,
  HStack,
  Button,
  Badge,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import { getUserPayments } from "../../features/payment/paymentSlice";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";

const TransactionsTab = () => {
  const dispatch = useDispatch();
  const { loading: transactionsLoading } = useSelector(
    (state) => state.paymentSlice
  );
  const transactions = useSelector(
    (state) => state.paymentSlice?.userPayments?.payments
  );

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
  }, [dispatch]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get paymentStatus color based on payment paymentStatus
  const getStatusColor = (paymentStatus) => {
    switch (paymentStatus.toLowerCase()) {
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
    switch (paymentStatus.toLowerCase()) {
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

  return (
    <Card
      bg={cardBg}
      borderRadius="xl"
      boxShadow="md"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardHeader
        bg={highlightBg}
        py={6}
        px={8}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <Flex align="center">
          <Icon as={CreditCard} color={primaryColor} boxSize={6} mr={3} />
          <Heading size="md" color={secondaryColor} fontWeight="700">
            Your Payment History
          </Heading>
        </Flex>
      </CardHeader>

      <CardBody p={{ base: 6, md: 8 }}>
        {transactionsLoading ? (
          <VStack spacing={6} align="stretch">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="80px" borderRadius="lg" />
            ))}
          </VStack>
        ) : (
          <TableContainer
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="sm"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th py={4} borderColor="gray.100">
                    Transaction ID
                  </Th>
                  <Th py={4} borderColor="gray.100">
                    Date
                  </Th>
                  <Th py={4} borderColor="gray.100">
                    Amount
                  </Th>
                  <Th py={4} borderColor="gray.100">
                    Payment Method
                  </Th>
                  <Th py={4} borderColor="gray.100">
                    Status
                  </Th>
                  <Th py={4} borderColor="gray.100">
                    Purpose
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <Tr key={transaction._id} _hover={{ bg: "gray.50" }}>
                      <Td
                        py={4}
                        borderColor="gray.100"
                        fontWeight="medium"
                        color={textColor}
                      >
                        <Text fontSize="sm" fontFamily="mono">
                          {transaction.transactionId || transaction._id}
                        </Text>
                      </Td>
                      <Td py={4} borderColor="gray.100" color={mutedColor}>
                        <HStack spacing={2}>
                          <Icon as={Calendar} boxSize={4} />
                          <Text fontSize="sm">
                            {formatDate(
                              transaction.createdAt || transaction.date
                            )}
                          </Text>
                        </HStack>
                      </Td>
                      <Td
                        py={4}
                        borderColor="gray.100"
                        fontWeight="bold"
                        color={
                          transaction.type === "refund"
                            ? "red.500"
                            : "green.500"
                        }
                      >
                        NRS {transaction?.amount}
                      </Td>
                      <Td py={4} borderColor="gray.100" color={mutedColor}>
                        <Badge
                          colorScheme="blue"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {transaction.paymentMethod || "Card"}
                        </Badge>
                      </Td>
                      <Td py={4} borderColor="gray.100">
                        <Tag
                          colorScheme={getStatusColor(
                            transaction.paymentStatus
                          )}
                          borderRadius="full"
                          size="md"
                          py={1}
                          px={3}
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
                      </Td>
                      <Td py={4} borderColor="gray.100" color={textColor}>
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
                      colSpan={7}
                      textAlign="center"
                      py={16}
                      borderColor="gray.100"
                    >
                      <VStack spacing={6}>
                        <Icon as={CreditCard} boxSize={16} color="gray.300" />
                        <Heading
                          size="md"
                          color={mutedColor}
                          fontWeight="medium"
                        >
                          No transactions found
                        </Heading>
                        <Text color="gray.500" maxW="md" textAlign="center">
                          You don't have any payment transactions yet. They will
                          appear here once you make payments for appointments or
                          other services.
                        </Text>
                      </VStack>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {transactions && transactions.length > 0 && (
          <Flex justify="space-between" align="center" mt={8} px={2}>
            <Text color={mutedColor} fontSize="sm" fontWeight="medium">
              Showing {transactions.length} transactions
            </Text>
            {transactions.length > 10 && (
              <Button
                variant="link"
                colorScheme="blue"
                size="sm"
                fontWeight="medium"
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
