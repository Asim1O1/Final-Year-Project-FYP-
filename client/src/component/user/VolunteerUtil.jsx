// VolunteerRequestModal.jsx
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const VolunteerRequestModal = ({
  isOpen,
  onClose,
  campaign,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && campaign?.volunteerQuestions) {
      const initialData = {};
      campaign.volunteerQuestions.forEach((q, index) => {
        initialData[`question_${index}`] =
          q.questionType === "boolean" ? false : "";
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, campaign]);

  const handleInputChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      [`question_${index}`]: value,
    }));

    // Clear error for this field if it exists
    if (errors[`question_${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`question_${index}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    campaign.volunteerQuestions.forEach((question, index) => {
      if (question.isRequired) {
        const value = formData[`question_${index}`];
        if (
          value === "" ||
          value === undefined ||
          (question.questionType !== "boolean" && !value?.trim?.())
        ) {
          newErrors[`question_${index}`] = "This question is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Format the answers for submission
      const answers = campaign.volunteerQuestions.map((question, index) => ({
        question: question.question,
        answer: formData[`question_${index}`],
        questionType: question.questionType,
      }));

      try {
        await onSubmit({ campaignId: campaign._id, answers });
        notification.success({
          message: "Request Submitted",
          description: "Your volunteer request has been submitted successfully",
          status: "success",
          duration: 3,
          isClosable: true,
        });
        navigate("/campaigns");
        onClose();
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message || "Failed to submit volunteer request",
          status: "error",
          duration: 3,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Volunteer Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} color="gray.600">
            Please answer the following questions to apply as a volunteer for "
            {campaign?.title}".
          </Text>

          <VStack spacing={4} align="stretch">
            {campaign?.volunteerQuestions?.map((question, index) => (
              <FormControl
                key={index}
                isInvalid={errors[`question_${index}`]}
                isRequired={question.isRequired}
              >
                <FormLabel>{question.question}</FormLabel>

                {question.questionType === "boolean" ? (
                  <Checkbox
                    isChecked={formData[`question_${index}`] || false}
                    onChange={(e) => handleInputChange(index, e.target.checked)}
                  >
                    Yes
                  </Checkbox>
                ) : (
                  <Textarea
                    value={formData[`question_${index}`] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}

                <FormErrorMessage>
                  {errors[`question_${index}`] ||
                    "Unknow error! Please try again."}
                </FormErrorMessage>
              </FormControl>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Submit Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// VolunteerRequestButton.jsx

import { Box, useDisclosure } from "@chakra-ui/react";
import { HeartHandshake } from "lucide-react";

import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { volunteerForCampaign } from "../../features/campaign/campaignSlice";

export const VolunteerRequestButton = ({ campaign }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.campaignSlice);

  // Debug: Log user and campaign data
  console.log("User:", user);
  console.log("Campaign:", campaign);

  // Check user's volunteer status
  const hasRequested = campaign?.volunteerRequests?.some(
    (request) => request?.user === user?.data?._id
  );

  console.log("The ids are");
  console.log("hasRequested:", hasRequested);

  const isVolunteer = campaign?.volunteers?.some(
    (volunteer) => volunteer._id === user?.data?._id
  );
  console.log("isVolunteer:", isVolunteer);

  // Check if campaign is full
  const isFull = campaign?.volunteers?.length >= campaign?.maxVolunteers;
  console.log(
    "isFull:",
    isFull,
    `(${campaign?.volunteers?.length}/${campaign?.maxVolunteers})`
  );

  // Check if campaign is in the past
  const campaignDate = new Date(campaign?.date);
  const currentDate = new Date();
  const isPast = campaignDate < currentDate;
  console.log(
    "isPast:",
    isPast,
    "Campaign Date:",
    campaignDate,
    "Current Date:",
    currentDate
  );
  console.log("is past is", isPast);

  const handleOpenModal = () => {
    if (!user) {
      console.log("No user logged in - showing login warning toast");
      notification.error({
        message: "Login Required",
        description: "Please log in to request volunteering",
        status: "warning",
        duration: 3,
        isClosable: true,
      });
      return;
    }

    console.log("Opening volunteer request modal");
    onOpen();
  };

  const handleSubmitRequest = async (requestData) => {
    console.log("Submitting volunteer request with data:", requestData);
    return dispatch(volunteerForCampaign(requestData)).unwrap();
  };

  // Determine button state
  const isButtonDisabled =
    !campaign?.allowVolunteers ||
    hasRequested ||
    isVolunteer ||
    isFull ||
    isPast;
  console.log("isButtonDisabled:", isButtonDisabled, {
    allowVolunteers: campaign?.allowVolunteers,
    hasRequested,
    isVolunteer,
    isFull,
    isPast,
  });

  // Determine button text
  let buttonText = "Request to Volunteer";
  if (hasRequested) buttonText = "Request Pending";
  if (isVolunteer) buttonText = "Already Volunteering";
  if (isFull) buttonText = "No Volunteer Slots Available";
  if (isPast) buttonText = "Campaign Ended";
  console.log("buttonText:", buttonText);

  return (
    <Box>
      <Button
        leftIcon={<HeartHandshake size={18} />}
        colorScheme="blue"
        isDisabled={isButtonDisabled}
        onClick={handleOpenModal}
        size="md"
        borderRadius="full"
        boxShadow="sm"
        _hover={{ boxShadow: "md" }}
      >
        {buttonText}
      </Button>

      <VolunteerRequestModal
        isOpen={isOpen}
        onClose={onClose}
        campaign={campaign}
        onSubmit={handleSubmitRequest}
        isLoading={isLoading}
      />
    </Box>
  );
};
