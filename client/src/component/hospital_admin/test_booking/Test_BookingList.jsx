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
import { useEffect, useState } from "react";
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
  console.log("The hospital bookings are", hospitalBookings);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const hospitalId = useSelector((state) => state?.auth?.user?.data?.hospital);
  console.log("The hospital Id is", hospitalId);

  const itemsPerPage = 10;

  useEffect(() => {
    if (hospitalId) {
      dispatch(
        fetchHospitalTestBookings({
          hospitalId,
          filters: {
            page: currentPage,
            limit: itemsPerPage,
          },
        })
      );
    }
  }, [dispatch, currentPage, hospitalId]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const result = await dispatch(
        updateTestBookingStatus({
          bookingId,
          status: newStatus,
        })
      ).unwrap();

      console.log("Booking status updated:", result);

      notification.success({
        message: "Status Updated",
        description: result?.message || `Status changed to ${newStatus}`,
        duration: 3,
      });

      // Optional: refresh booking list after status change
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
    } catch (error) {
      console.error("Error updating booking status:", error);

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
    dispatch(
      fetchHospitalTestBookings({
        hospitalId,
        filters: {
          // Wrap in filters object
          page: 1,
          limit: itemsPerPage,
          search: searchTerm,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      })
    );
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(
      fetchHospitalTestBookings({
        hospitalId,
        filters: {
          // Wrap in filters object
          page: newPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "confirmed":
        return "green";
      case "completed":
        return "blue";
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
      confirmed: { icon: CheckCircleIcon, color: "blue" },
      completed: { icon: CheckCircleIcon, color: "green" },
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
    <Container maxW="container.xl" py={6}>
      <Card
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <CardHeader
          bg={headerBgColor}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <Icon as={ClipboardIcon} size={24} color="blue.500" />
              <Heading size="lg">Medical Test Bookings</Heading>
            </Flex>

            <Button
              size="sm"
              leftIcon={<Icon as={RefreshCwIcon} size={16} />}
              colorScheme="blue"
              variant="ghost"
              onClick={() => handleSearch()}
              isLoading={isLoading}
              loadingText="Refreshing"
            >
              Refresh
            </Button>
          </Flex>
        </CardHeader>

        <CardBody p={5}>
          {/* Search and Filter */}
          <form onSubmit={handleSearch}>
            <Flex
              mb={6}
              gap={4}
              direction={{ base: "column", md: "row" }}
              bg={headerBgColor}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              align="center"
            >
              <Box flex={1}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={SearchIcon} color="gray.400" size={18} />
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

              <HStack spacing={3} width={{ base: "100%", md: "auto" }}>
                <Flex align="center" gap={2}>
                  <Icon as={FilterIcon} color="gray.500" size={16} />
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    borderRadius="md"
                    bg={bgColor}
                    width={{ base: "100%", md: "160px" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="blue"
                  leftIcon={<Icon as={SearchIcon} size={16} />}
                  borderRadius="md"
                >
                  Search
                </Button>
              </HStack>
            </Flex>
          </form>

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
                "Server down right now,  please! try again"}
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
              <Box overflowX="auto" className="bookings-table">
                <Table variant="simple">
                  <Thead bg={headerBgColor}>
                    <Tr>
                      <Th>Patient</Th>
                      <Th>Test Details</Th>
                      <Th>Appointment</Th>
                      <Th width="120px">Status</Th>
                      <Th width="160px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredBookings.map((booking) => (
                      <Tr
                        key={booking._id}
                        _hover={{ bg: hoverBgColor }}
                        transition="background 0.2s"
                      >
                        <Td>
                          <Flex align="center" gap={3}>
                            <Avatar
                              size="sm"
                              name={booking?.userId?.fullName}
                              bg="blue.500"
                              color="white"
                              icon={<Icon as={UserIcon} size={20} />}
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
                        <Td>
                          <Text fontWeight="medium">
                            {booking.testId.testName}
                          </Text>
                          <Tag size="sm" mt={1} colorScheme="green">
                            Rs. {booking.testId.testPrice?.toFixed(2)}
                          </Tag>
                        </Td>
                        <Td>
                          <HStack spacing={1} mb={1}>
                            <Icon
                              as={CalendarIcon}
                              size={14}
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
                              size={14}
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
                            <Select
                              size="sm"
                              value={booking.status}
                              onChange={(e) =>
                                handleStatusChange(booking._id, e.target.value)
                              }
                              isDisabled={updatingId === booking._id}
                              borderRadius="md"
                              bg={bgColor}
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </Select>
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
            <Flex justify="space-between" w="full" align="center">
              <Text color={textColorSecondary} fontSize="sm">
                Showing {filteredBookings.length} bookings • Page {currentPage}{" "}
                of {totalPages}
              </Text>
              <HStack spacing={2}>
                <IconButton
                  icon={<Icon as={ChevronLeftIcon} size={18} />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1 || isLoading}
                  aria-label="Previous page"
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                />
                <IconButton
                  icon={<Icon as={ChevronRightIcon} size={18} />}
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
