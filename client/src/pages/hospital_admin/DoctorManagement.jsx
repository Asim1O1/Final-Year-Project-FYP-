import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { Plus, Search } from "lucide-react";
import { Input } from "antd";

import AddDoctorForm from "../../component/hospital_admin/doctor/AddDoctor";
import UpdateDoctorForm from "../../component/hospital_admin/doctor/UpdateDoctor";
import DoctorList from "../../component/hospital_admin/doctor/DoctorList";

const DoctorManagement = () => {
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

  // ✅ Static doctor data
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      fullName: "Dr. John Doe",
      specialization: "Cardiologist",
      email: "johndoe@example.com",
    },
    {
      id: 2,
      fullName: "Dr. Jane Smith",
      specialization: "Dermatologist",
      email: "janesmith@example.com",
    },
    {
      id: 3,
      fullName: "Dr. Emily Brown",
      specialization: "Neurologist",
      email: "emilybrown@example.com",
    },
  ]);

  // Handle opening the form for adding a new doctor
  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    onAddOpen();
  };

  // Handle opening the form for editing an existing doctor
  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    onUpdateOpen();
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = (doctorId) => {
    setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Stack spacing={1}>
          <Heading size="lg">Doctor Management</Heading>
          <Text color="gray.600">{doctors.length} doctors registered</Text>
        </Stack>
        <Button
          colorScheme="blue"
          leftIcon={<Plus size={20} />}
          onClick={handleAddDoctor}
        >
          Add New Doctor
        </Button>
      </Flex>

      {/* Search Section */}
      <Box mb={6}>
        <Flex gap={4}>
          <InputGroup flex={1}>
            <Input
              placeholder="Search by name, specialization, or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              allowClear
            />
          </InputGroup>
          <Button variant="outline">Filter</Button>
        </Flex>
      </Box>

      {/* Doctor List */}
      <DoctorList
        doctors={filteredDoctors}
        isLoading={false} // No loading state since data is static
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
      />

      {/* Add Doctor Modal */}
      <AddDoctorForm isOpen={isAddOpen} onClose={onAddClose} />

      {/* Update Doctor Modal */}
      <UpdateDoctorForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        doctorData={selectedDoctor}
      />
    </Container>
  );
};

export default DoctorManagement;
