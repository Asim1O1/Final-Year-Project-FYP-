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
import UpdateMedicalTestForm from "../../component/hospital_admin/medical_test/UpdateMedicalTest";
import MedicalTestList from "../../component/hospital_admin/medical_test/MedicalTestList";
import AddMedicalTest from "../../component/hospital_admin/medical_test/AddMedicalTest";



const MedicalTestManagement = () => {
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
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Static test data
  const [tests, setTests] = useState([
    {
      id: 1,
      testName: "Complete Blood Count",
      category: "Hematology",
      price: 45.99,
      turnaroundTime: "24 hours",
    },
    {
      id: 2,
      testName: "Lipid Profile",
      category: "Biochemistry",
      price: 65.50,
      turnaroundTime: "48 hours",
    },
    {
      id: 3,
      testName: "Thyroid Function Test",
      category: "Endocrinology",
      price: 85.75,
      turnaroundTime: "72 hours",
    },
  ]);

  // Handle opening the form for adding a new test
  const handleAddTest = () => {
    setSelectedTest(null);
    onAddOpen();
  };

  // Handle opening the form for editing an existing test
  const handleEditTest = (test) => {
    setSelectedTest(test);
    onUpdateOpen();
  };

  // Handle deleting a test
  const handleDeleteTest = (testId) => {
    setTests(tests.filter((test) => test.id !== testId));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter tests based on search query
  const filteredTests = tests.filter(
    (test) =>
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.turnaroundTime.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Stack spacing={1}>
          <Heading size="lg">Medical Test Management</Heading>
          <Text color="gray.600">{tests.length} tests available</Text>
        </Stack>
        <Button
          colorScheme="blue"
          leftIcon={<Plus size={20} />}
          onClick={handleAddTest}
        >
          Add New Test
        </Button>
      </Flex>

      {/* Search Section */}
      <Box mb={6}>
        <Flex gap={4}>
          <InputGroup flex={1}>
            <Input
              placeholder="Search by test name, category, or turnaround time..."
              value={searchQuery}
              onChange={handleSearchChange}
              allowClear
            />
          </InputGroup>
          <Button variant="outline">Filter</Button>
        </Flex>
      </Box>

      {/* Test List */}
      <MedicalTestList
        tests={filteredTests}
        isLoading={false} // No loading state since data is static
        onEdit={handleEditTest}
        onDelete={handleDeleteTest}
      />

      {/* Add Test Modal */}
      <AddMedicalTest isOpen={isAddOpen} onClose={onAddClose} />

      {/* Update Test Modal */}
      <UpdateMedicalTestForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        testData={selectedTest}
      />
    </Container>
  );
};

export default MedicalTestManagement;