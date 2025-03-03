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

  const [selectedDay, setSelectedDay] = useState(3);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { availableSlots, loading, error } = useSelector(
    (state) => state?.appointmentSlice
  );

  const calendarDays = [
    { day: 25, month: "Feb" },
    { day: 26, month: "Feb" },
    { day: 27, month: "Feb" },
    { day: 28, month: "Feb" },
    { day: 1, month: "Mar" },
    { day: 2, month: "Mar" },
    { day: 3, month: "Mar" },
    { day: 4, month: "Mar" },
    { day: 5, month: "Mar" },
    { day: 6, month: "Mar" },
    { day: 7, month: "Mar" },
    { day: 8, month: "Mar" },
    { day: 9, month: "Mar" },
  ];

  useEffect(() => {
    dispatch(fetchAvailableTimeSlots({ doctorId, date: selectedDate }));
  }, [doctorId, selectedDate, dispatch]);

  const handleDateSelection = (index) => {
    setSelectedDay(index);
    const selectedDayData = calendarDays[index];
    let dateStr = `2025-`;
    if (selectedDayData.month === "Feb") {
      dateStr += `02-${selectedDayData.day.toString().padStart(2, "0")}`;
    } else {
      dateStr += `03-${selectedDayData.day.toString().padStart(2, "0")}`;
    }
    setSelectedDate(dateStr);
  };

  const handleNext = () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }

    navigate(
      `/book-appointment/patient-details/${doctorId}/${selectedDate}/${selectedSlot}`
    );
  };

  const groupTimeSlots = (slots) => {
    const morning = slots.filter((slot) => {
      const time = parseInt(slot.split(":")[0]);
      return time >= 8 && time < 12;
    });

    const afternoon = slots.filter((slot) => {
      const time = parseInt(slot.split(":")[0]);
      return time >= 12 && time < 17;
    });

    const evening = slots.filter((slot) => {
      const time = parseInt(slot.split(":")[0]);
      return time >= 17 && time < 21;
    });

    return { morning, afternoon, evening };
  };

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { morning, afternoon, evening } = groupTimeSlots(availableSlots || []);

  return (
    <Container maxW="container.md" py={8}>
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

      <Heading size="md" color="blue.500" mb={4}>
        Select Time Slot
      </Heading>

      <Box mb={8} textAlign="right">
        <Text fontSize="sm" color="gray.500">
          Step 3 of 5
        </Text>
      </Box>

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

          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="medium" color="gray.700">
              March 2025
            </Text>
            <Flex>
              <IconButton
                icon={<ChevronLeftIcon />}
                variant="ghost"
                colorScheme="blue"
                aria-label="Previous month"
                mr={2}
              />
              <IconButton
                icon={<ChevronRightIcon />}
                variant="ghost"
                colorScheme="blue"
                aria-label="Next month"
              />
            </Flex>
          </Flex>

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

            {calendarDays.map((date, index) => (
              <Button
                key={index}
                size="sm"
                variant={index === selectedDay ? "solid" : "outline"}
                colorScheme="blue"
                borderRadius="md"
                onClick={() => handleDateSelection(index)}
                isDisabled={index < 3} // Disable past days
                opacity={index < 3 ? 0.5 : 1}
                _disabled={{ opacity: 0.5 }}
              >
                {date.day}
              </Button>
            ))}
          </SimpleGrid>

          <Divider mb={6} />

          {loading && (
            <Flex justify="center" my={8}>
              <Text color="gray.500">Loading time slots...</Text>
            </Flex>
          )}

          {error && (
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <VStack spacing={6} align="stretch">
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
                    morning.map((slot) => (
                      <Button
                        key={slot}
                        size="md"
                        variant={selectedSlot === slot ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setSelectedSlot(slot)}
                        borderRadius="md"
                      >
                        {slot}
                      </Button>
                    ))
                  ) : (
                    <Text color="gray.500">No morning slots available</Text>
                  )}
                </HStack>
              </Box>

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
                    afternoon.map((slot) => (
                      <Button
                        key={slot}
                        size="md"
                        variant={selectedSlot === slot ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setSelectedSlot(slot)}
                        borderRadius="md"
                      >
                        {slot}
                      </Button>
                    ))
                  ) : (
                    <Text color="gray.500">No afternoon slots available</Text>
                  )}
                </HStack>
              </Box>

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
                    evening.map((slot) => (
                      <Button
                        key={slot}
                        size="md"
                        variant={selectedSlot === slot ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setSelectedSlot(slot)}
                        borderRadius="md"
                      >
                        {slot}
                      </Button>
                    ))
                  ) : (
                    <Text color="gray.500">No evening slots available</Text>
                  )}
                </HStack>
              </Box>
            </VStack>
          )}
        </CardBody>
      </Card>

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
