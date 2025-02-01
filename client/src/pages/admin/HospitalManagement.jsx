import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus, Search } from "lucide-react";
import { Input } from "antd";

import HospitalForm from "../../component/admin/hospitals/AddHospitalForm";
import HospitalList from "../../component/admin/hospitals/HospitalLists";

import { useDispatch, useSelector } from "react-redux";

const HospitalManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Fetch hospitals from Redux state
  const { hospitals, isLoading, error } = useSelector(
    (state) => state.hospitalSlice
  );

  // Handle opening the form for adding a new hospital
  const handleAddHospital = () => {
    setSelectedHospital(null);
    onOpen();
  };

  // Handle opening the form for editing an existing hospital
  const handleEditHospital = (hospital) => {
    console.log("ENTERED THE HANDLE EDIT HOSPITAL");
    console.log("teh hospital is", hospital);

    setSelectedHospital(hospital);

    onOpen(); // Open the modal
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
            <Input placeholder="Search hospitals..." />
          </InputGroup>
          <Button variant="outline">Filter</Button>
        </Flex>
      </Box>

      {/* Hospital List */}
      <HospitalList
        hospitals={hospitals}
        onEdit={handleEditHospital} 
        onDelete={handleDeleteHospital} 
      />

      {/* Add/Edit Hospital Modal */}
      <HospitalForm
        isOpen={isOpen}
        onClose={onClose}
        hospitalId={selectedHospital}
      />
    </Container>
  );
};

export default HospitalManagement;
