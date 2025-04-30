import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  FileText,
  Loader,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAppointmentById } from "../../features/appointment/appointmentSlice";

const AppointmentDetail = () => {
  const { id } = useParams();
  console.log("The appointment id", id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const appointment = useSelector(
    (state) => state.appointmentSlice.appointment
  );
  console.log("The appointment", appointment);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      dispatch(fetchAppointmentById(id))
        .unwrap()
        .then(() => setLoading(false))
        .catch((err) => {
          console.error("Error fetching appointment details:", err);
          setError(err.message || "Failed to fetch appointment details");
          setLoading(false);
        });
    }
  }, [id, dispatch]);

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const pageBg = useColorModeValue("gray.50", "gray.900");
  // Get payment status badge color
  const getPaymentStatusColorScheme = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "paid":
        return "green";
      case "not_required":
        return "gray";
      default:
        return "gray";
    }
  };

  // Get payment method display text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "pay_on_site":
        return "Pay on site";
      case "pay_now":
        return "Online payment";
      default:
        return method;
    }
  };

  // Handle back button
  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader
          className="w-12 h-12 text-blue-600 animate-spin"
          aria-label="Loading"
        />
        <p className="mt-4 text-gray-600 font-medium">
          Loading appointment details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-500" aria-label="Error" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Error Loading Appointment
        </h2>
        <p className="mt-2 text-gray-600">
          {error?.message || "An unexpected error has occured, try again later"}
        </p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          aria-label="Go back"
        >
          <ChevronLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle
          className="w-16 h-16 text-yellow-500"
          aria-label="Not found"
        />
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Appointment Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The appointment you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          aria-label="Go back"
        >
          <ChevronLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <Box bg={pageBg} minH="100vh" py={8}>
      <Container maxW="4xl" px={4}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Button
            variant="ghost"
            leftIcon={<Icon as={ChevronLeft} />}
            onClick={handleBackClick}
            color="gray.600"
            _hover={{ color: "blue.600" }}
          >
            Back to Notifications
          </Button>
          <Heading size="lg" color="gray.800">
            Appointment Details
          </Heading>
        </Flex>

        {/* Main content */}
        <Card
          bg={cardBg}
          rounded="xl"
          overflow="hidden"
          shadow="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          {/* Appointment Status Banner */}
          <Box
            p={4}
            bg={`${getStatusColor(appointment.status)}.500`}
            color="white"
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Icon
                  as={
                    appointment.status === "canceled"
                      ? XCircle
                      : appointment.status === "completed"
                      ? CheckCircle
                      : Calendar
                  }
                  boxSize={6}
                />
                <Text fontSize="lg" fontWeight="semibold">
                  {appointment.status === "canceled"
                    ? "Canceled Appointment"
                    : appointment.status === "completed"
                    ? "Completed Appointment"
                    : appointment.status === "confirmed"
                    ? "Confirmed Appointment"
                    : "Pending Appointment"}
                </Text>
              </HStack>
              <Badge
                colorScheme={getStatusColor(appointment.status)}
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
            </Flex>
          </Box>

          {/* Appointment Details */}
          <CardBody p={6}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              {/* Left Column */}
              <GridItem>
                <VStack spacing={6} align="stretch">
                  {/* Date & Time */}
                  <Card
                    bg={sectionBg}
                    variant="outline"
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <CardBody p={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        mb={2}
                      >
                        Date & Time
                      </Text>
                      <VStack spacing={3} align="stretch">
                        <HStack spacing={3}>
                          <Icon as={Calendar} boxSize={5} color="blue.500" />
                          <Text color="gray.800">
                            {formatDate(appointment.date)}
                          </Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Icon as={Clock} boxSize={5} color="blue.500" />
                          <Text color="gray.800">
                            {appointment.startTime} - {appointment.endTime}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Doctor & Hospital */}
                  <Card
                    bg={sectionBg}
                    variant="outline"
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <CardBody p={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        mb={2}
                      >
                        Healthcare Provider
                      </Text>
                      <VStack spacing={3} align="stretch">
                        <HStack spacing={3} align="start">
                          <Icon as={Stethoscope} boxSize={5} color="blue.500" />
                          <Box>
                            <Text color="gray.800" fontWeight="medium">
                              {appointment.doctor.fullName}
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                              {appointment.doctor.specialty}
                            </Text>
                          </Box>
                        </HStack>
                        <HStack spacing={3} align="start">
                          <Icon as={Building} boxSize={5} color="blue.500" />
                          <Box>
                            <Text color="gray.800" fontWeight="medium">
                              {appointment.hospital.name}
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                              {appointment.hospital.location}
                            </Text>
                          </Box>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Patient Details */}
                  <Card
                    bg={sectionBg}
                    variant="outline"
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <CardBody p={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        mb={2}
                      >
                        Patient Information
                      </Text>
                      <HStack spacing={3} align="start">
                        <Icon as={User} boxSize={5} color="blue.500" />
                        <Box>
                          <Text color="gray.800" fontWeight="medium">
                            {appointment.user.fullName}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            {appointment.user.email}
                          </Text>
                        </Box>
                      </HStack>
                    </CardBody>
                  </Card>
                </VStack>
              </GridItem>

              {/* Right Column */}
              <GridItem>
                <VStack spacing={6} align="stretch">
                  {/* Appointment Reason */}
                  <Card
                    bg={sectionBg}
                    variant="outline"
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <CardBody p={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        mb={2}
                      >
                        Reason for Visit
                      </Text>
                      <HStack spacing={3} align="start">
                        <Icon
                          as={FileText}
                          boxSize={5}
                          color="blue.500"
                          mt={1}
                        />
                        <Text color="gray.800">{appointment.reason}</Text>
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* Payment Details */}
                  <Card
                    bg={sectionBg}
                    variant="outline"
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <CardBody p={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                        mb={2}
                      >
                        Payment Information
                      </Text>
                      <VStack spacing={3} align="stretch">
                        <HStack spacing={3}>
                          <Icon as={CreditCard} boxSize={5} color="blue.500" />
                          <Box>
                            <Text color="gray.800" fontWeight="medium">
                              Payment Method
                            </Text>
                            <Text color="gray.600">
                              {getPaymentMethodText(appointment.paymentMethod)}
                            </Text>
                          </Box>
                        </HStack>
                        <HStack spacing={3}>
                          <Flex align="center">
                            <Badge
                              colorScheme={getPaymentStatusColorScheme(
                                appointment.paymentStatus
                              )}
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                            >
                              {appointment.paymentStatus
                                .charAt(0)
                                .toUpperCase() +
                                appointment.paymentStatus.slice(1)}
                            </Badge>
                          </Flex>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Rejection Reason (if applicable) */}
                  {appointment.status === "canceled" &&
                    appointment.rejectionReason && (
                      <Card
                        bg="red.50"
                        borderColor="red.100"
                        borderWidth="1px"
                        borderRadius="lg"
                        shadow="sm"
                      >
                        <CardBody p={4}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="red.500"
                            mb={2}
                          >
                            Cancellation Reason
                          </Text>
                          <HStack spacing={3} align="start">
                            <Icon
                              as={AlertCircle}
                              boxSize={5}
                              color="red.500"
                              mt={1}
                            />
                            <Text color="gray.800">
                              {appointment.rejectionReason}
                            </Text>
                          </HStack>
                        </CardBody>
                      </Card>
                    )}

                  {/* Action Buttons */}
                  <VStack spacing={3} mt={2}>
                    {appointment.status === "pending" && (
                      <Button
                        colorScheme="red"
                        leftIcon={<Icon as={XCircle} />}
                        size="lg"
                        width="full"
                        shadow="sm"
                      >
                        Cancel Appointment
                      </Button>
                    )}
                  </VStack>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default AppointmentDetail;
