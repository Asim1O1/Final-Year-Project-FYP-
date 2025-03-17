import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      };

      const response = await campaignServices.createCampaignService(
        updatedCampaignData
      );

      if (!response.isSuccess) throw response;
      console.log("The response in the campaign slice:", response);

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
      return response.data;
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
  async (campaignId, { rejectWithValue }) => {
    try {
      const response = await campaignServices.volunteerForCampaignService(
        campaignId
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

const campaignSlice = createSlice({
  name: "campaignSlice",
  initialState: {
    campaign: null,
    campaigns: [],
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
        state.campaigns = state.campaigns.filter(
          (campaign) => campaign.id !== action.payload.campaignId
        );
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
  },
});

export const { resetCampaignState } = campaignSlice.actions;
export default campaignSlice.reducer;
