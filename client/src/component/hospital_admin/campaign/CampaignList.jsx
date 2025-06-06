import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { notification } from "antd";
import {
  AlertCircle,
  Building,
  Calendar,
  CalendarX,
  Edit,
  MapPin,
  MoreVertical,
  Plus,
  RefreshCw,
  Trash,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllCampaigns,
  handleCampaignDeletion,
} from "../../../features/campaign/campaignSlice";
import Pagination from "../../../utils/Pagination";

const CampaignList = ({ onEdit }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state?.auth?.user?.data);
  const hospitalId = currentUser?.hospital;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const cancelRef = useRef();
  const userRole = currentUser?.role;

  // Fetch campaigns from Redux store
  const { campaigns, isLoading, error } = useSelector(
    (state) => state?.campaignSlice?.campaigns
  );
  console.log("the campaigns are", campaigns);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector(
    (state) => state?.campaignSlice?.campaigns?.pagination?.totalPages
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const cardHoverBorder = useColorModeValue("blue.300", "blue.500");
  const textColorPrimary = useColorModeValue("gray.800", "white");
  const textColorSecondary = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  // Status badge color mapping
  const statusColors = {
    active: "green",
    completed: "blue",
    upcoming: "purple",
    canceled: "red",
    draft: "orange",
  };
  // Fetch campaigns on component mount
  useEffect(() => {
    dispatch(
      fetchAllCampaigns({
        page: currentPage,
        limit: 10,
        hospital: hospitalId,
      })
    );
  }, [dispatch, currentPage, hospitalId]);

  // Delete dialog handlers
  const onDeleteOpen = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteOpen(true);
  };

  const onDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedCampaign(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCampaign) {
      try {
        const resultAction = await dispatch(
          handleCampaignDeletion(selectedCampaign._id)
        );

        if (handleCampaignDeletion.fulfilled.match(resultAction)) {
          notification.success({
            message: "Campaign Deleted",
            description: `"${selectedCampaign.title}" has been removed successfully.`,
            duration: 5.3,
            isClosable: true,
            position: "top-right",
          });

          dispatch(
            fetchAllCampaigns({
              page: currentPage,
              limit: 10,
              hospital: hospitalId,
            })
          );

          onDeleteClose();
        } else {
          notification.error({
            message: "Deletion Failed",
            description: "Something went wrong. Please try again.",
            duration: 5.3,
            isClosable: true,
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting campaign:", error);
        notification.error({
          message: "Error",
          description: "An unexpected error occurred.",
          duration: 5.3,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Box bg="gray.50" p={4} borderRadius="lg" shadow="sm">
        <Stack spacing={6}>
          {[1, 2, 3].map((item) => (
            <Box
              key={item}
              p={6}
              shadow="sm"
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
            >
              <Skeleton height="36px" width="70%" mb={4} />
              <Skeleton height="20px" width="100%" mb={3} />
              <Skeleton height="20px" width="90%" mb={5} />
              <Flex gap={8} mt={6} mb={4}>
                <Skeleton height="20px" width="30%" />
                <Skeleton height="20px" width="30%" />
              </Flex>
              <Flex justify="space-between">
                <Skeleton height="24px" width="120px" />
                <Skeleton height="36px" width="120px" borderRadius="md" />
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={12} px={6} bg="gray.50" borderRadius="lg">
        <Icon as={AlertCircle} boxSize={12} color="red.500" mb={4} />
        <Heading as="h3" size="lg" mb={3}>
          Error loading campaigns
        </Heading>
        <Text color="gray.600" fontSize="lg">
          {error?.error || "Please try again later."}
        </Text>
        <Button
          mt={6}
          colorScheme="blue"
          leftIcon={<RefreshCw size={18} />}
          onClick={() =>
            dispatch(
              fetchAllCampaigns({
                page: currentPage,
                limit: 10,
                hospital: hospitalId,
              })
            )
          }
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Box
        textAlign="center"
        py={16}
        px={6}
        bg="gray.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Icon as={CalendarX} boxSize={12} color="gray.400" mb={4} />
        <Heading as="h3" size="lg" mb={3} color="gray.700">
          No campaigns found
        </Heading>
        <Text color="gray.500" fontSize="lg" maxW="md" mx="auto">
          There are currently no campaigns matching your search criteria.
        </Text>
        {userRole === "hospital_admin" && (
          <Button
            mt={8}
            size="lg"
            colorScheme="blue"
            leftIcon={<Plus size={20} />}
            as={Link}
            to="/campaigns/new"
          >
            Create New Campaign
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={6}>
        {campaigns.map((campaign) => {
          return (
            <Box
              key={campaign._id}
              p={{ base: 4, md: 6 }}
              shadow="sm"
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="lg"
              bg={cardBg}
              transition="all 0.2s ease"
              _hover={{
                shadow: "md",
                borderColor: cardHoverBorder,
                transform: "translateY(-2px)",
              }}
              position="relative"
              overflow="hidden"
            >
              {/* Status indicator */}
              <Badge
                position="absolute"
                top={4}
                right={4}
                colorScheme={statusColors[status] || "gray"}
                textTransform="capitalize"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              ></Badge>

              <Flex
                justify="space-between"
                align="flex-start"
                flexDirection={{ base: "column", md: "row" }}
                gap={{ base: 4, md: 0 }}
              >
                <Stack spacing={2} flex="1" pr={{ md: 12 }}>
                  <Heading
                    size={{ base: "md", md: "md" }}
                    fontWeight="bold"
                    color={textColorPrimary}
                    lineHeight="1.3"
                  >
                    {campaign.title}
                  </Heading>
                  <Text
                    color={textColorSecondary}
                    fontSize={{ base: "sm", md: "md" }}
                    noOfLines={2}
                    maxW="3xl"
                    lineHeight="1.6"
                  >
                    {campaign?.description || "No description provided"}
                  </Text>
                </Stack>

                {userRole === "hospital_admin" && (
                  <Menu placement="bottom-end">
                    <MenuButton
                      as={IconButton}
                      icon={<MoreVertical size={18} />}
                      variant="ghost"
                      size="sm"
                      aria-label="More options"
                      borderRadius="md"
                      ml={{ md: 4 }}
                      _hover={{ bg: "gray.100" }}
                    />
                    <MenuList shadow="lg" borderRadius="md" py={2} minW="180px">
                      <MenuItem
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(campaign)}
                        fontWeight="medium"
                        py={3}
                        _hover={{ bg: "blue.50", color: "blue.600" }}
                      >
                        Edit Campaign
                      </MenuItem>
                      <MenuItem
                        icon={<Trash size={16} />}
                        color="red.500"
                        onClick={() => onDeleteOpen && onDeleteOpen(campaign)}
                        fontWeight="medium"
                        py={3}
                        _hover={{ bg: "red.50", color: "red.600" }}
                      >
                        Delete Campaign
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Flex>

              <Divider my={4} borderColor={dividerColor} />

              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4 }}
                spacing={{ base: 4, md: 6 }}
                mt={4}
              >
                <Flex align="center" color={textColorSecondary}>
                  <Flex
                    p={2}
                    bg="blue.50"
                    borderRadius="md"
                    align="center"
                    justify="center"
                    mr={3}
                    boxSize="36px"
                  >
                    <Calendar size={18} color="#3182CE" />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      DATE
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      {formatDate(campaign.date)}
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" color={textColorSecondary}>
                  <Flex
                    p={2}
                    bg="green.50"
                    borderRadius="md"
                    align="center"
                    justify="center"
                    mr={3}
                    boxSize="36px"
                  >
                    <MapPin size={18} color="#38A169" />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      LOCATION
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      {campaign.location || "N/A"}
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" color={textColorSecondary}>
                  <Flex
                    p={2}
                    bg="purple.50"
                    borderRadius="md"
                    align="center"
                    justify="center"
                    mr={3}
                    boxSize="36px"
                  >
                    <Building size={18} color="#805AD5" />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      HOSPITAL
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                      {campaign.hospital?.name || "N/A"}
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" color={textColorSecondary}>
                  <Flex
                    p={2}
                    bg="orange.50"
                    borderRadius="md"
                    align="center"
                    justify="center"
                    mr={3}
                    boxSize="36px"
                  >
                    <Users size={18} color="#DD6B20" />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      PARTICIPANTS
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      {campaign.volunteers?.length || 0}
                    </Text>
                  </Box>
                </Flex>
              </SimpleGrid>
            </Box>
          );
        })}
      </Stack>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="lg">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Campaign
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete "{selectedCampaign?.title}"? This
              action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CampaignList;
