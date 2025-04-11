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
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { fetchAvailableTimeSlots } from "../../features/appointment/appointmentSlice";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SelectTime = () => {
  const { doctorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { availableSlots, loading, error } = useSelector(
    (state) => state.appointmentSlice
  );

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
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
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
    const month = (selectedDayData.month + 1).toString().padStart(2, "0");
    const day = selectedDayData.day.toString().padStart(2, "0");
    const dateStr = `${currentYear}-${month}-${day}`;
    setSelectedDate(dateStr);
  };

  // Fetch available time slots when the selected date changes
  useEffect(() => {
    dispatch(fetchAvailableTimeSlots({ doctorId, date: selectedDate }));
  }, [doctorId, selectedDate, dispatch]);

  // Handle navigation to the next step
  const handleNext = () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    navigate(
      `/book-appointment/patient-details/${doctorId}/${selectedDate}/${selectedSlot}`
    );
  };

  // Group time slots into morning, afternoon, and evening
  const groupTimeSlots = (slots) => {
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
    const [hour, minute] = slot.split(":").map(Number);
    const slotTime = new Date(
      currentYear,
      currentMonth,
      selectedDay,
      hour,
      minute
    );
    const now = new Date();
    return slotTime < now;
  };

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Container maxW="container.md" py={8}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/select-specialty" color="blue.500">
            Select Specialty
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/select-doctor" color="blue.500">
            Choose Doctor
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem fontWeight="bold">
          <BreadcrumbLink color="blue.500">Book Appointment</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Patient Details</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Confirmation</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Heading and Step Indicator */}
      <Heading size="md" color="blue.500" mb={4}>
        Select Time Slot
      </Heading>
      <Box mb={8} textAlign="right">
        <Text fontSize="sm" color="gray.500">
          Step 3 of 5
        </Text>
      </Box>

      {/* Doctor Details Card */}
      <Card
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        bg={cardBg}
        borderColor={borderColor}
        mb={6}
      >
        <CardBody>
          {/* Doctor Info */}
          <Flex align="center" mb={6}>
            <Avatar src="/doctor-placeholder-1.jpg" size="md" mr={4} />
            <Box>
              <Text fontWeight="bold" color="blue.500">
                Dr. Sarah Wilson
              </Text>
              <Text fontSize="sm" color="gray.600">
                Cardiologist, MD
              </Text>
              <Text fontSize="sm" color="blue.400" mt={1}>
                $100 per visit
              </Text>
            </Box>
          </Flex>

          <Divider mb={6} />

          {/* Calendar Navigation */}
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="medium" color="gray.700">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Flex>
              <IconButton
                icon={<ChevronLeftIcon />}
                variant="ghost"
                colorScheme="blue"
                aria-label="Previous month"
                onClick={handlePreviousMonth}
                mr={2}
              />
              <IconButton
                icon={<ChevronRightIcon />}
                variant="ghost"
                colorScheme="blue"
                aria-label="Next month"
                onClick={handleNextMonth}
              />
            </Flex>
          </Flex>

          {/* Calendar Days */}
          <SimpleGrid columns={7} spacing={2} mb={6}>
            {daysOfWeek.map((day) => (
              <Box
                key={day}
                textAlign="center"
                fontSize="sm"
                fontWeight="medium"
                color="gray.500"
                py={1}
              >
                {day}
              </Box>
            ))}
            {calendarDays.map((date, index) => {
              const isPastDate =
                date.day &&
                new Date(currentYear, date.month, date.day) <
                  new Date(currentYearValue, currentMonthIndex, currentDate);
              const isCurrentDate =
                date.day === currentDate &&
                currentMonth === currentMonthIndex &&
                currentYear === currentYearValue;

              return (
                <Button
                  key={index}
                  size="sm"
                  variant={
                    index === selectedDay
                      ? "solid"
                      : isCurrentDate
                      ? "outline"
                      : "ghost"
                  }
                  colorScheme={
                    isCurrentDate
                      ? "green"
                      : index === selectedDay
                      ? "blue"
                      : "gray"
                  }
                  borderRadius="md"
                  onClick={() => handleDateSelection(index)}
                  isDisabled={!date.day || isPastDate}
                  opacity={!date.day || isPastDate ? 0.5 : 1}
                  _disabled={{ opacity: 0.5 }}
                >
                  {date.day || ""}
                </Button>
              );
            })}
          </SimpleGrid>

          <Divider mb={6} />

          {/* Loading State */}
          {loading && (
            <Flex justify="center" my={8}>
              <Text color="gray.500">Loading time slots...</Text>
            </Flex>
          )}

          {/* Error State */}
          {error && (
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Time Slots */}
          {!loading && !error && (
            <VStack spacing={6} align="stretch">
              {/* Morning Slots */}
              <Box>
                <Flex align="center" mb={4}>
                  <Badge colorScheme="blue" borderRadius="full" px={2} mr={2}>
                    •
                  </Badge>
                  <Text fontWeight="medium" color="gray.700">
                    Morning
                  </Text>
                </Flex>
                <HStack spacing={4} mb={6} wrap="wrap">
                  {morning.length > 0 ? (
                    morning.map((slot) => {
                      const isPast = isPastTimeSlot(slot);
                      return (
                        <Button
                          key={slot}
                          size="md"
                          variant={selectedSlot === slot ? "solid" : "outline"}
                          colorScheme={isPast ? "gray" : "blue"}
                          onClick={() => !isPast && setSelectedSlot(slot)}
                          borderRadius="md"
                          isDisabled={isPast}
                          opacity={isPast ? 0.5 : 1}
                          _disabled={{ opacity: 0.5 }}
                        >
                          {slot}
                        </Button>
                      );
                    })
                  ) : (
                    <Text color="gray.500">No morning slots available</Text>
                  )}
                </HStack>
              </Box>

              {/* Afternoon Slots */}
              <Box>
                <Flex align="center" mb={4}>
                  <Badge colorScheme="blue" borderRadius="full" px={2} mr={2}>
                    •
                  </Badge>
                  <Text fontWeight="medium" color="gray.700">
                    Afternoon
                  </Text>
                </Flex>
                <HStack spacing={4} mb={6} wrap="wrap">
                  {afternoon.length > 0 ? (
                    afternoon.map((slot) => {
                      const isPast = isPastTimeSlot(slot);
                      return (
                        <Button
                          key={slot}
                          size="md"
                          variant={selectedSlot === slot ? "solid" : "outline"}
                          colorScheme={isPast ? "gray" : "blue"}
                          onClick={() => !isPast && setSelectedSlot(slot)}
                          borderRadius="md"
                          isDisabled={isPast}
                          opacity={isPast ? 0.5 : 1}
                          _disabled={{ opacity: 0.5 }}
                        >
                          {slot}
                        </Button>
                      );
                    })
                  ) : (
                    <Text color="gray.500">No afternoon slots available</Text>
                  )}
                </HStack>
              </Box>

              {/* Evening Slots */}
              <Box>
                <Flex align="center" mb={4}>
                  <Badge colorScheme="blue" borderRadius="full" px={2} mr={2}>
                    •
                  </Badge>
                  <Text fontWeight="medium" color="gray.700">
                    Evening
                  </Text>
                </Flex>
                <HStack spacing={4} mb={6} wrap="wrap">
                  {evening.length > 0 ? (
                    evening.map((slot) => {
                      const isPast = isPastTimeSlot(slot);
                      return (
                        <Button
                          key={slot}
                          size="md"
                          variant={selectedSlot === slot ? "solid" : "outline"}
                          colorScheme={isPast ? "gray" : "blue"}
                          onClick={() => !isPast && setSelectedSlot(slot)}
                          borderRadius="md"
                          isDisabled={isPast}
                          opacity={isPast ? 0.5 : 1}
                          _disabled={{ opacity: 0.5 }}
                        >
                          {slot}
                        </Button>
                      );
                    })
                  ) : (
                    <Text color="gray.500">No evening slots available</Text>
                  )}
                </HStack>
              </Box>
            </VStack>
          )}
        </CardBody>
      </Card>

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
          Next
        </Button>
      </Flex>
    </Container>
  );
};

export default SelectTime;
