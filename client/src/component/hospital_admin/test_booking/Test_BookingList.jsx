import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  HStack,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Button,
  Input,
  IconButton,
} from "@chakra-ui/react";
import {
  fetchHospitalTestBookings,
  updateTestBookingStatus,
} from "../../../features/medical_test/medicalTestSlice";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

const TestBookingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { hospitalBookings, isLoading, error } = useSelector(
    (state) => state.medicalTestSlice
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const hospitalId = useSelector((state) => state?.auth?.user?.data?.hospital);

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
    console.log("The id is", bookingId, newStatus);
    setUpdatingId(bookingId);
    try {
      await dispatch(
        updateTestBookingStatus({
          bookingId,
          status: newStatus,
        })
      ).unwrap();

      toast({
        title: "Status updated",
        description: `Booking status has been updated to ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update booking status",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      fetchHospitalTestBookings({
        page: 1,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
    );
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(
      fetchHospitalTestBookings({
        page: newPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
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

  const totalPages = hospitalBookings?.totalPages || 1;

  return (
    <Box p={4} bg="white" borderRadius="lg" shadow="md" className="w-full">
      <Heading size="lg" mb={6}>
        Medical Test Bookings
      </Heading>

      {/* Search and Filter */}
      <form onSubmit={handleSearch}>
        <Flex mb={6} gap={4} direction={{ base: "column", md: "row" }}>
          <Box flex={1}>
            <Input
              placeholder="Search by patient name or test name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </Box>
          <Box width={{ base: "100%", md: "200px" }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </Box>
          <Button type="submit" colorScheme="blue" leftIcon={<SearchIcon />}>
            Search
          </Button>
        </Flex>
      </form>

      {isLoading && !hospitalBookings ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      ) : filteredBookings.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No bookings found
        </Alert>
      ) : (
        <>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Patient</Th>
                  <Th>Test Name</Th>
                  <Th>Booking Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBookings.map((booking) => (
                  <Tr key={booking._id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <Text fontWeight="medium">
                        {booking?.userId?.fullName}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {booking?.userId?.email}
                      </Text>
                    </Td>
                    <Td>
                      <Text>{booking.testId.testName}</Text>
                      <Text fontSize="sm" color="gray.600">
                        ₹{booking.testId.testPrice?.toFixed(2)}
                      </Text>
                    </Td>
                    <Td>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                      <Text fontSize="sm" color="gray.600">
                        {booking.timeSlot}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </Td>
                    <Td>
                      <Select
                        size="sm"
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                        isDisabled={updatingId === booking._id}
                        width="140px"
                      >
                        <option value="pending">Pending</option>

                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                      {updatingId === booking._id && (
                        <Spinner size="sm" ml={2} color="blue.500" />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination */}
          <Flex justify="space-between" mt={6} align="center">
            <Text color="gray.600">
              Page {currentPage} of {totalPages}
            </Text>
            <HStack>
              <IconButton
                icon={<ChevronLeftIcon />}
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1 || isLoading}
                aria-label="Previous page"
              />
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages || isLoading}
                aria-label="Next page"
              />
            </HStack>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default TestBookingList;
