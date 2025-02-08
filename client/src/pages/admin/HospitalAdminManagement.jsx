import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Card,
  CardBody,
  Container,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import AddHospitalAdminForm from "../../component/admin/hospital_admin/AddHospitalAdminForm";

import HospitalAdminList from "../../component/admin/hospital_admin/HospitalAdminList";

const HospitalAdminManagement = () => {
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddAdmin = () => {
    onAddOpen();
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    onEditOpen();
  };

  const handleDeleteAdmin = (adminId) => {
    console.log("Delete admin with ID:", adminId);
    // Implement delete functionality
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Hospital Admin Management</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleAddAdmin}
        >
          Add New Admin
        </Button>
      </Flex>

      {/* Search Section */}
      <Card mb={6} variant="outline">
        <CardBody pt={6}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray.400" />}
            />
            <Input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </CardBody>
      </Card>

      {/* Admin List Component */}
      <Box>
        <HospitalAdminList
          onEdit={handleEditAdmin}
          onDelete={handleDeleteAdmin}
        />
      </Box>

      {/* Add Admin Modal */}
      <AddHospitalAdminForm isOpen={isAddOpen} onClose={onAddClose} />
    </Container>
  );
};

export default HospitalAdminManagement;
