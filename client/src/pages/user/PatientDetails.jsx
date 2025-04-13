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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Image,
  Tooltip,
  Link,
  Spacer,
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
  FaCheckCircle,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaCreditCard,
  FaMoneyBill,
  FaPhone,
  FaEnvelope,
  FaStar,
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
    paymentMethod: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(true);
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state?.auth?.user?.data?._id);
  const doctor = useSelector((state) => state?.doctorSlice?.doctor);

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const primaryColor = useColorModeValue("blue.600", "blue.400");
  const secondaryColor = useColorModeValue("blue.700", "blue.300");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const successColor = useColorModeValue("green.50", "green.900");
  const successBorder = useColorModeValue("green.200", "green.700");
  const headerBg = useColorModeValue("blue.600", "blue.800");

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
          console.log("The result of payment completion is", result);

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
      console.log("the result in book appointment ", result)

      if (formData.paymentMethod === "pay_now") {
        console.log("enetered the pay_now")
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
        console.log("The payment response is", paymentResponse);

        window.location.href = paymentResponse?.data?.payment_url || paymentResponse.payment_url;
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
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
      <Container maxW="container.lg">
        {/* Progress Steps */}
        <Box 
          mb={8} 
          bg={bgColor} 
          p={4} 
          borderRadius="lg" 
          boxShadow="sm" 
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex 
            justify="space-between" 
            align="center" 
            mb={4}
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <Heading size="md" color={primaryColor}>
              <Icon as={FaUserMd} mr={2} />
              Complete Your Booking
            </Heading>
            <Badge colorScheme="blue" p={2} borderRadius="md" fontSize="sm">
              Step 4 of 5
            </Badge>
          </Flex>
          
          <Progress 
            value={80} 
            size="sm" 
            colorScheme="blue" 
            borderRadius="full" 
            mb={4}
          />
          
          <Flex justify="space-between" fontSize="sm" color={mutedColor} px={1}>
            <Text>Select Specialty</Text>
            <Text>Choose Doctor</Text>
            <Text>Select Time</Text>
            <Text fontWeight="bold" color={primaryColor}>Patient Details</Text>
            <Text>Confirmation</Text>
          </Flex>
        </Box>

        <Box
          bg={bgColor}
          borderRadius="xl"
          boxShadow="md"
          overflow="hidden"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box p={6} bg={headerBg} color="white">
            <Breadcrumb separator="›" color="white" opacity="0.8" fontSize="sm" mb={3}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/book-appointment">
                  Specialties
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/select-doctor">Doctors</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/book-appointment/select-time/${doctorId}`}>Time Slots</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontWeight="bold">Patient Details</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading size="lg">
              Complete Your Appointment
            </Heading>
            <Text mt={2} fontSize="md" opacity="0.9">
              Please review your appointment details and provide additional information
            </Text>
          </Box>

          <VStack spacing={8} align="stretch" p={{ base: 4, md: 8 }}>
            {/* Appointment Summary Card */}
            <Card
              borderRadius="xl"
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
                px={4}
                py={2}
                borderBottomLeftRadius="xl"
              >
                <Text fontWeight="bold">Appointment Summary</Text>
              </Box>

              <CardHeader pt={12} pb={0}>
                <Heading size="md" color={secondaryColor}>
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
                      gap={6}
                    >
                      <Avatar
                        src={
                          doctor?.doctorProfileImage ||
                          "https://via.placeholder.com/150"
                        }
                        size="2xl"
                        border="4px solid"
                        borderColor="blue.400"
                        boxShadow="lg"
                      />
                      <Box textAlign={{ base: "center", md: "left" }}>
                        <Text fontWeight="bold" fontSize="2xl" color="blue.800">
                          Dr. {doctor?.fullName || "Loading..."}
                        </Text>
                        <HStack
                          mt={2}
                          flexWrap="wrap"
                          justify={{ base: "center", md: "flex-start" }}
                          spacing={3}
                        >
                          <Badge
                            colorScheme="blue"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                          >
                            <Flex align="center">
                              <Icon as={FaStethoscope} mr={2} />
                              {doctor?.specialization || "Specialist"}
                            </Flex>
                          </Badge>
                          {doctor?.qualifications &&
                            doctor.qualifications.length > 0 && (
                              <Badge
                                colorScheme="green"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="sm"
                              >
                                <Flex align="center">
                                  <Icon as={FaUserGraduate} mr={2} />
                                  {doctor.qualifications[0].degree}
                                </Flex>
                              </Badge>
                            )}
                          <Badge
                            colorScheme="yellow"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                          >
                            <Flex align="center">
                              <Icon as={FaStar} mr={2} />
                              4.8 (120 reviews)
                            </Flex>
                          </Badge>
                        </HStack>
                        <Text fontSize="md" color="gray.600" mt={3}>
                          {doctor?.yearsOfExperience
                            ? `${doctor.yearsOfExperience} years of experience`
                            : "Experienced Healthcare Professional"}
                        </Text>
                        <HStack mt={4} spacing={4}>
                          <Button 
                            size="sm" 
                            leftIcon={<FaPhone />} 
                            colorScheme="blue" 
                            variant="outline"
                            borderRadius="full"
                          >
                            Contact
                          </Button>
                          <Button 
                            size="sm" 
                            leftIcon={<FaEnvelope />} 
                            colorScheme="blue" 
                            variant="outline"
                            borderRadius="full"
                          >
                            Message
                          </Button>
                        </HStack>
                      </Box>
                    </Flex>

                    <Divider mb={6} />

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {/* Appointment Time & Date Section */}
                      <Box
                        p={5}
                        borderRadius="lg"
                        bg={cardBg}
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor={borderColor}
                        transition="transform 0.3s"
                        _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                      >
                        <Heading size="sm" mb={4} color={secondaryColor}>
                          <Flex align="center">
                            <Icon as={FaCalendarAlt} mr={2} />
                            Appointment Schedule
                          </Flex>
                        </Heading>
                        <VStack spacing={5} align="stretch">
                          <Flex align="center">
                            <Icon
                              as={FaCalendarAlt}
                              color="blue.500"
                              mr={4}
                              boxSize={6}
                            />
                            <Box>
                              <Text fontSize="sm" color="gray.500">
                                Date
                              </Text>
                              <Text fontWeight="bold">{formatDate(date)}</Text>
                            </Box>
                          </Flex>

                          <Flex align="center">
                            <Icon
                              as={FaClock}
                              color="blue.500"
                              mr={4}
                              boxSize={6}
                            />
                            <Box>
                              <Text fontSize="sm" color="gray.500">
                                Time
                              </Text>
                              <Text fontWeight="bold">
                                {formatTime(startTime)}
                              </Text>
                            </Box>
                          </Flex>
                        </VStack>
                      </Box>

                      {/* Hospital Location Section */}
                      <Box
                        p={5}
                        borderRadius="lg"
                        bg={cardBg}
                        boxShadow="sm"
                        borderWidth="1px"
                        borderColor={borderColor}
                        transition="transform 0.3s"
                        _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                      >
                        <Heading size="sm" mb={4} color={secondaryColor}>
                          <Flex align="center">
                            <Icon as={FaHospital} mr={2} />
                            Hospital Information
                          </Flex>
                        </Heading>
                        <VStack spacing={5} align="stretch">
                          <Flex align="center">
                            <Icon
                              as={FaHospital}
                              color="blue.500"
                              mr={4}
                              boxSize={6}
                            />
                            <Box>
                              <Text fontSize="sm" color="gray.500">
                                Hospital
                              </Text>
                              <Text fontWeight="bold">
                                {doctor?.hospital?.name || "Not specified"}
                              </Text>
                            </Box>
                          </Flex>

                          <Flex align="center">
                            <Icon
                              as={FaMapMarkerAlt}
                              color="blue.500"
                              mr={4}
                              boxSize={6}
                            />
                            <Box>
                              <Text fontSize="sm" color="gray.500">
                                Location
                              </Text>
                              <Text fontWeight="bold">
                                {doctor?.hospital?.location || "Not specified"}
                              </Text>
                              {doctor?.hospital?.location && (
                                <Link 
                                  href="#" 
                                  color="blue.500" 
                                  fontSize="sm"
                                  display="inline-flex"
                                  alignItems="center"
                                  mt={1}
                                >
                                  View on map <Icon as={FaArrowRight} ml={1} boxSize={3} />
                                </Link>
                              )}
                            </Box>
                          </Flex>
                        </VStack>
                      </Box>
                    </SimpleGrid>

                    {doctor?.consultationFee && (
                      <Flex
                        mt={6}
                        bg={successColor}
                        p={4}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={successBorder}
                        align="center"
                        justify="space-between"
                      >
                        <Flex align="center">
                          <Icon
                            as={FaMoneyBillWave}
                            color="green.500"
                            mr={4}
                            boxSize={6}
                          />
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Consultation Fee
                            </Text>
                            <Text fontWeight="bold" color="green.700" fontSize="xl">
                              ${doctor.consultationFee}
                            </Text>
                          </Box>
                        </Flex>
                        <Tooltip label="This is the standard consultation fee for this specialist" hasArrow>
                          <Icon as={FaInfoCircle} color="gray.400" boxSize={5} cursor="help" />
                        </Tooltip>
                      </Flex>
                    )}
                  </>
                )}
              </CardBody>
            </Card>

            <Card variant="outline" borderRadius="xl" boxShadow="md">
              <CardHeader pb={2} bg={highlightColor}>
                <Heading size="md" color={secondaryColor}>
                  <Flex align="center">
                    <Icon as={FaInfoCircle} mr={2} />
                    Patient Information
                  </Flex>
                </Heading>
              </CardHeader>
              <CardBody pt={6}>
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
                    resize="vertical"
                    _hover={{ borderColor: "blue.300" }}
                  />
                  <Text fontSize="xs" color={mutedColor} mt={2}>
                    This information helps the doctor prepare for your appointment. Please be specific about your symptoms.
                  </Text>
                </FormControl>

                <FormControl as="fieldset" isRequired mb={6}>
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
                    <Stack direction={{ base: "column", md: "row" }} spacing={6}>
                      <Radio 
                        value="pay_on_site" 
                        colorScheme="blue" 
                        size="lg"
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={formData.paymentMethod === "pay_on_site" ? "blue.500" : "gray.200"}
                        _checked={{ bg: "blue.50" }}
                      >
                        <Flex align="center">
                          <Icon as={FaMoneyBill} mr={3} color="green.500" />
                          <Box>
                            <Text fontWeight="medium">Pay at Hospital</Text>
                            <Text fontSize="xs" color={mutedColor}>Pay in cash or card at the hospital</Text>
                          </Box>
                        </Flex>
                      </Radio>
                      <Radio 
                        value="pay_now" 
                        colorScheme="blue" 
                        size="lg"
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={formData.paymentMethod === "pay_now" ? "blue.500" : "gray.200"}
                        _checked={{ bg: "blue.50" }}
                      >
                        <Flex align="center">
                          <Icon as={FaCreditCard} mr={3} color="blue.500" />
                          <Box>
                            <Text fontWeight="medium">Pay Now</Text>
                            <Text fontSize="xs" color={mutedColor}>Secure online payment</Text>
                          </Box>
                        </Flex>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {formData.paymentMethod && (
                  <Alert 
                    status={formData.paymentMethod === "pay_now" ? "info" : "success"} 
                    variant="subtle"
                    borderRadius="md"
                    mb={6}
                  >
                    <AlertIcon />
                    <Box>
                      <AlertTitle>
                        {formData.paymentMethod === "pay_now" 
                          ? "Online Payment" 
                          : "Pay at Hospital"}
                      </AlertTitle>
                      <AlertDescription>
                        {formData.paymentMethod === "pay_now" 
                          ? "You'll be redirected to our secure payment gateway to complete your payment." 
                          : "Please arrive 15 minutes before your appointment time to complete the payment."}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                <Flex 
                  bg="blue.50" 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor="blue.200"
                  align="center"
                  mb={6}
                >
                  <Icon as={FaShieldAlt} color="blue.500" boxSize={6} mr={4} />
                  <Box>
                    <Text fontWeight="medium" color="blue.700">Your information is secure</Text>
                    <Text fontSize="sm" color={mutedColor}>
                      All personal and medical information is encrypted and protected
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>

            <Flex 
              direction={{ base: "column", md: "row" }} 
              justify="space-between"
              gap={4}
            >
              <Button
                leftIcon={<FaArrowLeft />}
                variant="outline"
                colorScheme="blue"
                size="lg"
                onClick={() => navigate(-1)}
                borderRadius="md"
              >
                Back
              </Button>
              <Spacer display={{ base: "none", md: "block" }} />
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSubmit}
                isLoading={isLoading}
                borderRadius="md"
                py={6}
                fontWeight="bold"
                rightIcon={<FaArrowRight />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
                isDisabled={!formData.paymentMethod || !formData.reason.trim()}
                loadingText={formData.paymentMethod === "pay_now" ? "Processing..." : "Confirming..."}
                width={{ base: "full", md: "auto" }}
              >
                {formData.paymentMethod === "pay_now"
                  ? "Proceed to Payment"
                  : "Confirm Appointment"}
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default PatientDetails;