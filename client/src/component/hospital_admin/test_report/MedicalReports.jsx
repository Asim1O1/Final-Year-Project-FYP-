import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHospitalMedicalReports,
  handleMedicalReportDeletion,
} from "../../../features/test_report/testReportSlice";
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  DeleteIcon,
  ExternalLinkIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { notification } from "antd";

const MedicalReports = () => {
  const dispatch = useDispatch();
  const { reports, isLoading, error } = useSelector(
    (state) => state.testReportSlice
  );
  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const adminId = currentUser?._id;
  const [isHospitalAdmin, setIsHospitalAdmin] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    if (currentUser?.role === "hospital_admin") {
      setIsHospitalAdmin(true);
    }

    if (adminId) {
      dispatch(fetchHospitalMedicalReports(adminId));
    }
  }, [dispatch, adminId, currentUser]);

  const handleDeleteConfirmation = (reportId) => {
    setSelectedReportId(reportId);
    onOpen();
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(
        handleMedicalReportDeletion(selectedReportId)
      ).unwrap();
      console.log("The result is", result);

      // Only refetch if deletion was successful
      if (result.isSuccess) {
        await dispatch(fetchHospitalMedicalReports(adminId)).unwrap();
      }

      notification.success({});
    } catch (error) {
      console.error("Failed to delete report:", error);

      notification.error({});
    } finally {
      onClose();
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("blue.700", "blue.300");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  if (isLoading) {
    return <div className="loading-container">Loading medical reports...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        {error.data?.message.includes("not linked to any hospital") &&
          isHospitalAdmin && (
            <div className="info-message">
              <p>
                Your admin account is not linked to any hospital. Please contact
                the system administrator.
              </p>
            </div>
          )}
      </div>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box
        bg={bgColor}
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Flex
          justify="space-between"
          align="center"
          bg={bgColor}
          p={5}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <HStack spacing={3}>
            <Icon as={TimeIcon} color="blue.500" boxSize={6} />
            <Heading as="h2" size="lg" color={headingColor} fontWeight="bold">
              Medical Reports
            </Heading>
          </HStack>

          {isHospitalAdmin && (
            <Badge
              colorScheme="green"
              fontSize="sm"
              px={3}
              py={1.5}
              borderRadius="full"
              fontWeight="medium"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Hospital Admin
            </Badge>
          )}
        </Flex>

        {reports && reports.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                <Tr>
                  <Th>Report Title</Th>
                  <Th>Date</Th>
                  <Th>Doctor</Th>
                  <Th>Patient</Th>
                  <Th width="200px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reports.map((report, index) => (
                  <Tr
                    key={report._id}
                    _hover={{ bg: hoverBgColor }}
                    bg={
                      index % 2 === 0
                        ? "transparent"
                        : useColorModeValue("gray.50", "gray.800")
                    }
                    transition="all 0.2s"
                  >
                    <Td fontWeight="medium" color={headingColor}>
                      {report.reportTitle || "Unknown Test"}
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Icon as={CalendarIcon} color="gray.500" size={4} />
                        <Text>
                          {report.uploadedAt
                            ? new Date(report.uploadedAt).toLocaleDateString()
                            : "Date not specified"}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>{report.doctorName || "Not specified"}</Td>
                    <Td>{report.patient?.email || "Not specified"}</Td>
                    <Td>
                      <HStack spacing={2}>
                        {report.reportFile ? (
                          <Link
                            href={report.reportFile}
                            isExternal
                            textDecoration="none"
                          >
                            <Button
                              colorScheme="blue"
                              size="sm"
                              rightIcon={<ExternalLinkIcon size={16} />}
                              _hover={{ transform: "translateY(-1px)" }}
                              transition="all 0.2s"
                              borderRadius="md"
                            >
                              View
                            </Button>
                          </Link>
                        ) : (
                          <Text color="gray.500" fontSize="sm">
                            No document
                          </Text>
                        )}
                        {isHospitalAdmin && (
                          <Button
                            colorScheme="red"
                            size="sm"
                            leftIcon={<DeleteIcon size={16} />}
                            onClick={() => handleDeleteConfirmation(report._id)}
                            _hover={{ transform: "translateY(-1px)" }}
                            transition="all 0.2s"
                            borderRadius="md"
                          >
                            Delete
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            py={10}
            px={6}
            m={4}
            borderRadius="lg"
            bg={highlightColor}
          >
            <AlertIcon boxSize={8} mr={0} mb={4} />
            <Heading as="h4" size="md" mb={2}>
              No medical reports found
            </Heading>

            {isHospitalAdmin && (
              <Text color="gray.600" maxW="md">
                As an admin, you'll see reports from patients at your hospital
                once they are created.
              </Text>
            )}
          </Alert>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Medical Report
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this medical report? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default MedicalReports;
