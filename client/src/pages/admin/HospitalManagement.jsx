import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Input } from "antd";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import HospitalForm from "../../component/admin/hospitals/AddHospitalForm";
import HospitalList from "../../component/admin/hospitals/HospitalLists";
import { fetchAllHospitals } from "../../features/hospital/hospitalSlice";

import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../utils/Pagination";

const HospitalManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const dispatch = useDispatch();

  // Redux state
  const { hospitals, loading, error, pagination } = useSelector(
    (state) => state.hospitalSlice
  );

  // Fetch data on mount or page/search/filter change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
    };

    // Only add specialties if one is selected
    if (selectedSpecialty) {
      params.specialty = selectedSpecialty; // Match the backend parameter name
    }

    dispatch(fetchAllHospitals(params));
  }, [dispatch, currentPage, searchTerm, selectedSpecialty]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setCurrentPage(1); // Reset to page 1

      const params = {
        page: 1,
        limit: 10,
        search: term,
      };

      // Only add specialty if one is selected
      if (selectedSpecialty) {
        params.specialty = selectedSpecialty; // Match the backend parameter name
      }

      dispatch(fetchAllHospitals(params));
    }, 500),
    [dispatch, selectedSpecialty]
  );

  // Input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setCurrentPage(1);
    dispatch(fetchAllHospitals({ page: 1, limit: 10 }));
  };

  const handleAddHospital = () => {
    setSelectedHospital(null);
    onOpen();
  };

  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    onOpen();
  };

  const handleDeleteHospital = (hospitalId) => {
    console.log("Delete hospital with ID:", hospitalId);
  };

  return (
    <Container maxW="container.xl" py={6}>
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

      {/* Search and Filter Section */}
      <Box mb={6}>
        <Flex direction="column" gap={4}>
          {/* Search */}
          <Flex gap={4}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none"></InputLeftElement>
              <Input
                placeholder="Search hospitals by name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Active Filter Display */}
      {selectedSpecialty && (
        <Box mb={4}>
          <Flex align="center" gap={2}>
            <Text fontWeight="medium">Active filter:</Text>
            <Tag size="sm" colorScheme="blue" borderRadius="full">
              <TagLabel>{selectedSpecialty}</TagLabel>
              <TagCloseButton onClick={() => setSelectedSpecialty("")} />
            </Tag>
          </Flex>
        </Box>
      )}

      {/* Hospital List */}
      <HospitalList
        hospitals={hospitals}
        loading={loading}
        error={error}
        onEdit={handleEditHospital}
        onDelete={handleDeleteHospital}
      />

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Add/Edit Modal */}
      <HospitalForm
        isOpen={isOpen}
        onClose={onClose}
        hospitalId={selectedHospital}
        onSuccess={() => {
          onClose();
          const params = {
            page: currentPage,
            search: searchTerm,
          };

          if (selectedSpecialty) {
            params.specialty = selectedSpecialty; // Match the backend parameter name
          }

          dispatch(fetchAllHospitals(params));
        }}
      />
    </Container>
  );
};

export default HospitalManagement;
