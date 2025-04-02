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
} from "@chakra-ui/react";
import {
  fetchUserCompletedTests,
  handleMedicalReportUpload,
} from "../../../features/test_report/testReportSlice";

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

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("blue.600", "blue.400");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const hintColor = useColorModeValue("gray.500", "gray.400");

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
    toast({
      title: "Upload successful",
      description: "Your medical report has been uploaded successfully.",
      status: "success",
      duration: 5000,
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
      toast({
        title: "Upload failed",
        description:
          error.message || "An error occurred while uploading your report.",
        status: "error",
        duration: 5000,
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
    <Box
      maxW="container.md"
      mx="auto"
      p={6}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Heading size="lg" mb={6} color={headingColor} fontWeight="600">
        Upload Medical Report
      </Heading>

      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <FormControl isInvalid={errors.file} isRequired>
            <FormLabel color={labelColor}>Upload File</FormLabel>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              p={1}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              _hover={{ borderColor: "blue.400" }}
              bg={useColorModeValue("white", "gray.700")}
            />
            <Text fontSize="sm" color={hintColor} mt={1}>
              Allowed formats: PDF, JPG, PNG (Max 5MB)
            </Text>
            {errors.file && <FormErrorMessage>{errors.file}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={errors.reportTitle} isRequired>
            <FormLabel color={labelColor}>Report Title</FormLabel>
            <Input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Enter report title"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              _hover={{ borderColor: "blue.400" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
            {errors.reportTitle && (
              <FormErrorMessage>{errors.reportTitle}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={errors.doctorName} isRequired>
            <FormLabel color={labelColor}>Doctor Name</FormLabel>
            <Input
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Enter doctor's name"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              _hover={{ borderColor: "blue.400" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
            {errors.doctorName && (
              <FormErrorMessage>{errors.doctorName}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={errors.email} isRequired>
            <FormLabel color={labelColor}>Patient Email</FormLabel>
            <Box display="flex" alignItems="center" gap={2}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter patient email"
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                _hover={{ borderColor: "blue.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
                isReadOnly={emailConfirmed}
              />
              {!emailConfirmed ? (
                <Button
                  onClick={handleConfirmEmail}
                  colorScheme="blue"
                  size="md"
                  width="150px"
                >
                  Confirm Email
                </Button>
              ) : (
                <Button
                  onClick={handleChangeEmail}
                  colorScheme="gray"
                  size="md"
                  width="150px"
                >
                  Change Email
                </Button>
              )}
            </Box>
            {errors.email && (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            )}
          </FormControl>

          {emailConfirmed && (
            <>
              <Box
                p={3}
                bg="blue.50"
                color="blue.800"
                borderRadius="md"
                mb={2}
                display={completedTests?.length === 0 ? "block" : "none"}
              >
                <Text fontWeight="medium">
                  Fetching tests for email: {email}
                  {isLoading && " (Loading...)"}
                </Text>
                <Text fontSize="sm">
                  {!completedTests || completedTests.length === 0
                    ? "No test records found for this email. Please verify the email address."
                    : `Found ${completedTests.length} test records.`}
                </Text>
              </Box>
              <FormControl isInvalid={errors.hospital} isRequired>
                <FormLabel color={labelColor}>Hospital</FormLabel>
                <Select
                  placeholder="Select hospital"
                  value={hospital}
                  onChange={handleHospitalChange}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500",
                  }}
                >
                  {renderHospitalOptions()}
                </Select>
                {errors.hospital && (
                  <FormErrorMessage>{errors.hospital}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={errors.testId} isRequired>
                <FormLabel color={labelColor}>Test</FormLabel>
                <Select
                  placeholder="Select test"
                  value={testId}
                  onChange={handleTestChange}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500",
                  }}
                >
                  {renderTestOptions()}
                </Select>
                {errors.testId && (
                  <FormErrorMessage>{errors.testId}</FormErrorMessage>
                )}
              </FormControl>
            </>
          )}

          {(isLoading || uploadProgress > 0) && (
            <Box my={4}>
              <Text mb={2} fontWeight="medium">
                Uploading... {uploadProgress}%
              </Text>
              <Progress
                value={uploadProgress}
                size="sm"
                colorScheme="blue"
                borderRadius="md"
                bg={borderColor}
              />
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Uploading"
            size="md"
            fontWeight="semibold"
            px={6}
            mt={2}
            _hover={{ bg: "blue.700" }}
            boxShadow="sm"
            isDisabled={!emailConfirmed}
          >
            Upload Report
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};
export default MedicalReportUpload;
