import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Plus, Search } from "lucide-react";
import { Input } from "antd";

import HospitalForm from "../../component/admin/hospitals/AddHospitalForm";
import HospitalList from "../../component/admin/hospitals/HospitalLists";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";

import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

const HospitalManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const dispatch = useDispatch();

  // Fetch hospitals from Redux state
  const { hospitals, loading, error } = useSelector((state) => state.hospitalSlice);
  //  const {totalPages, currentPage} = useSelector(
  //     (state) => state?.hospitalSlice?.data?.pagination
  //   );

     // Initial data fetch
     useEffect(() => {
      dispatch(fetchAllHospitals({page: currentPage, limit: 10, search: searchTerm}));
    }, [dispatch, currentPage, searchTerm]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(fetchAllHospitals({page: 1, limit: 10, search: term})); // Reset to page 1 when searching
    }, 500),
    [dispatch]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

 

  // Handle opening the form for adding a new hospital
  const handleAddHospital = () => {
    setSelectedHospital(null);
    onOpen();
  };

  // Handle opening the form for editing an existing hospital
  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    onOpen();
  };

  // Handle deleting a hospital
  const handleDeleteHospital = (hospitalId) => {
    console.log("Delete hospital with ID:", hospitalId);
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Hospital Management</Heading>
        <Button
          colorScheme="blue"
          leftIcon={<Plus size={20} />}
          onClick={handleAddHospital}
        >
          Add New Hospital
        </Button>
      </Flex>

      {/* Search Section */}
      <Box mb={6}>
        <Flex gap={4}>
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search hospitals by name, address, or test..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              dispatch(fetchAllHospitals());
            }}
          >
            Clear
          </Button>
        </Flex>
      </Box>

      {/* Hospital List */}
      <HospitalList
        hospitals={hospitals}
        loading={loading}
        error={error}
        onEdit={handleEditHospital}
        onDelete={handleDeleteHospital}
      />

      {/* Add/Edit Hospital Modal */}
      <HospitalForm
        isOpen={isOpen}
        onClose={onClose}
        hospitalId={selectedHospital}
        onSuccess={() => {
          onClose();
          dispatch(fetchAllHospitals({ search: searchTerm }));
        }}
      />
    </Container>
  );
};

export default HospitalManagement;