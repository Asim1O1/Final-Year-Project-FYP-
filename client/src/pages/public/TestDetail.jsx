import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { notification } from "antd";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
} from "lucide-react";
import { FaClipboardList, FaHospital, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchSingleMedicalTest } from "../../features/medical_test/medicalTestSlice";
import {
  completePayment,
  initiatePayment,
} from "../../features/payment/paymentSlice";

import { InfoIcon } from "@chakra-ui/icons";
import CustomLoader from "../../component/common/CustomSpinner";
import { bookMedicalTest } from "../../features/medical_test/medicalTestSlice";

export function TestDetail() {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { medicalTest, loading, error } = useSelector(
    (state) => state.medicalTestSlice
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(true);
  const userId = useSelector((state) => state?.auth?.user?.data?._id);

  const [formData, setFormData] = useState({
    name: user?.data?.fullName || "",
    phone: user?.data?.phone || "",
    email: user?.data?.email || "",
    bookingDate: "",
    bookingTime: "",
    notes: "",
    paymentMethod: "pay_on_site",
  });

  const [bookingError, setBookingError] = useState(null);

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  useEffect(() => {
    if (testId) {
      dispatch(fetchSingleMedicalTest(testId));
    }
  }, [dispatch, testId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };
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
              description: "Your test payment has been completed successfully.",
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

  const handleSubmit = async () => {
    console.log("clicked the handle submit");
    if (!formData.bookingDate || !formData.bookingTime) {
      notification.error({
        message: "Required Fields Missing",
        description: "Please select a date and time for your test.",
        duration: 3,
        placement: "topRight",
      });
      return;
    }

    const testBookingData = {
      userId,
      testId,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      hospitalId: medicalTest?.hospital?._id,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    };

    setIsLoading(true);

    try {
      // First, create the test booking regardless of payment method
      const result = await dispatch(bookMedicalTest(testBookingData)).unwrap();
      console.log("the result is ", result);

      if (formData.paymentMethod === "pay_now") {
        // Get the bookingId from the result
        const bookingId = result.bookingId;

        // Now initiate Khalti payment with the new bookingId
        const paymentResponse = await dispatch(
          initiatePayment({
            userId,
            bookingId,
            amount: medicalTest.testPrice,
            bookingType: "medical_test",
          })
        ).unwrap();
        console.log("The payment resonse is", paymentResponse);

        // Redirect to Khalti payment page
        window.location.href =
          paymentResponse.data?.data?.payment_url ||
          paymentResponse.data?.payment_url;
      } else {
        notification.success({
          message: "Test Booked Successfully",
          description: `Your test is confirmed. Token number: ${result.tokenNumber}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // navigate("/bookings");
      }
    } catch (error) {
      console.error("Booking error:", error);
      notification.error({
        message: "Booking Failed",
        description:
          error?.message || "An error occurred while booking the test",
        status: "error",
        duration: 5,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <CustomLoader size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          Error loading medicalTest details: {error}
        </Alert>
      </Box>
    );
  }

  if (!medicalTest) {
    return (
      <Box p={6}>
        <Text mb={4}>Test not found</Text>
      </Box>
    );
  }

  return (
    <Container maxW="8xl" py={8} px={[4, 6]}>
      <Button
        variant="ghost"
        mb={6}
        pl={0}
        leftIcon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
        color={accentColor}
        _hover={{ bg: highlightColor }}
        fontWeight="medium"
      >
        Back to Tests
      </Button>

      <Grid
        templateColumns={["1fr", null, null, "3fr 2fr"]}
        gap={8}
        bg={bgColor}
      >
        <GridItem colSpan={[1, null, null, 1]}>
          <Stack spacing={8}>
            <Card
              variant="outline"
              borderColor={borderColor}
              borderRadius="xl"
              boxShadow="sm"
              overflow="hidden"
            >
              <CardBody p={6}>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <HStack spacing={3} mb={2}>
                      <Heading as="h1" size="xl" fontWeight="bold">
                        {medicalTest.testName}
                      </Heading>
                    </HStack>

                    <Flex align="center" color={mutedColor} mb={4}>
                      <MapPin size={16} className="mr-2" />
                      <Text fontWeight="medium">
                        {medicalTest.hospital?.name || "Hospital not specified"}
                        ,{" "}
                        {medicalTest.hospital?.location ||
                          "Location not specified"}
                      </Text>
                    </Flex>

                    <Divider my={4} />

                    <Box mb={6}>
                      <Flex align="center" mb={3}>
                        <Icon
                          as={FaClipboardList}
                          color={accentColor}
                          mr={2}
                          boxSize={5}
                        />
                        <Heading as="h2" size="md" fontWeight="semibold">
                          About this Test
                        </Heading>
                      </Flex>
                      <Text color={mutedColor} lineHeight="tall">
                        {medicalTest.testDescription ||
                          "No description available"}
                      </Text>
                    </Box>

                    <Box mb={6}>
                      <Flex align="center" mb={3}>
                        <Icon
                          as={InfoIcon}
                          color={accentColor}
                          mr={2}
                          boxSize={5}
                        />
                        <Heading as="h2" size="md" fontWeight="semibold">
                          Preparation Instructions
                        </Heading>
                      </Flex>
                      <Card
                        bg={highlightColor}
                        variant="filled"
                        borderRadius="lg"
                        p={4}
                      >
                        <List spacing={2} pl={5} styleType="none">
                          {medicalTest.fastingRequired && (
                            <ListItem display="flex" alignItems="center">
                              <CheckCircle
                                size={16}
                                className="mr-2"
                                color={accentColor}
                              />
                              <Text fontWeight="medium">
                                Fast for 8-10 hours before the test (water is
                                allowed)
                              </Text>
                            </ListItem>
                          )}
                          <ListItem display="flex" alignItems="center">
                            <CheckCircle
                              size={16}
                              className="mr-2"
                              color={accentColor}
                            />
                            <Text fontWeight="medium">
                              Bring your ID and insurance card
                            </Text>
                          </ListItem>
                          <ListItem display="flex" alignItems="center">
                            <CheckCircle
                              size={16}
                              className="mr-2"
                              color={accentColor}
                            />
                            <Text fontWeight="medium">
                              Wear comfortable clothing with easy access to arms
                              for blood tests
                            </Text>
                          </ListItem>
                          <ListItem display="flex" alignItems="center">
                            <CheckCircle
                              size={16}
                              className="mr-2"
                              color={accentColor}
                            />
                            <Text fontWeight="medium">
                              Inform the technician about any medications you
                              are taking
                            </Text>
                          </ListItem>
                        </List>
                      </Card>
                    </Box>

                    <Box>
                      <Flex align="center" mb={3}>
                        <Icon
                          as={FaHospital}
                          color={accentColor}
                          mr={2}
                          boxSize={5}
                        />
                        <Heading as="h2" size="md" fontWeight="semibold">
                          Hospital Details
                        </Heading>
                      </Flex>
                      <Card
                        variant="outline"
                        borderColor={borderColor}
                        borderRadius="lg"
                        boxShadow="sm"
                      >
                        <CardBody p={5}>
                          <Heading as="h3" size="md" fontWeight="bold" mb={3}>
                            {medicalTest.hospital?.name ||
                              "Hospital not specified"}
                          </Heading>
                          <Stack spacing={3} fontSize="md">
                            <Flex align="center">
                              <MapPin
                                size={18}
                                className="mr-3"
                                color={accentColor}
                              />
                              <Text>
                                {medicalTest.hospital?.address?.fullAddress ||
                                  "Address not available"}
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Phone
                                size={18}
                                className="mr-3"
                                color={accentColor}
                              />
                              <Text>
                                {medicalTest.hospital?.contactNumber ||
                                  "Phone not available"}
                              </Text>
                            </Flex>
                          </Stack>
                        </CardBody>
                      </Card>
                    </Box>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Stack>
        </GridItem>

        <GridItem>
          <Card
            position="sticky"
            top="24"
            borderRadius="xl"
            overflow="hidden"
            borderColor={borderColor}
            boxShadow="lg"
          >
            <Box bg={accentColor} py={4} px={6}>
              <Heading size="md" color="white" fontWeight="semibold">
                Book Your Medical Test
              </Heading>
            </Box>

            <CardBody p={6}>
              <Box mb={6} bg={highlightColor} p={4} borderRadius="lg">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={mutedColor}
                      mb={1}
                    >
                      Test Price
                    </Text>
                    <Flex align="baseline" gap={2}>
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color={accentColor}
                      >
                        Rs {medicalTest.testPrice?.toFixed(2) || "0.00"}
                      </Text>
                      {medicalTest.originalPrice && (
                        <Text
                          color={mutedColor}
                          textDecoration="line-through"
                          fontSize="md"
                        >
                          RS. {medicalTest.originalPrice.toFixed(2)}
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Box>

              {bookingError && (
                <Alert status="error" mb={4} borderRadius="md">
                  <AlertIcon />
                  {bookingError}
                </Alert>
              )}

              <Stack as="form" spacing={5}>
                <FormControl isRequired>
                  <FormLabel htmlFor="name" fontWeight="medium">
                    Full Name
                  </FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    size="lg"
                    borderRadius="md"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: "0 0 0 1px " + accentColor,
                    }}
                  />
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel htmlFor="phone" fontWeight="medium">
                        Phone Number
                      </FormLabel>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        size="lg"
                        borderRadius="md"
                        borderColor={borderColor}
                        _focus={{
                          borderColor: accentColor,
                          boxShadow: "0 0 0 1px " + accentColor,
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel htmlFor="email" fontWeight="medium">
                        Email Address
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        size="lg"
                        borderRadius="md"
                        borderColor={borderColor}
                        _focus={{
                          borderColor: accentColor,
                          boxShadow: "0 0 0 1px " + accentColor,
                        }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel htmlFor="bookingDate" fontWeight="medium">
                        Preferred Date
                      </FormLabel>
                      <Box position="relative">
                        <Input
                          id="bookingDate"
                          type="date"
                          value={formData.bookingDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          size="lg"
                          borderRadius="md"
                          borderColor={borderColor}
                          _focus={{
                            borderColor: accentColor,
                            boxShadow: "0 0 0 1px " + accentColor,
                          }}
                        />
                        <Box
                          position="absolute"
                          right="4"
                          top="50%"
                          transform="translateY(-50%)"
                          color={mutedColor}
                          pointerEvents="none"
                        >
                          <Calendar size={18} />
                        </Box>
                      </Box>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel htmlFor="bookingTime" fontWeight="medium">
                        Preferred Time
                      </FormLabel>
                      <Box position="relative">
                        <Select
                          id="bookingTime"
                          placeholder="Select time slot"
                          value={formData.bookingTime}
                          onChange={handleInputChange}
                          size="lg"
                          borderRadius="md"
                          borderColor={borderColor}
                          _focus={{
                            borderColor: accentColor,
                            boxShadow: "0 0 0 1px " + accentColor,
                          }}
                          icon={<Clock size={18} />}
                        >
                          {availableTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl>
                  <FormLabel htmlFor="notes" fontWeight="medium">
                    Special Instructions (Optional)
                  </FormLabel>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or medical conditions we should know about"
                    resize="none"
                    value={formData.notes}
                    onChange={handleInputChange}
                    size="lg"
                    borderRadius="md"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: "0 0 0 1px " + accentColor,
                    }}
                    h="100px"
                  />
                </FormControl>

                <Box bg={highlightColor} p={4} borderRadius="lg">
                  <FormControl as="fieldset" isRequired>
                    <FormLabel as="legend" fontWeight="semibold" mb={3}>
                      <Flex align="center">
                        <Icon
                          as={FaMoneyBillWave}
                          color={accentColor}
                          mr={2}
                          boxSize={5}
                        />
                        Payment Method
                      </Flex>
                    </FormLabel>
                    <RadioGroup
                      onChange={handleRadioChange}
                      value={formData.paymentMethod}
                    >
                      <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={4}
                      >
                        <Radio
                          value="pay_on_site"
                          colorScheme="blue"
                          size="lg"
                          borderColor={borderColor}
                        >
                          <Flex align="center">Pay at Hospital</Flex>
                        </Radio>
                        <Radio
                          value="pay_now"
                          colorScheme="blue"
                          size="lg"
                          borderColor={borderColor}
                        >
                          <Flex align="center">
                            <CreditCard size={16} className="mr-1.5" />
                            Pay Now
                          </Flex>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  borderRadius="md"
                  py={7}
                  fontWeight="bold"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.3s"
                  mt={2}
                  loadingText={
                    formData.paymentMethod === "pay_now"
                      ? "Processing Payment..."
                      : "Confirming..."
                  }
                >
                  {formData.paymentMethod === "pay_now"
                    ? "Proceed to Payment"
                    : "Confirm Appointment"}
                </Button>

                <Flex align="center" justify="center" mt={2}>
                  <AlertCircle
                    size={14}
                    className="mr-1.5"
                    color={mutedColor}
                  />
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
}
