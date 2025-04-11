import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Textarea,
  Box,
  Flex,
  FormErrorMessage,
  useToast,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Icon,
  IconButton,
  Image,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllMedicalTests,
  updateMedicalTest,
} from "../../../features/medical_test/medicalTestSlice";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";
import { UploadIcon } from "lucide-react";

const UpdateMedicalTestForm = ({ isOpen, onClose, testData }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    testName: "",
    testDescription: "",
    testPrice: 0,
    hospital: "",
    testImage: null,
    testImageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const hospitals = useSelector(
    (state) => state?.hospitalSlice?.hospitals?.hospitals
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllHospitals());
    }
  }, [isOpen, dispatch]);

  // Populate form when testData changes

  useEffect(() => {
    if (testData) {
      console.log("Populating form with testData:", testData);

      setFormData((prev) => {
        const updatedForm = {
          testName: testData.testName || "",
          testDescription: testData.testDescription || "",
          testPrice: testData.testPrice || 0,
          hospital: testData.hospital?._id || "",
          // Don't reset testImage if it's already a File
          testImage: testData?.testImage || null,
          testImageUrl: testData.testImage || "",
        };
        console.log("Updated form data:", updatedForm);
        return updatedForm;
      });
      if (testData.testImage) {
        setImagePreview(null); // Clear any previous preview
      }

      setTabIndex(0); // Reset tab when opening modal
    }
  }, [testData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.testName) newErrors.testName = "Test name is required";
    if (!formData.testDescription)
      newErrors.testDescription = "Test description is required";
    if (!formData.hospital) newErrors.hospital = "Hospital is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (file) {
      console.log("File type:", file.type);
      console.log("File size:", file.size);

      // IMPORTANT: Create a separate reference to the file
      const imageFile = file;

      setFormData((prev) => {
        const updatedForm = { ...prev, testImage: imageFile };
        console.log("Updated form data with new image:", updatedForm);
        return updatedForm;
      });

      // Create image preview
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log("FileReader completed loading");
        console.log("Preview data length:", reader.result?.length || 0);
        setImagePreview(reader.result);

        // CRITICAL: Double-check that formData still has the image
        console.log(
          "Verifying formData after preview set:",
          formData.testImage
        );
        if (!formData.testImage) {
          console.log("Image lost in formData, restoring");
          setFormData((prev) => ({ ...prev, testImage: imageFile }));
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
      };

      console.log("Starting FileReader.readAsDataURL");
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    console.log("Removing image");
    setFormData((prev) => ({ ...prev, testImage: null }));
    setImagePreview(null);
  };

  // Fix the issue with image being reset to null
  const handleSubmit = async (e) => {
    console.log("Entering handleSubmit");
    e.preventDefault();

    // IMPORTANT: Debug the image state immediately before validation
    console.log("Image state before validation:", {
      formDataImage: formData.testImage,
      imagePreview: imagePreview,
    });

    if (!validateForm()) {
      console.log("Form validation failed, errors:", errors);
      setTabIndex(0);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const form = new FormData();
      console.log("Creating FormData object for submission");

      // CRITICAL FIX: Check if we have image in preview but not in formData
      if (!formData.testImage && imagePreview instanceof File) {
        console.log("Recovering image from preview state");
        form.append("testImage", imagePreview);
      } else if (
        !formData.testImage &&
        typeof imagePreview === "string" &&
        imagePreview.startsWith("data:")
      ) {
        // Convert base64 to file if needed
        console.log("Converting base64 preview to file");
        const imageFile = await base64ToFile(
          imagePreview,
          "recovered_image.png"
        );
        form.append("testImage", imageFile);
      } else {
        // Debug current form state
        console.log("Current formData state:", formData);
        console.log("Image preview state:", imagePreview);

        // Add fields
        Object.keys(formData).forEach((key) => {
          if (key === "testImage") {
            if (formData.testImage) {
              console.log("Adding image to FormData:", key, formData.testImage);
              console.log(
                "Image type:",
                formData.testImage instanceof File
                  ? "File object"
                  : typeof formData.testImage
              );
              form.append(key, formData.testImage);
            } else {
              console.log("No image to append to FormData");
            }
          } else if (formData[key] !== "") {
            console.log("Adding field to FormData:", key, formData[key]);
            form.append(key, formData[key]);
          }
        });
      }

      // Add a helper function to convert base64 to a file
      const base64ToFile = async (dataUrl, filename) => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
      };

      // Debug FormData contents
      console.log("FormData entries:");
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send update request
      console.log("Dispatching updateMedicalTest with testId:", testData._id);
      const response = await dispatch(
        updateMedicalTest({
          testId: testData._id,
          testData: form,
        })
      ).unwrap();

      console.log("Update response:", response);

      if (response.isSuccess) {
        toast({
          title: "Medical Test updated",
          description: "Medical test information has been updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Refresh medical test list
        dispatch(fetchAllMedicalTests({ page: 1, limit: 10 }));
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update medical test",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating medical test:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while updating the medical test",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
      <ModalContent boxShadow="2xl" borderRadius="lg">
        <ModalHeader bg="green.50" borderTopRadius="lg" py={4}>
          <Flex alignItems="center">
            <Box fontWeight="bold">Edit Medical Test: {testData?.testName}</Box>
            <Badge
              colorScheme="green"
              ml={2}
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
            >
              ${testData?.testPrice}
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton className="hover:bg-gray-100 transition-colors" />
        <ModalBody p={6}>
          <Tabs
            isFitted
            variant="enclosed"
            colorScheme="green"
            index={tabIndex}
            onChange={handleTabsChange}
            className="shadow-sm"
          >
            <TabList mb={4} className="rounded-t-md border border-gray-200">
              <Tab
                className="font-medium transition-colors hover:bg-green-50"
                _selected={{ bg: "green.50", borderColor: "green.500" }}
              >
                Test Information
              </Tab>

              <Tab
                className="font-medium transition-colors hover:bg-green-50"
                _selected={{ bg: "green.50", borderColor: "green.500" }}
              >
                Image
              </Tab>
            </TabList>

            <TabPanels className="border border-gray-200 rounded-b-md bg-white shadow-sm">
              {/* Tab 1: Test Information */}
              <TabPanel>
                <VStack spacing={5} align="stretch">
                  <FormControl isInvalid={errors.testName}>
                    <FormLabel fontWeight="medium">Test Name</FormLabel>
                    <Input
                      name="testName"
                      value={formData.testName}
                      onChange={handleInputChange}
                      placeholder="Test Name"
                      className="hover:border-green-300 focus:border-green-500"
                      borderRadius="md"
                      bg="gray.50"
                      _focus={{ bg: "white" }}
                    />
                    {errors.testName && (
                      <FormErrorMessage className="text-red-500">
                        {errors.testName}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={errors.testDescription}>
                    <FormLabel fontWeight="medium">Test Description</FormLabel>
                    <Textarea
                      name="testDescription"
                      value={formData.testDescription}
                      onChange={handleInputChange}
                      placeholder="Test Description"
                      className="hover:border-green-300 focus:border-green-500"
                      borderRadius="md"
                      bg="gray.50"
                      _focus={{ bg: "white" }}
                      rows={4}
                      resize="vertical"
                    />
                    {errors.testDescription && (
                      <FormErrorMessage className="text-red-500">
                        {errors.testDescription}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="medium">Test Price</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.testPrice}
                      onChange={(value) =>
                        handleNumberInputChange("testPrice", value)
                      }
                      className="hover:border-green-300 focus:border-green-500"
                      borderRadius="md"
                    >
                      <NumberInputField bg="gray.50" _focus={{ bg: "white" }} />
                      <NumberInputStepper>
                        <NumberIncrementStepper className="hover:bg-green-50" />
                        <NumberDecrementStepper className="hover:bg-green-50" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Tab 3: Image */}
              <TabPanel>
                <VStack spacing={5} align="stretch">
                  <FormControl className="p-6 max-w-lg bg-white rounded-xl shadow-lg border border-gray-100">
                    <FormLabel className="font-semibold text-gray-800 mb-4 text-lg">
                      Test Image
                    </FormLabel>

                    <Box className="mb-4">
                      <Box
                        className={`relative border-2 ${
                          imagePreview || formData.testImageUrl
                            ? "border-blue-400 bg-blue-50"
                            : "border-dashed border-gray-300"
                        } rounded-lg p-6 transition-all duration-300 hover:border-blue-500 group`}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {/* Upload Icon and Text (shows only when no image) */}
                        {!(imagePreview || formData.testImageUrl) && (
                          <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            className="py-6"
                          >
                            <Icon
                              as={UploadIcon}
                              boxSize={8}
                              className="text-blue-500 mb-3 group-hover:text-blue-600"
                            />
                            <Text className="font-medium text-gray-700 mb-1">
                              Drag and drop your image here
                            </Text>
                            <Text className="text-sm text-gray-500">
                              or click to browse files
                            </Text>
                            <Text className="mt-2 text-xs text-gray-400">
                              Supported formats: JPG, PNG, GIF
                            </Text>
                          </Flex>
                        )}

                        {/* Image Preview */}
                        {(imagePreview || formData.testImageUrl) && (
                          <Flex
                            direction="column"
                            align="center"
                            className="relative"
                          >
                            <Box className="relative w-full max-w-xs mx-auto">
                              <Image
                                src={imagePreview || formData.testImageUrl}
                                alt="Test Preview"
                                className="w-full h-48 object-contain rounded-md"
                              />
                              <Flex className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-md">
                                <Text className="text-white text-sm truncate flex-1">
                                  {formData.testImage?.name || "Current Image"}
                                </Text>
                              </Flex>
                            </Box>

                            <Flex className="mt-4 space-x-3 w-full justify-center">
                              <Button
                                colorScheme="blue"
                                size="sm"
                                leftIcon={<Icon as={EditIcon} />}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-sm transition-all"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Change Image
                              </Button>

                              <Button
                                colorScheme="red"
                                size="sm"
                                leftIcon={<Icon as={DeleteIcon} />}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm shadow-sm transition-all"
                                onClick={handleImageRemove}
                              >
                                Remove
                              </Button>
                            </Flex>
                          </Flex>
                        )}
                      </Box>
                    </Box>

                    {/* File Requirements Note */}
                    <Text className="text-xs text-gray-500 mt-2">
                      Recommended: Square image (1:1 ratio), minimum 300x300px,
                      maximum 2MB
                    </Text>
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter bg="gray.50" borderBottomRadius="lg" py={4}>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors"
            borderRadius="md"
          >
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="hover:shadow-md transition-all"
            borderRadius="md"
            fontWeight="semibold"
          >
            Update Medical Test
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateMedicalTestForm;
