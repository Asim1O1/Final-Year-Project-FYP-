import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  Avatar,
  Button,
  SimpleGrid,
  Divider,
  Badge,
  IconButton,
  HStack,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
  Grid,
  GridItem,
  Icon,
  Tooltip,
  Tag,
  useToast,
  Skeleton,
  Fade,
  ScaleFade,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TimeIcon,
  CalendarIcon,
  InfoIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaUserMd,
  FaMapMarkerAlt,
  FaVideo,
  FaPhoneAlt,
} from "react-icons/fa";
import { fetchAvailableTimeSlots } from "../../features/appointment/appointmentSlice";
import StepIndicator from "../../component/common/StepIndicator";
import { notification } from "antd";
import { fetchSingleDoctor } from "../../features/doctor/doctorSlice";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SelectTime = () => {
  const { doctorId } = useParams();
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  console.log("The doctor is", doctorId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedDay, setSelectedDay] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [appointmentType, setAppointmentType] = useState("in-person");

  const userId = useSelector((state) => state?.auth?.user?.data?._id);
  const doctor = useSelector((state) => state?.doctorSlice?.doctor);
  const [doctorError, setDoctorError] = useState(null);
  const { availableSlots, loading, error } = useSelector(
    (state) => state.appointmentSlice
  );

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

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("blue.600", "blue.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const todayColor = useColorModeValue("green.500", "green.300");

  // Get today's date for comparison
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonthIndex = today.getMonth();
  const currentYearValue = today.getFullYear();

  // Generate calendar days dynamically
  const generateCalendarDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    const calendarDays = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push({ day: null, month: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({ day, month: month });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  // Handle month navigation
  const handlePreviousMonth = () => {
    // Don't allow navigating to past months
    if (
      currentMonth === currentMonthIndex &&
      currentYear === currentYearValue
    ) {
      return;
    }

    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
    setSelectedDay(null); // Reset selected day when changing months
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
    setSelectedDay(null); // Reset selected day when changing months
  };

  // Handle date selection
  const handleDateSelection = (index) => {
    const selectedDayData = calendarDays[index];
    if (!selectedDayData.day) return; // Skip empty slots

    // Check if the selected date is in the past
    const selectedDateObj = new Date(
      currentYear,
      selectedDayData.month,
      selectedDayData.day
    );
    if (
      selectedDateObj <
      new Date(currentYearValue, currentMonthIndex, currentDate)
    ) {
      return; // Disable selection for past dates
    }

    setSelectedDay(index);
    setSelectedSlot(null); // Reset selected slot when changing date
    const month = (selectedDayData.month + 1).toString().padStart(2, "0");
    const day = selectedDayData.day.toString().padStart(2, "0");
    const dateStr = `${currentYear}-${month}-${day}`;
    setSelectedDate(dateStr);
  };

  // Fetch available time slots when the selected date changes
  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchAvailableTimeSlots({ doctorId, date: selectedDate }));
    }
  }, [doctorId, selectedDate, dispatch]);

  // Handle navigation to the next step
  const handleNext = () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    navigate(
      `/book-appointment/patient-details/${doctorId}/${selectedDate}/${selectedSlot}`
    );
  };

  // Group time slots into morning, afternoon, and evening
  const groupTimeSlots = (slots) => {
    if (!slots || !Array.isArray(slots))
      return { morning: [], afternoon: [], evening: [] };

    const morning = slots.filter((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      return hour >= 8 && hour < 12; // 8:00 AM - 11:59 AM
    });

    const afternoon = slots.filter((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      return hour >= 12 && hour < 17; // 12:00 PM - 4:59 PM
    });

    const evening = slots.filter((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      return hour >= 17 && hour < 21; // 5:00 PM - 8:59 PM
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupTimeSlots(availableSlots || []);

  // Check if a time slot is in the past
  const isPastTimeSlot = (slot) => {
    if (!selectedDate) return false;

    const [hour, minute] = slot.split(":").map(Number);
    const selectedDateParts = selectedDate.split("-").map(Number);

    const slotTime = new Date(
      selectedDateParts[0],
      selectedDateParts[1] - 1,
      selectedDateParts[2],
      hour,
      minute
    );

    const now = new Date();
    return slotTime < now;
  };

  // Format time for display (24h to 12h)
  const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Get day of week for selected date
  const getDayOfWeek = () => {
    if (!selectedDate) return "";

    const dateParts = selectedDate.split("-");
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const dateParts = dateString.split("-");
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.lg" py={8}>
        {/* Header Section */}
        <Box
          bg={cardBgColor}
          p={6}
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "start", md: "center" }}
            mb={4}
          >
            <HStack mb={{ base: 4, md: 0 }}>
              <Icon
                as={FaRegCalendarAlt}
                color={primaryColor}
                boxSize={6}
                mr={2}
              />
              <Heading size="lg" color={primaryColor} fontWeight="bold">
                Book Your Appointment
              </Heading>
            </HStack>
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="outline"
              colorScheme="blue"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Back to Doctors
            </Button>
          </Flex>

          {/* Breadcrumbs */}
          <Breadcrumb
            separator={<ChevronRightIcon color={mutedColor} />}
            fontSize="sm"
            mb={6}
            spacing="8px"
            fontWeight="medium"
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/select-specialty"
                color={mutedColor}
                _hover={{ color: textColor, textDecoration: "none" }}
              >
                <HStack>
                  <Badge colorScheme="green" borderRadius="full">
                    1
                  </Badge>
                  <Text>Select Specialty</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/select-doctor"
                color={mutedColor}
                _hover={{ color: textColor, textDecoration: "none" }}
              >
                <HStack>
                  <Badge colorScheme="green" borderRadius="full">
                    2
                  </Badge>
                  <Text>Choose Doctor</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                color={primaryColor}
                fontWeight="bold"
                _hover={{ textDecoration: "none" }}
              >
                <HStack>
                  <Badge colorScheme="blue" borderRadius="full">
                    3
                  </Badge>
                  <Text>Book Appointment</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">
                    4
                  </Badge>
                  <Text>Patient Details</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink color={mutedColor} _hover={{ color: textColor }}>
                <HStack>
                  <Badge colorScheme="gray" borderRadius="full">
                    5
                  </Badge>
                  <Text>Confirmation</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <StepIndicator currentStep={3} />
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={8}>
          {/* Doctor Info Sidebar */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Doctor Card */}
              <Card
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                bg={cardBgColor}
                borderColor={borderColor}
              >
                {/* Doctor Card */}
                <Card
                  borderWidth="1px"
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="sm"
                  bg={cardBgColor}
                  borderColor={borderColor}
                >
                  <Box
                    bg={highlightColor}
                    p={4}
                    borderBottom="1px"
                    borderColor={borderColor}
                  >
                    <Heading size="sm" color={secondaryColor}>
                      Doctor Information
                    </Heading>
                  </Box>
                  <CardBody>
                    {isLoadingDoctor ? (
                      <VStack spacing={4}>
                        <Skeleton
                          borderRadius="full"
                          boxSize="120px"
                          mx="auto"
                        />
                        <Skeleton height="20px" width="80%" mx="auto" />
                        <Skeleton height="16px" width="60%" mx="auto" />
                        <Skeleton height="16px" width="40%" mx="auto" />
                      </VStack>
                    ) : doctorError ? (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <Text>{doctorError?.message || doctorError?.error || "An unexpected error occurred"}</Text>
                      </Alert>
                    ) : doctor ? (
                      <>
                        <VStack align="center" spacing={4} mb={4}>
                          <Avatar
                            src={
                              doctor?.doctorProfileImage ||
                              "/doctor-placeholder-1.jpg"
                            }
                            size="xl"
                            border="3px solid"
                            borderColor={primaryColor}
                          />
                          <Box textAlign="center">
                            <Heading size="md" color={textColor}>
                              Dr. {doctor.fullName}
                            </Heading>
                            <Text fontSize="sm" color={mutedColor}>
                              {doctor.specialty}, {doctor.qualification}
                            </Text>
                          </Box>
                        </VStack>

                        <Divider mb={4} />

                        <VStack align="start" spacing={3}>
                          <HStack>
                            <Icon as={FaMapMarkerAlt} color={primaryColor} />
                            <Text fontSize="sm">
                              {doctor.hospital?.name ||
                                "Medical Center, 123 Health St."}
                            </Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaMapMarkerAlt} color={primaryColor} />
                            <Text fontSize="sm">
                              {doctor.hospital?.location ||
                                "Medical Center, 123 Health St."}
                            </Text>
                          </HStack>

                          <HStack>
                            <Icon as={FaRegClock} color={primaryColor} />
                            <Text fontSize="sm">
                              {doctor.yearsOfExperience}+ years experience
                            </Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaPhoneAlt} color={primaryColor} />
                            <Text fontSize="sm">
                              Consultation Fee: Rs{" "}
                              {doctor.consultationFee || 100}
                            </Text>
                          </HStack>
                        </VStack>
                      </>
                    ) : (
                      <Text color={mutedColor}>
                        No doctor information available
                      </Text>
                    )}
                  </CardBody>
                </Card>
              </Card>

              {/* Appointment Type */}
              <Card
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                bg={cardBgColor}
                borderColor={borderColor}
              >
                <Box
                  bg={highlightColor}
                  p={4}
                  borderBottom="1px"
                  borderColor={borderColor}
                >
                  <Heading size="sm" color={secondaryColor}>
                    Appointment Type
                  </Heading>
                </Box>
                <CardBody>
                  <VStack spacing={3}>
                    <Button
                      variant={
                        appointmentType === "in-person" ? "solid" : "outline"
                      }
                      colorScheme="blue"
                      size="md"
                      width="full"
                      leftIcon={<FaUserMd />}
                      onClick={() => setAppointmentType("in-person")}
                      justifyContent="flex-start"
                    >
                      In-Person Visit
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Selected Appointment */}
              {selectedDate && selectedSlot && (
                <ScaleFade in={true} initialScale={0.9}>
                  <Card
                    borderWidth="1px"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="sm"
                    bg={cardBgColor}
                    borderColor={primaryColor}
                  >
                    <Box
                      bg={highlightColor}
                      p={4}
                      borderBottom="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="sm" color={secondaryColor}>
                        Selected Appointment
                      </Heading>
                    </Box>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={CalendarIcon} color={primaryColor} />
                          <Text fontWeight="medium">
                            {formatDate(selectedDate)} ({getDayOfWeek()})
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={TimeIcon} color={primaryColor} />
                          <Text fontWeight="medium">
                            {formatTime(selectedSlot)}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon
                            as={
                              appointmentType === "in-person"
                                ? FaUserMd
                                : appointmentType === "video"
                                ? FaVideo
                                : FaPhoneAlt
                            }
                            color={primaryColor}
                          />
                          <Text fontWeight="medium">
                            {appointmentType === "in-person"
                              ? "In-Person Visit"
                              : appointmentType === "video"
                              ? "Video Consultation"
                              : "Phone Consultation"}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </ScaleFade>
              )}
            </VStack>
          </GridItem>

          {/* Calendar and Time Slots */}
          <GridItem>
            <Card
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
              bg={cardBgColor}
              borderColor={borderColor}
            >
              <Box
                bg={highlightColor}
                p={4}
                borderBottom="1px"
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center">
                  <Heading size="sm" color={secondaryColor}>
                    Select Date & Time
                  </Heading>
                  <Badge
                    colorScheme="blue"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    Step 3 of 5
                  </Badge>
                </Flex>
              </Box>

              <CardBody>
                {/* Calendar Section */}
                <Box mb={6}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontWeight="bold" color={textColor} fontSize="lg">
                      {new Date(currentYear, currentMonth).toLocaleString(
                        "default",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </Text>
                    <HStack>
                      <Tooltip label="Previous Month" hasArrow>
                        <IconButton
                          icon={<ChevronLeftIcon />}
                          variant="ghost"
                          colorScheme="blue"
                          aria-label="Previous month"
                          onClick={handlePreviousMonth}
                          isDisabled={
                            currentMonth === currentMonthIndex &&
                            currentYear === currentYearValue
                          }
                        />
                      </Tooltip>
                      <Tooltip label="Next Month" hasArrow>
                        <IconButton
                          icon={<ChevronRightIcon />}
                          variant="ghost"
                          colorScheme="blue"
                          aria-label="Next month"
                          onClick={handleNextMonth}
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>

                  <SimpleGrid columns={7} spacing={2} mb={6}>
                    {daysOfWeek.map((day) => (
                      <Box
                        key={day}
                        textAlign="center"
                        fontSize="sm"
                        fontWeight="bold"
                        color={mutedColor}
                        py={2}
                        borderRadius="md"
                        bg={highlightColor}
                      >
                        {day}
                      </Box>
                    ))}
                    {calendarDays.map((date, index) => {
                      const isPastDate =
                        date.day &&
                        new Date(currentYear, date.month, date.day) <
                          new Date(
                            currentYearValue,
                            currentMonthIndex,
                            currentDate
                          );
                      const isCurrentDate =
                        date.day === currentDate &&
                        currentMonth === currentMonthIndex &&
                        currentYear === currentYearValue;

                      return (
                        <Button
                          key={index}
                          height="40px"
                          variant={
                            index === selectedDay
                              ? "solid"
                              : isCurrentDate
                              ? "outline"
                              : "ghost"
                          }
                          colorScheme={
                            index === selectedDay
                              ? "blue"
                              : isCurrentDate
                              ? "green"
                              : "gray"
                          }
                          borderRadius="md"
                          onClick={() => handleDateSelection(index)}
                          isDisabled={!date.day || isPastDate}
                          opacity={!date.day ? 0 : isPastDate ? 0.5 : 1}
                          _hover={
                            !date.day || isPastDate
                              ? {}
                              : { bg: highlightColor }
                          }
                          position="relative"
                        >
                          {date.day || ""}
                          {isCurrentDate && (
                            <Box
                              position="absolute"
                              bottom="2px"
                              left="50%"
                              transform="translateX(-50%)"
                              width="4px"
                              height="4px"
                              borderRadius="full"
                              bg={todayColor}
                            />
                          )}
                        </Button>
                      );
                    })}
                  </SimpleGrid>
                </Box>

                <Divider mb={6} />

                {/* Time Slots Section */}
                <Box>
                  <Flex align="center" mb={4}>
                    <Icon as={FaRegClock} color={primaryColor} mr={2} />
                    <Heading size="md" color={textColor}>
                      Available Time Slots
                    </Heading>
                  </Flex>

                  {/* Loading State */}
                  {loading && (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={8}
                    >
                      <Spinner
                        size="xl"
                        color={primaryColor}
                        thickness="4px"
                        mb={4}
                      />
                      <Text color={mutedColor}>
                        Loading available time slots...
                      </Text>
                    </Flex>
                  )}

                  {/* Error State */}
                  {error && (
                    <Alert status="error" mb={6} borderRadius="lg">
                      <AlertIcon />
                      <Box flex="1">
                        <Text fontWeight="bold">Error Loading Time Slots</Text>
                        <Text fontSize="sm">{error}</Text>
                      </Box>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() =>
                          dispatch(
                            fetchAvailableTimeSlots({
                              doctorId,
                              date: selectedDate,
                            })
                          )
                        }
                      >
                        Retry
                      </Button>
                    </Alert>
                  )}

                  {/* No Slots Available */}
                  {!loading &&
                    !error &&
                    (!availableSlots || availableSlots.length === 0) && (
                      <Alert status="info" mb={6} borderRadius="lg">
                        <AlertIcon />
                        <Box flex="1">
                          <Text fontWeight="bold">No Time Slots Available</Text>
                          <Text fontSize="sm">
                            There are no available appointments on{" "}
                            {formatDate(selectedDate)}. Please select another
                            date.
                          </Text>
                        </Box>
                      </Alert>
                    )}

                  {/* Time Slots */}
                  {!loading &&
                    !error &&
                    availableSlots &&
                    availableSlots.length > 0 && (
                      <VStack spacing={6} align="stretch">
                        {/* Morning Slots */}
                        <Box>
                          <Flex align="center" mb={4}>
                            <Icon as={FaSun} color="orange.400" mr={2} />
                            <Text fontWeight="bold" color={textColor}>
                              Morning
                            </Text>
                            <Text fontSize="sm" color={mutedColor} ml={2}>
                              (8:00 AM - 11:59 AM)
                            </Text>
                          </Flex>
                          <Flex wrap="wrap" gap={3}>
                            {morning.length > 0 ? (
                              morning.map((slot) => {
                                const isPast = isPastTimeSlot(slot);
                                return (
                                  <Button
                                    key={slot}
                                    size="md"
                                    variant={
                                      selectedSlot === slot
                                        ? "solid"
                                        : "outline"
                                    }
                                    colorScheme={
                                      selectedSlot === slot ? "blue" : "gray"
                                    }
                                    onClick={() =>
                                      !isPast && setSelectedSlot(slot)
                                    }
                                    borderRadius="md"
                                    isDisabled={isPast}
                                    _disabled={{
                                      opacity: 0.5,
                                      cursor: "not-allowed",
                                    }}
                                    _hover={
                                      !isPast ? { bg: highlightColor } : {}
                                    }
                                    leftIcon={
                                      selectedSlot === slot ? (
                                        <CheckIcon />
                                      ) : (
                                        <TimeIcon />
                                      )
                                    }
                                  >
                                    {formatTime(slot)}
                                  </Button>
                                );
                              })
                            ) : (
                              <Text color={mutedColor}>
                                No morning slots available
                              </Text>
                            )}
                          </Flex>
                        </Box>

                        {/* Afternoon Slots */}
                        <Box>
                          <Flex align="center" mb={4}>
                            <Icon as={FaCloudSun} color="yellow.500" mr={2} />
                            <Text fontWeight="bold" color={textColor}>
                              Afternoon
                            </Text>
                            <Text fontSize="sm" color={mutedColor} ml={2}>
                              (12:00 PM - 4:59 PM)
                            </Text>
                          </Flex>
                          <Flex wrap="wrap" gap={3}>
                            {afternoon.length > 0 ? (
                              afternoon.map((slot) => {
                                const isPast = isPastTimeSlot(slot);
                                return (
                                  <Button
                                    key={slot}
                                    size="md"
                                    variant={
                                      selectedSlot === slot
                                        ? "solid"
                                        : "outline"
                                    }
                                    colorScheme={
                                      selectedSlot === slot ? "blue" : "gray"
                                    }
                                    onClick={() =>
                                      !isPast && setSelectedSlot(slot)
                                    }
                                    borderRadius="md"
                                    isDisabled={isPast}
                                    _disabled={{
                                      opacity: 0.5,
                                      cursor: "not-allowed",
                                    }}
                                    _hover={
                                      !isPast ? { bg: highlightColor } : {}
                                    }
                                    leftIcon={
                                      selectedSlot === slot ? (
                                        <CheckIcon />
                                      ) : (
                                        <TimeIcon />
                                      )
                                    }
                                  >
                                    {formatTime(slot)}
                                  </Button>
                                );
                              })
                            ) : (
                              <Text color={mutedColor}>
                                No afternoon slots available
                              </Text>
                            )}
                          </Flex>
                        </Box>

                        {/* Evening Slots */}
                        <Box>
                          <Flex align="center" mb={4}>
                            <Icon as={FaMoon} color="purple.400" mr={2} />
                            <Text fontWeight="bold" color={textColor}>
                              Evening
                            </Text>
                            <Text fontSize="sm" color={mutedColor} ml={2}>
                              (5:00 PM - 8:59 PM)
                            </Text>
                          </Flex>
                          <Flex wrap="wrap" gap={3}>
                            {evening.length > 0 ? (
                              evening.map((slot) => {
                                const isPast = isPastTimeSlot(slot);
                                return (
                                  <Button
                                    key={slot}
                                    size="md"
                                    variant={
                                      selectedSlot === slot
                                        ? "solid"
                                        : "outline"
                                    }
                                    colorScheme={
                                      selectedSlot === slot ? "blue" : "gray"
                                    }
                                    onClick={() =>
                                      !isPast && setSelectedSlot(slot)
                                    }
                                    borderRadius="md"
                                    isDisabled={isPast}
                                    _disabled={{
                                      opacity: 0.5,
                                      cursor: "not-allowed",
                                    }}
                                    _hover={
                                      !isPast ? { bg: highlightColor } : {}
                                    }
                                    leftIcon={
                                      selectedSlot === slot ? (
                                        <CheckIcon />
                                      ) : (
                                        <TimeIcon />
                                      )
                                    }
                                  >
                                    {formatTime(slot)}
                                  </Button>
                                );
                              })
                            ) : (
                              <Text color={mutedColor}>
                                No evening slots available
                              </Text>
                            )}
                          </Flex>
                        </Box>
                      </VStack>
                    )}
                </Box>

                {/* Navigation Buttons */}
                <Flex justify="space-between" mt={8}>
                  <Button
                    variant="outline"
                    leftIcon={<ChevronLeftIcon />}
                    borderRadius="md"
                    colorScheme="blue"
                    onClick={() => navigate(-1)}
                  >
                    Previous
                  </Button>
                  <Button
                    colorScheme="blue"
                    rightIcon={<ChevronRightIcon />}
                    onClick={handleNext}
                    borderRadius="md"
                    isDisabled={!selectedSlot}
                  >
                    Continue to Patient Details
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default SelectTime;
