import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Text,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  Badge,
  Avatar,
  Input,
  InputLeftElement,
  InputGroup,
  CloseButton,
  AlertDescription,
  AlertTitle,
  Toast,
  ModalFooter,
  Icon,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  Modal,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import {
  handleGetDoctors,
  handleAccountStatus,
} from "../../features/system_admin/systemadminslice";
import Pagination from "../../utils/Pagination";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CloseIcon,
  LockIcon,
  SearchIcon,
  UnlockIcon,
  ViewIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { notification } from "antd";
import CustomLoader from "../../component/common/CustomSpinner";

export const Doctors = () => {
  console.log("Doctors component rendered");
  const dispatch = useDispatch();
  const { doctors, isLoading, error } = useSelector(
    (state) => state?.systemAdminSlice
  );
  console.log("The dcotros are", doctors);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const { currentPage, totalPages } = useSelector(
    (state) => state?.systemAdminSlice.pagination.doctors
  );
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch doctors when page or search term changes
  useEffect(() => {
    console.log("Fetching doctors for page:", currentPage);
    dispatch(
      handleGetDoctors({
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm,
      })
    )
      .unwrap()
      .then((data) => {
        console.log("Doctors fetched successfully:", data);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, [dispatch, currentPage, debouncedSearchTerm]);

  const handlePageChange = (page) => {
    dispatch(
      handleGetDoctors({
        page,
        limit: 10,
        search: debouncedSearchTerm,
      })
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setDebouncedSearchTerm(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const openDeactivateModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleDeactivate = async () => {
    if (!selectedDoctor) return;

    setIsProcessing(true);

    try {
      const result = await dispatch(
        handleAccountStatus({
          accountId: selectedDoctor._id,
          role: "doctor",
        })
      ).unwrap();

      if (!result.isSuccess) {
        notification.error({
          title: "Operation failed",
          description: result.message || "Failed to update account status",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      // Use the updated doctor state from the response
      const updatedStatus = result.data.isActive ? "activated" : "deactivated";

      // Show success notification
      notification.success({
        title: "Account updated",
        description: `Doctor ${selectedDoctor.fullName} has been ${updatedStatus}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      // Refresh doctors list after update
      await dispatch(
        handleGetDoctors({ page: currentPage, limit: 10 })
      ).unwrap();
      closeDeactivateModal();
    } catch (error) {
      console.error("Status change failed:", error);
      notification.error({
        title: "Operation failed",
        description: error.message || "Failed to update account status",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
        className="bg-gray-50 rounded-lg shadow-sm p-8"
      >
        <CustomLoader
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
        />
        <Box mt={4} fontWeight="medium" color="gray.600">
          Loading doctors...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="solid" className="rounded-md shadow-md">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load doctors"}
          </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );
  }

  return (
    <Box className="max-w-7xl mx-auto">
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        className="border-b border-gray-200 pb-4"
      >
        <Heading size="lg" fontWeight="bold" className="text-gray-800">
          Doctor Management
        </Heading>

        <InputGroup size="md" width="300px" className="shadow-sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            ref={searchInputRef}
            placeholder="Search doctors..."
            borderRadius="lg"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px blue.500",
            }}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
          {searchTerm && (
            <InputRightElement>
              <IconButton
                aria-label="Clear search"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={clearSearch}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>

      <Box
        bg="white"
        rounded="lg"
        shadow="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.200"
        className="hover:shadow-lg transition-shadow duration-300"
      >
        {/* No results message */}
        {doctors?.length === 0 && (
          <Box p={6} textAlign="center" bg="white">
            <Text fontSize="lg" fontWeight="medium" color="gray.600">
              {debouncedSearchTerm
                ? "No doctors found matching your search"
                : "No doctors available"}
            </Text>
            {debouncedSearchTerm && (
              <Button mt={4} variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
            )}
          </Box>
        )}

        {/* Table - only show if there are results */}
        {doctors?.length > 0 && (
          <Box className="overflow-x-auto">
            <Table variant="simple" colorScheme="gray">
              <Thead className="bg-gray-50">
                <Tr>
                  <Th className="px-6 py-4 text-gray-500 font-medium">Name</Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">Email</Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">
                    Specialization
                  </Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">
                    Experience
                  </Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">
                    Status
                  </Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {doctors?.map((doctor) => (
                  <Tr
                    key={doctor._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Td className="px-6 py-4">
                      <Flex align="center">
                        <Avatar
                          size="sm"
                          name={doctor.fullName}
                          src={doctor.profilePicture}
                          bg="teal.500"
                          color="white"
                          mr={3}
                        />
                        <Box>
                          <Text fontWeight="medium">{doctor.fullName}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {doctor.qualification}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td className="px-6 py-4">
                      <Text color="gray.700">{doctor.email}</Text>
                    </Td>
                    <Td className="px-6 py-4">
                      <Badge
                        colorScheme="purple"
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {doctor.specialization}
                      </Badge>
                    </Td>
                    <Td className="px-6 py-4">
                      <Text>
                        {doctor.yearsOfExperience}{" "}
                        {doctor.yearsOfExperience === 1 ? "year" : "years"}
                      </Text>
                    </Td>
                    <Td className="px-6 py-4">
                      <Badge
                        colorScheme={doctor.isActive ? "green" : "red"}
                        borderRadius="full"
                        px={2}
                        py={1}
                        variant="subtle"
                      >
                        <Flex align="center">
                          <Box
                            className={`w-2 h-2 rounded-full mr-2 ${
                              doctor.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {doctor.isActive ? "Active" : "Inactive"}
                        </Flex>
                      </Badge>
                    </Td>
                    <Td className="px-6 py-4">
                      <Menu>
                        <MenuButton
                          as={Button}
                          size="sm"
                          variant="outline"
                          rightIcon={<ChevronDownIcon />}
                          className="shadow-sm hover:shadow transition-shadow duration-150"
                        >
                          Actions
                        </MenuButton>
                        <MenuList className="shadow-lg">
                          <MenuItem
                            icon={
                              doctor.isActive ? <LockIcon /> : <UnlockIcon />
                            }
                            color={doctor.isActive ? "red.500" : "green.500"}
                            onClick={() => openDeactivateModal(doctor)}
                          >
                            {doctor.isActive ? "Deactivate" : "Activate"}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {totalPages > 1 && (
          <Flex
            justify="space-between"
            align="center"
            px={6}
            py={4}
            borderTopWidth="1px"
            borderColor="gray.200"
            className="bg-gray-50"
          >
            <Text color="gray.500" fontSize="sm">
              Showing{" "}
              <Text as="span" fontWeight="medium">
                {(currentPage - 1) * 10 + 1}-
                {Math.min(
                  currentPage * 10,
                  (doctors?.length || 0) + (currentPage - 1) * 10
                )}
              </Text>{" "}
              of{" "}
              <Text as="span" fontWeight="medium">
                {debouncedSearchTerm ? "filtered" : "total"} doctors
              </Text>
            </Text>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="shadow-sm"
            />
          </Flex>
        )}
      </Box>

      {/* Deactivation Modal */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={closeDeactivateModal}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
        <ModalContent borderRadius="xl" className="shadow-xl mx-4" maxW="md">
          <Box
            position="absolute"
            top="-10px"
            right="-10px"
            borderRadius="full"
            bg="white"
            className="shadow-md z-10"
          >
            <ModalCloseButton
              borderRadius="full"
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              size="md"
            />
          </Box>

          <Box
            className={`w-full h-1 rounded-t-xl ${
              selectedDoctor?.isActive ? "bg-red-500" : "bg-green-500"
            }`}
          />

          <ModalHeader
            pt={6}
            className="flex items-center justify-center"
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <Text fontWeight="bold" fontSize="xl">
              {selectedDoctor?.isActive
                ? "Deactivate Doctor"
                : "Activate Doctor"}
            </Text>
          </ModalHeader>

          <ModalBody className="pt-6 pb-6">
            <Flex direction="column" align="center">
              <Flex
                justify="center"
                align="center"
                className={`w-16 h-16 rounded-full mb-5 ${
                  selectedDoctor?.isActive ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <Icon
                  as={
                    selectedDoctor?.isActive ? WarningTwoIcon : CheckCircleIcon
                  }
                  w={8}
                  h={8}
                  color={selectedDoctor?.isActive ? "red.500" : "green.500"}
                />
              </Flex>

              <Text align="center" fontSize="md" className="mb-6">
                {selectedDoctor?.isActive
                  ? "Deactivating this doctor will remove their access to the system and hide their profile from patients."
                  : "Activating will restore this doctor's access and make their profile visible to patients."}
              </Text>

              {selectedDoctor && (
                <Box className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Flex align="center" className="mb-3">
                    <Avatar
                      size="md"
                      name={selectedDoctor.fullName}
                      src={selectedDoctor.profilePicture}
                      bg="teal.500"
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold">{selectedDoctor.fullName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {selectedDoctor.specialization}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex className="justify-between text-sm">
                    <Box>
                      <Text color="gray.500">Experience</Text>
                      <Text mt={1} fontWeight="medium">
                        {selectedDoctor.yearsOfExperience} years
                      </Text>
                    </Box>

                    <Box>
                      <Text color="gray.500">Current Status</Text>
                      <Badge
                        colorScheme={selectedDoctor.isActive ? "green" : "red"}
                        mt={1}
                      >
                        {selectedDoctor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Box>
                  </Flex>
                </Box>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter
            borderTopWidth="1px"
            borderColor="gray.100"
            className="flex justify-between gap-3 px-6 py-4"
          >
            <Button
              variant="ghost"
              onClick={closeDeactivateModal}
              isDisabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              colorScheme={selectedDoctor?.isActive ? "red" : "green"}
              onClick={handleDeactivate}
              isLoading={isProcessing}
              loadingText={
                selectedDoctor?.isActive ? "Deactivating..." : "Activating..."
              }
              className="flex-1"
              leftIcon={
                selectedDoctor?.isActive ? <LockIcon /> : <UnlockIcon />
              }
            >
              {selectedDoctor?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
