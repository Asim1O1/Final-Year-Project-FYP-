import createApiResponse from "../../utils/createApiResponse";
import axiosInstance from "../../utils/axiosInstance";

const createCampaignService = async (campaignData) => {
  try {
    const response = await axiosInstance.post("/api/campaigns/", campaignData);

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

const getAllCampaignsService = async (
  page = 1,
  limit = 10,
  sort = "createdAt"
) => {
  try {
    const response = await axiosInstance.get("/api/campaigns/", {
      params: { page, limit, sort },
    });

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch campaigns",
        error: response?.data?.error || null,
      });
    }
    console.log("response", response);

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw createApiResponse({
      isSuccess: false,
      message: "Failed to fetch campaigns",
      error: error.response?.data?.error || error,
    });
  }
};

const volunteerForCampaignService = async (campaignId) => {
  try {
    const response = await axiosInstance.post(
      `/api/campaigns/${campaignId}/volunteer`
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

const campaignServices = {
  createCampaignService,
  updateCampaignService,
  deleteCampaignService,
  getCampaignByIdService,
  getAllCampaignsService,
  volunteerForCampaignService,
};

export default campaignServices;
