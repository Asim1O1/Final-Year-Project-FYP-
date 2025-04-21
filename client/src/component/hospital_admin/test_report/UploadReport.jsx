import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Progress,
  useColorModeValue,
  Select,
  CardFooter,
  Icon,
  Divider,
  HStack,
  Alert,
  AlertIcon,
  InputRightElement,
  InputGroup,
  StepTitle,
  StepDescription,
  StepIndicator,
  Step,
  StepStatus,
  StepSeparator,
  Stepper,
  CardBody,
  Flex,
  CardHeader,
  Container,
  Card,
} from "@chakra-ui/react";
import {
  fetchUserCompletedTests,
  handleMedicalReportUpload,
} from "../../../features/test_report/testReportSlice";
import { BuildingIcon, ClipboardListIcon, FileIcon, FilesIcon, UploadIcon, UserIcon } from "lucide-react";
import { ArrowRightIcon, CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import { notification } from "antd";

const MedicalReportUpload = () => {
  const dispatch = useDispatch();
  const { isLoading, error, completedTests } = useSelector(
    (state) => state.testReportSlice
  );
  const [file, setFile] = useState(null);
  const [reportTitle, setReportTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [hospital, setHospitalId] = useState("");
  const [testId, setTestId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Only fetch completed tests when email is confirmed
  useEffect(() => {
    if (emailConfirmed) {
      console.log("Email confirmed, fetching user completed tests for:", email);
      dispatch(fetchUserCompletedTests(email));
    } else {
      console.log("Email not confirmed or changed, resetting selections");
      setTestId(""); // Reset test selection if email is not confirmed
      setHospitalId(""); // Reset hospital selection if email is not confirmed
    }
  }, [emailConfirmed, email, dispatch]);

  // Debug effect to log completed tests when they change
  useEffect(() => {
    console.log("completedTests updated:", completedTests);
    if (completedTests && completedTests.length > 0) {
      console.log("First test in array:", completedTests[0]);
      console.log("Hospital data for first test:", completedTests[0]?.hospital);
    } else {
      console.log("completedTests is empty or undefined");
    }
  }, [completedTests]);

  // Debug effect to log hospital and test selections
  useEffect(() => {
    console.log("Hospital selected:", hospital);
    console.log("Test selected:", testId);
  }, [hospital, testId]);

  let currentStep = 0;
  if (emailConfirmed) currentStep = 1;
  if (emailConfirmed && hospital) currentStep = 2;
  if (emailConfirmed && hospital && testId) currentStep = 3;

  // Color mode values
 const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const headingColor = useColorModeValue('blue.700', 'blue.300');
  const hintColor = useColorModeValue('gray.500', 'gray.400');
  const stepBgColor = useColorModeValue('blue.50', 'blue.900');
  const activeStepBg = useColorModeValue('blue.100', 'blue.800');

  const validateForm = () => {
    const newErrors = {};
    if (!file) newErrors.file = "File is required";
    if (!reportTitle.trim()) newErrors.reportTitle = "Report title is required";
    if (!doctorName.trim()) newErrors.doctorName = "Doctor name is required";
    if (!email.trim()) newErrors.email = "Patient email is required";
    if (!hospital) newErrors.hospital = "Hospital is required";
    if (!testId) newErrors.testId = "Test is required";

    if (file && file.size > 5 * 1024 * 1024) {
      newErrors.file = "File size should not exceed 5MB";
    }

    if (
      file &&
      !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
    ) {
      newErrors.file = "Only PDF, JPG, and PNG files are allowed";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ ...errors, email: "Patient email is required" });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return false;
    }

    // Clear any existing email error
    const updatedErrors = { ...errors };
    delete updatedErrors.email;
    setErrors(updatedErrors);

    return true;
  };

  const handleConfirmEmail = () => {
    console.log("Confirm email button clicked");
    if (validateEmail()) {
      console.log("Email validation passed, setting emailConfirmed to true");
      setEmailConfirmed(true);
    } else {
      console.log("Email validation failed");
    }
  };

  const handleChangeEmail = () => {
    console.log("Change email button clicked");
    setEmailConfirmed(false);
    // Reset dependent fields
    setHospitalId("");
    setTestId("");
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleHospitalChange = (e) => {
    const selectedHospitalId = e.target.value;
    console.log("Hospital selection changed to:", selectedHospitalId);
    setHospitalId(selectedHospitalId);
  };

  const handleTestChange = (e) => {
    const selectedTestId = e.target.value;
    console.log("Test selection changed to:", selectedTestId);
    setTestId(selectedTestId);
  };

  const simulateUploadProgress = (dispatch, reportData) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        dispatch(handleMedicalReportUpload(reportData));
      }
    }, 300);
  };

  const handleUploadSuccess = () => {
    notification.success({
      title: "Upload successful",
      description: "Your medical report has been uploaded successfully.",
      status: "success",
      duration: 3,
      isClosable: true,
    });

    // Reset form
    setFile(null);
    setReportTitle("");
    setDoctorName("");
    setEmail("");
    setEmailConfirmed(false);
    setHospitalId("");
    setTestId("");
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", {
      file,
      reportTitle,
      doctorName,
      email,
      hospital,
      testId,
    });

    if (!validateForm()) {
      console.log("Form validation failed with errors:", errors);
      return;
    }

    try {
      const reportData = new FormData();
      reportData.append("reportFile", file);
      reportData.append("reportTitle", reportTitle);
      reportData.append("doctorName", doctorName);
      reportData.append("email", email);
      reportData.append("hospital", hospital);
      reportData.append("testId", testId);

      // Simulate upload progress before actual upload
      simulateUploadProgress(dispatch, reportData);
    } catch (error) {
      console.error("Error during form submission:", error);
      notification.error({
        title: "Upload failed",
        description:
          error.message || "An error occurred while uploading your report.",
        status: "error",
        duration: 3,
        isClosable: true,
      });
    }
  };

  // Show error from Redux if any
  React.useEffect(() => {
    if (error) {
      console.error("Redux error detected:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // Handle successful upload
  React.useEffect(() => {
    if (!isLoading && uploadProgress === 100 && !error) {
      handleUploadSuccess();
    }
  }, [isLoading, uploadProgress, error]);

  // Debug render - Check hospital and test options
  const renderHospitalOptions = () => {
    console.log(
      "Rendering hospital options with completedTests:",
      completedTests
    );
    if (!completedTests || completedTests.length === 0) {
      return <option value="">No hospitals found</option>;
    }

    // Extract unique hospitals
    const uniqueHospitals = [];
    const hospitalIds = new Set();

    completedTests.forEach((test) => {
      if (
        test?.hospital &&
        test.hospital._id &&
        !hospitalIds.has(test.hospital._id)
      ) {
        hospitalIds.add(test.hospital._id);
        uniqueHospitals.push(test.hospital);
      }
    });

    console.log("Unique hospitals found:", uniqueHospitals);

    return uniqueHospitals.map((hospital) => (
      <option key={hospital._id} value={hospital._id}>
        {hospital.name} - {hospital.location}
      </option>
    ));
  };

  const renderTestOptions = () => {
    console.log("Rendering test options with completedTests:", completedTests);
    if (!completedTests || completedTests.length === 0) {
      return <option value="">No tests found</option>;
    }

    // Filter tests by selected hospital if one is selected
    const filteredTests = hospital
      ? completedTests.filter((test) => test.hospital._id === hospital)
      : completedTests;

    return filteredTests.map((test) => (
      <option key={test._id} value={test.testId}>
        {test.testName} 
      </option>
    ));
  };

  return (
    <Container maxW="container.md" py={8}>
    <Card
      bg={bgColor}
      borderRadius="xl"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      <CardHeader borderBottomWidth="1px" borderColor={borderColor} bg={useColorModeValue('gray.50', 'gray.750')}>
        <Flex align="center" gap={3}>
          <Icon as={UploadIcon} color="blue.500" boxSize={5} />
          <Heading size="lg" color={headingColor} fontWeight="600">
            Upload Medical Report
          </Heading>
        </Flex>
      </CardHeader>

      <CardBody pt={6}>
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Progress Stepper */}
            <Stepper size="sm" index={currentStep} colorScheme="blue" mb={2}>
              <Step>
                <StepIndicator bg={currentStep >= 0 ? activeStepBg : stepBgColor}>
                  <StepStatus 
                    complete={<Icon as={CheckIcon} />} 
                    incomplete={<Icon as={UserIcon} />} 
                    active={<Icon as={UserIcon} />} 
                  />
                </StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle>Patient</StepTitle>
                  <StepDescription>Confirm email</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator bg={currentStep >= 1 ? activeStepBg : stepBgColor}>
                  <StepStatus 
                    complete={<Icon as={CheckIcon} />} 
                    incomplete={<Icon as={BuildingIcon} />} 
                    active={<Icon as={BuildingIcon} />} 
                  />
                </StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle>Hospital</StepTitle>
                  <StepDescription>Select facility</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator bg={currentStep >= 2 ? activeStepBg : stepBgColor}>
                  <StepStatus 
                    complete={<Icon as={CheckIcon} />} 
                    incomplete={<Icon as={ClipboardListIcon} />} 
                    active={<Icon as={ClipboardListIcon} />} 
                  />
                </StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle>Test</StepTitle>
                  <StepDescription>Select test</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
              <Step>
                <StepIndicator bg={currentStep >= 3 ? activeStepBg : stepBgColor}>
                  <StepStatus 
                    complete={<Icon as={CheckIcon} />} 
                    incomplete={<Icon as={FileIcon} />} 
                    active={<Icon as={FilesIcon} />} 
                  />
                </StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle>Upload</StepTitle>
                  <StepDescription>Submit report</StepDescription>
                </Box>
              </Step>
            </Stepper>

            <Divider />

            {/* Patient Information Section */}
            <Box>
              <Heading size="sm" mb={4} color={labelColor}>
                Patient Information
              </Heading>
              
              <FormControl isInvalid={errors.email} isRequired mb={4}>
                <FormLabel color={labelColor}>Patient Email</FormLabel>
                <InputGroup size="md">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter patient email"
                    borderRadius="md"
                    isReadOnly={emailConfirmed}
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px blue.500",
                    }}
                    pr="140px"
                  />
                  <InputRightElement width="auto" pr={1}>
                    {!emailConfirmed ? (
                      <Button
                        onClick={handleConfirmEmail}
                        colorScheme="blue"
                        size="sm"
                        rightIcon={<ArrowRightIcon size={16} />}
                      >
                        Verify Email
                      </Button>
                    ) : (
                      <HStack spacing={1}>
                        <Icon as={CheckCircleIcon} color="green.500" />
                        <Button
                          onClick={handleChangeEmail}
                          variant="ghost"
                          size="sm"
                          color="gray.500"
                        >
                          Change
                        </Button>
                      </HStack>
                    )}
                  </InputRightElement>
                </InputGroup>
                {errors.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                )}
              </FormControl>
            </Box>

            {/* Hospital and Test Selection */}
            {emailConfirmed && (
              <>
                {completedTests?.length === 0 && (
                  <Alert status="info" variant="left-accent" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">
                      <Text fontWeight="medium">
                        {isLoading ? "Searching records..." : "No test records found"}
                      </Text>
                      <Text fontSize="sm">
                        Please verify the patient email address is correct.
                      </Text>
                    </Box>
                  </Alert>
                )}

                <Divider />
                
                <Box>
                  <Heading size="sm" mb={4} color={labelColor}>
                    Test Details
                  </Heading>
                  
                  <HStack spacing={4} align="flex-start">
                    <FormControl isInvalid={errors.hospital} isRequired flex="1">
                      <FormLabel color={labelColor}>Hospital</FormLabel>
                      <Select
                        placeholder="Select hospital"
                        value={hospital}
                        onChange={handleHospitalChange}
                        borderRadius="md"
                        icon={<BuildingIcon size={16} />}
                        _hover={{ borderColor: "blue.400" }}
                      >
                        {renderHospitalOptions()}
                      </Select>
                      {errors.hospital && (
                        <FormErrorMessage>{errors.hospital}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.testId} isRequired flex="1">
                      <FormLabel color={labelColor}>Test</FormLabel>
                      <Select
                        placeholder="Select test"
                        value={testId}
                        onChange={handleTestChange}
                        borderRadius="md"
                        icon={<ClipboardListIcon size={16} />}
                        _hover={{ borderColor: "blue.400" }}
                        isDisabled={!hospital}
                      >
                        {renderTestOptions()}
                      </Select>
                      {errors.testId && (
                        <FormErrorMessage>{errors.testId}</FormErrorMessage>
                      )}
                    </FormControl>
                  </HStack>
                </Box>
                
                <Divider />
              </>
            )}

            {/* Report Information */}
            <Box>
              <Heading size="sm" mb={4} color={labelColor}>
                Report Information
              </Heading>
              
              <FormControl isInvalid={errors.reportTitle} isRequired mb={4}>
                <FormLabel color={labelColor}>Report Title</FormLabel>
                <Input
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                  borderRadius="md"
                  _hover={{ borderColor: "blue.400" }}
                />
                {errors.reportTitle && (
                  <FormErrorMessage>{errors.reportTitle}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={errors.doctorName} isRequired mb={4}>
                <FormLabel color={labelColor}>Doctor Name</FormLabel>
                <Input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Enter doctor's name"
                  borderRadius="md"
                  _hover={{ borderColor: "blue.400" }}
                />
                {errors.doctorName && (
                  <FormErrorMessage>{errors.doctorName}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={errors.file} isRequired>
                <FormLabel color={labelColor}>Report File</FormLabel>
                <Box
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  bg={useColorModeValue("gray.50", "gray.700")}
                  _hover={{ borderColor: "blue.400", bg: useColorModeValue("blue.50", "blue.900") }}
                  transition="all 0.2s"
                  cursor="pointer"
                  as="label"
                >
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    display="none"
                  />
                  <Icon as={UploadIcon} mb={2} boxSize={8} color="blue.500" />
                  <Text fontWeight="medium">
                    Drag files here or click to browse
                  </Text>
                  <Text fontSize="sm" color={hintColor} mt={1}>
                    Allowed formats: PDF, JPG, PNG (Max 5MB)
                  </Text>
                </Box>
                {errors.file && <FormErrorMessage mt={2}>{errors.file}</FormErrorMessage>}
              </FormControl>
            </Box>

            {/* Upload Progress */}
            {(isLoading || uploadProgress > 0) && (
              <Box mt={2}>
                <Text mb={2} fontWeight="medium">
                  Uploading... {uploadProgress}%
                </Text>
                <Progress
                  value={uploadProgress}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                  bg={borderColor}
                  hasStripe
                  isAnimated
                />
              </Box>
            )}
          </VStack>
        </Box>
      </CardBody>

      <CardFooter 
        borderTopWidth="1px" 
        borderColor={borderColor}
        bg={useColorModeValue('gray.50', 'gray.750')}
      >
        <Button
          type="submit"
          onClick={handleSubmit}
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Uploading"
          size="lg"
          fontWeight="semibold"
          px={8}
          leftIcon={<UploadIcon size={18} />}
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
          transition="all 0.2s"
          width="full"
          isDisabled={!emailConfirmed}
        >
          Upload Report
        </Button>
      </CardFooter>
    </Card>
  </Container>
  );
};
export default MedicalReportUpload;
