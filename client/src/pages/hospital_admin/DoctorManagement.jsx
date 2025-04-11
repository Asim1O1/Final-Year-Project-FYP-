import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  InputGroup,
  useDisclosure,
  Text,
  Stack,
  useToast,
  InputLeftElement,
  IconButton,
  InputRightElement,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Input } from "antd";

import AddDoctorForm from "../../component/hospital_admin/doctor/AddDoctor";
import UpdateDoctorForm from "../../component/hospital_admin/doctor/UpdateDoctor";
import DoctorList from "../../component/hospital_admin/doctor/DoctorList";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors } from "../../features/doctor/doctorSlice";
import { CloseIcon, RepeatIcon, SearchIcon } from "@chakra-ui/icons";

const DoctorManagement = () => {
  const toast = useToast();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const hospitalId = currentUser?.hospital;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { doctors, isLoading } = useSelector(
    (state) => state.doctorSlice?.doctors || {}
  );

  useEffect(() => {
    if (hospitalId) {
      dispatch(
        fetchAllDoctors({
          page: currentPage,
          limit: 10,
          hospital: hospitalId,
          search: debouncedSearchQuery,
        })
      )
        .unwrap()
        .catch((err) => {
          toast({
            title: "Error loading doctors",
            description: err.message || "Failed to fetch doctors",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  }, [dispatch, currentPage, hospitalId, debouncedSearchQuery, toast]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setDebouncedSearchQuery(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    onAddOpen();
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    onUpdateOpen();
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <Stack spacing={1}>
          <Heading size="lg">Doctor Management</Heading>
          <Text color="gray.600">
            {doctors?.length || 0}{" "}
            {doctors?.length === 1 ? "doctor" : "doctors"} found
          </Text>
        </Stack>
        <Button
          colorScheme="blue"
          leftIcon={<Plus size={20} />}
          onClick={handleAddDoctor}
          isLoading={isLoading}
        >
          Add New Doctor
        </Button>
      </Flex>

      {/* Search Section */}
      <Box mb={6}>
        <Flex gap={4} flexWrap="wrap">
          <InputGroup flex={1} minW="300px" size="md" className="shadow-sm">
            <Input
              ref={searchInputRef}
              placeholder="Search by name, specialization, or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              borderRadius="lg"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
            {searchQuery && (
              <InputRightElement>
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={<CloseIcon fontSize="10px" />}
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  _hover={{ bg: "transparent" }}
                />
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            variant="outline"
            isLoading={isLoading}
            onClick={handleClearSearch}
            borderRadius="lg"
            borderColor="gray.300"
            _hover={{ bg: "gray.50" }}
            className="shadow-sm"
            leftIcon={searchQuery ? <RepeatIcon /> : <SearchIcon />}
          >
            {searchQuery ? "Clear" : "Search"}
          </Button>
        </Flex>
      </Box>

      {/* Doctor List */}
      {!isLoading && doctors?.length === 0 ? (
        <Box p={6} textAlign="center" bg="white" borderRadius="md" shadow="sm">
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            {debouncedSearchQuery
              ? "No doctors found matching your search"
              : "No doctors available"}
          </Text>
          {debouncedSearchQuery && (
            <Button mt={4} variant="outline" onClick={handleClearSearch}>
              Clear search
            </Button>
          )}
        </Box>
      ) : (
        <DoctorList
          doctors={doctors || []}
          isLoading={isLoading}
          onEdit={handleEditDoctor}
        />
      )}

      {/* Add Doctor Modal */}
      <AddDoctorForm
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSuccess={() => {
          onAddClose();
          dispatch(
            fetchAllDoctors({
              page: currentPage,
              limit: 10,
              hospital: hospitalId,
              search: debouncedSearchQuery,
            })
          );
        }}
      />

      {/* Update Doctor Modal */}
      <UpdateDoctorForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        doctorData={selectedDoctor}
        onSuccess={() => {
          onUpdateClose();
          dispatch(
            fetchAllDoctors({
              page: currentPage,
              limit: 10,
              hospital: hospitalId,
              search: debouncedSearchQuery,
            })
          );
        }}
      />
    </Container>
  );
};

export default DoctorManagement;
