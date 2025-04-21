import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMedicalTests } from "../../features/medical_test/medicalTestSlice";
import MedicalTestList from "../../component/hospital_admin/medical_test/MedicalTestList";
import AddMedicalTest from "../../component/hospital_admin/medical_test/AddMedicalTest";
import UpdateMedicalTestForm from "../../component/hospital_admin/medical_test/UpdateMedicalTest";

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

  const dispatch = useDispatch();
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { medicalTests, isLoading, totalPages } = useSelector(
    (state) => state?.medicalTestSlice
  );

  // Fetch tests on load and when searchQuery changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchAllMedicalTests({ search: searchQuery , isAdmin: true}));
    }, 300); // debounce search

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, dispatch]);

  const handleAddTest = () => {
    setSelectedTest(null);
    onAddOpen();
  };

  const handleEditTest = (test) => {
    setSelectedTest(test);
    onUpdateOpen();
  };



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Stack spacing={1}>
          <Heading size="lg">Medical Test Management</Heading>
          <Text color="gray.600">
            {medicalTests.length} medical tests available
          </Text>
        </Stack>
        <Button
          colorScheme="blue"
          leftIcon={<Plus size={20} />}
          onClick={handleAddTest}
        >
          Add New Test
        </Button>
      </Flex>

      {/* Search */}
      <Box mb={6}>
        <Flex gap={4}>
          <InputGroup flex={1}>
            <Input
              placeholder="Search by test name, category, or turnaround time..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Flex>
      </Box>

      {/* Test List */}
      <MedicalTestList
        medicalTests={medicalTests}
        isLoading={isLoading}
        onEdit={handleEditTest}
       
      />

      {/* Modals */}
      <AddMedicalTest isOpen={isAddOpen} onClose={onAddClose} />
      <UpdateMedicalTestForm
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        testData={selectedTest}
      />
    </Container>
  );
};

export default MedicalTestManagement;
