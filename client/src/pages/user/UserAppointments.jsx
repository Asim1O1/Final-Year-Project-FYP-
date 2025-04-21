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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  X,
  XCircle,
} from "lucide-react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { fetchUserAppointments } from "../../features/appointment/appointmentSlice";
import Pagination from "../../utils/Pagination";
import { updateAppointmentStatus } from "../../features/appointment/appointmentSlice";
import { notification } from "antd";
import { deleteAppointments } from "../../features/appointment/appointmentSlice";

const AppointmentsTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state?.auth);
  const userData = user?.data;

  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Get appointments from Redux store
  const { appointments, loading: appointmentsLoading } = useSelector(
    (state) => state?.appointmentSlice
  );

  const totalPages = useSelector(
    (state) => state?.appointmentSlice?.appointments?.pagination?.totalPages
  );
  console.log("totoal pages", totalPages);
  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const highlightBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("gray.700", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    if (userData?._id) {
      dispatch(
        fetchUserAppointments({
          userId: userData._id,
          page: currentPage,
          limit: 10,
        })
      );
    }
  }, [dispatch, userData?._id, currentPage]);

  // Handle appointment cancellation initiation
  const initiateCancelAppointment = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancellationReason("");
    onOpen();
  };

  // Confirm and process appointment cancellation
  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel || !cancellationReason.trim()) return;

    try {
      setIsCancelling(true);
      await dispatch(
        updateAppointmentStatus({
          appointmentId: appointmentToCancel._id,
          status: "canceled",
          cancellationReason: cancellationReason,
        })
      ).unwrap();

      // Refresh appointments after successful cancellation
      dispatch(
        fetchUserAppointments({
          userId: userData._id,
          page: currentPage,
          limit: 10,
        })
      );

      notification.success({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
        status: "success",
        duration: 2,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      notification.error({
        title: "Cancellation Failed",
        description:
          error.message || "Failed to cancel appointment. Please try again.",
        status: "error",
        duration: 2,
        isClosable: true,
      });
    } finally {
      setIsCancelling(false);
    }
  };

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

  // Get status color based on appointment status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "scheduled":
      case "confirmed":
        return "blue";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  // Get status icon based on appointment status
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return CheckCircle;
      case "scheduled":
      case "confirmed":
        return Calendar;
      case "pending":
        return Clock;
      case "cancelled":
        return X;
      default:
        return AlertCircle;
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId) => {
    // Implement your cancel appointment logic here
    console.log("Cancelling appointment:", appointmentId);
    // dispatch(cancelAppointment(appointmentId));
  };

  return (
    <>
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
          py={4}
          px={6}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Flex align="center">
              <Icon as={Calendar} color={primaryColor} boxSize={5} mr={3} />
              <Heading size="md" color={secondaryColor} fontWeight="semibold">
                Your Appointments
              </Heading>
            </Flex>
            <Button
              onClick={() => navigate("/book-appointment")}
              bg={primaryColor}
              color="white"
              size="sm"
              leftIcon={<Icon as={Calendar} boxSize={4} />}
              px={5}
              _hover={{
                bg: "blue.600",
                transform: "translateY(-1px)",
                boxShadow: "sm",
              }}
              _active={{
                bg: "blue.700",
                transform: "translateY(0)",
              }}
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              borderRadius="md"
              fontWeight="medium"
            >
              Schedule New
            </Button>
          </Flex>
        </CardHeader>

        <CardBody p={{ base: 4, md: 6 }}>
          {appointmentsLoading ? (
            <VStack spacing={4} align="stretch">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  height="70px"
                  borderRadius="md"
                  opacity={0.6}
                />
              ))}
            </VStack>
          ) : (
            <>
              <TableContainer
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="xs"
                overflow="hidden"
              >
                <Table variant="simple" size="md">
                  <Thead bg="gray.50">
                    <Tr>
                      {[
                        "Title",
                        "Date & Time",
                        "Hospital",
                        "Doctor",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <Th
                          key={header}
                          py={3}
                          px={4}
                          borderColor="gray.200"
                          color="gray.600"
                          fontWeight="semibold"
                          fontSize="sm"
                          textTransform="capitalize"
                        >
                          {header}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>

                  <Tbody>
                    {appointments?.appointments &&
                    appointments?.appointments.length > 0 ? (
                      appointments?.appointments.map((appointment) => {
                        const isCancellable = ![
                          "completed",
                          "canceled",
                          "rejected",
                        ].includes(appointment.status?.toLowerCase());

                        return (
                          <Tr
                            key={appointment._id}
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.2s"
                          >
                            <Td
                              py={3}
                              px={4}
                              borderColor="gray.100"
                              fontWeight="medium"
                              color={textColor}
                            >
                              {appointment.title || "Doctor Appointment"}
                            </Td>
                            <Td
                              py={3}
                              px={4}
                              borderColor="gray.100"
                              color={mutedColor}
                              whiteSpace="nowrap"
                            >
                              {formatDate(appointment.date)}
                            </Td>
                            <Td
                              py={3}
                              px={4}
                              borderColor="gray.100"
                              color={mutedColor}
                            >
                              {appointment.hospital?.name || "N/A"}
                            </Td>
                            <Td
                              py={3}
                              px={4}
                              borderColor="gray.100"
                              color={mutedColor}
                            >
                              {appointment.doctor?.fullName ||
                                appointment.fullName ||
                                "N/A"}
                            </Td>
                            <Td py={3} px={4} borderColor="gray.100">
                              <Tag
                                colorScheme={getStatusColor(appointment.status)}
                                borderRadius="full"
                                size="sm"
                                py={1}
                                px={3}
                                fontWeight="medium"
                              >
                                <Flex align="center">
                                  <Icon
                                    as={getStatusIcon(appointment.status)}
                                    boxSize={2.5}
                                    mr={1.5}
                                  />
                                  {appointment.status}
                                </Flex>
                              </Tag>
                            </Td>

                            <Td py={3} px={4} borderColor="gray.100">
                              <HStack spacing={2}>
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  variant="outline"
                                  borderRadius="md"
                                  fontWeight="medium"
                                  leftIcon={<Icon as={Eye} boxSize={3} />}
                                  onClick={() =>
                                    navigate(`/appointments/${appointment._id}`)
                                  }
                                >
                                  View
                                </Button>

                                {isCancellable && (
                                  <Button
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                    borderRadius="md"
                                    fontWeight="medium"
                                    leftIcon={<Icon as={X} boxSize={3} />}
                                    onClick={() =>
                                      initiateCancelAppointment(appointment)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      })
                    ) : (
                      <Tr>
                        <Td
                          colSpan={6}
                          textAlign="center"
                          py={12}
                          borderColor="gray.100"
                        >
                          <VStack spacing={4}>
                            <Icon as={Calendar} boxSize={12} color="gray.300" />
                            <Heading
                              size="md"
                              color={mutedColor}
                              fontWeight="medium"
                            >
                              No appointments found
                            </Heading>
                            <Text
                              color="gray.500"
                              maxW="md"
                              textAlign="center"
                              fontSize="sm"
                            >
                              You don't have any appointments scheduled yet.
                              Book your first appointment.
                            </Text>
                            <Button
                              size="sm"
                              bg={primaryColor}
                              color="white"
                              px={6}
                              py={4}
                              onClick={() => navigate("/book-appointment")}
                              borderRadius="md"
                              _hover={{
                                bg: "blue.600",
                                transform: "translateY(-1px)",
                                boxShadow: "sm",
                              }}
                              transition="all 0.2s"
                              fontWeight="medium"
                            >
                              Schedule Now
                            </Button>
                          </VStack>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>

              {appointments?.appointments &&
                appointments.appointments.length > 0 && (
                  <Flex justify="space-between" align="center" mt={6} px={2}>
                    <Text color={mutedColor} fontSize="xs" fontWeight="medium">
                      Showing {appointments.appointments.length} of{" "}
                      {appointments.totalCount} appointments
                    </Text>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      size="sm"
                    />
                  </Flex>
                )}
            </>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>
              Are you sure you want to cancel your appointment on{" "}
              <strong>
                {appointmentToCancel && formatDate(appointmentToCancel.date)}
              </strong>
              ?
            </Text>

            <FormControl>
              <FormLabel>Reason for cancellation</FormLabel>
              <Textarea
                placeholder="Please specify your reason for cancellation..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                resize="vertical"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
              isDisabled={isCancelling}
            >
              Go Back
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmCancelAppointment}
              isLoading={isCancelling}
              loadingText="Cancelling..."
            >
              Confirm Cancellation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppointmentsTab;
