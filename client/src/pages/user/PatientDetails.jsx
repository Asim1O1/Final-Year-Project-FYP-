import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  RadioGroup,
  Radio,
  Button,
  Stack,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
  Avatar,
  Divider,
  Badge,
  Skeleton,
  Container,
  Card,
  CardBody,
  CardHeader,
  Icon,
  useColorModeValue,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { bookAppointment } from "../../features/appointment/appointmentSlice";
import { fetchSingleDoctor } from "../../features/doctor/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaMoneyBillWave,
  FaHospital,
  FaStethoscope,
  FaUserGraduate,
} from "react-icons/fa";
import { notification } from "antd";
import {
  initiatePayment,
  completePayment,
} from "../../features/payment/paymentSlice"; // Import payment thunks

const PatientDetails = () => {
  const { doctorId, date, startTime } = useParams();
  const [formData, setFormData] = useState({
    reason: "",
    hospitalId: "",
    paymentMethod: "pay_on_site",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(true);
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state?.auth?.user?.data?._id);

  const doctor = useSelector((state) => state?.doctorSlice?.doctor);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const cardBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const handlePaymentCompletion = async () => {
      try {
        const pidx = searchParams.get("pidx");
        const transaction_id = searchParams.get("transaction_id");
        const amount = searchParams.get("amount");
        const purchase_order_id = searchParams.get("purchase_order_id");

        if (pidx && transaction_id && amount && purchase_order_id) {
          const result = await dispatch(
            completePayment({ pidx, transaction_id, amount, purchase_order_id })
          ).unwrap();

          if (result.IsSuccess) {
            notification.success({
              message: "Payment Successful",
              description: "Your payment has been completed successfully.",
              duration: 3,
              placement: "topRight",
            });
            navigate("/payment-success", {
              state: { transactionDetails: result },
            });
          } else {
            throw new Error("Payment verification failed.");
          }
        }
      } catch (error) {
        notification.error({
          message: "Payment Failed",
          description: error.message || "Payment verification failed.",
          duration: 3,
          placement: "topRight",
        });
        navigate("/payment-failed");
      }
    };

    handlePaymentCompletion();
  }, [searchParams, dispatch, navigate]);

  useEffect(() => {
    const loadDoctorInfo = async () => {
      setIsLoadingDoctor(true);
      try {
        await dispatch(fetchSingleDoctor(doctorId)).unwrap();
      } catch (error) {
        notification.error({
          title: "Error Loading Doctor Information",
          description: error.message || "Could not fetch doctor details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingDoctor(false);
      }
    };

    loadDoctorInfo();
  }, [dispatch, doctorId, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = async () => {
    if (!formData.reason.trim()) {
      notification.error({
        message: "Required Field Missing",
        description: "Please provide a reason for your appointment.",
        duration: 3,
        placement: "topRight",
      });
      return;
    }

    const appointmentData = {
      userId,
      doctorId,
      date,
      startTime,
      reason: formData.reason,
      hospitalId: doctor?.hospital?._id,
      paymentMethod: formData.paymentMethod,
    };

    setIsLoading(true);

    try {
      // First, create the appointment regardless of payment method
      const result = await dispatch(bookAppointment(appointmentData)).unwrap();

      if (formData.paymentMethod === "pay_now") {
        // Get the appointmentId from the result
        const appointmentId = result.data.appointmentId;

        // Now initiate Khalti payment with the new appointmentId
        const paymentResponse = await dispatch(
          initiatePayment({
            userId,
            bookingId: appointmentId,
            amount: doctor.consultationFee,
            bookingType: "appointment",
          })
        ).unwrap();

        window.location.href = paymentResponse.payment_url;
      } else {
        // For pay_on_site, just show success and redirect
        notification.success({
          title: "Appointment Booked",
          description: result.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/appointment-success");
      }
    } catch (error) {
      console.log("The error is", error);
      notification.error({
        title: "Booking Failed",
        description:
          error?.message || "An error occurred while booking the appointment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container maxW="container.lg" py={8}>
      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Box p={5} bg="blue.600" color="white">
          <Breadcrumb separator="›" color="white" opacity="0.8" fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="/book-appointment">
                Specialties
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Doctors</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Time Slots</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink fontWeight="bold">Patient Details</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading size="lg" mt={2}>
            Complete Your Appointment
          </Heading>
        </Box>

        <VStack spacing={6} align="stretch" p={6}>
          {/* Appointment Summary Card */}
          <Card
            borderRadius="md"
            variant="outline"
            boxShadow="md"
            bg={highlightColor}
            borderColor="blue.200"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              right="0"
              bg="blue.500"
              color="white"
              px={3}
              py={1}
              borderBottomLeftRadius="md"
            >
              <Text fontWeight="bold">Appointment Details</Text>
            </Box>

            <CardHeader pt={10} pb={0}>
              <Heading size="md" color="blue.600">
                <Icon as={FaUserMd} mr={2} />
                Your Appointment with
              </Heading>
            </CardHeader>

            <CardBody>
              {isLoadingDoctor ? (
                <VStack align="stretch" spacing={4}>
                  <Skeleton height="60px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </VStack>
              ) : (
                <>
                  <Flex
                    mb={6}
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "center", md: "flex-start" }}
                    gap={4}
                  >
                    <Avatar
                      src={
                        doctor?.doctorProfileImage ||
                        "https://via.placeholder.com/150"
                      }
                      size="xl"
                      border="3px solid"
                      borderColor="blue.400"
                    />
                    <Box textAlign={{ base: "center", md: "left" }}>
                      <Text fontWeight="bold" fontSize="xl" color="blue.800">
                        Dr. {doctor?.fullName || "Loading..."}
                      </Text>
                      <HStack
                        mt={2}
                        flexWrap="wrap"
                        justify={{ base: "center", md: "flex-start" }}
                      >
                        <Badge
                          colorScheme="blue"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          <Flex align="center">
                            <Icon as={FaStethoscope} mr={1} />
                            {doctor?.specialization || "Specialist"}
                          </Flex>
                        </Badge>
                        {doctor?.qualifications &&
                          doctor.qualifications.length > 0 && (
                            <Badge
                              colorScheme="green"
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              <Flex align="center">
                                <Icon as={FaUserGraduate} mr={1} />
                                {doctor.qualifications[0].degree}
                              </Flex>
                            </Badge>
                          )}
                      </HStack>
                      <Text fontSize="sm" color="gray.600" mt={2}>
                        {doctor?.yearsOfExperience
                          ? `${doctor.yearsOfExperience} years of experience`
                          : "Experienced Healthcare Professional"}
                      </Text>
                    </Box>
                  </Flex>

                  <Divider mb={6} />

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Appointment Time & Date Section */}
                    <Box
                      p={4}
                      borderRadius="md"
                      bg={cardBg}
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="sm" mb={4} color="blue.700">
                        Appointment Schedule
                      </Heading>
                      <VStack spacing={4} align="stretch">
                        <Flex align="center">
                          <Icon
                            as={FaCalendarAlt}
                            color="blue.500"
                            mr={3}
                            boxSize={5}
                          />
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              Date
                            </Text>
                            <Text fontWeight="medium">{formatDate(date)}</Text>
                          </Box>
                        </Flex>

                        <Flex align="center">
                          <Icon
                            as={FaClock}
                            color="blue.500"
                            mr={3}
                            boxSize={5}
                          />
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              Time
                            </Text>
                            <Text fontWeight="medium">
                              {formatTime(startTime)}
                            </Text>
                          </Box>
                        </Flex>
                      </VStack>
                    </Box>

                    {/* Hospital Location Section */}
                    <Box
                      p={4}
                      borderRadius="md"
                      bg={cardBg}
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="sm" mb={4} color="blue.700">
                        Hospital Information
                      </Heading>
                      <VStack spacing={4} align="stretch">
                        <Flex align="center">
                          <Icon
                            as={FaHospital}
                            color="blue.500"
                            mr={3}
                            boxSize={5}
                          />
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              Hospital
                            </Text>
                            <Text fontWeight="medium">
                              {doctor?.hospital?.name || "Not specified"}
                            </Text>
                          </Box>
                        </Flex>

                        <Flex align="center">
                          <Icon
                            as={FaMapMarkerAlt}
                            color="blue.500"
                            mr={3}
                            boxSize={5}
                          />
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              Location
                            </Text>
                            <Text fontWeight="medium">
                              {doctor?.hospital?.location || "Not specified"}
                            </Text>
                          </Box>
                        </Flex>
                      </VStack>
                    </Box>
                  </SimpleGrid>

                  {doctor?.consultationFee && (
                    <Flex
                      mt={6}
                      bg="green.50"
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="green.200"
                      align="center"
                    >
                      <Icon
                        as={FaMoneyBillWave}
                        color="green.500"
                        mr={3}
                        boxSize={5}
                      />
                      <Box>
                        <Text fontSize="sm" color="gray.600">
                          Consultation Fee
                        </Text>
                        <Text fontWeight="bold" color="green.700">
                          {doctor.consultationFee}
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </>
              )}
            </CardBody>
          </Card>

          <Card variant="outline" borderRadius="md" boxShadow="md">
            <CardHeader pb={2}>
              <Heading size="md">Patient Information</Heading>
            </CardHeader>
            <CardBody>
              <FormControl isRequired mb={6}>
                <FormLabel fontWeight="medium">
                  Reason for Appointment
                </FormLabel>
                <Textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please describe your symptoms or reason for this appointment"
                  rows={4}
                  focusBorderColor="blue.400"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl as="fieldset" isRequired>
                <FormLabel as="legend" fontWeight="medium">
                  <Flex align="center">
                    <Icon as={FaMoneyBillWave} color="green.500" mr={2} />
                    Payment Method
                  </Flex>
                </FormLabel>
                <RadioGroup
                  onChange={handleRadioChange}
                  value={formData.paymentMethod}
                >
                  <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                    <Radio value="pay_on_site" colorScheme="blue" size="lg">
                      Pay at Hospital
                    </Radio>
                    <Radio value="pay_now" colorScheme="blue" size="lg">
                      Pay Now
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </CardBody>
          </Card>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
            borderRadius="md"
            py={6}
            fontWeight="bold"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            {formData.paymentMethod === "pay_now"
              ? "Proceed to Payment"
              : "Confirm Appointment"}
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default PatientDetails;
