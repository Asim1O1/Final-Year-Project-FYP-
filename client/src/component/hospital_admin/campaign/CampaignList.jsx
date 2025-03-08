import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Stack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, MoreVertical, Edit, Trash, Building, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCampaigns } from "../../../features/campaign/campaignSlice";

const CampaignList = ({ userRole, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Fetch campaigns from Redux store
  const { campaigns, isLoading, error } = useSelector((state) => state?.campaignSlice);
  console.log("Campaigns from Redux:", campaigns);

  // Fetch campaigns on component mount
  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  // Handle confirm delete
  const handleDeleteConfirm = (campaignId, campaignTitle) => {
    if (window.confirm(`Are you sure you want to delete "${campaignTitle}"?`)) {
      onDelete(campaignId);
      toast({
        title: "Campaign deleted",
        description: `"${campaignTitle}" has been removed successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={4}>
        {[1, 2, 3].map((item) => (
          <Box key={item} p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <Skeleton height="30px" width="60%" mb={4} />
            <Skeleton height="20px" width="100%" mb={3} />
            <Flex gap={6} mt={4}>
              <Skeleton height="20px" width="30%" />
              <Skeleton height="20px" width="30%" />
            </Flex>
          </Box>
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h3" size="lg" mb={2}>
          Error loading campaigns
        </Heading>
        <Text color="gray.500">{error}</Text>
      </Box>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h3" size="lg" mb={2}>
          No campaigns found
        </Heading>
        <Text color="gray.500">
          There are currently no campaigns matching your search criteria.
        </Text>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {campaigns.map((campaign) => (
        <Box
          key={campaign._id} // Use `_id` instead of `id`
          p={5}
          shadow="sm"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          transition="all 0.2s"
          _hover={{ shadow: "md" }}
        >
          <Flex justify="space-between" align="flex-start">
            <Stack spacing={1}>
              <Heading size="md" fontWeight="semibold">
                {campaign.title}
              </Heading>
              <Text color="gray.600" noOfLines={2}>
                {campaign.description}
              </Text>
            </Stack>
            {userRole === "hospital_admin" && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MoreVertical size={18} />}
                  variant="ghost"
                  size="sm"
                  aria-label="More options"
                />
                <MenuList>
                  <MenuItem 
                    icon={<Edit size={18} />} 
                    onClick={() => onEdit(campaign)}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<Trash size={18} />}
                    color="red.500"
                    onClick={() => handleDeleteConfirm(campaign._id, campaign.title)} // Use `_id`
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>

          <Stack spacing={3} mt={4}>
            <Flex align="center" color="gray.600">
              <Calendar size={16} />
              <Text ml={2}>{formatDate(campaign.date)}</Text>
            </Flex>
            <Flex align="center" color="gray.600">
              <MapPin size={16} />
              <Text ml={2}>{campaign.location}</Text>
            </Flex>
            <Flex align="center" color="gray.600">
              <Building size={16} />
              <Text ml={2}>{campaign.hospital?.name}</Text> {/* Assuming hospital is populated */}
            </Flex>
          </Stack>

          <Flex justify="flex-end" mt={4}>
            <Button
              as={Link}
              to={`/campaigns/${campaign._id}`} // Use `_id`
              colorScheme="blue"
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={16} />}
            >
              View Details
            </Button>
          </Flex>
        </Box>
      ))}
    </Stack>
  );
};

export default CampaignList;