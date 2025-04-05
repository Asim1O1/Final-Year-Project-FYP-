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
  HStack,
  Alert,
  AlertIcon,
  Flex,
  Text,
  MenuDivider,
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
  ModalFooter,
  Icon,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  Modal,
} from "@chakra-ui/react";
import {
  handleGetUsers,
  handleAccountStatus,
} from "../../features/system_admin/systemadminslice";
import Pagination from "../../utils/Pagination";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  LockIcon,
  SearchIcon,
  UnlockIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { notification } from "antd";
import CustomLoader from "../../component/common/CustomSpinner";

export const Users = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector(
    (state) => state?.systemAdminSlice
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentPage, totalPages } = useSelector(
    (state) => state?.systemAdminSlice?.pagination?.users
  );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [users]);

  const handlePageChange = (page) => {
    dispatch(handleGetUsers({ page, limit: 10 }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      handleGetUsers({
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm,
      })
    ).catch(console.error);
  }, [dispatch, currentPage, debouncedSearchTerm]);

  //
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setDebouncedSearchTerm(searchTerm.trim());
    }
  };
  const openDeactivateModal = (user) => {
    setSelectedUser(user);
    setIsDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);

    try {
      const result = await dispatch(
        handleAccountStatus({ accountId: selectedUser._id, role: "user" })
      ).unwrap();

      if (result.isSuccess) {
        // Show success notification
        notification.success({
          title: "Account updated",
          description: result?.message,
          duration: 2,
          isClosable: true,
          position: "top-right",
        });

        await dispatch(
          handleGetUsers({ page: currentPage, limit: 10 })
        ).unwrap();
        closeDeactivateModal();
      } else {
        // Handle API success=false case
        notification.error({
          title: "Operation failed",
          description: result.message || "Failed to update account status",
          duration: 2,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Status change failed:", error);
      notification.error({
        title: "Operation failed",
        description: error.message || "Failed to update account status",
        duration: 2,
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
          Loading users...
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
            {error.message || "Failed to load users"}
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
          User Management
        </Heading>

        <InputGroup size="md" width="300px" className="shadow-sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            ref={searchInputRef}
            placeholder="Search users..."
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
        {users?.length === 0 && (
          <Box p={6} textAlign="center" bg="white">
            <Text fontSize="lg" fontWeight="medium" color="gray.600">
              {searchTerm
                ? "No users found matching your search"
                : "No users available"}
            </Text>
            {searchTerm && (
              <Button
                mt={4}
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                  searchInputRef.current?.focus();
                }}
              >
                Clear search
              </Button>
            )}
          </Box>
        )}

        {/* Table - only show if there are results */}
        {users?.length > 0 && (
          <Box className="overflow-x-auto">
            <Table variant="simple" colorScheme="gray">
              <Thead className="bg-gray-50">
                <Tr>
                  <Th className="px-6 py-4 text-gray-500 font-medium">Name</Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">Email</Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">Role</Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">
                    Status
                  </Th>
                  <Th className="px-6 py-4 text-gray-500 font-medium">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.map((user) => (
                  <Tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Td className="px-6 py-4">
                      <Flex align="center">
                        <Avatar
                          size="sm"
                          name={user.fullName}
                          bg="blue.500"
                          color="white"
                          mr={3}
                        />
                        <Box>
                          <Text fontWeight="medium">{user.fullName}</Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td className="px-6 py-4">
                      <Text color="gray.700">{user.email}</Text>
                    </Td>
                    <Td className="px-6 py-4">
                      <Badge
                        colorScheme={user.role === "admin" ? "purple" : "blue"}
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {user.role}
                      </Badge>
                    </Td>
                    <Td className="px-6 py-4">
                      <Badge
                        colorScheme={user.isActive ? "green" : "red"}
                        borderRadius="full"
                        px={2}
                        py={1}
                        variant="subtle"
                      >
                        <Flex align="center">
                          <Box
                            className={`w-2 h-2 rounded-full mr-2 ${
                              user.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {user.isActive ? "Active" : "Inactive"}
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
                            icon={user.isActive ? <LockIcon /> : <UnlockIcon />}
                            color={user.isActive ? "red.500" : "green.500"}
                            onClick={() => openDeactivateModal(user)}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </MenuItem>
                          <MenuDivider />
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
                  (users?.length || 0) + (currentPage - 1) * 10
                )}
              </Text>{" "}
              of{" "}
              <Text as="span" fontWeight="medium">
                {searchTerm ? "filtered" : "total"} users
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
              selectedUser?.isActive ? "bg-red-500" : "bg-green-500"
            }`}
          />

          <ModalHeader
            pt={6}
            className="flex items-center justify-center"
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <Text fontWeight="bold" fontSize="xl">
              {selectedUser?.isActive
                ? "Deactivate Account"
                : "Activate Account"}
            </Text>
          </ModalHeader>

          <ModalBody className="pt-6 pb-6">
            <Flex direction="column" align="center">
              <Flex
                justify="center"
                align="center"
                className={`w-16 h-16 rounded-full mb-5 ${
                  selectedUser?.isActive ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <Icon
                  as={selectedUser?.isActive ? WarningTwoIcon : CheckCircleIcon}
                  w={8}
                  h={8}
                  color={selectedUser?.isActive ? "red.500" : "green.500"}
                />
              </Flex>

              <Text align="center" fontSize="md" className="mb-6">
                {selectedUser?.isActive
                  ? "Are you sure you want to deactivate this user's account? This action will prevent them from accessing the system."
                  : "This action will restore the user's access to the system. Are you sure you want to proceed?"}
              </Text>

              {selectedUser && (
                <Box className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Flex align="center" className="mb-3">
                    <Avatar
                      size="md"
                      name={selectedUser.fullName}
                      bg="blue.500"
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold">{selectedUser.fullName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {selectedUser.email}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex className="justify-between text-sm">
                    <Box>
                      <Text color="gray.500">Role</Text>
                      <Badge
                        colorScheme={
                          selectedUser.role === "admin" ? "purple" : "blue"
                        }
                        mt={1}
                      >
                        {selectedUser.role}
                      </Badge>
                    </Box>

                    <Box>
                      <Text color="gray.500">Current Status</Text>
                      <Badge
                        colorScheme={selectedUser.isActive ? "green" : "red"}
                        mt={1}
                      >
                        {selectedUser.isActive ? "Active" : "Inactive"}
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
              colorScheme={selectedUser?.isActive ? "red" : "green"}
              onClick={handleDeactivate}
              isLoading={isProcessing}
              loadingText={
                selectedUser?.isActive ? "Deactivating..." : "Activating..."
              }
              className="flex-1"
              leftIcon={selectedUser?.isActive ? <LockIcon /> : <UnlockIcon />}
            >
              {selectedUser?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
