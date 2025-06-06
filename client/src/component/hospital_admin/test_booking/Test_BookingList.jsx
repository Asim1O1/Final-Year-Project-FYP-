import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { notification } from "antd";
import {
  ClipboardIcon,
  ClockIcon,
  FilterIcon,
  RefreshCwIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHospitalTestBookings,
  updateTestBookingStatus,
} from "../../../features/medical_test/medicalTestSlice";

const TestBookingList = () => {
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state?.medicalTestSlice);
  const hospitalBookings = useSelector(
    (state) => state?.medicalTestSlice?.hospitalBookings
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const hospitalId = useSelector((state) => state?.auth?.user?.data?.hospital);

  const itemsPerPage = 10;

  // Fetch bookings with current filters
  const fetchBookings = useCallback(() => {
    if (hospitalId) {
      console.log("Fetching with filters:", {
        hospitalId,
        status: statusFilter,
        search: searchTerm,
      });

      dispatch(
        fetchHospitalTestBookings({
          hospitalId,
          filters: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
          },
        })
      );
    }
  }, [
    dispatch,
    hospitalId,
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
  ]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    // First, find the current booking to check its status
    const booking = filteredBookings.find((b) => b._id === bookingId);

    // Prevent changes to completed bookings
    if (booking?.status === "completed") {
      notification.warning({
        message: "Action Not Allowed",
        description: "Completed bookings cannot be modified.",
        duration: 3,
      });
      return;
    }

    // Continue with the update if not completed
    setUpdatingId(bookingId);
    try {
      const result = await dispatch(
        updateTestBookingStatus({
          bookingId,
          status: newStatus,
        })
      ).unwrap();

      notification.success({
        message: "Status Updated",
        description: result?.message || `Status changed to ${newStatus}`,
        duration: 3,
      });

      // Refresh the list after status change
      fetchBookings();
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description:
          error?.message || "Something went wrong while updating the status.",
        duration: 5,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchBookings();
  };

  const handleRefresh = () => {
    // Reset search and filters
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    fetchBookings();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "yellow";
      case "booked": // Added for new status
        return "blue";
      case "confirmed":
        return "green";
      case "completed":
        return "teal";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const filteredBookings = hospitalBookings || [];
  console.log("The filtered bookings are", filteredBookings);

  const totalPages = hospitalBookings?.totalPages || 1;
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("blue.50", "blue.900");
  const textColorSecondary = useColorModeValue("gray.600", "gray.400");

  // Status indicator component

  const StatusIndicator = ({ status }) => {
    const statusInfo = {
      pending: { icon: ClockIcon, color: "yellow" },
      booked: { icon: CalendarIcon, color: "blue" }, // Added for new status
      confirmed: { icon: CheckCircleIcon, color: "green" },
      completed: { icon: CheckCircleIcon, color: "teal" },
      cancelled: { icon: XCircleIcon, color: "red" },
    };

    const { icon: StatusIcon, color } = statusInfo[status.toLowerCase()] || {
      icon: ClockIcon,
      color: "gray",
    };

    return (
      <Badge
        colorScheme={getStatusColor(status)}
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderRadius="full"
      >
        <Icon as={StatusIcon} boxSize={3} mr={1} />
        <Text>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
      </Badge>
    );
  };

  // Custom icon component
  const Icon = ({ as, ...props }) => {
    const IconComponent = as;
    return <IconComponent {...props} />;
  };

  return (
    <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
      <Card
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        {/* Header */}
        <CardHeader
          bg={headerBgColor}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <Flex align="center" gap={2}>
              <Icon as={ClipboardIcon} boxSize={6} color="blue.500" />
              <Heading size="lg">Medical Test Bookings</Heading>
            </Flex>

            <Button
              size="sm"
              leftIcon={<Icon as={RefreshCwIcon} boxSize={4} />}
              colorScheme="blue"
              variant="ghost"
              onClick={handleRefresh}
              isLoading={isLoading}
              loadingText="Refreshing"
            >
              Refresh
            </Button>
          </Flex>
        </CardHeader>

        {/* Body */}
        <CardBody p={{ base: 4, md: 5 }}>
          {/* Search and Filter Form */}
          <form onSubmit={handleSearch}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              mb={6}
              bg={headerBgColor}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              {/* Search Input */}
              <Box flex={1}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={SearchIcon} color="gray.400" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by patient name or test"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="md"
                    bg={bgColor}
                  />
                </InputGroup>
              </Box>

              {/* Filters and Search Button */}
              <Flex
                gap={3}
                direction={{ base: "column", sm: "row" }}
                align="center"
                width={{ base: "100%", md: "auto" }}
              >
                <Flex align="center" gap={2} width="100%">
                  <Icon as={FilterIcon} color="gray.500" boxSize={4} />
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    borderRadius="md"
                    bg={bgColor}
                    width="100%"
                    maxW={{ sm: "160px" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="booked">Booked</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="blue"
                  leftIcon={<Icon as={SearchIcon} boxSize={4} />}
                  borderRadius="md"
                  width={{ base: "100%", sm: "auto" }}
                >
                  Search
                </Button>
              </Flex>
            </Flex>
          </form>

          {/* Loading, Error, or Empty States */}
          {isLoading && !hospitalBookings ? (
            <Flex justify="center" align="center" minH="200px">
              <VStack spacing={3}>
                <Spinner size="xl" color="blue.500" thickness="3px" />
                <Text color={textColorSecondary}>Loading bookings...</Text>
              </VStack>
            </Flex>
          ) : error ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error?.message ||
                error?.error ||
                "Server down right now, please try again."}
            </Alert>
          ) : filteredBookings.length === 0 ? (
            <Alert status="info" borderRadius="md" variant="subtle">
              <AlertIcon />
              <Box>
                <Text fontWeight="medium">No bookings found</Text>
                <Text fontSize="sm">Try adjusting your search filters</Text>
              </Box>
            </Alert>
          ) : (
            <>
              {/* Table */}
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead bg={headerBgColor}>
                    <Tr>
                      <Th>Patient</Th>
                      <Th>Test Details</Th>
                      <Th>Appointment</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredBookings.map((booking) => (
                      <Tr
                        key={booking._id}
                        _hover={{ bg: hoverBgColor }}
                        transition="background 0.2s"
                      >
                        <Td minW="180px">
                          <Flex align="center" gap={3}>
                            <Avatar
                              size="sm"
                              name={booking?.userId?.fullName}
                              bg="blue.500"
                              color="white"
                              icon={<Icon as={UserIcon} boxSize={4} />}
                            />
                            <Box>
                              <Text fontWeight="medium">
                                {booking?.userId?.fullName}
                              </Text>
                              <Text fontSize="sm" color={textColorSecondary}>
                                {booking?.userId?.email}
                              </Text>
                            </Box>
                          </Flex>
                        </Td>

                        <Td minW="160px">
                          <Text fontWeight="medium">
                            {booking.testId.testName}
                          </Text>
                          <Tag size="sm" mt={1} colorScheme="green">
                            Rs. {booking.testId.testPrice?.toFixed(2)}
                          </Tag>
                        </Td>

                        <Td minW="160px">
                          <HStack spacing={1} mb={1}>
                            <Icon
                              as={CalendarIcon}
                              boxSize={4}
                              color={textColorSecondary}
                            />
                            <Text>
                              {new Date(
                                booking.bookingDate
                              ).toLocaleDateString()}
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon
                              as={ClockIcon}
                              boxSize={4}
                              color={textColorSecondary}
                            />
                            <Text fontSize="sm" color={textColorSecondary}>
                              {booking.timeSlot}
                            </Text>
                          </HStack>
                        </Td>

                        <Td>
                          <StatusIndicator status={booking.status} />
                        </Td>

                        <Td>
                          <Flex align="center">
                            <Tooltip
                              label={
                                booking.status === "completed"
                                  ? "Completed bookings cannot be modified"
                                  : ""
                              }
                              isDisabled={booking.status !== "completed"}
                              hasArrow
                            >
                              <Select
                                size="sm"
                                value={booking.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    booking._id,
                                    e.target.value
                                  )
                                }
                                isDisabled={
                                  updatingId === booking._id ||
                                  booking.status === "completed"
                                }
                                borderRadius="md"
                                bg={bgColor}
                                width="100%"
                                maxW="140px"
                                cursor={
                                  booking.status === "completed"
                                    ? "not-allowed"
                                    : "pointer"
                                }
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </Select>
                            </Tooltip>
                            {updatingId === booking._id && (
                              <Spinner size="sm" ml={2} color="blue.500" />
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </>
          )}
        </CardBody>

        <Divider />

        {/* Pagination */}
        {!isLoading && filteredBookings.length > 0 && (
          <CardFooter bg={headerBgColor}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              w="full"
              align={{ base: "flex-start", md: "center" }}
              gap={2}
            >
              <Text color={textColorSecondary} fontSize="sm">
                Showing {filteredBookings.length} bookings • Page {currentPage}{" "}
                of {totalPages}
              </Text>
              <HStack spacing={2}>
                <IconButton
                  icon={<Icon as={ChevronLeftIcon} boxSize={4} />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1 || isLoading}
                  aria-label="Previous page"
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                />
                <IconButton
                  icon={<Icon as={ChevronRightIcon} boxSize={4} />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages || isLoading}
                  aria-label="Next page"
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                />
              </HStack>
            </Flex>
          </CardFooter>
        )}
      </Card>
    </Container>
  );
};

export default TestBookingList;
