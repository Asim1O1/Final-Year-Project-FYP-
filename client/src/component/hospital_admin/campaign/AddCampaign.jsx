import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { notification } from "antd";
import { Building2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCampaigns,
  handleCampaignCreation,
} from "../../../features/campaign/campaignSlice";
import { fetchAllHospitals } from "../../../features/hospital/hospitalSlice";

const AddCampaignForm = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  // Fetch hospitals from Redux store
  const hospitals = useSelector((state) => {
    if (state?.hospitalSlice?.hospitals?.hospitals) {
      return state.hospitalSlice.hospitals.hospitals;
    }
    return state?.hospitalSlice?.hospitals || [];
  });

  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const hospitalId = currentUser?.hospital;
  const [currentPage, setCurrentPage] = useState(1);

  const adminHospital = hospitals?.find(
    (hospital) => hospital._id === currentUser?.hospital
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    hospital: adminHospital?._id || "",
    allowVolunteers: false,
    maxVolunteers: 0,
    volunteerQuestions: [],
  });

  const [errors, setErrors] = useState({});
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    questionType: "question",
    isRequired: true,
  });

  useEffect(() => {
    dispatch(fetchAllHospitals({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));

    // Reset volunteer-related errors when toggling allowVolunteers
    if (name === "allowVolunteers" && !checked) {
      setErrors((prev) => ({
        ...prev,
        maxVolunteers: "",
        volunteerQuestions: "",
      }));
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionTypeChange = (e) => {
    const questionType = e.target.value;
    setNewQuestion((prev) => ({
      ...prev,
      questionType,
    }));
  };

  const handleRequiredChange = (e) => {
    const { checked } = e.target;
    setNewQuestion((prev) => ({ ...prev, isRequired: checked }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      setFormData((prev) => ({
        ...prev,
        volunteerQuestions: [...prev.volunteerQuestions, { ...newQuestion }],
      }));

      // Reset new question form
      setNewQuestion({
        question: "",
        questionType: "question",
        isRequired: true,
      });

      // Clear any question-related errors
      setErrors((prev) => ({
        ...prev,
        volunteerQuestions: "",
      }));
    }
  };

  const handleRemoveQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      volunteerQuestions: prev.volunteerQuestions.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (adminHospital && !formData.hospital) {
      setFormData((prev) => ({ ...prev, hospital: adminHospital._id }));
    } else if (!formData.hospital) {
      newErrors.hospital = "Hospital is required";
    }

    if (formData.allowVolunteers) {
      if (parseInt(formData.maxVolunteers) <= 0)
        newErrors.maxVolunteers = "Maximum volunteers must be greater than 0";
      if (formData.volunteerQuestions.length === 0)
        newErrors.volunteerQuestions =
          "At least one volunteer question is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before validation:", formData);

    // Create a working copy of form data that we can modify immediately
    const submissionData = { ...formData };

    // Set hospital ID from adminHospital if available and not already set
    if (adminHospital && !submissionData.hospital) {
      submissionData.hospital = adminHospital._id;
    }

    // Validate with our modified data
    const newErrors = {};
    if (!submissionData.title.trim()) newErrors.title = "Title is required";
    if (!submissionData.description.trim())
      newErrors.description = "Description is required";
    if (!submissionData.date) newErrors.date = "Date is required";
    if (!submissionData.location.trim())
      newErrors.location = "Location is required";
    if (!submissionData.hospital) newErrors.hospital = "Hospital is required";

    if (submissionData.allowVolunteers) {
      if (parseInt(submissionData.maxVolunteers) <= 0)
        newErrors.maxVolunteers = "Maximum volunteers must be greater than 0";
      if (submissionData.volunteerQuestions.length === 0)
        newErrors.volunteerQuestions =
          "At least one volunteer question is required";
    }

    // Update the errors state
    setErrors(newErrors);

    // If there are errors, stop the submission
    if (Object.keys(newErrors).length > 0) {
      console.log("Form validation failed with errors:", newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting campaign data:", submissionData);

      // Ensure maxVolunteers is a number
      if (submissionData.allowVolunteers) {
        submissionData.maxVolunteers = parseInt(submissionData.maxVolunteers);
      }

      // Dispatch with the validated data
      const actionResult = await dispatch(
        handleCampaignCreation(submissionData)
      );
      console.log("Action result:", actionResult);
      if (handleCampaignCreation.fulfilled.match(actionResult)) {
        notification.success({
          message: "Campaign Created",
          description: "The campaign has been created successfully.",
          duration: 6,
        });

        dispatch(
          fetchAllCampaigns({
            page: currentPage,
            limit: 10,
            hospital: hospitalId,
          })
        );

        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          hospital: "",
          allowVolunteers: false,
          maxVolunteers: 0,
          volunteerQuestions: [],
        });

        onClose();
      } else {
        notification.error({
          message: "Error",
          description:
            actionResult?.error?.message ||
            "There was an error creating the campaign. Please try again.",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Campaign creation error:", error);
      notification.error({
        message: "Error",
        description:
          (error && error.message) ||
          "There was an error creating the campaign. Please try again.",
        duration: 5,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Campaign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                placeholder="Enter campaign title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Enter campaign description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.date}>
              <FormLabel>Date</FormLabel>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              <FormErrorMessage>{errors.date}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.location}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                placeholder="Enter campaign location"
                value={formData.location}
                onChange={handleInputChange}
              />
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            </FormControl>

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
                  onChange={handleInputChange}
                  pl="40px"
                  isDisabled={!!adminHospital} // Disable only when there's a hospital
                >
                  {adminHospital && (
                    <option value={adminHospital._id}>
                      {adminHospital.name}
                    </option>
                  )}
                </Select>
              </InputGroup>
              {errors.hospital && (
                <FormErrorMessage>{errors.hospital}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Allow Volunteers</FormLabel>
              <Checkbox
                name="allowVolunteers"
                isChecked={formData.allowVolunteers}
                onChange={handleCheckboxChange}
              >
                Allow Volunteers
              </Checkbox>
            </FormControl>

            {formData.allowVolunteers && (
              <>
                <FormControl isInvalid={!!errors.maxVolunteers}>
                  <FormLabel>Max Volunteers</FormLabel>
                  <Input
                    name="maxVolunteers"
                    type="number"
                    min="1"
                    placeholder="Enter max number of volunteers"
                    value={formData.maxVolunteers}
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{errors.maxVolunteers}</FormErrorMessage>
                </FormControl>

                {/* Volunteer Questions Section */}
                <Box
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  mt={4}
                >
                  <Heading size="md" mb={4}>
                    Volunteer Questions
                  </Heading>

                  {/* Existing Questions List */}
                  {formData.volunteerQuestions.length > 0 ? (
                    <Box mb={6}>
                      <Text fontWeight="bold" mb={2}>
                        Added Questions:
                      </Text>
                      {formData.volunteerQuestions.map((q, index) => (
                        <Box
                          key={index}
                          p={3}
                          bg="gray.50"
                          borderRadius="md"
                          mb={2}
                        >
                          <Flex justify="space-between" align="center">
                            <Box>
                              <Text fontWeight="semibold">
                                {q.question}{" "}
                                {q.isRequired && (
                                  <Badge colorScheme="red">Required</Badge>
                                )}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Type:{" "}
                                {q.questionType === "question"
                                  ? "Text Response"
                                  : "Yes/No"}
                              </Text>
                            </Box>
                            <IconButton
                              aria-label="Remove question"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveQuestion(index)}
                            />
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box mb={4}>
                      {errors.volunteerQuestions ? (
                        <Alert status="error" borderRadius="md">
                          <AlertIcon />
                          {errors.volunteerQuestions}
                        </Alert>
                      ) : (
                        <Text color="gray.500">
                          No questions added yet. Add at least one question
                          below.
                        </Text>
                      )}
                    </Box>
                  )}

                  {/* Add New Question Form */}
                  <Box
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <FormControl mb={3}>
                      <FormLabel>Question Text</FormLabel>
                      <Input
                        name="question"
                        placeholder="Enter question"
                        value={newQuestion.question}
                        onChange={handleQuestionChange}
                      />
                    </FormControl>

                    <FormControl mb={3}>
                      <FormLabel>Question Type</FormLabel>
                      <Select
                        name="questionType"
                        value={newQuestion.questionType}
                        onChange={handleQuestionTypeChange}
                      >
                        <option value="question">Text Response</option>
                        <option value="boolean">Yes/No</option>
                      </Select>
                    </FormControl>

                    <FormControl display="flex" alignItems="center" mb={3}>
                      <FormLabel mb="0">Required Question</FormLabel>
                      <Switch
                        isChecked={newQuestion.isRequired}
                        onChange={handleRequiredChange}
                      />
                    </FormControl>

                    <Button
                      colorScheme="blue"
                      onClick={handleAddQuestion}
                      isDisabled={!newQuestion.question.trim()}
                    >
                      Add Question
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            isDisabled={isSubmitting}
          >
            Create Campaign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCampaignForm;
