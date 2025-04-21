import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  SimpleGrid,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Textarea,
  Select,
  useToast,
  Icon,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { DollarSign, FileText, Building2 } from "lucide-react";
import { notification } from "antd";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";
import { createMedicalTest, fetchAllMedicalTests } from "../../../features/medical_test/medicalTestSlice";
import { SmallCloseIcon } from "@chakra-ui/icons";
import CustomLoader from "../../common/CustomSpinner";

const AddMedicalTest = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const initialFormData = {
    testName: "",
    testPrice: "",
    hospital: "",
    testDescription: "",
    testImage: null,
  };
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    dispatch(fetchAllMedicalTests({ page: currentPage, isAdmin: true }));
  }, [dispatch, currentPage, refreshTrigger]);
  

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);

  const hospitals = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.hospitals
  );

  useEffect(() => {
    dispatch(fetchAllHospitals());
  }, [dispatch]);
  

  const currentUser = useSelector((state) => state?.auth?.user?.data);

  const adminHospital = hospitals?.find(
    (hospital) => hospital._id === currentUser?.hospital
  );
  useEffect(() => {
    if (adminHospital?._id && !formData.hospital) {
      setFormData(prev => ({...prev, hospital: adminHospital._id}));
    }
  }, [adminHospital, formData.hospital]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, testImage: file }));

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, testImage: null }));
    setImagePreview(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.testName || !formData.testPrice || !formData.hospital) {
        console.log("form data .hospital", formData.hospital)
        throw new Error("Please fill all required fields");
      }

      const testData = new FormData();
      testData.append("testName", formData.testName);

      testData.append("testPrice", parseFloat(formData.testPrice));
      testData.append("hospital", formData.hospital);
      testData.append("testDescription", formData.testDescription);

      if (formData.testImage) {
        testData.append("testImage", formData.testImage);
      }

      console.log("The test data before sending it to the backend:");
      for (let [key, value] of testData.entries()) {
        console.log(key, value);
      }

      const response = await dispatch(createMedicalTest(testData)).unwrap();
      

      setRefreshTrigger(prev => prev + 1);
    

      notification.success({
        message: "Success",
        description: "Medical test added successfully",
        duration: 3,
        isClosable: true,
      });

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.log("Error adding test:", error);
      notification.error({
        message: "Failed to add test",
        description: error.message || "An unknown error occurred",
        duration: 3,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <Box
          position="fixed"
          top="0"
          right="0"
          bottom="0"
          left="0"
          zIndex="9999"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CustomLoader
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg="white" borderRadius="xl" shadow="xl">
          <ModalHeader borderBottom="1px" borderColor="gray.200" py={4} px={6}>
            <Flex align="center" gap={3}>
              <Box bg="teal.500" p={2} borderRadius="lg" color="white">
                <FileText size={20} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold">
                Add Medical Test
              </Text>
            </Flex>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody py={6} px={6}>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Test Name
                  </FormLabel>
                  <Input
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    placeholder="Complete Blood Count (CBC)"
                    bg="gray.50"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={6}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Test Price
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={DollarSign} size={18} />
                      </InputLeftElement>
                      <Input
                        name="testPrice"
                        value={formData.testPrice}
                        onChange={handleChange}
                        placeholder="50.00"
                        bg="gray.50"
                        pl="40px"
                        type="number"
                        step="0.01"
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Hospital
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={Building2} size={18} />
                    </InputLeftElement>
                    <Select
                      name="hospital"
                      value={adminHospital?._id || ""}
                      onChange={handleChange}
                      pl="40px"
                      isDisabled // Disable since there's only one option
                    >
                      {adminHospital && (
                        <option value={adminHospital._id}>
                          {adminHospital.name}
                        </option>
                      )}
                    </Select>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Test Image
                  </FormLabel>
                  <Box>
                    {imagePreview ? (
                      <Box position="relative" width="fit-content" mb={3}>
                        <Image
                          src={imagePreview}
                          alt="Test Image Preview"
                          maxH="200px"
                          borderRadius="md"
                        />
                        <IconButton
                          icon={<SmallCloseIcon />}
                          size="xs"
                          colorScheme="red"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={handleImageRemove}
                          aria-label="Remove image"
                        />
                      </Box>
                    ) : (
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        p={6}
                        border="2px dashed"
                        borderColor="gray.200"
                        borderRadius="md"
                        bg="gray.50"
                        cursor="pointer"
                        onClick={() =>
                          document.getElementById("testImage").click()
                        }
                      >
                        <Icon as={Image} boxSize={8} color="gray.400" mb={2} />
                        <Text color="gray.500" mb={1}>
                          Upload test image
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          Click to browse or drag and drop
                        </Text>
                      </Flex>
                    )}
                    <Input
                      id="testImage"
                      name="testImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      display="none"
                    />
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Test Description
                  </FormLabel>
                  <Textarea
                    name="testDescription"
                    value={formData.testDescription}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the test, including preparation instructions and what the test measures."
                    bg="gray.50"
                    rows={4}
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter borderTop="1px" borderColor="gray.200" py={4} px={6}>
              <Button variant="ghost" mr={3} onClick={onClose} size="md">
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="teal"
                size="md"
               
                loadingText="Adding..."
              >
                Add Test
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMedicalTest;
