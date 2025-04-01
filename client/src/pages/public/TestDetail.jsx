import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  Badge,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Select,
  List,
  ListItem,
  Stack,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Icon,
  RadioGroup,
  Radio,
  Toast,
} from "@chakra-ui/react";
import { ArrowLeft, Calendar, MapPin, Phone, Star } from "lucide-react";
import { fetchSingleMedicalTest } from "../../features/medical_test/medicalTestSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";
import { notification } from "antd";
import {
  completePayment,
  initiatePayment,
} from "../../features/payment/paymentSlice";

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

  useEffect(() => {
    if (testId) {
      dispatch(fetchSingleMedicalTest(testId));
    }
  }, [dispatch, testId]);

  const mutedColor = useColorModeValue("gray.500", "gray.400");

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
          title: "Test Booked Successfully",
          description: `Your test is confirmed. Token number: ${result.tokenNumber}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/bookings");
      }
    } catch (error) {
      console.error("Booking error:", error);
      notification.error({
        title: "Booking Failed",
        description:
          error?.message || "An error occurred while booking the test",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" />
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
    <Box flex="1" p={[4, 6]} maxW="6xl" mx="auto">
      <Button
        variant="ghost"
        mb={4}
        pl={0}
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(-1)}
      >
        Back to Tests
      </Button>

      <Grid templateColumns={["1fr", null, null, "2fr 1fr"]} gap={6}>
        <GridItem colSpan={[1, null, null, 2]}>
          <Stack spacing={6}>
            <Box
              position="relative"
              h={["64", "80"]}
              w="full"
              borderRadius="lg"
              overflow="hidden"
            >
              <Image
                src={
                  medicalTest.testImage ||
                  "/placeholder.svg?height=400&width=800"
                }
                alt={medicalTest.testName}
                fill
                className="object-cover"
              />
            </Box>

            <Box>
              <Flex align="center" gap={2} mb={2}>
                <Heading as="h1" size="xl" fontWeight="bold">
                  {medicalTest.testName}
                </Heading>
              </Flex>

              <Flex align="center" color={mutedColor} mb={4}>
                <MapPin size={16} className="mr-1" />
                <Text>
                  {medicalTest.hospital?.name || "Hospital not specified"},{" "}
                  {medicalTest.hospital?.location || "Location not specified"}
                </Text>
              </Flex>

              <Box mb={6}>
                <Heading as="h2" size="md" fontWeight="semibold" mb={2}>
                  About this Test
                </Heading>
                <Text color={mutedColor}>
                  {medicalTest.testDescription || "No description available"}
                </Text>
              </Box>

              <Box mb={6}>
                <Heading as="h2" size="md" fontWeight="semibold" mb={2}>
                  Preparation Instructions
                </Heading>
                <List spacing={1} pl={5} styleType="disc" color={mutedColor}>
                  {medicalTest.fastingRequired && (
                    <ListItem>
                      Fast for 8-10 hours before the test (water is allowed)
                    </ListItem>
                  )}
                  <ListItem>Bring your ID and insurance card</ListItem>
                  <ListItem>
                    Wear comfortable clothing with easy access to arms for blood
                    tests
                  </ListItem>
                  <ListItem>
                    Inform the technician about any medications you are taking
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading as="h2" size="md" fontWeight="semibold" mb={2}>
                  Hospital Details
                </Heading>
                <Card>
                  <CardBody p={4}>
                    <Heading as="h3" size="sm" fontWeight="bold" mb={2}>
                      {medicalTest.hospital?.name || "Hospital not specified"}
                    </Heading>
                    <Stack spacing={2} fontSize="sm">
                      <Flex align="center">
                        <MapPin size={16} className="mr-2" color={mutedColor} />
                        <Text>
                          {medicalTest.hospital?.address?.fullAddress ||
                            "Address not available"}
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Phone size={16} className="mr-2" color={mutedColor} />
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
          </Stack>
        </GridItem>

        <GridItem>
          <Card position="sticky" top="20">
            <CardBody p={6}>
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={1}>
                  ${medicalTest.testPrice?.toFixed(2) || "0.00"}
                </Text>
                {medicalTest.originalPrice && (
                  <Flex align="center" gap={2}>
                    <Text color={mutedColor} textDecoration="line-through">
                      ${medicalTest.originalPrice.toFixed(2)}
                    </Text>
                    <Badge
                      variant="outline"
                      color="green.600"
                      borderColor="green.600"
                    >
                      Save{" "}
                      {Math.round(
                        (1 -
                          medicalTest.testPrice / medicalTest.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  </Flex>
                )}
              </Box>

              {bookingError && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {bookingError}
                </Alert>
              )}

              <Stack as="form" spacing={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="bookingDate">Preferred Date</FormLabel>
                  <Box position="relative">
                    <Input
                      id="bookingDate"
                      type="date"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <Box
                      position="absolute"
                      right="3"
                      top="50%"
                      transform="translateY(-50%)"
                      color={mutedColor}
                      pointerEvents="none"
                    >
                      <Calendar size={16} />
                    </Box>
                  </Box>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="bookingTime">Preferred Time</FormLabel>
                  <Select
                    id="bookingTime"
                    placeholder="Select time slot"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                  >
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="notes">
                    Special Instructions (Optional)
                  </FormLabel>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or medical conditions we should know about"
                    resize="none"
                    value={formData.notes}
                    onChange={handleInputChange}
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
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      spacing={4}
                    >
                      <Radio value="pay_on_site" colorScheme="blue" size="lg">
                        Pay at Hospital
                      </Radio>
                      <Radio value="pay_now" colorScheme="blue" size="lg">
                        Pay Now
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

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
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}
