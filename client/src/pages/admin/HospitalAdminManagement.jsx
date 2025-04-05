import { useEffect, useRef, useState } from "react";
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
import { handleGetAllHospitalAdmins } from "../../features/hospital_admin/hospitalAdminSlice";

import HospitalAdminList from "../../component/admin/hospital_admin/HospitalAdminList";
import { useDispatch, useSelector } from "react-redux";

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

  const dispatch = useDispatch();

  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { currentPage, setCurrentPage } = useState(1);
  const { totalPages, setTotalPages } = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      handleGetAllHospitalAdmins({
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm,
      })
    )
     
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [dispatch, currentPage, debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setDebouncedSearchTerm(searchTerm.trim());
    }
  };

  const handleAddAdmin = () => {
    onAddOpen();
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    onEditOpen();
  };

  const handleDeleteAdmin = (adminId) => {
    console.log("Delete admin with ID:", adminId);
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
