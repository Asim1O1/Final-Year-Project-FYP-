import createApiResponse from "../../utils/createApiResponse";
import axiosInstance from "../../utils/axiosInstance";

const createCampaignService = async (campaignData) => {
  try {
    const response = await axiosInstance.post("/api/campaigns/", {
      ...campaignData,
      allowVolunteers: campaignData.allowVolunteers ?? false,
      maxVolunteers: campaignData.maxVolunteers ?? 0,
      volunteerQuestions: campaignData.volunteerQuestions ?? [],
    });

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Campaign creation failed",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);

    // Handle specific error cases
    let errorMessage = "Failed to create campaign";
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }

    throw createApiResponse({
      isSuccess: false,
      message: errorMessage,
      error: error.response?.data?.error || error,
    });
  }
};

const updateCampaignService = async (campaignId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/api/campaigns/${campaignId}`,
      updatedData
    );

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to update campaign",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to update campaign",
      error: error.response?.data?.error || error,
    });
  }
};

const deleteCampaignService = async (campaignId) => {
  try {
    const response = await axiosInstance.delete(`/api/campaigns/${campaignId}`);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to delete campaign",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to delete campaign",
      error: error.response?.data?.error || error,
    });
  }
};

const getCampaignByIdService = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/campaigns/${campaignId}`);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch campaign",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to fetch campaign",
      error: error.response?.data?.error || error,
    });
  }
};

const getAllCampaignsService = async ({
  page = 1,
  limit = 10,
  sort = "createdAt",
  hospital = null,
  search = null,
  startDate = null,
  endDate = null,
} = {}) => {
  try {
    const params = { page, limit, sort };

    // Add optional parameters to the request
    if (hospital) params.hospital = hospital;
    if (search) params.search = search;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axiosInstance.get("/api/campaigns", { params });

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch campaigns",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Campaigns fetched successfully",
      data: {
        campaigns: response.data?.data,
        pagination: response.data?.pagination || null,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to fetch campaigns",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const volunteerForCampaignService = async (campaignId, answers) => {
  try {
    const response = await axiosInstance.post(
      `/api/campaigns/${campaignId}/volunteer`,
      {
        answers, // Send answers to required questions
      }
    );

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to volunteer for campaign",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error volunteering for campaign:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to volunteer for campaign",
      error: error.response?.data?.error || error,
    });
  }
};

const handleVolunteerRequestService = async (campaignId, requestId, status) => {
  try {
    const response = await axiosInstance.put(
      `/api/campaigns/${campaignId}/volunteer/${requestId}`,
      { status }
    );
    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to handle volunteer request",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: false,
      message: response?.data?.message || "Failed to handle volunteer request",
      error: response?.data?.error || null,
    });
  } catch (error) {
    console.error("Error handling volunteer request:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to handle volunteer request",
      error: error.response?.data?.error || error,
    });
  }
};

const getVolunteerRequestsService = async (req, res) => {
  console.log("Fetching volunteer requests with query:", req.query);
  try {
    const response = await axiosInstance.get(
      `/api/campaigns/volunteerRequests`,
      {
        params: req.query,
      }
    );
    console.log("The respone is", response);
    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to fetch volunteer requests",
        error: response?.data?.error || null,
      });
    }
    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error fetching volunteer requests:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to fetch volunteer requests",
      error: error.response?.data?.error || error,
    });
  }
};

const campaignServices = {
  createCampaignService,
  updateCampaignService,
  deleteCampaignService,
  getCampaignByIdService,
  getAllCampaignsService,
  volunteerForCampaignService,
  handleVolunteerRequestService,
  getVolunteerRequestsService,
};

export default campaignServices;
