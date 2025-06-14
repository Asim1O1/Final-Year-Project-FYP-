import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignServices from "../../services/campaign/campaign.service";
import createApiResponse from "../../utils/createApiResponse";

// **Create Campaign**
export const handleCampaignCreation = createAsyncThunk(
  "campaign/createCampaign",
  async (campaignData, { rejectWithValue }) => {
    try {
      const updatedCampaignData = {
        ...campaignData,
        allowVolunteers: campaignData.allowVolunteers ?? false,
        maxVolunteers: campaignData.maxVolunteers ?? 0,
        volunteerQuestions: campaignData.volunteerQuestions ?? [], // Include volunteer questions
      };

      const response = await campaignServices.createCampaignService(
        updatedCampaignData
      );

      if (!response.isSuccess) throw response;
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to create campaign")
      );
    }
  }
);

// **Update Campaign**
export const handleCampaignUpdate = createAsyncThunk(
  "campaign/updateCampaign",
  async ({ campaignId, updatedData }, { rejectWithValue }) => {
    console.log("THe updated data in the campaign slice is", updatedData);
    try {
      const response = await campaignServices.updateCampaignService(
        campaignId,
        updatedData
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to update campaign")
      );
    }
  }
);

// **Delete Campaign**
export const handleCampaignDeletion = createAsyncThunk(
  "campaign/deleteCampaign",
  async (campaignId, { rejectWithValue }) => {
    try {
      const response = await campaignServices.deleteCampaignService(campaignId);
      if (!response.isSuccess) throw response;
      return { campaignId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to delete campaign")
      );
    }
  }
);

// **Fetch All Campaigns**
export const fetchAllCampaigns = createAsyncThunk(
  "campaign/fetchAllCampaigns",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await campaignServices.getAllCampaignsService(params);

      if (!response.isSuccess) throw response;

      // Return both campaigns and pagination in proper structure
      return {
        campaigns: response.data.campaigns,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch campaigns")
      );
    }
  }
);

// **Fetch Single Campaign**
export const fetchSingleCampaign = createAsyncThunk(
  "campaign/fetchSingleCampaign",
  async (campaignId, { rejectWithValue }) => {
    try {
      const response = await campaignServices.getCampaignByIdService(
        campaignId
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch campaign details")
      );
    }
  }
);

// **Volunteer for Campaign**
export const volunteerForCampaign = createAsyncThunk(
  "campaign/volunteerForCampaign",
  async ({ campaignId, answers }, { rejectWithValue }) => {
    try {
      const response = await campaignServices.volunteerForCampaignService(
        campaignId,
        answers // Send user responses
      );

      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to volunteer for campaign")
      );
    }
  }
);
// **Handle Volunteer Request (Approve/Reject)**
export const handleVolunteerRequest = createAsyncThunk(
  "campaign/handleVolunteerRequest",
  async ({ campaignId, requestId, status }, { rejectWithValue }) => {
    try {
      const response = await campaignServices.handleVolunteerRequestService(
        campaignId,
        requestId,
        status
      );

      if (!response.isSuccess) throw response;
      console.log("response is", response);

      return {
        campaignId,
        requestId,
        status,
        updatedRequest: response.data?.data,
      };
    } catch (error) {
      console.log("error ius", error);
      return rejectWithValue(
        createApiResponse(error, "Failed to handle volunteer request")
      );
    }
  }
);

// **Fetch Volunteer Requests**
export const fetchVolunteerRequests = createAsyncThunk(
  "campaign/fetchVolunteerRequests",
  async (params = {}, { rejectWithValue }) => {
    console.log("fetching volunteer requests");
    try {
      const response = await campaignServices.getVolunteerRequestsService(
        params
      );

      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch volunteer requests")
      );
    }
  }
);

const campaignSlice = createSlice({
  name: "campaignSlice",
  initialState: {
    campaign: null,
    campaigns: [],
    volunteerRequests: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetCampaignState: (state) => {
      state.campaign = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(handleCampaignCreation.pending, handlePending)
      .addCase(handleCampaignCreation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaign = action.payload;
        state.error = null;
      })
      .addCase(handleCampaignCreation.rejected, handleRejected);

    builder
      .addCase(handleCampaignUpdate.pending, handlePending)
      .addCase(handleCampaignUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaign = action.payload;
        state.error = null;
      })
      .addCase(handleCampaignUpdate.rejected, handleRejected);

    builder
      .addCase(handleCampaignDeletion.pending, handlePending)
      .addCase(handleCampaignDeletion.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(state.campaigns)) {
          state.campaigns = state.campaigns.filter(
            (campaign) => campaign.id !== action.payload.campaignId
          );
        }
        state.error = null;
      })
      .addCase(handleCampaignDeletion.rejected, handleRejected);

    builder
      .addCase(fetchAllCampaigns.pending, handlePending)
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCampaigns.rejected, handleRejected);

    builder
      .addCase(fetchSingleCampaign.pending, handlePending)
      .addCase(fetchSingleCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaign = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleCampaign.rejected, handleRejected);

    builder
      .addCase(volunteerForCampaign.pending, handlePending)
      .addCase(volunteerForCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaign = action.payload;
        state.error = null;
      })
      .addCase(volunteerForCampaign.rejected, handleRejected);

    builder
      .addCase(handleVolunteerRequest.pending, handlePending)
      .addCase(handleVolunteerRequest.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update the specific request in the campaign
        if (state.campaign && state.campaign.volunteerRequests) {
          state.campaign.volunteerRequests =
            state.campaign.volunteerRequests.map((request) =>
              request._id === action.payload.requestId
                ? action.payload.updatedRequest
                : request
            );
        }

        state.error = null;
      })
      .addCase(handleVolunteerRequest.rejected, handleRejected);

    builder
      .addCase(fetchVolunteerRequests.pending, handlePending)
      .addCase(fetchVolunteerRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.volunteerRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchVolunteerRequests.rejected, handleRejected);
  },
});

export const { resetCampaignState } = campaignSlice.actions;
export default campaignSlice.reducer;
